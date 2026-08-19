import React from 'react';
import Layout from '../layout/Layout.jsx';
import CinematicHero from '../components/CinematicHero.jsx';
import FAQ from '../components/FAQ.jsx';
import ImpactSimulator from '../components/ImpactSimulator.jsx';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, TrendingUp, Shield, Zap, Target, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';

const Home = () => {
    const { t, content } = useApp();
    const fallbackWork = [
        { id: 'al-owaid', name: 'براند العويد للعود', metric: '2.6x ROAS', desc: 'استراتيجية استحواذ لبراند عطور فاخر على منصة سلة.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop' },
        { id: 'toyo', name: 'تطبيق تويو (Toyo)', metric: '2,500+ Conv.', desc: 'نمو محلي مكثف لخدمات التوصيل في السوق السعودي.', image: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop' },
        { id: 'qanatir', name: 'براند قناطير الغذائي', metric: '2.5x ROAS', desc: 'توسيع نطاق الإيرادات عبر المحتوى الإبداعي عالي الأداء.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' },
    ];

    const selectedWork = content?.projects?.length
        ? content.projects.map((project) => ({
            id: project.slug,
            name: project.name,
            metric: Object.values(project.results || {})[0] || 'Featured impact',
            desc: project.description || '',
            image: project.image_url || project.thumbnail_url || fallbackWork[0].image,
        }))
        : fallbackWork;

    const cmsPackages = content?.packages?.length
        ? content.packages.map((pkg) => ({ ...pkg, price: `${Number(pkg.price_sar).toLocaleString()} SAR` }))
        : t.packages.items;

    const whyBlock = getCmsBlock(content, 'home.why_wajd', { title: t.whyUs.title, body: t.whyUs.subtitle, data: {} });
    const whyItems = whyBlock.data?.items?.length ? whyBlock.data.items : t.whyUs.items;
    const whyWajd = whyItems.map((item, index) => ({
        ...item,
        icon: [Target, TrendingUp, Shield, Zap][index] || Target
    }));

    const partners = [
        { name: 'العويد للعود', logo: 'https://images.unsplash.com/photo-1588412079929-790b9f593d8e?q=80&w=200&auto=format&fit=crop' },
        { name: 'تويو', logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop' },
        { name: 'قناطير', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop' },
        { name: 'جسار', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aa9c?q=80&w=200&auto=format&fit=crop' },
        { name: 'فلاش', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop' },
    ];

    return (
        <Layout>
            <CinematicHero />

            {/* Impact Simulator Hook */}
            <ImpactSimulator />

            {/* Trusted By / Partners Section */}
            <section className="py-20 border-y border-white/5 bg-obsidian-950/50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-[5%]">
                    <p className="text-center text-white/20 text-xs uppercase tracking-[0.4em] mb-12 font-sans">Trusted by Ambitious Brands</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {partners.map((partner, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 font-serif text-xl">
                                    {partner.name[0]}
                                </div>
                                <span className="text-xl font-serif text-white/80">{partner.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Value Proposition Section */}
            <section className="section-padding bg-obsidian-900" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <span className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block font-sans">The Outcome Engine</span>
                            <h2 className="text-4xl md:text-6xl font-serif mb-10 leading-[1.2] text-right">
                                نحن لا نطلق إعلانات فقط. <br />
                                <span className="text-gold-500 italic">نحن نهندس النتائج.</span>
                            </h2>
                            <p className="text-white/50 text-lg mb-10 font-arabic leading-relaxed text-right">
                                تركز معظم الوكالات على مقاييس الغرور مثل النقرات والإعجابات. نحن نركز على المقياس الوحيد المهم: أرباحك الصافية. تجمع هندسة النمو لدينا بين تحليل البيانات العميق والمحتوى الإبداعي عالي التأثير لتحويل كل ريال من الإنفاق الإعلاني إلى إيرادات يمكن التنبؤ بها.
                            </p>
                            <Link to="/about" className="text-gold-500 hover:text-white transition-colors flex items-center gap-3 font-arabic text-lg justify-end group">
                                <ArrowUpRight className="w-5 h-5 rotate-[-90deg] group-hover:rotate-[-45deg] transition-transform" /> اكتشف منهجيتنا
                            </Link>
                        </motion.div>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { title: 'الاستحواذ (Acquisition)', desc: 'أنظمة قابلة للتوسع للعثور على عملائك المثاليين وتحويلهم.' },
                                { title: 'الأداء (Performance)', desc: 'تحسين مبني على البيانات يحقق أقصى استفادة من كل ميزانية.' },
                                { title: 'الإبداع (Creative)', desc: 'سرد قصصي بصري مصمم خصيصاً لجذب الانتباه والتحويل.' },
                                { title: 'الاستراتيجية (Strategy)', desc: 'المخطط المعماري وراء كل حملة ناجحة.' },
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className="glass-card p-10 rounded-[2rem] group hover:border-gold-500/30 transition-all text-right"
                                >
                                    <h3 className="text-2xl font-serif mb-3 group-hover:text-gold-500 transition-colors">{item.title}</h3>
                                    <p className="text-white/40 text-lg font-arabic leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Wajd - Grid Section */}
            <section className="section-padding" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-gold-500 text-xs uppercase tracking-[0.4em] font-medium mb-6 block font-sans">{whyBlock.data?.tag || t.whyUs.tag}</span>
                        <h2 className="text-4xl md:text-7xl font-serif mb-8">{whyBlock.title || t.whyUs.title}</h2>
                        <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto leading-relaxed">{whyBlock.body || t.whyUs.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {whyWajd.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-right p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6 mr-0 ml-auto">
                                    <item.icon className="w-6 h-6 text-gold-500" />
                                </div>
                                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                                <p className="text-white/40 font-arabic leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Selected Work Section */}
            <section className="section-padding bg-obsidian-900" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-20">
                        <div className="text-right">
                            <span className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block font-sans">Selected Impact</span>
                            <h2 className="text-4xl md:text-6xl font-serif">أعمال مختارة</h2>
                        </div>
                        <Link to="/portfolio" className="text-white/40 hover:text-gold-500 transition-colors flex items-center gap-3 font-arabic text-lg group">
                            <ArrowUpRight className="w-5 h-5 rotate-[-90deg] group-hover:rotate-[-45deg] transition-transform" /> عرض جميع المشاريع
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {selectedWork.map((work, i) => (
                            <Link 
                                to={`/portfolio/${work.id}`}
                                key={i}
                                className="group cursor-pointer text-right block"
                            >
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 1 }}
                                >
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 bg-obsidian-800 border border-white/5">
                                    <img 
                                        src={work.image} 
                                        alt={work.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-80"></div>
                                    <div className="absolute bottom-10 right-10 left-10">
                                        <p className="text-5xl font-serif text-gold-500 mb-2">{work.metric}</p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">Primary Outcome</p>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif mb-3 group-hover:text-gold-500 transition-colors">{work.name}</h3>
                                <p className="text-white/40 text-lg font-arabic">{work.desc}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Growth Packages Section */}
            <section className="section-padding bg-obsidian-950" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-gold-500 text-xs uppercase tracking-[0.4em] font-medium mb-6 block font-sans">{t.packages.tag}</span>
                        <h2 className="text-4xl md:text-7xl font-serif mb-8">{t.packages.title}</h2>
                        <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto">{t.packages.subtitle}</p>
                        <p className="text-white/30 text-sm font-arabic max-w-xl mx-auto mt-5">{t.packages.adSpendNote}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {cmsPackages.map((pkg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className={`glass-card p-10 rounded-[2.5rem] flex flex-col justify-between relative group transition-all ${pkg.popular ? 'border-2 border-gold-500/50 scale-105 z-10 bg-gold-500/5' : 'border border-white/5 hover:border-gold-500/20'}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold-500 text-obsidian-950 px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{t.packages.mostPopular}</div>
                                )}
                                <div>
                                    <h3 className={`text-2xl font-serif mb-2 ${pkg.popular ? 'text-gold-500' : ''}`}>{pkg.name}</h3>
                                    <p className="text-white/30 text-sm mb-8 font-sans uppercase tracking-widest">{pkg.subtitle}</p>
                                    <ul className="space-y-4 mb-10">
                                        {pkg.features.map((feat, j) => (
                                            <li key={j} className="flex items-center gap-3 text-white/70 font-arabic">
                                                <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" /> {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="pt-8 border-t border-white/5 mb-8">
                                        <p className="text-white/30 text-xs mb-2">{t.packages.monthlyFrom}</p>
                                        <p className="text-4xl font-serif text-white group-hover:text-gold-500 transition-colors">
                                            {pkg.price}
                                        </p>
                                    </div>
                                    <Link to="/contact" className={`w-full py-4 rounded-full font-arabic font-bold text-center block transition-all ${pkg.popular ? 'bg-gold-500 text-obsidian-950 hover:bg-white shadow-[0_0_30px_rgba(197,168,98,0.2)]' : 'border border-white/10 text-white hover:bg-white hover:text-obsidian-950'}`}>
                                        {t.packages.cta}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <FAQ />

            {/* Final CTA Section */}
            <section className="section-padding bg-gold-500 text-obsidian-950 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-7xl font-serif mb-10 leading-[1.1] tracking-tight">
                        {t.footer.ready}
                    </h2>
                    <p className="text-obsidian-950/70 text-xl md:text-2xl mb-16 font-arabic max-w-2xl mx-auto leading-relaxed">
                        {t.footer.desc}
                    </p>
                    <Link to="/contact" className="inline-block bg-obsidian-950 text-white px-16 py-6 rounded-full font-arabic font-bold text-2xl hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-obsidian-950/40 hover:bg-white hover:text-obsidian-950">
                        {t.footer.cta}
                    </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-obsidian-950/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </section>
        </Layout>
    );
};

export default Home;
