import React from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';

const About = () => {
    const { lang, content } = useApp();
    const hero = getCmsBlock(content, 'about.hero', { title: 'نحن نُوجد لتحويل الإمكانات إلى أرباح.', body: 'فلسفة وجد', data: { eyebrow: 'فلسفتنا' } });
    const narrative = getCmsBlock(content, 'about.narrative', { title: 'منهجية وجد', body: 'في وجد، لا نؤمن بالتسويق كنشاط قائم بذاته. نؤمن بهندسة الإيرادات.', data: { paragraphs: ['فريقنا مزيج من مهندسي الأداء والمبدعين الاستراتيجيين وعلماء البيانات.', 'لا نعمل لديك فقط؛ نعمل من أجل أرباحك الصافية.'] } });
    const principlesBlock = getCmsBlock(content, 'about.principles', { title: 'مبادئنا الجوهرية', body: 'القيم التي تحرك كل قرار نتخذه في سبيل نمو علامتك التجارية.', data: { items: [] } });
    const principles = principlesBlock.data?.items?.length ? principlesBlock.data.items : (lang === 'ar' ? [
        { title: 'شفافية مطلقة', desc: 'لا توجد رسوم مخفية، ولا بيانات محجوبة.' },
        { title: 'هوس بالنتائج', desc: 'كل قرار يقاس مقابل نمو الإيرادات الفعلي.' },
        { title: 'أنظمة قابلة للتوسع', desc: 'نبني نتائج قابلة للتنبؤ والقياس.' },
    ] : [
        { title: 'Radical transparency', desc: 'No hidden fees and no hidden data.' },
        { title: 'Results obsession', desc: 'Every decision is measured against real revenue growth.' },
        { title: 'Scalable systems', desc: 'We build outcomes that can be predicted and measured.' },
    ]);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative pt-48 pb-24 px-[5%] overflow-hidden" dir="rtl">
                <div className="max-w-6xl mx-auto text-right">
                    <motion.span 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-gold-500 text-xs uppercase tracking-[0.3em] font-medium mb-8 block font-sans"
                    >
                        {hero.data?.eyebrow || (lang === 'ar' ? 'فلسفتنا' : 'OUR PHILOSOPHY')}
                    </motion.span>
                    <motion.h1 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-6xl md:text-[10rem] font-serif leading-[0.85] mb-16 tracking-tighter"
                    >
                        {hero.title}
                    </motion.h1>
                </div>
            </section>

            {/* Core Narrative */}
            <section className="section-padding bg-obsidian-900" dir="rtl">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-right"
                    >
                        <h2 className="text-5xl font-serif mb-10 text-white/90">{narrative.title}</h2>
                        <div className="space-y-8 text-white/60 text-xl font-arabic leading-relaxed">
                            <p>{narrative.body}</p>
                            {(narrative.data?.paragraphs || []).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                        </div>
                    </motion.div>
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-obsidian-800 border border-white/5">
                            <img 
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop" 
                                alt="Strategy Session" 
                                className="w-full h-full object-cover grayscale opacity-40 hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        <div className="absolute -bottom-12 -right-12 glass-card p-12 rounded-[2rem] hidden md:block text-right border border-gold-500/20">
                            <p className="text-6xl font-serif text-gold-500 mb-2">100%</p>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans">Data Driven Architecture</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Principles */}
            <section className="section-padding" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-8xl font-serif mb-8">{principlesBlock.title}</h2>
                        <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto leading-relaxed">{principlesBlock.body}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-20">
                        {principles.map((principle, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                variants={fadeIn}
                                className="text-center group"
                            >
                                <div className="w-20 h-20 bg-gold-500/5 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-gold-500/10 rotate-12 group-hover:rotate-0 group-hover:bg-gold-500 group-hover:border-gold-500 transition-all duration-700">
                                    <span className="text-gold-500 font-serif text-3xl -rotate-12 group-hover:rotate-0 group-hover:text-obsidian-950 transition-all duration-700">{i + 1}</span>
                                </div>
                                <h3 className="text-3xl font-serif mb-6">{principle.title}</h3>
                                <p className="text-white/40 font-arabic text-lg leading-relaxed">{principle.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default About;
