import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Film, Palette, ShoppingBag, BarChart2, BrainCircuit,
} from "lucide-react";

const services = [
  {
    icon: <TrendingUp size={28} />,
    title: "إعلانات Meta & TikTok",
    desc: "حملات إعلانية مدروسة على Facebook وInstagram وTikTok مع تتبع دقيق لكل ريال تنفقه.",
    tag: "الأعلى طلباً",
    highlight: true,
  },
  {
    icon: <Film size={28} />,
    title: "إدارة المحتوى",
    desc: "محتوى يومي واحترافي يبني حضورك الرقمي ويحوّل المتابعين لعملاء فعليين.",
    tag: null,
    highlight: false,
  },
  {
    icon: <Palette size={28} />,
    title: "الهوية البصرية",
    desc: "تصميم لوغو وهوية بصرية متكاملة تعكس قيمتك وتفرّق براندك في السوق.",
    tag: null,
    highlight: false,
  },
  {
    icon: <ShoppingBag size={28} />,
    title: "متاجر Shopify",
    desc: "بناء وتحسين متجرك الإلكتروني على Shopify مع تجربة شراء سلسة وتحويل عالي.",
    tag: null,
    highlight: false,
  },
  {
    icon: <BarChart2 size={28} />,
    title: "تحليل البيانات",
    desc: "تقارير وتحليلات متعمقة تكشف أين تنجح إعلاناتك وأين ينزف الميزانية.",
    tag: null,
    highlight: false,
  },
  {
    icon: <BrainCircuit size={28} />,
    title: "استراتيجية بالذكاء الاصطناعي",
    desc: "نستخدم أحدث أدوات الـ AI لتسريع إنتاج المحتوى وتحسين أداء حملاتك.",
    tag: "جديد",
    highlight: false,
  },
];

export default function Services() {
  return (
    <div id="services" className="py-32 bg-[#060606] relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.06),transparent)] pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">خدماتنا</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-4"
          >
            كل حاجة براندك{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">
              محتاجها
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/50 max-w-xl mx-auto"
          >
            مش وكالة تعمل كل حاجة بشكل عادي — وجد بتتخصص وبتتميز في كل خدمة.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative bg-[#0a0a0a] border rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                s.highlight
                  ? "border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.08)]"
                  : "border-white/8 hover:border-white/20"
              }`}
            >
              {s.highlight && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              )}

              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  s.highlight
                    ? "bg-primary/15 text-primary group-hover:bg-primary/25"
                    : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-primary"
                }`}>
                  {s.icon}
                </div>
                {s.tag && (
                  <span className={`text-xs font-bold border rounded-full px-3 py-1 ${
                    s.tag === "الأعلى طلباً"
                      ? "bg-primary/10 text-primary border-primary/25"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {s.tag}
                  </span>
                )}
              </div>

              <h3 className={`text-xl font-black mb-3 transition-colors duration-200 ${
                s.highlight ? "text-white" : "text-white/80 group-hover:text-white"
              }`}>
                {s.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/55 transition-colors duration-200">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => document.getElementById("simulate")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 font-bold px-8 py-4 rounded-2xl transition-all duration-300"
          >
            ابدأ تحليل براندك مجاناً ←
          </button>
        </motion.div>
      </div>
    </div>
  );
}
