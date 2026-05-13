import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingDown, TrendingUp, ArrowLeft } from "lucide-react";

function AnimatedNum({ target, duration = 2000 }: { target: number; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{val.toLocaleString("en-US")}</span>;
}

const beforeMetrics = [
  { label: "مبيعات شهرية", value: 8500, suffix: "ر.س", bad: true },
  { label: "متابعين حقيقيين", value: 420, suffix: "", bad: true },
  { label: "معدل التحويل", value: 0.8, suffix: "%", bad: true, fixed: 1 },
  { label: "ROAS الإعلانات", value: 0.9, suffix: "x", bad: true, fixed: 1 },
];

const afterMetrics = [
  { label: "مبيعات شهرية", value: 897421, suffix: "ر.س", bad: false },
  { label: "متابعين حقيقيين", value: 84000, suffix: "", bad: false },
  { label: "معدل التحويل", value: 6.8, suffix: "%", bad: false, fixed: 1 },
  { label: "ROAS الإعلانات", value: 6.45, suffix: "x", bad: false, fixed: 2 },
];

function MetricRow({
  label,
  value,
  suffix,
  bad,
  fixed,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  bad: boolean;
  fixed?: number;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(ease * value);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  const display = fixed != null ? val.toFixed(fixed) : Math.floor(val).toLocaleString("en-US");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: bad ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay, duration: 0.5 }}
      className={`flex items-center justify-between py-4 border-b last:border-0 ${
        bad ? "border-red-900/30" : "border-green-900/30"
      }`}
    >
      <span className={`text-sm ${bad ? "text-white/40" : "text-white/70"}`}>{label}</span>
      <span
        className={`text-2xl font-black font-mono tabular-nums ${
          bad ? "text-red-400" : "text-green-400"
        } ${!bad ? "drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]" : ""}`}
      >
        {display}{suffix}
      </span>
    </motion.div>
  );
}

export default function BeforeAfter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(212,175,55,0.04),transparent)] pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold tracking-widest uppercase mb-4"
          >
            النتائج الحقيقية
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-4"
          >
            الفرق <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">واضح</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/50"
          >
            نفس البراند — قبل وبعد وجد
          </motion.p>
        </div>

        {/* Split screen */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Before */}
          <div className="bg-[#0d0505] border-l border-white/10 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-black text-lg">قبل وجد</p>
                <p className="text-white/30 text-xs">تسويق بدون استراتيجية</p>
              </div>
            </div>
            {beforeMetrics.map((m, i) => (
              <MetricRow key={m.label} {...m} delay={i * 0.1} />
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-red-500/5 border border-red-500/15 rounded-xl p-4 text-center"
            >
              <p className="text-red-400/70 text-sm">ميزانية إعلانية تُهدر بدون عائد</p>
            </motion.div>
          </div>

          {/* After */}
          <div className="bg-[#030d05] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-black text-lg">بعد وجد</p>
                <p className="text-white/30 text-xs">نتائج حقيقية وقابلة للقياس</p>
              </div>
            </div>
            {afterMetrics.map((m, i) => (
              <MetricRow key={m.label} {...m} delay={i * 0.1 + 0.2} />
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(212,175,55,0.05)]"
            >
              <p className="text-primary text-sm font-semibold">كل ريال إعلاني بيرجع 6.45x</p>
            </motion.div>
          </div>
        </div>

        {/* Arrow divider label */}
        <div className="flex justify-center mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-full px-6 py-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            <span className="text-white/60 text-sm">من</span>
            <span className="text-red-400 font-bold">8,500 ر.س</span>
            <ArrowLeft size={16} className="text-primary" />
            <span className="text-green-400 font-bold">+897,000 ر.س</span>
            <span className="text-white/60 text-sm">شهرياً</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
