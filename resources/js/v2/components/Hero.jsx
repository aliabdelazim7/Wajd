import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section className="relative min-h-screen flex flex-col pt-40 md:pt-48 pb-20 px-[5%] overflow-hidden" dir="rtl">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto w-full"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-12 flex justify-start">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-medium uppercase tracking-widest font-sans">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                        </span>
                        Growth Engineering Agency
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 
                    variants={itemVariants}
                    className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif font-medium leading-[1.1] mb-6 text-right tracking-tight"
                >
                    نُهندس <span className="italic text-gold-500">النمو</span> <br />
                    للعلامات الطموحة.
                </motion.h1>

                <motion.div variants={itemVariants} className="mb-12 text-right">
                    <p className="text-2xl md:text-4xl font-serif text-gold-500 italic">
                        وَجْدٌ... <span className="text-white not-italic">لِلنَّتَائِجِ وُجِدْ.</span>
                    </p>
                </motion.div>

                {/* Subheadline & CTA */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <motion.div variants={itemVariants} className="order-2 md:order-1">
                        <Link to="/contact" className="group relative inline-flex items-center gap-4 bg-gold-500 text-obsidian-950 px-10 py-5 rounded-full font-arabic font-bold text-lg overflow-hidden transition-all hover:pl-12 active:scale-95">
                            <span className="relative z-10">ابدأ تدقيق النمو</span>
                            <ArrowUpRight className="relative z-10 w-6 h-6 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 rotate-[-90deg] group-hover:rotate-[-45deg]" />
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>
                    </motion.div>

                    <motion.p 
                        variants={itemVariants}
                        className="max-w-2xl text-lg md:text-xl text-white/50 leading-relaxed font-arabic text-right order-1 md:order-2"
                    >
                        أبعد من مجرد تسويق. نحن نبني أنظمة استحواذ خاصة تضاعف الإيرادات وتهيمن على الأسواق من خلال الاستراتيجيات القائمة على البيانات والمحتوى الإبداعي عالي الأداء.
                    </motion.p>
                </div>

                {/* Stats / Social Proof Strip */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-32 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 text-right"
                >
                    <div>
                        <p className="text-4xl md:text-6xl font-serif mb-3 text-white">$12M+</p>
                        <p className="text-xs uppercase tracking-widest text-white/40 font-sans">Ad Spend Managed</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-6xl font-serif mb-3 text-white">6.4x</p>
                        <p className="text-xs uppercase tracking-widest text-white/40 font-sans">Max ROAS Achieved</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-6xl font-serif mb-3 text-white">120K+</p>
                        <p className="text-xs uppercase tracking-widest text-white/40 font-sans">Actual Conversions</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-6xl font-serif mb-3 text-white">8+</p>
                        <p className="text-xs uppercase tracking-widest text-white/40 font-sans">Market Sectors</p>
                    </div>
                </motion.div>
            </motion.div>
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[60vw] h-[60vw] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        </section>
    );
};

export default Hero;
