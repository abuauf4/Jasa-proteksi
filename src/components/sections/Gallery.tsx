"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const categories = ["Semua", "Eksterior", "Interior", "Event"];

const galleryItems = [
  { title: "Pajero Sport Eksterior", category: "Eksterior", color: "from-slate-600 to-slate-800" },
  { title: "Xpander Interior", category: "Interior", color: "from-zinc-600 to-zinc-800" },
  { title: "Launching Event", category: "Event", color: "from-emerald-600 to-emerald-800" },
  { title: "Outlander PHEV Eksterior", category: "Eksterior", color: "from-cyan-600 to-cyan-800" },
  { title: "Triton Interior", category: "Interior", color: "from-orange-600 to-orange-800" },
  { title: "Test Drive Event", category: "Event", color: "from-violet-600 to-violet-800" },
  { title: "Xpander Cross Eksterior", category: "Eksterior", color: "from-teal-600 to-teal-800" },
  { title: "Showroom Interior", category: "Interior", color: "from-rose-600 to-rose-800" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "Semua"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <SectionWrapper id="galeri" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Galeri
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Lihat koleksi foto kendaraan dan acara kami
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

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`${index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} flex items-center justify-center`}
                  >
                    <Camera className="w-12 h-12 text-white/20" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    <p className="text-white/70 text-xs">{item.category}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <Dialog
          open={selectedImage !== null}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border">
            <DialogTitle className="sr-only">Gallery Image</DialogTitle>
            {selectedImage !== null && filteredItems[selectedImage] && (
              <div className="aspect-[16/10] bg-gradient-to-br flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${filteredItems[selectedImage].color} flex items-center justify-center`}
                >
                  <Camera className="w-24 h-24 text-white/20" />
                </div>
              </div>
            )}
            {selectedImage !== null && filteredItems[selectedImage] && (
              <div className="p-4">
                <h3 className="font-semibold font-[family-name:var(--font-montserrat)] text-foreground">
                  {filteredItems[selectedImage].title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {filteredItems[selectedImage].category}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SectionWrapper>
  );
}
