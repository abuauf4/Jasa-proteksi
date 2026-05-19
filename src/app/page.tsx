"use client";

import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Features from "@/components/sections/Features";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Gallery from "@/components/sections/Gallery";
import Blog from "@/components/sections/Blog";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import MapSection from "@/components/sections/MapSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import FloatingWhatsApp from "@/components/conversion/FloatingWhatsApp";
import BackToTop from "@/components/conversion/BackToTop";
import CookieConsent from "@/components/conversion/CookieConsent";
import StickyCTABar from "@/components/conversion/StickyCTABar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Portfolio />
        <Services />
        <Features />
        <Testimonials />
        <Pricing />
        <About />
        <FAQ />
        <Blog />
        <Gallery />
        <Contact />
        <MapSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <CookieConsent />
      <StickyCTABar />
    </div>
  );
}
