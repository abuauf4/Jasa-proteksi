# Task: SEO Pillar Articles (5 new pages)

**Agent**: Z.ai Code (single agent)
**Scope**: Create 5 SEO pillar article pages in `src/app/<slug>/page.tsx`
**Started**: Session start

## Constraints
- Do NOT modify existing files. Only CREATE new files.
- Do NOT touch premium engine, API, database, or any calculation logic.
- Each article is a server component (SSR) using `ArticleShell`.
- `revalidate = 3600`
- Indonesian language, factual content tied to Jasa Proteksi's actual data
  (8 partners, 49 brands, vehicle database).

## Reference pattern
- `src/app/perbedaan-all-risk-dan-tlo/page.tsx` (Article 1 — DO NOT TOUCH).
- `src/components/site/ArticleShell.tsx`
- `src/lib/article-helpers.ts` -> `getArticleSettings()`

## Articles planned
1. (existing) `/perbedaan-all-risk-dan-tlo` — already done.
2. `/cara-menghitung-premi-asuransi-mobil`
3. `/biaya-asuransi-mobil`
4. `/faktor-premi-asuransi-mobil`
5. `/asuransi-mobil-bekas`
6. `/perluasan-asuransi-mobil`

## Cross-reference map (Related Articles section)
- Article 1 (existing) -> 4, 3, 2  ✓ already in source
- Article 2 -> 1 (perbedaan-all-risk-dan-tlo), 3 (biaya), 4 (faktor)
- Article 3 -> 2 (cara-menghitung), 4 (faktor), 1 (perbedaan)
- Article 4 -> 1 (perbedaan), 3 (biaya), 6 (perluasan)
- Article 5 -> 1 (perbedaan), 4 (faktor), 6 (perluasan)
- Article 6 -> 1 (perbedaan), 4 (faktor), 2 (cara-menghitung)

All 6 articles inter-link.

## Partner data (factual)
8 partners: Sinarmas, ACA, Mega, Zurich (Syariah), Tugu, Sahabat, Oona, MAG.

Batas All Risk per partner:
- Sinarmas: 10 thn
- ACA: 10 thn
- Mega: 10 thn
- Zurich Syariah: 10 thn
- Tugu: 5 thn
- Sahabat: 5 thn
- Oona: 5 thn
- MAG: 3 thn

Addon rates (perluasan):
- Banjir: 0.1%
- Gempa Bumi: 0.15%
- Kerusuhan/SRCC: 0.05%
- Terorisme: 0.05%
- Bengkel Resmi: Sinarmas 0.5%, Mega/Oona/Sahabat 0.1%, Zurich/Tugu 0.15%
  (ACA & MAG: tidak tersedia)
- TPL: fixed amount
- PA Driver / PA Passenger: fixed amount / per seat

Vehicle price categories:
- cat1 ≤ 125jt
- cat2 ≤ 200jt
- cat3 ≤ 400jt
- cat4 ≤ 800jt
- cat5 > 800jt

Wilayah (region): Wilayah 1, 2, 3 (rate berbeda per wilayah, ditentukan plat nomor).

## Notes
- Following ArticleShell pattern exactly. The component's `description` prop is
  declared in the interface but unused internally and not passed by the
  existing reference page; I will match the reference behavior to remain
  consistent and avoid drift.

## Progress
- [x] agent-ctx record created
- [x] Article 2 written — `src/app/cara-menghitung-premi-asuransi-mobil/page.tsx`
- [x] Article 3 written — `src/app/biaya-asuransi-mobil/page.tsx`
- [x] Article 4 written — `src/app/faktor-premi-asuransi-mobil/page.tsx`
- [x] Article 5 written — `src/app/asuransi-mobil-bekas/page.tsx`
- [x] Article 6 written — `src/app/perluasan-asuransi-mobil/page.tsx`
- [x] lint check — `bun run lint` clean, no errors
- [x] runtime check — all 5 routes return HTTP 200; canonical + OG + H1 verified SSR

## Verification results
- `bun run lint` → clean (no output, exit 0)
- HTTP probes (curl) → all 5 new routes returned `200 OK`
- Server-rendered HTML verified to contain unique `<title>`, `<link rel="canonical">`,
  and `<h1>` text matching each article's metadata.

## Files created (final list)
1. `/home/z/my-project/src/app/cara-menghitung-premi-asuransi-mobil/page.tsx`
2. `/home/z/my-project/src/app/biaya-asuransi-mobil/page.tsx`
3. `/home/z/my-project/src/app/faktor-premi-asuransi-mobil/page.tsx`
4. `/home/z/my-project/src/app/asuransi-mobil-bekas/page.tsx`
5. `/home/z/my-project/src/app/perluasan-asuransi-mobil/page.tsx`

No existing files were modified. No engine/API/db/calculation logic touched.
