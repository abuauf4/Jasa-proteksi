import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Preloader from "@/components/shared/Preloader";
import ScrollProgress from "@/components/shared/ScrollProgress";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jasa Proteksi | Perusahaan Insurtech Terpercaya di Indonesia",
  description:
    "Platform asuransi online terpercaya di Indonesia. Asuransi Mobil, Motor, Perjalanan, Hewan Peliharaan, dan Kecelakaan Diri. Mudah, cepat, dan terjangkau.",
  keywords: [
    "Jasa Proteksi",
    "Asuransi Online",
    "Insurtech Indonesia",
    "Asuransi Mobil",
    "Asuransi Motor",
    "Asuransi Perjalanan",
    "Asuransi Hewan",
    "OJK Licensed",
  ],
  authors: [{ name: "Jasa Proteksi Insurtech" }],
  openGraph: {
    title: "Jasa Proteksi | Perusahaan Insurtech Terpercaya di Indonesia",
    description: "Melindungi Setiap Langkah Hidupmu. Perlindungan asuransi yang mudah, cepat, dan terjangkau.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased bg-background text-foreground font-[family-name:var(--font-poppins)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <Preloader />
            <ScrollProgress />
            {children}
          </SmoothScroll>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
