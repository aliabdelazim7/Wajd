import React from 'react';
import Navbar from '../components/Navbar.jsx';
import LiquidGoldBackground from '../components/LiquidGoldBackground.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';

const Layout = ({ children }) => {
    const { t, lang, content } = useApp();
    const footer = getCmsBlock(content, 'footer', { title: lang === 'ar' ? 'نُوجد الأثر الذي يتحول إلى مبيعات حقيقية.' : 'We create digital impact that turns into real sales.', body: 'وَجْدٌ... لِلنَّتَائِجِ وُجِدْ.' });
    const socials = content?.settings?.contact || {};
    return (
        <div className="relative min-h-screen bg-obsidian-950 text-white selection:bg-gold-500 selection:text-obsidian-950" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <LiquidGoldBackground />
            {/* Subtle Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold-500/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold-600/5 blur-[100px]"></div>
            </div>

            <Navbar />
            <main className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            duration: window.innerWidth < 768 ? 0.3 : 0.6, 
                            ease: "easeOut" 
                        }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Premium Footer - Placeholder for now */}
            <footer className="relative z-10 py-24 px-[5%] border-t border-white/5 text-center font-sans">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <span className="text-4xl font-serif font-bold tracking-[0.2em] text-white/20 mb-8">WAJD</span>
                    <p className="text-white/60 text-lg mb-4 max-w-md font-arabic">{footer.title}</p>
                    <p className="text-gold-500 text-2xl font-serif italic mb-12">{footer.body}</p>
                    
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm uppercase tracking-widest font-medium mb-12 text-white/40">
                        <Link to="/" className="hover:text-gold-500 transition-colors">{t.nav.home}</Link>
                        <Link to="/about" className="hover:text-gold-500 transition-colors">{t.nav.about}</Link>
                        <Link to="/services" className="hover:text-gold-500 transition-colors">{t.nav.services}</Link>
                        <Link to="/portfolio" className="hover:text-gold-500 transition-colors">{t.nav.portfolio}</Link>
                        <Link to="/contact" className="hover:text-gold-500 transition-colors">{t.nav.contact}</Link>
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-xs text-white/20 uppercase tracking-[0.2em]">
                        <p>© {new Date().getFullYear()} Wajd Agency. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}</p>
                        <div className="flex flex-wrap gap-8 mt-4 md:mt-0 justify-center">
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <a href={socials.linkedin || 'https://www.linkedin.com/company/wajdagency'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href={socials.instagram || 'https://www.instagram.com/wajdagency'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                            <a href={socials.tiktok || 'https://www.tiktok.com/@wajdagency'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
                            <a href={socials.x || 'https://x.com/wajdagency'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
