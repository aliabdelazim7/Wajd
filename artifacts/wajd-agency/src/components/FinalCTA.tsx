import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  const scrollToForm = () => {
    document.getElementById("simulate")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="cta" className="min-h-[80dvh] flex items-center justify-center relative overflow-hidden bg-black py-20">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(212,175,55,0.12),transparent)] pointer-events-none" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-2xl"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              top: `${10 + i * 11}%`,
              left: `${5 + i * 12}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Glowing ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10 animate-[spin_30s_linear_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/5 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

      <div className="container relative z-10 px-6 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-8"
        >
          <Sparkles size={14} className="text-primary" />
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">ابدأ التحول</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
        >
          خلّي البراند بتاعك{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-300 to-primary bg-[length:200%] animate-[gradient_3s_linear_infinite]">
            يبقى اللي كله بيتكلم عنه
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground/60 mb-12 max-w-2xl mx-auto"
        >
          سواء كنت بداية أو عندك شركة قائمة، وجد تقدر تاخدك للمستوى الجاي.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={scrollToForm}
            className="h-20 px-12 text-2xl font-bold bg-primary text-black hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] rounded-full group relative overflow-hidden"
            data-testid="button-final-cta"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-4">
              ابدأ التحول دلوقتي
              <ArrowLeft className="group-hover:-translate-x-2 transition-transform duration-300" size={28} />
            </span>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-white/25 text-sm"
        >
          بدون التزام — فريق وجد بيتواصل معاك خلال 24 ساعة
        </motion.p>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
