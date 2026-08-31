#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VERIFIKASI PIN RATE BENGKEL ETIQA — jasaproteksi.com
=====================================================
Tujuan: membuktikan bahwa menambah 1 row override (Etiqa x bengkelAuthorized
= 0.001) TIDAK mengubah hitungan premi siapa pun. Satu-satunya perubahan yang
diizinkan: bengkelResmiRate milik Etiqa berubah dari null -> 0.001.

CARA PAKAI:
  1. SEBELUM nambah row (sekali saja):
       python3 etiqa_verify.py --capture
     -> membuat etiqa_baseline.json di folder yang sama

  2. Tambah row override via Admin Panel:
     Admin > Partners > Edit Etiqa > Addon Rate Overrides >
     Bengkel Authorized, rate = 0.001 > Save
     (atau via SQL INSERT ins_partner_addon_rates rate=0.001 utk slug etiqa)

  3. SESUDAH nambah row:
       python3 etiqa_verify.py
     -> hasil harus: SEMUA PASS, hanya Etiqa bengkelResmiRate null->0.001

Exit code: 0 = aman, 1 = ada perbedaan tak terduga (JANGAN lanjut, cek dulu).
Hanya butuh Python 3 standar (tanpa pip install apa pun).
"""

import argparse
import json
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

API_URL = "https://jasaproteksi.com/api/vehicles/premium"
DEFAULT_BASELINE = Path(__file__).resolve().parent / "etiqa_baseline.json"

OTR_OVERRIDE = 200_000_000  # OTR dipatok 200 juta agar perbandingan apple-to-apple

SCENARIOS = [
    {
        "name": "S1: Mobil 4 thn - bengkel Etiqa harus FREE",
        "payload": {
            "brand": "TOYOTA", "modelDescription": "AVANZA", "vehicleYear": 2022,
            "coverageType": "Comprehensive", "plateCode": "B",
            "addOns": ["flood", "bengkelAuthorized"],
            "vehicleValueOverride": OTR_OVERRIDE,
        },
    },
    {
        "name": "S2: Mobil 8 thn - bengkel Etiqa 0.1% (di sini pin-nya kelihatan)",
        "payload": {
            "brand": "TOYOTA", "modelDescription": "AVANZA", "vehicleYear": 2018,
            "coverageType": "Comprehensive", "plateCode": "B",
            "addOns": ["flood", "bengkelAuthorized"],
            "vehicleValueOverride": OTR_OVERRIDE,
        },
    },
    {
        "name": "S3: Mobil 13 thn - All Risk 15 thn hanya Etiqa",
        "payload": {
            "brand": "TOYOTA", "modelDescription": "AVANZA", "vehicleYear": 2013,
            "coverageType": "Comprehensive", "plateCode": "B",
            "addOns": ["flood", "bengkelAuthorized"],
            "vehicleValueOverride": OTR_OVERRIDE,
        },
    },
    {
        "name": "S4: Mobil 4 thn TLO - jalur coverage lain",
        "payload": {
            "brand": "TOYOTA", "modelDescription": "AVANZA", "vehicleYear": 2022,
            "coverageType": "TLO", "plateCode": "B",
            "addOns": ["flood", "bengkelAuthorized"],
            "vehicleValueOverride": OTR_OVERRIDE,
        },
    },
]

# Field level-atas respons yang dibandingkan
TOP_FIELDS = [
    "source", "isEligible", "vehicleValue", "vehicleAge", "wilayah", "plateCity",
    "baseRate", "loadingRate", "effectiveRate", "basePremium",
    "totalPremiumBeforeDiscount", "discountPercent", "discountAmount",
    "adminFee", "policyFee", "totalPremium",
]

# Field per-partner yang dibandingkan
PARTNER_FIELDS = [
    "modifier", "addonModifier", "adminFee", "estimatedPremium",
    "bengkelAuthorizedExcluded", "bengkelResmiFree", "bengkelResmiRate",
]
BREAKDOWN_FIELDS = [
    "basePremium", "addOnPremium", "totalPremiumBeforeDiscount",
    "discountPercent", "discountAmount", "adminFee", "policyFee",
]


def call_api(payload, timeout=90):
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL, data=body, method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def expected_diff(partner_name, path, old, new):
    """Satu-satunya perubahan yang diizinkan: pin rate Etiqa null -> 0.001."""
    return (
        partner_name == "Etiqa"
        and path == "bengkelResmiRate"
        and old is None
        and abs(float(new) - 0.001) < 1e-9
    )


def compare_scenario(base_resp, new_resp, scenario_name, report):
    """Bandingkan dua respons untuk satu skenario. Return (pass, expected, fail)."""
    p = e = f = 0

    def line(status, text):
        report.append(f"    [{status}] {text}")
        return {"PASS": 1, "OK-EXPECTED": 1, "FAIL": 1}.get(status, 0)

    # 1) Field level-atas
    for field in TOP_FIELDS:
        old, new = base_resp.get(field), new_resp.get(field)
        if old == new:
            p += 1
        else:
            status = "FAIL"
            f += 1
            line(status, f"{field}: {old!r} -> {new!r}  (BEDA! tidak terduga)")

    # 2) Daftar partner: cek nama sama semua
    base_names = [x.get("name") for x in base_resp.get("partners", [])]
    new_names = [x.get("name") for x in new_resp.get("partners", [])]
    if base_names != new_names:
        f += 1
        line("FAIL", f"DAFTAR PARTNER BERUBAH!\n        sebelum: {base_names}\n        sesudah: {new_names}")
        return p, e, f

    # 3) Bandingkan per partner
    for bp, np_ in zip(base_resp["partners"], new_resp["partners"]):
        name = bp.get("name")
        partner_fail = 0

        for field in PARTNER_FIELDS:
            old, new = bp.get(field), np_.get(field)
            if old == new:
                continue
            if expected_diff(name, field, old, new):
                e += 1
                line("OK-EXPECTED", f"{name}.{field}: {old!r} -> {new!r}  (INI MEMANG TARGET PIN)")
            else:
                partner_fail += 1
                f += 1
                line("FAIL", f"{name}.{field}: {old!r} -> {new!r}")

        for field in BREAKDOWN_FIELDS:
            old, new = bp.get("breakdown", {}).get(field), np_.get("breakdown", {}).get(field)
            if old == new:
                continue
            partner_fail += 1
            f += 1
            line("FAIL", f"{name}.breakdown.{field}: {old!r} -> {new!r}")

        # Addon breakdown (urutan & isi harus identik)
        b_addons = bp.get("breakdown", {}).get("addons", [])
        n_addons = np_.get("breakdown", {}).get("addons", [])
        if len(b_addons) != len(n_addons):
            partner_fail += 1
            f += 1
            line("FAIL", f"{name}.breakdown.addons: jumlah {len(b_addons)} -> {len(n_addons)}")
        else:
            for i, (ba, na) in enumerate(zip(b_addons, n_addons)):
                if ba != na:
                    partner_fail += 1
                    f += 1
                    line("FAIL", f"{name}.breakdown.addons[{i}] ({ba.get('key')}): {ba} -> {na}")

        if partner_fail == 0:
            p += 1
            line("PASS", f"{name}: premi {np_.get('estimatedPremium'):,} identik".replace(",", "."))

    return p, e, f


def pin_status(resp):
    """Deteksi apakah Etiqa sudah di-pin (bengkelResmiRate bukan null di skenario S2)."""
    for p in resp.get("partners", []):
        if p.get("name") == "Etiqa":
            return p.get("bengkelResmiRate")
    return "PARTNER-TIDAK-ADA"


def run_all():
    results = []
    for sc in SCENARIOS:
        print(f"  > {sc['name']} ...", flush=True)
        resp = call_api(sc["payload"])
        if not resp.get("dataAvailable"):
            raise RuntimeError(f"API gagal/dataAvailable=false untuk {sc['name']}: {json.dumps(resp)[:300]}")
        results.append({"name": sc["name"], "payload": sc["payload"], "response": resp})
    return results


def cmd_capture(out_path, force):
    if out_path.exists() and not force:
        sys.exit(f"REFUSE: {out_path.name} sudah ada. Pakai --force kalau memang mau timpa.")
    print("Capture baseline (SEBELUM pin) ...")
    results = run_all()
    doc = {
        "captured_at": datetime.now().isoformat(timespec="seconds"),
        "api": API_URL,
        "note": "Baseline SEBELUM row override Etiqa x bengkelAuthorized=0.001 ditambahkan",
        "etiqa_pin_status": pin_status(results[1]["response"]),
        "scenarios": results,
    }
    out_path.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nBaseline tersimpan: {out_path}")
    print(f"Status pin Etiqa saat capture: {doc['etiqa_pin_status']} "
          f"({'BELUM di-pin - kondisi benar utk baseline' if doc['etiqa_pin_status'] is None else doc['etiqa_pin_status']})")


def cmd_verify(baseline_path):
    if not baseline_path.exists():
        sys.exit(f"Baseline tidak ditemukan: {baseline_path}\nJalankan dulu: python3 {Path(__file__).name} --capture")
    base_doc = json.loads(baseline_path.read_text(encoding="utf-8"))
    print(f"Baseline di-capture: {base_doc.get('captured_at')} | pin saat baseline: {base_doc.get('etiqa_pin_status')}")
    print("Jalankan ulang 4 skenario ke LIVE ...")
    new_results = run_all()

    total_p = total_e = total_f = 0
    print("\n" + "=" * 74)
    for sc, new in zip(base_doc["scenarios"], new_results):
        print(f"\n### {sc['name']}")
        report = []
        p, e, f = compare_scenario(sc["response"], new["response"], sc["name"], report)
        for r in report:
            print(r)
        total_p += p
        total_e += e
        total_f += f
        new_pin = pin_status(new["response"])
        print(f"    [INFO] Etiqa bengkelResmiRate sekarang: {new_pin}")

    print("\n" + "=" * 74)
    print(f"RINGKASAN: {total_p} PASS | {total_e} perubahan expected (pin Etiqa) | {total_f} FAIL")
    if total_f == 0 and total_e > 0:
        print("\nHASIL: AMAN - hitungan semua partner identik, hanya Etiqa yang ter-pin 0.001.")
        print("        Row override bekerja sesuai rencana. Rollback = hapus 1 row itu.")
        sys.exit(0)
    elif total_f == 0 and total_e == 0:
        print("\nHASIL: AMAN - semua identik. TAPI pin Etiqa BELUM terdeteksi:")
        print("        cek apakah row override sudah benar-benar di-save (rate=0.001, slug=etiqa).")
        sys.exit(0)
    else:
        print("\nHASIL: ADA PERBEDAAN TAK TERDUGA! Jangan anggap ini efek row Etiqa -")
        print("        row itu cuma boleh mengubah bengkelResmiRate Etiqa. Cek diff di atas,")
        print("        kemungkinan ada perubahan rate/partner lain di admin.")
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="Verifikasi pin rate bengkel Etiqa (jasaproteksi.com)")
    ap.add_argument("--capture", action="store_true", help="Simpan baseline SEBELUM nambah row")
    ap.add_argument("--force", action="store_true", help="Izinkan timpa baseline yang sudah ada")
    ap.add_argument("--baseline", type=Path, default=DEFAULT_BASELINE, help="Lokasi file baseline")
    args = ap.parse_args()

    if args.capture:
        cmd_capture(args.baseline, args.force)
    else:
        cmd_verify(args.baseline)


if __name__ == "__main__":
    main()
