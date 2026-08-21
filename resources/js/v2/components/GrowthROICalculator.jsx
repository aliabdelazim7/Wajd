import { useMemo, useState } from 'react';
import { ArrowUpRight, Calculator, CheckCircle2, CircleHelp, Info, LineChart, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { trackAnalyticsEvent } from '../utils/analytics.js';

const SCENARIOS = {
    ecommerce: { labelAr: 'متجر إلكتروني', labelEn: 'E-commerce', conservative: 1.8, target: 3.0, upside: 4.2 },
    services: { labelAr: 'خدمات وشركات', labelEn: 'Services & B2B', conservative: 1.5, target: 2.6, upside: 3.8 },
    local: { labelAr: 'مطعم أو نشاط محلي', labelEn: 'Restaurant or local business', conservative: 1.4, target: 2.4, upside: 3.4 },
    high_ticket: { labelAr: 'منتج مرتفع القيمة', labelEn: 'High-ticket offer', conservative: 1.7, target: 3.2, upside: 4.8 },
};

const formatMoney = (amount, lang) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(amount)));

const GrowthROICalculator = () => {
    const { lang } = useApp();
    const navigate = useNavigate();
    const isArabic = lang === 'ar';
    const [budget, setBudget] = useState(5000);
    const [averageOrderValue, setAverageOrderValue] = useState(350);
    const [margin, setMargin] = useState(45);
    const [scenarioKey, setScenarioKey] = useState('ecommerce');
    const [hasCalculated, setHasCalculated] = useState(false);

    const copy = isArabic ? {
        eyebrow: 'أداة مجانية تساعدك تاخد قرار أوضح',
        title: 'احسب شكل النمو قبل ما تصرف.',
        subtitle: 'استخدم أرقام مشروعك لتكوين سيناريو أولي: كم إيراداً يحتاجه الإنفاق الإعلاني، وما نقطة التعادل التقريبية؟',
        budget: 'الميزانية الإعلانية الشهرية',
        aov: 'متوسط قيمة الطلب أو الصفقة',
        margin: 'هامش الربح الإجمالي',
        niche: 'نوع النشاط',
        resultTitle: 'قراءة أولية لمنظومة النمو',
        scenario: 'السيناريو المستهدف',
        revenue: 'الإيراد المتوقع في السيناريو',
        grossProfit: 'إجمالي الربح قبل المصاريف الأخرى',
        breakEven: 'نقطة التعادل الإعلانية',
        orders: 'عدد الطلبات أو الصفقات',
        run: 'احسب السيناريو',
        cta: 'أريد مراجعة الأرقام مع وجد',
        assumptions: 'هذه محاكاة وليست وعداً بنتيجة. المخرجات تعتمد على العرض، الهامش، جودة صفحة البيع، السوق، والتتبع.',
        model: 'المعامل المستخدم في السيناريو',
        target: 'مستهدف',
        notSet: 'اضبط الأرقام ثم شغّل الحاسبة',
        planNote: 'سنستخدم هذه الأرقام كبداية في مراجعة مشروعك، وليس كالتزام بنتيجة مسبقة.',
        helperAov: 'إن لم تكن تعرف الرقم، اكتب متوسط سعر البيع.',
        helperMargin: 'مثال: منتج سعره 100 وتكلفته 55 = هامش 45%.',
    } : {
        eyebrow: 'A free tool for a clearer decision',
        title: 'Model the growth before you spend.',
        subtitle: 'Use your business numbers to build a first scenario: what revenue your ad spend needs to create, and where the approximate break-even point sits.',
        budget: 'Monthly ad budget',
        aov: 'Average order or deal value',
        margin: 'Gross profit margin',
        niche: 'Business type',
        resultTitle: 'A first read on your growth engine',
        scenario: 'Target scenario',
        revenue: 'Projected scenario revenue',
        grossProfit: 'Gross profit before other costs',
        breakEven: 'Ad break-even point',
        orders: 'Orders or deals',
        run: 'Run the scenario',
        cta: 'I want Wajd to review these numbers',
        assumptions: 'This is a scenario model, not a promise. Outputs depend on the offer, margin, landing experience, market, and tracking quality.',
        model: 'Scenario multiplier used',
        target: 'Target',
        notSet: 'Adjust the inputs, then run the calculator',
        planNote: 'We will use these numbers as a starting point in your review, not as a pre-agreed outcome.',
        helperAov: 'If unknown, enter your average selling price.',
        helperMargin: 'Example: price 100, cost 55 = 45% margin.',
    };

    const scenario = SCENARIOS[scenarioKey];
    const results = useMemo(() => {
        const targetRevenue = budget * scenario.target;
        const conservativeRevenue = budget * scenario.conservative;
        const upsideRevenue = budget * scenario.upside;
        const grossProfit = targetRevenue * (margin / 100);
        const breakEvenRoas = margin > 0 ? 100 / margin : 0;
        const orders = averageOrderValue > 0 ? targetRevenue / averageOrderValue : 0;
        return { targetRevenue, conservativeRevenue, upsideRevenue, grossProfit, breakEvenRoas, orders };
    }, [averageOrderValue, budget, margin, scenario]);

    const runCalculation = () => {
        setHasCalculated(true);
        trackAnalyticsEvent('roi_calculator_used', {
            budget_sar: budget,
            average_order_value: averageOrderValue,
            margin_percent: margin,
            scenario: scenarioKey,
            target_roas: scenario.target,
        });
    };

    const requestReview = () => {
        trackAnalyticsEvent('roi_plan_requested', {
            budget_sar: budget,
            average_order_value: averageOrderValue,
            margin_percent: margin,
            scenario: scenarioKey,
            projected_revenue: Math.round(results.targetRevenue),
        });
        navigate('/contact', {
            state: {
                roiSnapshot: {
                    budget,
                    averageOrderValue,
                    margin,
                    scenario: scenarioKey,
                    targetRoas: scenario.target,
                    projectedRevenue: Math.round(results.targetRevenue),
                    breakEvenRoas: Number(results.breakEvenRoas.toFixed(1)),
                },
            },
        });
    };

    return (
        <section id="roi-calculator" className="relative overflow-hidden bg-obsidian-900 py-24 md:py-32" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold-500/[0.06] blur-[110px]" />
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-[5%]">
                <div className="mb-14 max-w-3xl">
                    <div className={`mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-500 ${isArabic ? 'justify-end' : 'justify-start'}`}><Calculator className="h-4 w-4" /> {copy.eyebrow}</div>
                    <h2 className={`font-serif text-4xl leading-[1.05] text-white md:text-6xl ${isArabic ? 'text-right' : 'text-left'}`}>{copy.title}</h2>
                    <p className={`mt-6 max-w-2xl text-base leading-8 text-white/45 md:text-lg ${isArabic ? 'ml-0 mr-auto text-right' : 'text-left'}`}>{copy.subtitle}</p>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
                    <div className={`rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 md:p-8 ${isArabic ? 'text-right' : 'text-left'}`}>
                        <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-5"><div><p className="text-xs uppercase tracking-[0.22em] text-gold-500">01</p><h3 className="mt-2 font-serif text-2xl text-white">{isArabic ? 'أدخل أرقامك' : 'Enter your numbers'}</h3></div><Target className="h-5 w-5 text-gold-500" /></div>
                        <FieldLabel label={copy.budget} value={`${formatMoney(budget, lang)} SAR`} />
                        <input type="range" min="1000" max="25000" step="500" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="mt-4 h-1 w-full cursor-pointer appearance-none bg-white/10 accent-gold-500" aria-label={copy.budget} />
                        <div className="mt-2 flex justify-between text-[10px] text-white/25"><span>1,000 SAR</span><span>25,000 SAR</span></div>

                        <div className="mt-8"><label htmlFor="roi-aov" className="mb-2 block text-sm font-semibold text-white/75">{copy.aov}</label><div className="relative"><input id="roi-aov" type="number" min="1" max="100000" value={averageOrderValue} onChange={(event) => setAverageOrderValue(Math.max(1, Number(event.target.value) || 0))} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-gold-500/60" /><span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-white/25">SAR</span></div><p className="mt-2 text-xs text-white/25">{copy.helperAov}</p></div>

                        <div className="mt-7"><FieldLabel label={copy.margin} value={`${margin}%`} /><input type="range" min="10" max="90" step="5" value={margin} onChange={(event) => setMargin(Number(event.target.value))} className="mt-4 h-1 w-full cursor-pointer appearance-none bg-white/10 accent-gold-500" aria-label={copy.margin} /><p className="mt-2 text-xs text-white/25">{copy.helperMargin}</p></div>

                        <div className="mt-8"><label htmlFor="roi-niche" className="mb-2 block text-sm font-semibold text-white/75">{copy.niche}</label><select id="roi-niche" value={scenarioKey} onChange={(event) => setScenarioKey(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#11110f] px-4 py-3 text-sm text-white outline-none transition focus:border-gold-500/60">{Object.entries(SCENARIOS).map(([key, item]) => <option key={key} value={key}>{isArabic ? item.labelAr : item.labelEn}</option>)}</select></div>

                        <button type="button" onClick={runCalculation} className="mt-9 flex w-full items-center justify-center gap-3 rounded-xl bg-gold-500 px-5 py-4 font-bold text-obsidian-950 transition hover:bg-white active:scale-[0.99]"><LineChart className="h-5 w-5" /> {copy.run}</button>
                    </div>

                    <div className="rounded-[2rem] border border-gold-500/25 bg-[#171613] p-6 shadow-2xl shadow-black/20 md:p-8">
                        <div className={`mb-8 flex items-start justify-between gap-4 ${isArabic ? 'text-right' : 'text-left'}`}><div><p className="text-xs uppercase tracking-[0.22em] text-gold-500">02</p><h3 className="mt-2 font-serif text-2xl text-white md:text-3xl">{copy.resultTitle}</h3></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500"><Sparkles className="h-5 w-5" /></div></div>
                        {!hasCalculated ? <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/12 px-8 text-center"><p className="max-w-sm text-sm leading-7 text-white/35">{copy.notSet}</p></div> : <>
                            <div className={`mb-5 flex items-center justify-between gap-4 rounded-2xl border border-gold-500/15 bg-gold-500/[0.05] p-4 ${isArabic ? 'text-right' : 'text-left'}`}><div><p className="text-xs text-white/35">{copy.scenario}</p><p className="mt-1 font-semibold text-gold-500">{isArabic ? scenario.labelAr : scenario.labelEn}</p></div><span className="rounded-full border border-gold-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-gold-500">{copy.target} {scenario.target.toFixed(1)}x</span></div>
                            <div className="grid gap-3 sm:grid-cols-2"><ResultCard label={copy.revenue} value={`${formatMoney(results.targetRevenue, lang)} SAR`} accent /><ResultCard label={copy.grossProfit} value={`${formatMoney(results.grossProfit, lang)} SAR`} /><ResultCard label={copy.breakEven} value={`${results.breakEvenRoas.toFixed(1)}x ROAS`} /><ResultCard label={copy.orders} value={formatMoney(results.orders, lang)} /></div>
                            <div className="mt-5 rounded-2xl border border-white/8 bg-black/15 p-4"><div className="mb-4 flex items-center justify-between text-xs text-white/35"><span>{isArabic ? 'نطاق السيناريوهات' : 'Scenario range'}</span><span>{formatMoney(results.conservativeRevenue, lang)} — {formatMoney(results.upsideRevenue, lang)} SAR</span></div><div className="h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[58%] rounded-full bg-gradient-to-r from-white/25 via-gold-500 to-gold-300" /></div><div className="mt-3 flex justify-between text-[10px] text-white/25"><span>{isArabic ? 'محافظ' : 'Conservative'}</span><span>{isArabic ? 'مستهدف' : 'Target'}</span><span>{isArabic ? 'متفائل' : 'Upside'}</span></div></div>
                            <div className={`mt-5 flex items-start gap-3 text-xs leading-6 text-white/35 ${isArabic ? 'text-right' : 'text-left'}`}><CircleHelp className="mt-1 h-4 w-4 shrink-0 text-gold-500/70" /> <span>{copy.assumptions}</span></div>
                            <button type="button" onClick={requestReview} className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-gold-500/45 bg-transparent px-5 py-4 text-sm font-bold text-gold-500 transition hover:bg-gold-500 hover:text-obsidian-950">{copy.cta}<ArrowUpRight className="h-4 w-4" /></button>
                            <p className="mt-4 text-center text-xs leading-6 text-white/25">{copy.planNote}</p>
                        </>}
                    </div>
                </div>

                <div className={`mt-8 flex items-start gap-3 text-xs leading-6 text-white/30 ${isArabic ? 'justify-end text-right' : 'justify-start text-left'}`}><Info className="mt-1 h-4 w-4 shrink-0 text-white/35" /><span>{copy.assumptions}</span></div>
            </div>
        </section>
    );
};

const FieldLabel = ({ label, value }) => <div className="flex items-end justify-between gap-4"><span className="text-sm font-semibold text-white/75">{label}</span><strong className="font-serif text-2xl text-gold-500">{value}</strong></div>;
const ResultCard = ({ label, value, accent = false }) => <div className={`rounded-2xl border p-4 ${accent ? 'border-gold-500/30 bg-gold-500/[0.08]' : 'border-white/8 bg-black/15'}`}><p className="text-xs leading-5 text-white/35">{label}</p><p className={`mt-3 font-serif text-xl ${accent ? 'text-gold-500' : 'text-white'}`}>{value}</p></div>;

export default GrowthROICalculator;
