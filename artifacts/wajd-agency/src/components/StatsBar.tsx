import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ target, decimals = 0, prefix = "", suffix = "" }: {
  target: number; decimals?: number; prefix?: string; suffix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(e * target);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString("ar-EG");
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const stats = [
  { value: 50,  suffix: "+",  label: "عميل راضٍ",       decimals: 0 },
  { value: 6.45, suffix: "x", label: "متوسط الـ ROAS",   decimals: 2 },
  { value: 200, suffix: "+",  label: "حملة ناجحة",       decimals: 0 },
  { value: 897, suffix: "K+", label: "مبيعات في شهر",    decimals: 0, prefix: "₺" },
];

export default function StatsBar() {
  return (
    <div className="relative bg-[#070707] border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(212,175,55,0.04),transparent)] pointer-events-none" />

      <div className="container px-6 mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-x-reverse divide-white/5">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center px-6 py-4"
            >
              <span className="text-3xl md:text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] tabular-nums">
                <CountUp target={s.value} decimals={s.decimals} prefix={s.prefix ?? ""} suffix={s.suffix} />
              </span>
              <span className="text-white/40 text-sm mt-2 font-medium">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
