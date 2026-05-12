"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const categories = ["Semua", "SUV", "MPV", "Pickup"];

const cars = [
  {
    name: "Pajero Sport",
    category: "SUV",
    price: "Mulai Rp 599 Juta",
    description: "SUV premium tangguh dengan performa luar biasa",
    color: "from-slate-700 to-slate-900",
  },
  {
    name: "Xpander",
    category: "MPV",
    price: "Mulai Rp 279 Juta",
    description: "MPV keluarga terbaik dengan fitur lengkap",
    color: "from-sky-600 to-sky-800",
  },
  {
    name: "Xpander Cross",
    category: "MPV",
    price: "Mulai Rp 329 Juta",
    description: "MPV adventure dengan ground clearance tinggi",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    name: "Triton",
    category: "Pickup",
    price: "Mulai Rp 399 Juta",
    description: "Double cabin tangguh untuk segala medan",
    color: "from-orange-600 to-orange-800",
  },
  {
    name: "Outlander PHEV",
    category: "SUV",
    price: "Mulai Rp 899 Juta",
    description: "SUV hybrid plug-in dengan teknologi terdepan",
    color: "from-teal-600 to-teal-800",
  },
  {
    name: "L300",
    category: "Pickup",
    price: "Mulai Rp 199 Juta",
    description: "Pickup andalan untuk bisnis dan usaha Anda",
    color: "from-red-600 to-red-800",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredCars =
    activeCategory === "Semua"
      ? cars
      : cars.filter((car) => car.category === activeCategory);

  return (
    <SectionWrapper id="model" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Model Mitsubishi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Pilih kendaraan yang sesuai dengan gaya hidup Anda
          </p>
        </AnimatedSection>

        {/* Filter tabs */}
        <AnimatedSection className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Car grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car) => (
              <motion.div
                key={car.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Card className="overflow-hidden group border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300">
                    {/* Image placeholder */}
                    <div
                      className={`relative aspect-[4/3] bg-gradient-to-br ${car.color} flex items-center justify-center overflow-hidden`}
                    >
                      <Car className="w-20 h-20 text-white/20 group-hover:scale-110 transition-transform duration-300" />
                      <Badge className="absolute top-4 left-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                        {car.category}
                      </Badge>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Button
                            asChild
                            size="sm"
                            className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30"
                          >
                            <a href="#kontak">
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </a>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-foreground mb-1">
                        {car.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">{car.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-accent font-bold text-lg">{car.price}</span>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-accent/30 text-accent hover:bg-accent/10"
                        >
                          <a href="#kontak">Lihat Detail</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
