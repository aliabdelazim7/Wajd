import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { LayoutGrid, ShoppingCart, ShieldCheck, Zap, ArrowRight, ExternalLink, Monitor, Smartphone, Database } from 'lucide-react';

const TechShowcase = () => {
    const { lang } = useApp();
    const isArabic = lang === 'ar';

    const content = isArabic ? {
        eyebrow: 'الحلول التقنية',
        title: 'أنظمة ذكية لإدارة نموك.',
        desc: 'لا نكتفي بجلب العملاء، بل نوفر لك الأدوات التقنية لإدارة عملياتك بكفاءة عالية وأتمتة كاملة.',
        items: [
            {
                id: 'market-pos',
                title: 'Market POS',
                category: 'نظام إدارة التجزئة',
                desc: 'نظام كاشير متكامل يدير المخزون، المبيعات، والتقارير المالية بدقة متناهية. مصمم للسرعة وسهولة الاستخدام في نقاط البيع المزدحمة.',
                features: ['إدارة مخزون ذكية', 'تقارير أرباح حية', 'دعم الباركود والطباعة'],
                link: 'https://market-1-tau.vercel.app/login',
                icon: ShoppingCart
            },
            {
                id: 'adria-admin',
                title: 'Adria Admin',
                category: 'إدارة متاجر الأزياء',
                desc: 'منصة إدارية متقدمة مصممة خصيصاً لقطاع الأزياء والبوتيكات. تشمل إدارة التصنيع، الخزائن، وحملات واتساب التسويقية المدمجة.',
                features: ['تتبع دورة التصنيع', 'إدارة الخزائن والشركاء', 'حملات واتساب مدمجة'],
                link: 'https://adria-demo.vercel.app/admin/',
                icon: LayoutGrid
            }
        ],
        cta: 'اطلب نظامك المخصص الآن'
    } : {
        eyebrow: 'TECH SOLUTIONS',
        title: 'Smart Systems to Manage Your Growth.',
        desc: 'We don’t just bring customers; we provide the tech tools to manage your operations with high efficiency and full automation.',
        items: [
            {
                id: 'market-pos',
                title: 'Market POS',
                category: 'Retail Management System',
                desc: 'A complete cashier system managing inventory, sales, and financial reports with extreme precision. Built for speed in busy retail environments.',
                features: ['Smart Inventory Management', 'Live Profit Reporting', 'Barcode & Printing Support'],
                link: 'https://market-1-tau.vercel.app/login',
                icon: ShoppingCart
            },
            {
                id: 'adria-admin',
                title: 'Adria Admin',
                category: 'Fashion Boutique Management',
                desc: 'Advanced management platform specifically for fashion and boutiques. Includes manufacturing management, treasuries, and built-in WhatsApp marketing.',
                features: ['Manufacturing Cycle Tracking', 'Treasury & Partner Management', 'Integrated WhatsApp Campaigns'],
                link: 'https://adria-demo.vercel.app/admin/',
                icon: LayoutGrid
            }
        ],
        cta: 'Request Your Custom System'
    };

    return (
        <section className="section-padding bg-obsidian-950 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-500/5 blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-5 sm:px-[5%] relative z-10">
                <div className={`mb-20 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-gold-500 text-xs font-semibold tracking-[0.28em] uppercase mb-4 block"
                    >
                        {content.eyebrow}
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif mb-6"
                    >
                        {content.title}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed"
                    >
                        {content.desc}
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                    {content.items.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative"
                        >
                            <div className="relative z-10 h-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 hover:border-gold-500/40 transition-all duration-500 overflow-hidden">
                                {/* Decorative Icon Background */}
                                <div className={`absolute -top-10 ${isArabic ? '-left-10' : '-right-10'} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700`}>
                                    <item.icon size={240} />
                                </div>

                                <div className="flex flex-col h-full relative z-20">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
                                            <item.icon size={28} />
                                        </div>
                                        <div>
                                            <span className="text-gold-500/60 text-xs font-semibold tracking-widest uppercase">{item.category}</span>
                                            <h3 className="text-2xl md:text-3xl font-serif text-white mt-1">{item.title}</h3>
                                        </div>
                                    </div>

                                    <p className={`text-white/40 leading-relaxed mb-8 ${isArabic ? 'font-arabic' : ''}`}>
                                        {item.desc}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                        {item.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-center gap-3">
                                                <ShieldCheck size={18} className="text-gold-500/50" />
                                                <span className="text-sm text-white/60">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2 text-white/30"><Monitor size={16} /></div>
                                            <div className="flex items-center gap-2 text-white/30"><Smartphone size={16} /></div>
                                            <div className="flex items-center gap-2 text-white/30"><Database size={16} /></div>
                                        </div>
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-gold-500 font-semibold hover:text-white transition-colors group/link"
                                        >
                                            <span>{isArabic ? 'معاينة النظام' : 'Preview System'}</span>
                                            <ExternalLink size={18} className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Integration CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-500/20 text-center"
                >
                    <Zap className="mx-auto mb-6 text-gold-500" size={40} />
                    <h3 className="text-2xl md:text-3xl font-serif mb-4">{isArabic ? 'هل تحتاج إلى حل تقني مخصص لعملك؟' : 'Need a Custom Tech Solution?'}</h3>
                    <p className="text-white/50 max-w-xl mx-auto mb-8">
                        {isArabic ? 'نحن نطور لك الأنظمة التي يحتاجها مشروعك للنمو، من المتاجر الإلكترونية وحتى الأنظمة الإدارية المعقدة.' : 'We develop the systems your business needs to grow, from e-commerce stores to complex management systems.'}
                    </p>
                    <a 
                        href="/contact" 
                        className="inline-flex items-center gap-3 bg-gold-500 text-obsidian-950 px-8 py-4 rounded-full font-bold transition-all hover:bg-white hover:scale-105 active:scale-95"
                    >
                        <span>{content.cta}</span>
                        <ArrowRight className={isArabic ? 'rotate-180' : ''} size={20} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default TechShowcase;
