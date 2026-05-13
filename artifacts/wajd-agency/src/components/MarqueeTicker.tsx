import React from "react";

const items = [
  "إعلانات Meta", "إعلانات TikTok",
  "إدارة المحتوى", "هوية بصرية",
  "متاجر Shopify", "تحليل البيانات",
  "بناء البراند", "استراتيجية التسويق",
  "ذكاء اصطناعي", "زيادة المبيعات",
  "إعادة الاستهداف", "تحسين الـ ROAS",
];

const Dot = () => (
  <span className="mx-6 text-primary/60 text-lg select-none">◆</span>
);

export default function MarqueeTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden bg-black border-y border-white/5 py-4 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div dir="ltr" className="flex w-max animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-white/30 text-sm font-semibold tracking-widest uppercase hover:text-primary transition-colors duration-200 cursor-default">
              {item}
            </span>
            <Dot />
          </span>
        ))}
      </div>
    </div>
  );
}
