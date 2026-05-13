import React from "react";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Mail, ArrowLeft } from "lucide-react";
import { SiTiktok, SiFacebook } from "react-icons/si";

const links = {
  services: [
    { label: "إعلانات Meta & TikTok", id: "services" },
    { label: "إدارة المحتوى",         id: "services" },
    { label: "هوية بصرية",            id: "services" },
    { label: "تحليل البراند",         id: "services" },
  ],
  company: [
    { label: "أعمالنا",    id: "portfolio" },
    { label: "من نحن",     id: "story"     },
    { label: "تواصل معنا", id: "cta"       },
    { label: "لوحة التحكم",href: "/admin"  },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#040404] border-t border-white/5 pt-20 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,175,55,0.04),transparent)] pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        {/* Top CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0a0a0a] border border-white/8 rounded-3xl p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(212,175,55,0.06)]"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              جاهز تشوف نتائج حقيقية؟
            </h3>
            <p className="text-white/40 text-base">
              كلمنا دلوقتي — التحليل الأول مجاناً
            </p>
          </div>
          <button
            onClick={() => scrollTo("cta")}
            className="shrink-0 flex items-center gap-3 bg-primary text-black font-black px-8 py-4 rounded-2xl hover:bg-primary/90 shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all duration-300 group"
          >
            ابدأ معنا
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl font-black text-primary tracking-tighter">وجد</span>
            </div>
            <p className="text-white/40 text-base leading-relaxed mb-6 max-w-sm">
              وكالة تسويق رقمي متخصصة في تحويل الميزانيات الإعلانية لنتائج قابلة للقياس وعائد استثمار مضاعف.
            </p>
            <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/wajdagency" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary text-white/50 flex items-center justify-center transition-all duration-200" data-testid="link-social-instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@wajdagency" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary text-white/50 flex items-center justify-center transition-all duration-200" data-testid="link-social-tiktok">
                <SiTiktok size={16} />
              </a>
              <a href="https://x.com/wajdagency" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary text-white/50 flex items-center justify-center transition-all duration-200" data-testid="link-social-twitter">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/company/wajdagency" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary text-white/50 flex items-center justify-center transition-all duration-200" data-testid="link-social-linkedin">
                <Linkedin size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61562980695038" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary text-white/50 flex items-center justify-center transition-all duration-200" data-testid="link-social-facebook">
                <SiFacebook size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/80 font-bold mb-5 text-sm uppercase tracking-widest">الخدمات</h4>
            <ul className="space-y-3">
              {links.services.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="text-white/40 hover:text-primary transition-colors text-sm text-right w-full"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h4 className="text-white/80 font-bold mb-5 text-sm uppercase tracking-widest">روابط</h4>
            <ul className="space-y-3 mb-8">
              {links.company.map((l) => (
                <li key={l.label}>
                  {"href" in l ? (
                    <a href={l.href} className="text-white/40 hover:text-primary transition-colors text-sm">
                      {l.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollTo(l.id)}
                      className="text-white/40 hover:text-primary transition-colors text-sm text-right w-full"
                    >
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <a href="mailto:wajd.marketing@gmail.com" className="flex items-center gap-3 text-white/30 hover:text-primary transition-colors text-sm group">
                <Mail size={15} className="shrink-0" />
                wajd.marketing@gmail.com
              </a>
              <a href="https://linktr.ee/wajd.agency" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/30 hover:text-primary transition-colors text-sm group">
                <span className="text-xs font-bold border border-current rounded px-1">LT</span>
                linktr.ee/wajd.agency
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-sm">
            © {year} وجد — Wajd Marketing Agency. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/15 text-xs tracking-wider">
            ماكينة النمو · GROWTH MACHINE
          </p>
        </div>
      </div>
    </footer>
  );
}
