import React from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';
import { Target, BarChart3, PenTool, Layers, Rocket, Search, Zap, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';

const Services = () => {
    const { lang, content } = useApp();
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const textAlign = lang === 'ar' ? 'text-right' : 'text-left';
    const hero = getCmsBlock(content, 'services.hero', lang === 'ar'
        ? { title: 'آليات النمو لدينا.', body: 'نحن لا نقدم مهاماً تسويقية؛ نحن نقدم نتائج تجارية ملموسة.', data: { eyebrow: 'قدراتنا' } }
        : { title: 'Our Growth Mechanisms.', body: 'We do not deliver marketing tasks; we deliver tangible business outcomes.', data: { eyebrow: 'CAPABILITIES' } });
    const catalog = getCmsBlock(content, 'services.catalog', { data: { items: [] } });
    const fallbackServices = [
        {
            icon: Target,
            title: lang === 'ar' ? 'هندسة الاستحواذ' : 'Acquisition Engineering',
            mechanism: lang === 'ar' ? 'أنظمة مبيعات قابلة للتنبؤ' : 'Predictable sales systems',
            outcome: lang === 'ar' ? 'نمو قاعدة العملاء' : 'Customer base growth',
            desc: lang === 'ar' ? 'نبني آلات استحواذ خاصة تجد وتجذب عملائك المثاليين على نطاق واسع. لا مجال للتخمين، فقط نتائج مبنية على البيانات والتحليل السلوكي.' : 'We build acquisition engines that find and convert your ideal customers at scale—grounded in data and behavioral insight.'
        },
        {
            icon: BarChart3,
            title: lang === 'ar' ? 'تسويق الأداء' : 'Performance Marketing',
            mechanism: lang === 'ar' ? 'تحسين العائد الإعلاني ROAS' : 'ROAS optimization',
            outcome: lang === 'ar' ? 'توسيع نطاق الإيرادات' : 'Revenue expansion',
            desc: lang === 'ar' ? 'تحويل الإنفاق الإعلاني إلى نمو ملموس. ندير ونحسن ميزانيتك عبر ميتا وسناب شات وجوجل وتيك توك لتحقيق أقصى استفادة من كل ريال مستثمر.' : 'We turn ad spend into measurable growth by managing and optimizing Meta, Snapchat, Google, and TikTok campaigns.'
        },
        {
            icon: PenTool,
            title: lang === 'ar' ? 'محتوى إبداعي عالي التأثير' : 'High-Impact Creative',
            mechanism: lang === 'ar' ? 'سرد قصصي بصري' : 'Visual storytelling',
            outcome: lang === 'ar' ? 'جذب الانتباه والتحويل' : 'Attention and conversion',
            desc: lang === 'ar' ? 'إبداع لا يكتفي بالمظهر الجميل فحسب، بل يبيع. نصمم أصولاً بصرية هندست خصيصاً لكسب الانتباه في أول ثوانٍ وتحفيز اتخاذ القرار الشرائي.' : 'Creative that does more than look good—it sells. We design visual assets to earn attention in the first seconds and move buyers to act.'
        },
        {
            icon: Layers,
            title: lang === 'ar' ? 'استراتيجية النمو' : 'Growth Strategy',
            mechanism: lang === 'ar' ? 'المخطط المعماري' : 'The architectural blueprint',
            outcome: lang === 'ar' ? 'الهيمنة على السوق' : 'Market leadership',
            desc: lang === 'ar' ? 'الأساس الاستراتيجي وراء كل حملة. نرسم خريطة رحلة عميلك بالكامل ونبني الأنظمة التقنية اللازمة للهيمنة على تخصصك وتوسيع حصتك السوقية.' : 'The strategic foundation behind every campaign. We map the full customer journey and build the systems needed to expand your market share.'
        }
    ];
    const services = catalog.data?.items?.length ? catalog.data.items.map((item, index) => ({ ...item, icon: [Target, BarChart3, PenTool, Layers][index] || Target })) : fallbackServices;

    const process = lang === 'ar' ? [
        { icon: Search, title: 'الفحص والتقييم', desc: 'تحديد فجوات الأداء الحالية ومواضع هدر الميزانية.' },
        { icon: Layers, title: 'التخطيط الاستراتيجي', desc: 'بناء مسار شراء مخصص يركز على تحويل الزائر إلى مشترٍ.' },
        { icon: Rocket, title: 'الإطلاق والتحسين', desc: 'مراقبة الأرقام 24/7 مع تحسين مستمر للعروض والجمهور.' },
        { icon: TrendingUp, title: 'المضاعفة والتوسع', desc: 'توسيع القنوات الرابحة وفتح أسواق جديدة بثقة تامة.' }
    ] : [
        { icon: Search, title: 'Audit and Assessment', desc: 'Identify current performance gaps and budget leakage.' },
        { icon: Layers, title: 'Strategic Planning', desc: 'Build a tailored buying journey designed to turn visitors into customers.' },
        { icon: Rocket, title: 'Launch and Optimize', desc: 'Monitor the numbers around the clock and continuously improve offers and audiences.' },
        { icon: TrendingUp, title: 'Scale and Expand', desc: 'Scale winning channels and enter new markets with confidence.' }
    ];

    return (
        <Layout>
            <section className="pt-48 pb-24 px-[5%]" dir={direction}>
                <div className="max-w-6xl mx-auto text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-500 text-xs uppercase tracking-[0.3em] font-medium mb-8 block font-sans"
                    >
                        {hero.data?.eyebrow || (lang === 'ar' ? 'قدراتنا' : 'CAPABILITIES')}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[10rem] font-serif leading-[0.85] mb-12 tracking-tighter"
                    >
                        {hero.title}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto text-white/60 text-xl font-arabic leading-relaxed"
                    >
                        {hero.body}
                    </motion.p>
                </div>
            </section>

            <section className="section-padding pt-0" dir={direction}>
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                    {services.map((service, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className={`glass-card p-16 rounded-[3rem] group hover:border-gold-500/30 transition-all ${textAlign} border border-white/5`}
                        >
                            <div className="w-20 h-20 rounded-[1.5rem] bg-gold-500/5 border border-gold-500/10 flex items-center justify-center mb-10 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition-all duration-700 mr-0 ml-auto">
                                <service.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-4xl font-serif mb-3">{service.title}</h3>
                            <p className="text-gold-500 text-sm uppercase tracking-widest font-medium mb-8 font-sans">{service.mechanism} → {service.outcome}</p>
                            <p className="text-white/40 font-arabic text-lg leading-relaxed">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding bg-obsidian-900" dir={direction}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-8xl font-serif mb-8">{lang === 'ar' ? 'منهجية التنفيذ' : 'How We Execute'}</h2>
                        <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto">{lang === 'ar' ? 'كيف ننتقل بعملك من الوضع الحالي إلى السيادة السوقية.' : 'How we move your business from its current state to market leadership.'}</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-12">
                        {process.map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={textAlign}
                            >
                                <p className="text-gold-500 font-serif text-5xl mb-8 opacity-20">0{i + 1}</p>
                                <h3 className="text-2xl font-serif mb-4 text-white">{step.title}</h3>
                                <p className="text-white/40 font-arabic leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Services;
