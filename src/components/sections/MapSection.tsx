"use client";

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export default function MapSection() {
  return (
    <SectionWrapper id="lokasi" className="py-0">
      <div className="relative">
        {/* Map placeholder */}
        <div className="w-full h-80 sm:h-96 lg:h-[500px] bg-gradient-to-br from-muted via-muted/80 to-muted/50 relative overflow-hidden">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Roads simulation */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border/40" />
          <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-border/40" />
          <div className="absolute top-0 bottom-0 right-1/4 w-0.5 bg-border/30" />
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-border/30" />

          {/* Center marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-pulse-green">
                <MapPin className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="w-1 h-4 bg-accent/50" />
            </div>
          </div>

          {/* Address overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm">
            <AnimatedSection direction="up">
              <div className="bg-card/95 backdrop-blur-md rounded-xl p-5 shadow-xl border border-border/50">
                <h3 className="font-semibold font-[family-name:var(--font-montserrat)] text-foreground mb-1">
                  Mitsubishi Showroom
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Jl. Raya Protokol Halim PK, Jakarta Timur
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
