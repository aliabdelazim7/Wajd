import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import img1 from "@assets/1_1777748284175.png";
import img5 from "@assets/5_1777748284178.png";
import img7 from "@assets/7_1777748284179.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type Metric = {
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
};

type DynamicItem = {
  id: number;
  client: string;
  period: string;
  tag: string;
  color: string;
  metrics: Metric[];
  screenshotUrl?: string | null;
};

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * value);
      if (progress < 1) requestAnimationFrame(update);
      else setCount(value);
    };
    requestAnimationFrame(update);
  }, [isInView, value]);

  const display =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("en-US");

  return (
    <span ref={ref} className="font-black font-mono tracking-tight">
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── Static cases (العويد) ────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { gradient: string; border: string; tag: string }> = {
  amber:  { gradient: "from-amber-500/10",  border: "group-hover:border-amber-500/40",  tag: "bg-amber-500/10 text-amber-400 border-amber-500/20"  },
  blue:   { gradient: "from-blue-500/10",   border: "group-hover:border-blue-500/40",   tag: "bg-blue-500/10 text-blue-400 border-blue-500/20"     },
  pink:   { gradient: "from-pink-500/10",   border: "group-hover:border-pink-500/40",   tag: "bg-pink-500/10 text-pink-400 border-pink-500/20"     },
  green:  { gradient: "from-green-500/10",  border: "group-hover:border-green-500/40",  tag: "bg-green-500/10 text-green-400 border-green-500/20"  },
  purple: { gradient: "from-purple-500/10", border: "group-hover:border-purple-500/40", tag: "bg-purple-500/10 text-purple-400 border-purple-500/20"},
  red:    { gradient: "from-red-500/10",    border: "group-hover:border-red-500/40",    tag: "bg-red-500/10 text-red-400 border-red-500/20"        },
};

const staticCases = [
  {
    id: "static-1",
    client: "براند العويد",
    period: "نوفمبر 2025",
    tag: "متجر إلكتروني",
    screenshot: img1,
    color: "amber",
    metrics: [
      { label: "إجمالي المبيعات", value: 897421, prefix: "₺", suffix: "", decimals: 0 },
      { label: "عدد الطلبات",     value: 2938,   prefix: "",  suffix: " طلب", decimals: 0 },
      { label: "زيارات المتجر",   value: 511600, prefix: "",  suffix: " زيارة", decimals: 0 },
      { label: "عملاء جدد",       value: 2895,   prefix: "",  suffix: " عميل", decimals: 0 },
    ],
  },
  {
    id: "static-2",
    client: "براند العويد",
    period: "يناير 2026",
    tag: "إعلانات TikTok",
    screenshot: img5,
    color: "pink",
    metrics: [
      { label: "ROAS",            value: 6.45,   prefix: "",  suffix: "x",      decimals: 2 },
      { label: "مشتريات",         value: 1833,   prefix: "",  suffix: " شراء",  decimals: 0 },
      { label: "Checkouts",       value: 14642,  prefix: "",  suffix: "",        decimals: 0 },
      { label: "الإنفاق",         value: 23229,  prefix: "$", suffix: "",        decimals: 0 },
    ],
  },
  {
    id: "static-3",
    client: "براند العويد",
    period: "نوفمبر 2025",
    tag: "إعلانات Meta",
    screenshot: img7,
    color: "blue",
    metrics: [
      { label: "ROAS",            value: 2.51,   prefix: "",     suffix: "x",     decimals: 2 },
      { label: "مشتريات",         value: 1350,   prefix: "",     suffix: " شراء", decimals: 0 },
      { label: "إضافة للسلة",     value: 10798,  prefix: "",     suffix: "",       decimals: 0 },
      { label: "الإنفاق",         value: 132372, prefix: "ر.س",  suffix: "",       decimals: 0 },
    ],
  },
];

// ─── Card components ──────────────────────────────────────────────────────────
function StaticCard({ c, idx }: { c: typeof staticCases[0]; idx: number }) {
  const theme = COLOR_MAP[c.color] ?? COLOR_MAP["amber"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: idx * 0.12 }}
      className={`group bg-[#0a0a0a] border border-white/10 ${theme.border} rounded-3xl overflow-hidden transition-all duration-300`}
    >
      <div className="relative overflow-hidden h-44 bg-white/5">
        <img
          src={c.screenshot}
          alt={`${c.client} - ${c.period}`}
          className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} to-transparent`} />
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold border rounded-full px-3 py-1 backdrop-blur-sm ${theme.tag}`}>
            {c.tag}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-xs text-white/50 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            {c.period}
          </span>
        </div>
      </div>

      <div className="px-6 pt-5 pb-2">
        <h3 className="text-xl font-black text-white">{c.client}</h3>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/5">
        {c.metrics.map((m) => (
          <div key={m.label} className="bg-[#0a0a0a] p-5">
            <p className="text-white/40 text-xs mb-1">{m.label}</p>
            <div className="text-xl text-white leading-tight">
              <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DynamicCard({ item, idx }: { item: DynamicItem; idx: number }) {
  const theme = COLOR_MAP[item.color] ?? COLOR_MAP["amber"];
  const dotColor: Record<string, string> = {
    amber: "bg-amber-500", blue: "bg-blue-500", pink: "bg-pink-500",
    green: "bg-green-500", purple: "bg-purple-500", red: "bg-red-500",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: idx * 0.12 }}
      className={`group bg-[#0a0a0a] border border-white/10 ${theme.border} rounded-3xl overflow-hidden transition-all duration-300`}
    >
      {item.screenshotUrl ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.screenshotUrl}
            alt={item.client}
            className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute bottom-3 right-4">
            <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 backdrop-blur-sm ${theme.tag}`}>
              {item.tag}
            </span>
          </div>
        </div>
      ) : (
        <div className={`h-1.5 w-full ${dotColor[item.color] ?? "bg-amber-500"}`} />
      )}

      <div className="px-6 pt-5 pb-2 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-black text-white">{item.client}</h3>
          <div className="flex gap-2 mt-1">
            {!item.screenshotUrl && (
              <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${theme.tag}`}>
                {item.tag}
              </span>
            )}
            <span className="text-xs text-white/30">{item.period}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/5 mt-3">
        {item.metrics.map((m) => (
          <div key={m.label} className="bg-[#0a0a0a] p-5">
            <p className="text-white/40 text-xs mb-1">{m.label}</p>
            <div className="text-xl text-white leading-tight">
              <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [dynamicItems, setDynamicItems] = useState<DynamicItem[]>([]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDynamicItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div id="portfolio" className="py-32 bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              أعمالنا
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              أرقام تتكلم
            </h2>
            <p className="text-xl text-foreground/60 max-w-xl">
              مش كلام — نتائج حقيقية من براندات حقيقية شغلنا عليها.
            </p>
          </div>
          <div className="h-px flex-1 bg-white/10 hidden md:block mb-4 mx-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {staticCases.map((c, i) => (
            <StaticCard key={c.id} c={c} idx={i} />
          ))}
          {dynamicItems.map((item, i) => (
            <DynamicCard key={item.id} item={item} idx={i} />
          ))}
        </div>

        <p className="text-center text-white/20 text-sm mt-12">
          * الأرقام من لوحات تحكم حقيقية — Shopify · TikTok Ads · Meta Ads
        </p>
      </div>
    </div>
  );
}
