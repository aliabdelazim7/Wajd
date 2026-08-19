import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import GrowthMesh from './GrowthMesh.jsx';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';

const CinematicHero = () => {
    const { t, lang, content } = useApp();
    const hero = getCmsBlock(content, 'home.hero', { data: {} });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;
            
            const glow = document.getElementById('cursor-glow');
            if (glow) {
                glow.style.transform = `translate(${x}px, ${y}px)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center pt-40 md:pt-48 pb-20 px-[5%] overflow-hidden bg-obsidian-950">
            {/* Cinematic Background Gradients & Glows */}
            <div id="cursor-glow" className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none transition-transform duration-300 ease-out"></div>
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="relative z-20">
                {/* Elite Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`mb-10 flex ${lang === 'ar' ? 'justify-start' : 'justify-start'}`}
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-400" />
                        <span>{hero.data?.badge || t.hero.badge}</span>
                    </div>
                </motion.div>

                {/* Main Headline with Editorial Stagger */}
                <motion.h1 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-4xl md:text-7xl lg:text-[7.5rem] font-serif font-medium leading-[1.1] lg:leading-[1.05] mb-6 lg:mb-8 tracking-tight ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                >
                    {hero.data?.title1 || t.hero.title1} <span className="italic text-gold-500 underline decoration-gold-500/30 underline-offset-[16px]">{hero.data?.highlight || (lang === 'ar' ? 'النمو' : 'Growth')}</span> <br />
                    {hero.data?.title2 || t.hero.title2}
                </motion.h1>

                {/* Official Diacritics Slogan Hook */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className={`mb-14 flex items-center gap-4 ${lang === 'ar' ? 'text-right flex-row' : 'text-left flex-row-reverse justify-end'}`}
                >
                    <div className="h-[1px] w-16 bg-gold-500/40"></div>
                    <p className="text-2xl md:text-4xl font-serif text-gold-500 italic tracking-wide">
                        {hero.data?.slogan || t.hero.slogan}
                    </p>
                </motion.div>

                {/* Subheadline & CTA Box */}
                <div className={`flex flex-col md:flex-row md:items-end justify-between gap-12 ${lang === 'ar' ? '' : 'md:flex-row-reverse'}`}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="order-2 md:order-1"
                    >
                        <Link to="/contact" className="group relative inline-flex items-center gap-4 bg-gold-500 text-obsidian-950 px-12 py-6 rounded-full font-arabic font-bold text-xl overflow-hidden transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(197,168,98,0.3)]">
                            <span className="relative z-10">{hero.data?.cta || t.hero.cta}</span>
                            <ArrowUpRight className={`relative z-10 w-7 h-7 transition-transform ${lang === 'ar' ? 'rotate-[-90deg] group-hover:rotate-[-45deg] group-hover:-translate-x-1' : 'group-hover:translate-x-1'} group-hover:-translate-y-1`} />
                        </Link>
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className={`max-w-2xl text-xl md:text-2xl text-white/60 leading-relaxed font-arabic order-1 md:order-2 ${lang === 'ar' ? 'text-right border-r-2 pr-6' : 'text-left border-l-2 pl-6'} border-gold-500/30`}
                    >
                        {hero.data?.desc || t.hero.desc}
                    </motion.p>
                </div>

                {/* High-Impact Statistics Strip */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className={`mt-36 pt-16 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                >
                    <div className="group cursor-default">
                        <p className="text-5xl md:text-7xl font-serif mb-3 text-white group-hover:text-gold-500 transition-colors">$12M+</p>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-sans">{hero.data?.metrics?.adSpend || t.hero.metrics.adSpend}</p>
                    </div>
                    <div className="group cursor-default">
                        <p className="text-5xl md:text-7xl font-serif mb-3 text-white group-hover:text-gold-500 transition-colors">6.4x</p>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-sans">{hero.data?.metrics?.maxRoas || t.hero.metrics.maxRoas}</p>
                    </div>
                    <div className="group cursor-default">
                        <p className="text-5xl md:text-7xl font-serif mb-3 text-white group-hover:text-gold-500 transition-colors">120K+</p>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-sans">{hero.data?.metrics?.conversions || t.hero.metrics.conversions}</p>
                    </div>
                    <div className="group cursor-default">
                        <p className="text-5xl md:text-7xl font-serif mb-3 text-white group-hover:text-gold-500 transition-colors">8+</p>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-sans">{hero.data?.metrics?.sectors || t.hero.metrics.sectors}</p>
                    </div>
                </motion.div>
                </div>

                {/* The Hook: Interactive Growth Mesh */}
                <GrowthMesh />
            </div>
        </section>
    );
};

export default CinematicHero;
