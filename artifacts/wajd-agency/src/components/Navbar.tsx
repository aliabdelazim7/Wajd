import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import AIExperience from "./AIExperience";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = aiModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aiModalOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { name: "الرئيسية", id: "hero" },
    { name: "خدماتنا", id: "services" },
    { name: "أعمالنا", id: "portfolio" },
    { name: "ابدأ معنا", id: "cta" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/85 backdrop-blur-xl border-b border-white/8 py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => scrollTo("hero")} data-testid="link-logo">
            <span className="text-3xl font-black text-primary tracking-tighter">وجد</span>
            <div className="h-8 w-px bg-white/20 hidden md:block" />
            <span className="text-xs text-foreground/70 hidden md:block tracking-widest uppercase font-medium">
              WAJD MARKETING AGENCY
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                data-testid={`link-${link.id}`}
              >
                {link.name}
              </button>
            ))}

            {/* AI Button */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/60 text-primary text-sm font-semibold rounded-full px-4 py-2 transition-all duration-200 shadow-[0_0_12px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              data-testid="button-ai-header"
            >
              <Sparkles size={14} />
              جرب الذكاء الاصطناعي
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-5"
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors text-right"
                  data-testid={`link-mobile-${link.id}`}
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); setAiModalOpen(true); }}
                className="flex items-center gap-2 justify-center bg-primary/10 border border-primary/30 text-primary text-sm font-semibold rounded-full px-4 py-3 transition-all"
              >
                <Sparkles size={14} />
                جرب الذكاء الاصطناعي
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* AI Modal */}
      <AnimatePresence>
        {aiModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setAiModalOpen(false); }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#080808] border border-white/10 rounded-3xl shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#080808] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-bold">جرب قوة وجد</p>
                    <p className="text-white/40 text-xs">ذكاء اصطناعي لتوليد محتواك</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <AIExperience asModal />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
