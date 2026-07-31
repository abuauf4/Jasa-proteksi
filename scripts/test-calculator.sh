#!/bin/bash
# End-to-end calculator test using snapshot parsing.
set -e
cd /home/z/my-project

get_ref() {
  local pattern="$1"
  agent-browser snapshot -i 2>&1 | grep -E "$pattern" | grep -oE 'ref=e[0-9]+' | head -1 | cut -d= -f2
}

echo "=== Reload ==="
agent-browser reload
sleep 4

echo "=== Step 1: Brand ==="
BRAND_REF=$(get_ref 'combobox "Merek')
echo "  Brand ref: @$BRAND_REF"
agent-browser select @$BRAND_REF "TOYOTA"
sleep 2

echo "=== Step 2: Model ==="
MODEL_REF=$(get_ref 'combobox "Tipe')
echo "  Model ref: @$MODEL_REF"
agent-browser select @$MODEL_REF "TOYOTA 86 A/T"
sleep 2

echo "=== Step 3: Year ==="
YEAR_REF=$(get_ref 'combobox "Tahun')
echo "  Year ref: @$YEAR_REF"
agent-browser select @$YEAR_REF "2024"
sleep 3

echo "=== Verify value ==="
agent-browser snapshot 2>&1 | grep -oE 'Rp[0-9.]+(,|\s|")' | head -3

echo "=== Step 4: Lanjutkan → Region ==="
NEXT_BTN=$(get_ref 'button "Lanjutkan"')
echo "  Lanjutkan ref: @$NEXT_BTN"
agent-browser click @$NEXT_BTN
sleep 2
agent-browser snapshot -i 2>&1 | grep -E "combobox|Langkah" | head -3

echo "=== Step 5: Select Wilayah ==="
PLATE_REF=$(get_ref 'combobox "Wilayah')
echo "  Wilayah ref: @$PLATE_REF"
agent-browser select @$PLATE_REF "B (Jakarta)"
sleep 1

echo "=== Step 6: Lanjutkan → Protection ==="
NEXT_BTN=$(get_ref 'button "Lanjutkan"')
agent-browser click @$NEXT_BTN
sleep 2
agent-browser snapshot -i 2>&1 | grep -E "radio" | head -3

echo "=== Step 7: Lanjutkan → Extension ==="
NEXT_BTN=$(get_ref 'button "Lanjutkan"')
agent-browser click @$NEXT_BTN
sleep 2
agent-browser snapshot -i 2>&1 | grep -E "checkbox" | head -3

echo "=== Step 8: Toggle Banjir ==="
# Use checkbox ref directly
BANJIR_REF=$(agent-browser snapshot -i 2>&1 | grep -E 'checkbox "Banjir' | grep -oE 'ref=e[0-9]+' | head -1 | cut -d= -f2)
echo "  Banjir ref: @$BANJIR_REF"
agent-browser click @$BANJIR_REF
sleep 1

echo "=== Step 9: Hitung Estimasi ==="
CALC_BTN=$(get_ref 'button "Hitung Estimasi')
echo "  Hitung ref: @$CALC_BTN"
agent-browser click @$CALC_BTN
sleep 8

echo "=== Result ==="
agent-browser snapshot 2>&1 | grep -oE 'Estimasi Premi[^"]+|Rp[0-9.]+|Lanjutkan Pengajuan|Konsultasikan Hasil|Ubah Data Kendaraan' | head -15

echo "=== Test: Back → data preserved ==="
BACK_BTN=$(get_ref 'button "Ubah Data')
echo "  Back ref: @$BACK_BTN"
agent-browser click @$BACK_BTN
sleep 2
echo "  After back, current state:"
agent-browser snapshot -i 2>&1 | grep "combobox" | head -5

echo "=== Done ==="
