import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer, i, direction }) => {
    const questionDirection = direction || 'rtl';
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="border-b border-white/5 overflow-hidden"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full py-8 flex justify-between items-center group ${questionDirection === 'rtl' ? 'text-right' : 'text-left'}`}
            >
                <span className={`text-xl md:text-2xl font-serif transition-colors ${isOpen ? 'text-gold-500' : 'text-white/80 group-hover:text-white'}`}>
                    {question}
                </span>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'bg-gold-500 border-gold-500 rotate-90' : ''}`}>
                    {isOpen ? <Minus className="w-4 h-4 text-obsidian-950" /> : <Plus className="w-4 h-4 text-white" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="pb-8 text-white/40 text-lg font-arabic leading-relaxed max-w-3xl ml-auto">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

import { useApp } from '../context/AppContext.jsx';

const FAQ = () => {
    const { lang, content } = useApp();
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

    const fallbackFaqs = lang === 'ar' ? [
        { question: 'ما هي الميزانية الإعلانية التي تنصحون بها للبدء؟', answer: 'نبدأ باختبار إعلاني من 1,000 إلى 2,000 ريال، ثم نزيد الاستثمار فقط عندما تظهر مؤشرات واضحة على ما يعمل.' },
        { question: 'متى يمكنني توقع رؤية نتائج ملموسة؟', answer: 'تظهر مؤشرات الأداء الأولى خلال الأسبوع الأول، بينما تحتاج دورة النمو الكاملة عادةً إلى 60–90 يوماً لبناء أساس قابل للتوسع.' },
        { question: 'هل تقدمون خدمات صناعة المحتوى الإبداعي؟', answer: 'نعم، نصمم أصولاً بصرية موجهة لجذب الانتباه والتحويل، مع ربط الإبداع بما تظهره بيانات الجمهور.' },
        { question: 'كيف تضمنون شفافية الأرقام والبيانات؟', answer: 'نشاركك مؤشرات الأداء بوضوح ونشرح أين يذهب كل ريال وما الذي يحقق عائداً فعلياً.' },
    ] : [
        { question: 'What ad budget do you recommend to start?', answer: 'We start with a focused test from SAR 1,000 to 2,000, then increase spend only when the data shows what works.' },
        { question: 'When can I expect to see tangible results?', answer: 'Early indicators can appear in the first week, while a meaningful growth cycle usually needs 60–90 days to build a scalable base.' },
        { question: 'Do you provide creative content production?', answer: 'Yes. We design visual assets built for attention and conversion, connecting creative decisions to audience data.' },
        { question: 'How do you ensure data transparency?', answer: 'We keep performance visible and explain where every riyal goes and which decisions are producing a return.' },
    ];

    const faqs = lang === 'ar' && content?.faqs?.length ? content.faqs : fallbackFaqs;

    return (
            <section className="section-padding bg-obsidian-950" dir={direction}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block font-sans">{lang === 'ar' ? 'الأسئلة المتكررة' : 'COMMON INQUIRIES'}</span>
                    <h2 className="text-4xl md:text-7xl font-serif">{lang === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}</h2>
                </div>
                <div className="border-t border-white/5">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} {...faq} i={i} direction={direction} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
