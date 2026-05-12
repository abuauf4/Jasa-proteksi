# Worklog: Mitsubishi Showroom Website Update with Real Data

## Date: 2026-03-04

## Summary
Updated the Mitsubishi Showroom website with authentic data from Mitsubishi Motors Indonesia (MMKSI). All changes preserve the premium luxury design while replacing placeholder/fictional data with real information.

## Files Modified

### 1. Navigation.tsx
- **Change**: Replaced text "MISUBISHI" with official Mitsubishi logo image (`/images/mitsubishi-logo.png`)
- **Details**: Added `next/image` import, used `brightness-0 invert` class for white-friendly rendering on dark background, kept gold Diamond accent
- **Logo size**: 36px mobile, 40px desktop (responsive via `lg:w-10 lg:h-10`)

### 2. Hero.tsx
- **Change**: Updated tagline from "Authorized Mitsubishi Dealer" to "Drive your Ambition"
- **Details**: This is the official Mitsubishi Motors global tagline

### 3. Portfolio.tsx
- **Change**: Replaced 6 placeholder car models with 8 real Mitsubishi Indonesia models
- **New models**: Xpander, Xpander Cross, Pajero Sport, Xforce, Destinator, Triton, L300, Outlander PHEV
- **New data fields**: Added `engine`, `transmission`, `seats` specs for each model
- **New UI**: Added specs display row with Gauge, Cog, Users icons below price
- **Real prices (OTR Jakarta)**: Xpander Rp 270jt, Xpander Cross Rp 331jt, Pajero Sport Rp 578jt, Xforce Rp 388jt, Destinator Rp 385jt, Triton Rp 307jt, L300 Rp 233jt, Outlander PHEV Rp 1,2M
- **Categories**: Kept "Semua", "SUV", "MPV", "Pickup"

### 4. About.tsx
- **Change**: Updated company name to "PT Mitsubishi Motors Krama Yudha Sales Indonesia"
- **Description**: Updated to include real info about 349 dealers and "Drive your Ambition" tagline
- **Stats updated**:
  - 10+ Tahun → 40+ Tahun Pengalaman
  - 5K+ Mobil Terjual → 349 Dealer Resmi
  - 98% Kepuasan Pelanggan → kept
  - 15+ Penghargaan → 9 Model Tersedia

### 5. Contact.tsx
- **Change**: Updated all contact information with real MMKSI data
- **Address**: Jl. Pulomas Selatan No.22, Kayu Putih, Pulo Gadung, Jakarta Timur 13210
- **Phone**: 021-475-9000
- **WhatsApp**: 0811-1301-1300 (MIRA)
- **Emergency Hotline**: 0804-1-300-300 (24 jam)
- **Email**: publicrelations@mitsubishi-motors.co.id
- **Hours**: Sen-Jum: 08:00-17:00, Sab: 08:00-15:00

### 6. Footer.tsx
- **Change**: Replaced "MISUBISHI" text with official logo image
- **Description**: "Dealer resmi Mitsubishi Motors Indonesia. Drive your Ambition."
- **Contact items**: Updated to match Contact section data, added WhatsApp MIRA number
- **Bottom bar**: Updated copyright to "© 2025 PT Mitsubishi Motors Krama Yudha Sales Indonesia. All rights reserved."
- **Tagline**: Changed from "Authorized Mitsubishi Dealer" to "Drive your Ambition"

### 7. FAQ.tsx
- **Change**: Updated all FAQ answers with real data
- **Warranty FAQ**: Detailed warranty info per model (3yr/100k km for passenger, 2yr/50k km for L300)
- **Test Drive FAQ**: Now references MIRA WhatsApp booking at 0811-1301-1300
- **Credit FAQ**: Added MIRA reference
- **Promo FAQ**: Updated with real promo types (DP Ringan, Bunga Special, SMART CASH)

### 8. Pricing.tsx
- **Change**: Replaced 3 fictional tiers with real Mitsubishi promo names
- **Tier 1**: "DP Ringan" — DP mulai 10%, cicilan mulai Rp 4,5jt/bulan
- **Tier 2**: "Bunga Special" — Bunga 0% hingga 2 tahun, tenor hingga 7 tahun (RECOMMENDED)
- **Tier 3**: "SMART CASH" — Cashback hingga jutaan rupiah + free accessories
- **Disclaimer**: "Simulasi kredit bersifat estimasi. Hubungi dealer untuk penawaran terperinci."

### 9. CTASection.tsx
- **Change**: Updated trust badges
  - "Garansi 5 Tahun" → "Garansi 3 Tahun / 100.000 km"
  - "Servis Resmi" → kept
  - "Mitra Resmi" → "349 Dealer Resmi"
- **WhatsApp link**: Updated to real MIRA number (0811-1301-1300)

### 10. Features.tsx
- **Change**: Updated all 4 feature descriptions with real Mitsubishi technology
  - MIVEC: Full name "Mitsubishi Innovative Valve timing Electronic Control"
  - Safety: Added "Hill Start Assist" 
  - Design: "Dynamic Shield" design language
  - Warranty: "3 Tahun / 100.000 km" (was "5 Tahun")

### 11. Services.tsx
- **Change**: Updated Test Drive description to reference MIRA booking
- **New description**: "Rasakan langsung performa kendaraan impian Anda. Booking melalui MIRA di WhatsApp 0811-1301-1300."

### 12. FloatingWhatsApp.tsx
- **Change**: Updated WhatsApp link from fictional number to MIRA: `https://wa.me/6281113011300`

### 13. StickyCTABar.tsx
- **Change**: Updated phone number from "+62 21 8888 7777" to "021-475-9000"

## Quality Checks
- ✅ `bun run lint` passed with no errors
- ✅ Dev server compiling successfully
- ✅ No changes to globals.css or layout.tsx
- ✅ All premium luxury design preserved (dark sections, gold accents, glassmorphism)
- ✅ All prices match provided real data
- ✅ next/image used for logo imports
