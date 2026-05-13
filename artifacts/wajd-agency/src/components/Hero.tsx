import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      dots.length = 0;
      const count = Math.floor((w * h) / 18000);
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,175,55,0.25)";
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.07 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Radial glow overlays */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(212,175,55,0.08),transparent)]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      <div className="container relative z-10 px-6 md:px-12 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            وكالة تسويق غير تقليدية
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.08] mb-6 max-w-5xl"
        >
          دي مش وكالة...{" "}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#D4AF37] via-[#f5d97e] to-[#B8960C] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            دي ماكينة نمو
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-2xl text-foreground/60 max-w-2xl mb-12"
        >
          نحوّل التسويق لنتائج حقيقية وأرقام واضحة —{" "}
          <span className="text-white/80">بدون كلام فاضي</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            className="h-16 px-10 text-xl bg-primary text-black font-black hover:bg-primary/90 shadow-[0_0_35px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)] transition-all duration-300 rounded-2xl group"
            onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="button-hero-cta"
          >
            <span className="flex items-center gap-3">
              ابدأ التحول
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-16 px-10 text-xl border-white/15 text-white/80 hover:bg-white/5 hover:border-primary/40 hover:text-primary transition-all duration-300 rounded-2xl"
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="button-hero-portfolio"
          >
            شوف أعمالنا
          </Button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-14 flex items-center gap-3 text-white/25 text-sm"
        >
          <div className="flex -space-x-2 -space-x-reverse">
            {["ع", "م", "ش", "ف", "ه"].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white/60"
              >
                {c}
              </div>
            ))}
          </div>
          <span>انضم لـ +50 براند يثقون في وجد</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-foreground/30 hover:text-primary transition-colors"
        onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">اكتشف</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </div>
  );
}
