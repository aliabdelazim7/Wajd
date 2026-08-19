import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ImpactSimulator = () => {
    const { t, lang } = useApp();
    const [budget, setBudget] = useState(2000);
    const [sector, setSector] = useState('ecommerce');
    const [results, setResults] = useState({ reach: 0, roas: 0, revenue: 0 });

    const sectors = {
        ecommerce: { roas: 4.5, reachMult: 35 },
        realestate: { roas: 12.0, reachMult: 15 },
        b2b: { roas: 3.5, reachMult: 25 },
        healthcare: { roas: 5.2, reachMult: 20 }
    };

    useEffect(() => {
        const currentSector = sectors[sector];
        setResults({
            reach: Math.round(budget * currentSector.reachMult),
            roas: currentSector.roas,
            revenue: Math.round(budget * currentSector.roas)
        });
    }, [budget, sector]);

    return (
        <section className="section-padding bg-obsidian-900 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="text-gold-500 text-xs uppercase tracking-[0.4em] font-medium mb-6 block font-sans">{lang === 'ar' ? 'محاكي أثر وجد' : 'Wajd Impact Simulator'}</span>
                    <h2 className="text-4xl md:text-7xl font-serif mb-6 lg:mb-8">{t.simulator.title}</h2>
                    <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto">{t.simulator.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-7 space-y-16">
                        <div className="space-y-8">
                            <div className="flex justify-between items-end">
                                <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-sans">{t.simulator.step1}</span>
                                <span className="text-gold-500 text-5xl font-serif font-light">
                                    {budget.toLocaleString()} <span className="text-sm uppercase tracking-widest opacity-40 ml-2">SAR</span>
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="500"
                                value={budget}
                                onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                                className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer accent-gold-500 hover:bg-white/20 transition-all"
                                aria-label={lang === 'ar' ? 'الميزانية الإعلانية بالريال السعودي' : 'Monthly ad budget in SAR'}
                            />
                            <div className="flex justify-between text-xs text-white/25 font-sans">
                                <span>1,000 SAR</span>
                                <span>100,000 SAR+</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <span className={`text-white/40 text-xs uppercase tracking-[0.3em] font-sans block ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.simulator.step2}</span>
                            <div className="flex flex-wrap gap-4">
                                {Object.keys(sectors).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setSector(key)}
                                        className={`px-8 py-4 rounded-full border transition-all font-arabic text-lg ${sector === key ? 'bg-gold-500 border-gold-500 text-obsidian-950' : 'bg-transparent border-white/10 text-white/40 hover:border-gold-500/40 hover:text-white'}`}
                                    >
                                        {t.simulator.sectors[key]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="glass-card p-12 rounded-[3rem] border border-gold-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
                            <div className={`space-y-12 relative z-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <div>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-sans">{t.simulator.revenue}</p>
                                    <p className="text-6xl md:text-7xl font-serif text-white group-hover:text-gold-500 transition-colors duration-700">
                                        {results.revenue.toLocaleString()} <span className="text-lg opacity-30 ml-2">SAR</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
                                    <div>
                                        <p className="text-white/30 text-xs uppercase tracking-widest mb-2 font-sans">{t.simulator.roasTarget}</p>
                                        <p className="text-4xl font-serif text-gold-500">{results.roas.toFixed(1)}x</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-xs uppercase tracking-widest mb-2 font-sans">{t.simulator.estReach}</p>
                                        <p className="text-4xl font-serif text-white">{results.reach.toLocaleString()}+</p>
                                    </div>
                                </div>

                                <button className="w-full bg-gold-500 text-obsidian-950 py-6 rounded-full font-arabic font-bold text-xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_20px_50px_rgba(197,168,98,0.15)]">
                                    {t.simulator.cta} <ArrowRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold-500/5 blur-[80px] rounded-full"></div>
                        </div>
                        <p className="text-center text-white/20 text-xs mt-8 font-arabic leading-relaxed italic">{t.simulator.disclaimer}</p>
                    </div>
                </div>
            </div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-gold-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        </section>
    );
};

export default ImpactSimulator;
