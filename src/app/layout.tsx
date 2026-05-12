import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

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
  title: "Mitsubishi Showroom | Dealer Resmi Mitsubishi Jakarta",
  description:
    "Dealer resmi Mitsubishi di Jakarta. Temukan model terbaru, promo eksklusif, simulasi kredit, dan booking test drive mudah. Pajero Sport, Xpander, Outlander PHEV, dan lainnya.",
  keywords: [
    "Mitsubishi",
    "Dealer Mitsubishi",
    "Mitsubishi Jakarta",
    "Pajero Sport",
    "Xpander",
    "Test Drive",
    "Kredit Mitsubishi",
  ],
  authors: [{ name: "Mitsubishi Showroom" }],
  openGraph: {
    title: "Mitsubishi Showroom | Dealer Resmi Mitsubishi Jakarta",
    description: "Pengalaman berkendara premium dimulai di sini. Temukan model terbaru dan promo eksklusif.",
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
