import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { lang, toggleLang, t } = useApp();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const navLinks = [
        { name: t.nav.home, path: '/' },
        { name: t.nav.about, path: '/about' },
        { name: t.nav.services, path: '/services' },
        { name: t.nav.portfolio, path: '/portfolio' },
        { name: lang === 'ar' ? 'رؤى النمو' : 'Insights', path: '/insights' },
        { name: t.nav.contact, path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[120] transition-all duration-500 ${scrolled ? 'py-3 lg:py-4 bg-obsidian-950/95 backdrop-blur-xl border-b border-white/5' : 'py-5 lg:py-6 bg-transparent'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-[5%] flex justify-between items-center">
                {/* Logo - Text Only */}
                <Link to="/" className="group">
                    <span className="text-2xl md:text-3xl font-serif font-bold tracking-[0.2em] text-white group-hover:text-gold-500 transition-all duration-500">
                        WAJD
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`text-sm font-arabic font-medium transition-colors hover:text-gold-500 ${location.pathname === link.path ? 'text-gold-500' : 'text-white/60'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {/* Language Switcher — Wajd currently serves Gulf markets in SAR */}
                    <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
                        <button 
                            onClick={toggleLang}
                            className="flex items-center gap-1.5 text-xs font-sans tracking-widest text-white/70 hover:text-gold-500 transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {lang === 'ar' ? 'EN' : 'عربي'}
                        </button>
                        <span className="text-xs font-sans tracking-widest text-gold-500 bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/20">SAR</span>
                    </div>

                    <Link to="/contact" className="bg-gold-500 text-obsidian-950 px-8 py-3 rounded-full text-sm font-arabic font-bold hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(197,168,98,0.3)]">
                        {t.nav.cta}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden text-white"
                    aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-8 h-8 text-gold-500" /> : <Menu className="w-8 h-8 text-white" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-0 z-[110] min-h-screen overflow-y-auto overscroll-contain bg-obsidian-950 backdrop-blur-2xl flex flex-col justify-start items-center gap-5 md:hidden px-6 pt-28 pb-10 text-center"
                    >
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="w-full max-w-xs py-2 text-2xl sm:text-4xl font-serif hover:text-gold-500 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link 
                            to="/contact" 
                            onClick={() => setIsOpen(false)}
                            className="mt-4 w-full max-w-xs bg-gold-500 text-obsidian-950 px-6 py-4 rounded-full text-xl sm:text-2xl font-arabic font-bold shadow-[0_0_30px_rgba(197,168,98,0.3)]"
                        >
                            {t.nav.cta}
                        </Link>
                        <div className="mt-8 pt-8 border-t border-white/5 w-full">
                            <p className="text-gold-500 text-xl sm:text-2xl font-serif italic">{lang === 'ar' ? 'وَجْدٌ... لِلنَّتَائِجِ وُجِدْ.' : 'WAJD... FOUND FOR RESULTS.'}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
