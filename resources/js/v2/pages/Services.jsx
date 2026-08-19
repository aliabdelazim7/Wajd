import React from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';
import { Target, BarChart3, PenTool, Layers, Rocket, Search, Zap, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';

const Services = () => {
    const { lang, content } = useApp();
    const hero = getCmsBlock(content, 'services.hero', { title: 'آليات النمو لدينا.', body: 'نحن لا نقدم مهاماً تسويقية؛ نحن نقدم نتائج تجارية ملموسة.', data: { eyebrow: 'قدراتنا' } });
    const catalog = getCmsBlock(content, 'services.catalog', { data: { items: [] } });
    const fallbackServices = [
        {
            icon: Target,
            title: 'هندسة الاستحواذ',
            mechanism: 'أنظمة مبيعات قابلة للتنبؤ',
            outcome: 'نمو قاعدة العملاء',
            desc: 'نبني آلات استحواذ خاصة تجد وتجذب عملائك المثاليين على نطاق واسع. لا مجال للتخمين، فقط نتائج مبنية على البيانات والتحليل السلوكي.'
        },
        {
            icon: BarChart3,
            title: 'تسويق الأداء',
            mechanism: 'تحسين العائد الإعلاني ROAS',
            outcome: 'توسيع نطاق الإيرادات',
            desc: 'تحويل الإنفاق الإعلاني إلى نمو ملموس. ندير ونحسن ميزانيتك عبر ميتا وسناب شات وجوجل وتيك توك لتحقيق أقصى استفادة من كل ريال مستثمر.'
        },
        {
            icon: PenTool,
            title: 'محتوى إبداعي عالي التأثير',
            mechanism: 'سرد قصصي بصري',
            outcome: 'جذب الانتباه والتحويل',
            desc: 'إبداع لا يكتفي بالمظهر الجميل فحسب، بل يبيع. نصمم أصولاً بصرية هندست خصيصاً لكسب الانتباه في أول ثوانٍ وتحفيز اتخاذ القرار الشرائي.'
        },
        {
            icon: Layers,
            title: 'استراتيجية النمو',
            mechanism: 'المخطط المعماري',
            outcome: 'الهيمنة على السوق',
            desc: 'الأساس الاستراتيجي وراء كل حملة. نرسم خريطة رحلة عميلك بالكامل ونبني الأنظمة التقنية اللازمة للهيمنة على تخصصك وتوسيع حصتك السوقية.'
        }
    ];
    const services = catalog.data?.items?.length ? catalog.data.items.map((item, index) => ({ ...item, icon: [Target, BarChart3, PenTool, Layers][index] || Target })) : fallbackServices;

    const process = [
        { icon: Search, title: 'الفحص والتقييم', desc: 'تحديد فجوات الأداء الحالية ومواضع هدر الميزانية.' },
        { icon: Layers, title: 'التخطيط الاستراتيجي', desc: 'بناء مسار شراء مخصص يركز على تحويل الزائر إلى مشترٍ.' },
        { icon: Rocket, title: 'الإطلاق والتحسين', desc: 'مراقبة الأرقام 24/7 مع تحسين مستمر للعروض والجمهور.' },
        { icon: TrendingUp, title: 'المضاعفة والتوسع', desc: 'توسيع القنوات الرابحة وفتح أسواق جديدة بثقة تامة.' }
    ];

    return (
        <Layout>
            <section className="pt-48 pb-24 px-[5%]" dir="rtl">
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

            <section className="section-padding pt-0" dir="rtl">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                    {services.map((service, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="glass-card p-16 rounded-[3rem] group hover:border-gold-500/30 transition-all text-right border border-white/5"
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
            <section className="section-padding bg-obsidian-900" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-8xl font-serif mb-8">منهجية التنفيذ</h2>
                        <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto">كيف ننتقل بعملك من الوضع الحالي إلى السيادة السوقية.</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-12">
                        {process.map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-right"
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
