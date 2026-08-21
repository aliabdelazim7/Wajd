import { useEffect, useState } from 'react';
import Layout from '../layout/Layout.jsx';
import CinematicHero from '../components/CinematicHero.jsx';
import FAQ from '../components/FAQ.jsx';
import GrowthROICalculator from '../components/GrowthROICalculator.jsx';
import ProductDemo from '../components/ProductDemo.jsx';
import SocialProof from '../components/SocialProof.jsx';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, TrendingUp, Shield, Zap, Target, CheckCircle2, ShoppingBag, Plus, Check, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getCmsBlock } from '../utils/content.js';
import { trackAnalyticsEvent } from '../utils/analytics.js';
import { mergePortfolioProjects } from '../utils/portfolioEvidence.js';

const Home = () => {
    const { lang, t, content } = useApp();
    const outcomeEngine = t.home.outcomeEngine;
    const selectedImpact = t.home.selectedImpact;
    const builder = t.packages;
    const navigate = useNavigate();
    useEffect(() => {
        trackAnalyticsEvent('builder_started', { source: 'homepage' });
    }, []);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const textAlign = lang === 'ar' ? 'text-right' : 'text-left';
    const ctaJustify = lang === 'ar' ? 'justify-end' : 'justify-start';
    const selectedWork = mergePortfolioProjects(content?.projects || [], lang)
        .slice(0, 3)
        .map((project) => ({
            id: project.slug,
            name: project.name,
            metric: project.metric || Object.values(project.results || {})[0] || (lang === 'ar' ? 'أثر مختار' : 'Selected impact'),
            desc: project.description || '',
            image: project.image || project.image_url || project.thumbnail_url,
        }));

    const basePlans = lang === 'ar' && content?.packages?.length
        ? content.packages.map((pkg) => ({
            id: pkg.slug,
            name: pkg.name,
            subtitle: pkg.subtitle,
            price: Number(pkg.price_sar),
            features: pkg.features || [],
            popular: Boolean(pkg.is_featured),
        }))
        : builder.basePlans;
    const [selectedBaseId, setSelectedBaseId] = useState(basePlans.find((plan) => plan.popular)?.id || basePlans[0]?.id);
    const [selectedAddonIds, setSelectedAddonIds] = useState([]);
    const selectedBase = basePlans.find((plan) => plan.id === selectedBaseId) || basePlans[0];
    const selectedAddons = builder.addons.filter((addon) => selectedAddonIds.includes(addon.id));
    const monthlyAddonsTotal = selectedAddons.filter((addon) => addon.type === 'monthly').reduce((total, addon) => total + addon.price, 0);
    const oneTimeAddonsTotal = selectedAddons.filter((addon) => addon.type === 'one_time').reduce((total, addon) => total + addon.price, 0);
    const monthlyTotal = (selectedBase?.price || 0) + monthlyAddonsTotal;
    const formatSar = (amount) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(amount);
    const toggleAddon = (addonId) => setSelectedAddonIds((current) => {
        const wasAdded = current.includes(addonId);
        const next = wasAdded ? current.filter((id) => id !== addonId) : [...current, addonId];
        const addon = builder.addons.find((item) => item.id === addonId);
        trackAnalyticsEvent('builder_addon_toggled', {
            addon_id: addonId,
            addon_name: addon?.name,
            action: wasAdded ? 'removed' : 'added',
            base_plan_id: selectedBaseId,
            price: addon?.price || 0,
            billing_type: addon?.type,
        });
        return next;
    });
    const requestBuild = () => {
        trackAnalyticsEvent('builder_continue_clicked', {
            base_plan_id: selectedBase?.id,
            addon_ids: selectedAddons.map((addon) => addon.id),
            monthly_total: monthlyTotal,
            one_time_total: oneTimeAddonsTotal,
        });
        navigate('/contact', {
            state: {
                packageBuilder: {
                    basePlan: { id: selectedBase.id, name: selectedBase.name, price: selectedBase.price },
                    addons: selectedAddons.map(({ id, name, price, type }) => ({ id, name, price, type })),
                    monthlyTotal,
                    oneTimeTotal: oneTimeAddonsTotal,
                },
            },
        });
    };

    const whyBlock = getCmsBlock(content, 'home.why_wajd', { title: t.whyUs.title, body: t.whyUs.subtitle, data: {} });
    const whyItems = lang === 'ar' && whyBlock.data?.items?.length ? whyBlock.data.items : t.whyUs.items;
    const whyWajd = whyItems.map((item, index) => ({
        ...item,
        icon: [Target, TrendingUp, Shield, Zap][index] || Target
    }));

    const partners = [
        { name: lang === 'ar' ? 'العويد للعود' : 'Al Owaid Oud', logo: 'https://images.unsplash.com/photo-1588412079929-790b9f593d8e?q=80&w=200&auto=format&fit=crop' },
        { name: lang === 'ar' ? 'تويو' : 'Toyo', logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop' },
        { name: lang === 'ar' ? 'قناطير' : 'Qanatir', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop' },
        { name: lang === 'ar' ? 'جسار' : 'Jassar', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aa9c?q=80&w=200&auto=format&fit=crop' },
        { name: lang === 'ar' ? 'فلاش' : 'Flash', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop' },
    ];

    return (
        <Layout>
            <CinematicHero />

            {/* Growth ROI Calculator */}
            <GrowthROICalculator />

            {/* Trusted By / Partners Section */}
            <section className="py-20 border-y border-white/5 bg-obsidian-950/50 overflow-hidden" dir={direction}>
                <div className="max-w-7xl mx-auto px-[5%]">
                    <p className="text-center text-white/20 text-xs uppercase tracking-[0.4em] mb-12 font-sans">{t.home.trustedBy}</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {partners.map((partner, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 font-serif text-xl">
                                    {partner.name[0]}
                                </div>
                                <span className="text-xl font-serif text-white/80">{partner.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Value Proposition Section */}
            <section className="section-padding bg-obsidian-900" dir={direction}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <span className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block font-sans">{outcomeEngine.eyebrow}</span>
                            <h2 className={`text-4xl md:text-6xl font-serif mb-10 leading-[1.2] ${textAlign}`}>
                                {outcomeEngine.title1} <br />
                                <span className="text-gold-500 italic">{outcomeEngine.title2}</span>
                            </h2>
                            <p className={`text-white/50 text-lg mb-10 font-arabic leading-relaxed ${textAlign}`}>
                                {outcomeEngine.body}
                            </p>
                            <Link to="/about" className={`text-gold-500 hover:text-white transition-colors flex items-center gap-3 font-arabic text-lg ${ctaJustify} group`}>
                                <ArrowUpRight className="w-5 h-5 rotate-[-90deg] group-hover:rotate-[-45deg] transition-transform" /> {outcomeEngine.cta}
                            </Link>
                        </motion.div>
                        <div className="grid grid-cols-1 gap-6">
                            {outcomeEngine.cards.map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className={`glass-card p-10 rounded-[2rem] group hover:border-gold-500/30 transition-all ${textAlign}`}
                                >
                                    <h3 className="text-2xl font-serif mb-3 group-hover:text-gold-500 transition-colors">{item.title}</h3>
                                    <p className="text-white/40 text-lg font-arabic leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Wajd - Grid Section */}
            <section className="section-padding" dir={direction}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-gold-500 text-xs uppercase tracking-[0.4em] font-medium mb-6 block font-sans">{lang === 'ar' ? (whyBlock.data?.tag || t.whyUs.tag) : t.whyUs.tag}</span>
                        <h2 className="text-4xl md:text-7xl font-serif mb-8">{lang === 'ar' ? (whyBlock.title || t.whyUs.title) : t.whyUs.title}</h2>
                        <p className="text-white/40 text-xl font-arabic max-w-2xl mx-auto leading-relaxed">{lang === 'ar' ? (whyBlock.body || t.whyUs.subtitle) : t.whyUs.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {whyWajd.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`${textAlign} p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors`}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6 ${lang === 'ar' ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
                                    <item.icon className="w-6 h-6 text-gold-500" />
                                </div>
                                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                                <p className="text-white/40 font-arabic leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Tangibility & Interactive Demo */}
            <ProductDemo />

            {/* Social Proof & Reviewable Evidence */}
            <SocialProof projects={selectedWork} />

            {/* Selected Work Section */}
            <section className="section-padding bg-obsidian-900" dir={direction}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-20">
                        <div className={textAlign}>
                            <span className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block font-sans">{selectedImpact.eyebrow}</span>
                            <h2 className="text-4xl md:text-6xl font-serif">{selectedImpact.title}</h2>
                        </div>
                        <Link to="/portfolio" className={`text-white/40 hover:text-gold-500 transition-colors flex items-center gap-3 font-arabic text-lg ${ctaJustify} group`}>
                            <ArrowUpRight className="w-5 h-5 rotate-[-90deg] group-hover:rotate-[-45deg] transition-transform" /> {selectedImpact.viewAll}
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {selectedWork.map((work, i) => (
                            <Link 
                                to={`/portfolio/${work.id}`}
                                key={i}
                                className={`group cursor-pointer ${textAlign} block`}
                            >
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 1 }}
                                >
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 bg-obsidian-800 border border-white/5">
                                    <img 
                                        src={work.image} 
                                        alt={work.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-80"></div>
                                    <div className="absolute bottom-10 right-10 left-10">
                                        <p className="text-5xl font-serif text-gold-500 mb-2">{work.metric}</p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">{selectedImpact.primaryOutcome}</p>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif mb-3 group-hover:text-gold-500 transition-colors">{work.name}</h3>
                                <p className="text-white/40 text-lg font-arabic">{work.desc}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Build Your Growth Engine */}
            <section className="section-padding bg-obsidian-950" dir={direction}>
                <div className="mx-auto max-w-7xl">
                    <div className={`mb-16 max-w-4xl ${lang === 'ar' ? 'mr-0 ml-auto text-right' : 'ml-0 mr-auto text-left'}`}>
                        <span className="mb-6 block text-xs font-medium tracking-[0.4em] text-gold-500">{builder.tag}</span>
                        <h2 className="mb-7 max-w-4xl font-serif text-4xl leading-[1.05] md:text-7xl">{builder.title}</h2>
                        <p className="max-w-3xl text-lg leading-8 text-white/45 md:text-xl">{builder.subtitle}</p>
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/25">{builder.adSpendNote}</p>
                    </div>

                    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-12">
                            <div>
                                <div className={`mb-6 flex items-end justify-between gap-4 ${textAlign}`}>
                                    <div>
                                        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-gold-500/80">01</p>
                                        <h3 className="font-serif text-3xl md:text-4xl">{builder.baseLabel}</h3>
                                    </div>
                                    <span className="hidden text-sm text-white/30 md:block">{lang === 'ar' ? 'كل خطة تبدأ من هنا' : 'Every build starts here'}</span>
                                </div>
                                <div className="grid gap-5 md:grid-cols-3">
                                    {basePlans.map((plan, index) => {
                                        const isSelected = plan.id === selectedBase?.id;
                                        return (
                                            <motion.button
                                                type="button"
                                                key={plan.id}
                                                initial={{ opacity: 0, y: 16 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.08 }}
                                                onClick={() => {
                                                    setSelectedBaseId(plan.id);
                                                    trackAnalyticsEvent('builder_base_selected', {
                                                        plan_id: plan.id,
                                                        plan_name: plan.name,
                                                        price: plan.price,
                                                    });
                                                }}
                                                aria-pressed={isSelected}
                                                className={`relative flex min-h-[280px] flex-col text-start transition-all ${textAlign} ${isSelected ? 'border-gold-500 bg-gold-500/[0.08] shadow-[0_0_40px_rgba(197,168,98,0.08)]' : 'border-white/10 bg-white/[0.025] hover:border-gold-500/40'} rounded-[1.75rem] border p-6`}
                                            >
                                                {plan.popular && <span className="absolute -top-3 right-5 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-obsidian-950">{builder.mostPopular}</span>}
                                                <div className="mb-6 flex items-start justify-between gap-3">
                                                    <div>
                                                        <h4 className={`font-serif text-2xl ${isSelected ? 'text-gold-500' : 'text-white'}`}>{plan.name}</h4>
                                                        <p className="mt-2 text-sm leading-6 text-white/40">{plan.subtitle}</p>
                                                        <span className="mt-3 block text-xs tracking-wide text-gold-500/65">{builder.bestForLabel}: {builder.planHints?.[plan.id]}</span>
                                                    </div>
                                                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-gold-500 bg-gold-500 text-obsidian-950' : 'border-white/20 text-transparent'}`}><Check className="h-4 w-4" /></span>
                                                </div>
                                                <div className={`mb-6 text-3xl font-serif ${isSelected ? 'text-gold-500' : 'text-white'}`}>{formatSar(plan.price)} <span className="text-xs font-sans text-white/35">{builder.monthlyLabel}</span></div>
                                                <ul className="mt-auto space-y-2.5 text-sm leading-6 text-white/60">
                                                    {plan.features.slice(0, 4).map((feature) => <li key={feature} className={`flex items-start gap-2 ${lang === 'ar' ? '' : 'flex-row-reverse justify-end text-right'}`}><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-gold-500/80" /><span>{feature}</span></li>)}
                                                </ul>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className={`mb-6 ${textAlign}`}>
                                    <p className="mb-2 text-xs uppercase tracking-[0.24em] text-gold-500/80">02</p>
                                    <h3 className="font-serif text-3xl md:text-4xl">{builder.addonsLabel}</h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/35">{builder.addonsHint}</p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {builder.addons.map((addon, index) => {
                                        const isAdded = selectedAddonIds.includes(addon.id);
                                        return (
                                            <motion.button
                                                type="button"
                                                key={addon.id}
                                                initial={{ opacity: 0, y: 14 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.06 }}
                                                onClick={() => toggleAddon(addon.id)}
                                                aria-pressed={isAdded}
                                                className={`group flex items-center gap-4 rounded-[1.5rem] border p-5 text-start transition-all ${textAlign} ${isAdded ? 'border-gold-500/70 bg-gold-500/[0.08]' : 'border-white/10 bg-white/[0.02] hover:border-gold-500/35'}`}
                                            >
                                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${isAdded ? 'border-gold-500 bg-gold-500 text-obsidian-950' : 'border-white/10 bg-white/5 text-gold-500'}`}>{isAdded ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="mb-1 flex flex-wrap items-center gap-2 font-serif text-lg text-white"><span>{addon.name}</span><span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-sans uppercase tracking-[0.14em] text-white/35">{addon.tag}</span>{addon.id === 'liftdesk-automation' && selectedBase?.id === 'growth' && <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[9px] font-sans tracking-wide text-gold-500">{builder.recommendedAddonLabel}</span>}</span>
                                                    <span className="block text-sm leading-6 text-white/40">{addon.subtitle}</span>
                                                </span>
                                                <span className="shrink-0 text-end"><span className="block text-lg font-serif text-gold-500">{formatSar(addon.price)}</span><span className="text-[10px] uppercase tracking-[0.12em] text-white/30">{addon.type === 'monthly' ? builder.monthlyLabel : builder.oneTimeLabel}</span></span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <aside className="xl:sticky xl:top-28">
                            <div className="rounded-[1.75rem] border border-gold-500/30 bg-[#171613] p-6 shadow-2xl shadow-black/20 md:p-7">
                                <div className={`mb-7 flex items-center justify-between gap-3 border-b border-white/10 pb-5 ${textAlign}`}>
                                    <div><p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-500">03</p><h3 className="font-serif text-2xl">{builder.summaryTitle}</h3></div>
                                    <ShoppingBag className="h-5 w-5 text-gold-500" />
                                </div>
                                <div className={`space-y-4 ${textAlign}`}>
                                    {selectedBase && <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-white/45">{selectedBase.name}</p><p className="mt-1 text-xs text-white/25">{builder.monthlyLabel}</p></div><strong className="font-serif text-white">{formatSar(selectedBase.price)}</strong></div>}
                                    {selectedAddons.length ? selectedAddons.map((addon) => <div key={addon.id} className="flex items-start justify-between gap-4 border-t border-white/5 pt-4"><div className="min-w-0"><p className="text-sm text-white/55">{addon.name}</p><p className="mt-1 text-xs text-white/25">{addon.type === 'monthly' ? builder.monthlyLabel : builder.oneTimeLabel}</p></div><div className="flex items-center gap-2"><strong className="font-serif text-white">{formatSar(addon.price)}</strong><button type="button" onClick={() => toggleAddon(addon.id)} aria-label={builder.removeCta} className="text-white/25 transition hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div></div>) : <p className="border-t border-white/5 pt-4 text-sm leading-6 text-white/30">{builder.emptyAddons}</p>}
                                </div>
                                <div className="mt-7 space-y-3 border-t border-white/10 pt-5">
                                    <div className="flex items-center justify-between gap-4 text-sm"><span className="text-white/35">{builder.monthlyLabel}</span><strong className="font-serif text-xl text-gold-500">{formatSar(monthlyTotal)} SAR</strong></div>
                                    {oneTimeAddonsTotal > 0 && <div className="flex items-center justify-between gap-4 text-sm"><span className="text-white/35">{builder.oneTimeLabel}</span><strong className="font-serif text-xl text-white">{formatSar(oneTimeAddonsTotal)} SAR</strong></div>}
                                </div>
                                <button type="button" data-analytics-event="builder_cta_clicked" data-analytics-location="growth_engine_summary" onClick={requestBuild} className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gold-500 px-5 py-4 font-bold text-obsidian-950 transition hover:bg-white active:scale-[0.98]">{builder.continueCta}<ArrowUpRight className="h-5 w-5" /></button>
                                <p className="mt-4 text-center text-xs leading-6 text-white/25">{lang === 'ar' ? 'السعر النهائي يتأكد بعد مراجعة نطاق المشروع.' : 'Final pricing is confirmed after reviewing the project scope.'}</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <FAQ />

            {/* Final CTA Section */}
            <section className="section-padding bg-gold-500 text-obsidian-950 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-7xl font-serif mb-10 leading-[1.1] tracking-tight">
                        {t.footer.ready}
                    </h2>
                    <p className="text-obsidian-950/70 text-xl md:text-2xl mb-16 font-arabic max-w-2xl mx-auto leading-relaxed">
                        {t.footer.desc}
                    </p>
                    <Link data-analytics-event="cta_clicked" data-analytics-location="final_cta" to="/contact" className="inline-block bg-obsidian-950 text-white px-16 py-6 rounded-full font-arabic font-bold text-2xl hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-obsidian-950/40 hover:bg-white hover:text-obsidian-950">
                        {t.footer.cta}
                    </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-obsidian-950/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </section>
        </Layout>
    );
};

export default Home;
