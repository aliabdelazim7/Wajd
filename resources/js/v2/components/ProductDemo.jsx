import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    BarChart3,
    Bot,
    Check,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    ExternalLink,
    LayoutDashboard,
    MessageSquareText,
    PackageCheck,
    Play,
    ShoppingCart,
    Sparkles,
    Users,
    Workflow,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { trackAnalyticsEvent } from '../utils/analytics.js';
import marketPosMockup from '../assets/market-pos-mockup.png';

const ProductDemo = () => {
    const { lang, content } = useApp();
    const isArabic = lang === 'ar';
    const demoSettings = content?.settings?.product_demos || {};
    const [activeProduct, setActiveProduct] = useState('market-pos');
    const [activeView, setActiveView] = useState('overview');
    const [showVideoHint, setShowVideoHint] = useState(false);

    const baseCopy = useMemo(() => isArabic ? {
        eyebrow: 'شوف المنتج قبل ما تشتريه',
        title: 'مش بنبيعك كلام.\nبنوريك النظام وهو شغال.',
        subtitle: 'وجد تجمع بين التسويق والتقنية في منظومة واحدة. جرّب معاينة تفاعلية سريعة للأنظمة التي يمكن أن تصبح جزءاً من تشغيل مشروعك.',
        interactive: 'معاينة تفاعلية',
        liveProof: 'منتج حقيقي • تجربة عملية',
        marketPos: 'Market POS',
        liftDesk: 'LiftDesk',
        marketPosCategory: 'تشغيل المتاجر ونقاط البيع',
        liftDeskCategory: 'أتمتة خدمة العملاء والعمليات',
        overview: 'نظرة عامة',
        sales: 'المبيعات',
        automations: 'الأتمتة',
        previewSystem: 'افتح المعاينة الحية',
        requestBuild: 'ابنِ نظاماً يناسب مشروعك',
        watchWalkthrough: 'شاهد شرح النظام',
        videoComing: 'أضفنا لك تجربة تفاعلية الآن — وفيديو شرح قصير قادم في النسخة القادمة.',
        metrics: {
            totalSales: 'إجمالي المبيعات',
            orders: 'الطلبات اليوم',
            stock: 'حالة المخزون',
            resolved: 'مهام أُنجزت',
        },
        marketRows: [
            ['عطر نجد', '18', 'متوفر'],
            ['بوكس الضيافة', '12', 'منخفض'],
            ['زيت العود الملكي', '31', 'متوفر'],
        ],
        liftRows: [
            ['رسالة جديدة', 'تم تصنيفها كطلب سعر', 'منذ دقيقة'],
            ['تذكير متابعة', 'عميل لم يكمل الطلب', 'منذ 8 دقائق'],
            ['تقرير يومي', 'جاهز للمراجعة', 'منذ 22 دقيقة'],
        ],
        featureTitle: 'الجزء المهم: كل رقم له قرار بعده',
        featureBody: 'لوحة واضحة للفريق، بيانات قابلة للفهم، وأتمتة تقلل الأعمال اليدوية — عشان النمو مايبقاش معلقاً على شخص واحد.',
        features: ['واجهة عربية وإنجليزية', 'لوحات قياس قابلة للتخصيص', 'ربط مع رحلة العميل', 'صلاحيات وتقارير للفريق'],
        proof: 'بدل ما تتخيل النتيجة، جرّب شكلها الآن.',
    } : {
        eyebrow: 'SEE THE PRODUCT BEFORE YOU BUY IT',
        title: 'We do not sell promises.\nWe show the system working.',
        subtitle: 'Wajd brings growth and technology into one operating layer. Explore a quick interactive preview of the systems that can become part of your business.',
        interactive: 'Interactive preview',
        liveProof: 'Real product thinking • Practical execution',
        marketPos: 'Market POS',
        liftDesk: 'LiftDesk',
        marketPosCategory: 'Retail and point-of-sale operations',
        liftDeskCategory: 'Customer support and workflow automation',
        overview: 'Overview',
        sales: 'Sales',
        automations: 'Automations',
        previewSystem: 'Open live preview',
        requestBuild: 'Build a system for my business',
        watchWalkthrough: 'Watch the walkthrough',
        videoComing: 'The interactive walkthrough is live now — a short recorded tour is next.',
        metrics: {
            totalSales: 'Total sales',
            orders: 'Orders today',
            stock: 'Stock health',
            resolved: 'Tasks resolved',
        },
        marketRows: [
            ['Najd Oud', '18', 'In stock'],
            ['Hospitality Box', '12', 'Low stock'],
            ['Royal Oud Oil', '31', 'In stock'],
        ],
        liftRows: [
            ['New message', 'Classified as price request', '1 min ago'],
            ['Follow-up reminder', 'Customer did not finish checkout', '8 min ago'],
            ['Daily report', 'Ready for review', '22 min ago'],
        ],
        featureTitle: 'The important part: every number leads to a decision',
        featureBody: 'A clear workspace for the team, readable data, and automation that reduces manual work — so growth never depends on one person.',
        features: ['Arabic and English interface', 'Custom performance dashboards', 'Connected customer journey', 'Team permissions and reporting'],
        proof: 'Do not imagine the result. Experience the shape of it now.',
    }, [isArabic]);
    const localizedDemoSettings = demoSettings[isArabic ? 'ar' : 'en'] || demoSettings;
    const copy = useMemo(() => ({
        ...baseCopy,
        ...localizedDemoSettings,
        metrics: { ...baseCopy.metrics, ...(localizedDemoSettings.metrics || {}) },
        marketRows: Array.isArray(localizedDemoSettings.marketRows) ? localizedDemoSettings.marketRows : baseCopy.marketRows,
        liftRows: Array.isArray(localizedDemoSettings.liftRows) ? localizedDemoSettings.liftRows : baseCopy.liftRows,
        features: Array.isArray(localizedDemoSettings.features) ? localizedDemoSettings.features : baseCopy.features,
    }), [baseCopy, localizedDemoSettings]);

    const metricIcons = { totalSales: CircleDollarSign, orders: ShoppingCart, stock: PackageCheck, messages: MessageSquareText, flows: Workflow, resolved: Clock3 };
    const marketMetrics = Array.isArray(localizedDemoSettings.marketMetrics) ? localizedDemoSettings.marketMetrics : [
        { key: 'totalSales', label: copy.metrics.totalSales, value: '24,780', suffix: 'SAR', trend: '+12.5%' },
        { key: 'orders', label: copy.metrics.orders, value: '48', suffix: '', trend: '+8.3%' },
        { key: 'stock', label: copy.metrics.stock, value: '92%', suffix: '', trend: 'Healthy' },
    ];
    const liftMetrics = Array.isArray(localizedDemoSettings.liftMetrics) ? localizedDemoSettings.liftMetrics : [
        { key: 'messages', label: isArabic ? 'رسائل اليوم' : 'Messages today', value: '126', suffix: '', trend: '+24%' },
        { key: 'flows', label: isArabic ? 'تدفقات نشطة' : 'Active flows', value: '14', suffix: '', trend: 'Running' },
        { key: 'resolved', label: copy.metrics.resolved, value: '89%', suffix: '', trend: '+17%' },
    ];
    const marketChart = Array.isArray(localizedDemoSettings.marketChart) && localizedDemoSettings.marketChart.length ? localizedDemoSettings.marketChart : [34, 52, 42, 67, 58, 78, 64, 88, 73, 96, 81, 100];

    const products = {
        'market-pos': {
            key: 'market-pos',
            name: localizedDemoSettings.products?.marketPos?.name || copy.marketPos,
            category: localizedDemoSettings.products?.marketPos?.category || copy.marketPosCategory,
            icon: ShoppingCart,
            liveUrl: localizedDemoSettings.products?.marketPos?.liveUrl || 'https://market-1-tau.vercel.app/login',
            accent: 'gold',
        },
        liftdesk: {
            key: 'liftdesk',
            name: localizedDemoSettings.products?.liftDesk?.name || copy.liftDesk,
            category: localizedDemoSettings.products?.liftDesk?.category || copy.liftDeskCategory,
            icon: Bot,
            liveUrl: null,
            accent: 'violet',
        },
    };
    const selectedProduct = products[activeProduct];

    const selectProduct = (productKey) => {
        setActiveProduct(productKey);
        setActiveView('overview');
        trackAnalyticsEvent('demo_tab_switched', { demo_id: productKey });
    };

    const openWalkthrough = () => {
        setShowVideoHint(true);
        trackAnalyticsEvent('demo_walkthrough_clicked', { demo_id: activeProduct });
    };

    const openLivePreview = () => {
        trackAnalyticsEvent('demo_live_preview_clicked', { demo_id: activeProduct });
        if (selectedProduct.liveUrl) window.open(selectedProduct.liveUrl, '_blank', 'noopener,noreferrer');
        else window.location.assign('/contact?interest=liftdesk');
    };

    return (
        <section id="product-demo" className="relative overflow-hidden bg-[#0a0a09] py-24 md:py-32" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-gold-500/[0.08] blur-[120px]" />
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-[5%]">
                <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                        className={isArabic ? 'text-right' : 'text-left'}
                    >
                        <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">
                            <span className="h-px w-10 bg-gold-500/60" />
                            <span>{copy.eyebrow}</span>
                        </div>
                        <h2 className="max-w-xl whitespace-pre-line font-serif text-4xl leading-[1.06] text-white md:text-6xl">
                            {copy.title}
                        </h2>
                        <p className="mt-7 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                            {copy.subtitle}
                        </p>
                        <div className={`mt-9 flex flex-wrap items-center gap-3 ${isArabic ? 'justify-end' : 'justify-start'}`}>
                            <button type="button" onClick={openWalkthrough} className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold-500/50 hover:text-gold-500">
                                <Play className="h-4 w-4 fill-current" />
                                {copy.watchWalkthrough}
                            </button>
                            <span className="text-xs text-white/25">{copy.liveProof}</span>
                        </div>
                        {showVideoHint && <p role="status" className="mt-4 max-w-md text-sm leading-6 text-gold-500/80">{copy.videoComing}</p>}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="min-w-0"
                    >
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2" role="tablist" aria-label={copy.interactive}>
                                {Object.values(products).map((product) => {
                                    const Icon = product.icon;
                                    const isActive = product.key === activeProduct;
                                    return (
                                        <button
                                            key={product.key}
                                            type="button"
                                            role="tab"
                                            aria-selected={isActive}
                                            onClick={() => selectProduct(product.key)}
                                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${isActive ? 'border-gold-500/70 bg-gold-500 text-obsidian-950' : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white'}`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {product.name}
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-300/80"><span className="h-2 w-2 rounded-full bg-emerald-400" /> {copy.interactive}</span>
                        </div>

                        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#151514] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
                                <div className="flex items-center gap-2" aria-hidden="true">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-300/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/30"><LayoutDashboard className="h-3.5 w-3.5" /> wajd.systems/{activeProduct}</div>
                            </div>

                            <div className="grid min-h-[450px] lg:grid-cols-[145px_minmax(0,1fr)]">
                                <aside className="hidden border-e border-white/8 bg-black/10 p-4 lg:block">
                                    <div className="mb-8 flex items-center gap-2 text-sm font-bold text-white"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500 text-[10px] font-black text-obsidian-950">W</span> {selectedProduct.name}</div>
                                    <div className="space-y-2 text-xs text-white/35">
                                        {[
                                            [copy.overview, LayoutDashboard, 'overview'],
                                            [activeProduct === 'market-pos' ? copy.sales : copy.automations, activeProduct === 'market-pos' ? BarChart3 : Workflow, 'detail'],
                                        ].map(([label, Icon, view]) => <button type="button" key={view} onClick={() => setActiveView(view)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition ${activeView === view ? 'bg-gold-500/10 text-gold-500' : 'hover:bg-white/5 hover:text-white/70'}`}><Icon className="h-3.5 w-3.5" /> {label}</button>)}
                                    </div>
                                </aside>

                                <div className="min-w-0 p-4 md:p-7">
                                    <div className={`mb-6 flex flex-wrap items-start justify-between gap-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                                        <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-500/70">{selectedProduct.category}</p><h3 className="mt-2 font-serif text-2xl text-white md:text-3xl">{selectedProduct.name}</h3></div>
                                        <button type="button" onClick={openLivePreview} className="inline-flex items-center gap-2 rounded-xl border border-gold-500/30 px-3 py-2 text-xs font-semibold text-gold-500 transition hover:bg-gold-500 hover:text-obsidian-950"><ExternalLink className="h-3.5 w-3.5" /> {copy.previewSystem}</button>
                                    </div>

                                    {activeProduct === 'market-pos' ? (
                                        <>
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                {marketMetrics.slice(0, 3).map((item) => { const Icon = metricIcons[item.key] || BarChart3; return <Metric key={item.key} icon={Icon} label={item.label} value={item.value} suffix={item.suffix} trend={item.trend} />; })}
                                            </div>
                                            <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                                                <div className="relative min-h-[185px] overflow-hidden rounded-2xl border border-white/8 bg-black/15 p-4">
                                                    <div className="mb-5 flex items-center justify-between text-xs text-white/40"><span>{copy.sales}</span><span className="rounded-md border border-white/10 px-2 py-1">Last 30 days</span></div>
                                                    <div className="flex h-28 items-end gap-2">
                                                        {marketChart.map((height, index) => <div key={index} className={`flex-1 rounded-t-md ${index === 9 ? 'bg-gold-500' : 'bg-gold-500/25'}`} style={{ height: `${height}%` }} />)}
                                                    </div>
                                                    <div className="mt-2 flex justify-between text-[10px] text-white/25"><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div>
                                                </div>
                                                <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                                                    <div className="mb-4 flex items-center justify-between text-xs text-white/40"><span>{copy.metrics.stock}</span><PackageCheck className="h-4 w-4 text-gold-500" /></div>
                                                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[15px] border-gold-500/20 border-t-gold-500 border-e-gold-500"><span className="font-serif text-xl text-white">92%</span></div>
                                                    <p className="mt-3 text-center text-[10px] text-emerald-300/70">{isArabic ? 'المخزون تحت السيطرة' : 'Inventory is under control'}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                                {copy.marketRows.map(([name, count, status]) => <div key={name} className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-black/10 px-3 py-2.5 text-xs"><span className="truncate text-white/65">{name}</span><span className="text-white/35">{count}</span><span className={status === (isArabic ? 'متوفر' : 'In stock') ? 'text-emerald-300/70' : 'text-amber-300/70'}>{status}</span></div>)}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                {liftMetrics.slice(0, 3).map((item) => { const Icon = metricIcons[item.key] || BarChart3; return <Metric key={item.key} icon={Icon} label={item.label} value={item.value} suffix={item.suffix} trend={item.trend} />; })}
                                            </div>
                                            <div className="mt-4 rounded-2xl border border-white/8 bg-black/15 p-4">
                                                <div className="mb-4 flex items-center justify-between text-xs text-white/40"><span>{copy.automations}</span><span className="inline-flex items-center gap-1.5 text-emerald-300/70"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live</span></div>
                                                <div className="space-y-2">
                                                    {copy.liftRows.map(([title, body, time], index) => <div key={title} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${index === 0 ? 'bg-gold-500/15 text-gold-500' : 'bg-white/5 text-white/40'}`}>{index === 0 ? <MessageSquareText className="h-4 w-4" /> : index === 1 ? <Users className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white/75">{title}</p><p className="truncate text-[11px] text-white/35">{body}</p></div><span className="shrink-0 text-[10px] text-white/25">{time}</span></div>)}
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><Sparkles className="h-4 w-4" /></div><div><p className="text-xs font-semibold text-white/75">{isArabic ? 'اقتراح ذكي' : 'Smart suggestion'}</p><p className="mt-1 text-[11px] leading-5 text-white/35">{isArabic ? 'حوّل أكثر الأسئلة تكراراً إلى رد آلي أو مهمة للفريق.' : 'Turn the most repeated questions into an automated reply or a team task.'}</p></div></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-14 grid gap-8 border-t border-white/8 pt-10 lg:grid-cols-[0.85fr_1fr_1fr] lg:gap-14">
                    <div className={isArabic ? 'text-right' : 'text-left'}><p className="text-sm uppercase tracking-[0.2em] text-gold-500">{copy.proof}</p><p className="mt-4 font-serif text-2xl leading-tight text-white/75">{copy.featureTitle}</p></div>
                    <p className={`text-sm leading-7 text-white/40 ${isArabic ? 'text-right' : 'text-left'}`}>{copy.featureBody}</p>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-white/55">{copy.features.map((feature) => <div key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" /> <span>{feature}</span></div>)}</div>
                </div>
                <div className={`mt-9 flex flex-wrap gap-4 ${isArabic ? 'justify-end' : 'justify-start'}`}>
                    <Link to="/contact" state={{ demoRequest: activeProduct }} onClick={() => trackAnalyticsEvent('demo_request_clicked', { demo_id: activeProduct })} className="inline-flex items-center gap-3 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-bold text-obsidian-950 transition hover:bg-white">{copy.requestBuild}<ArrowUpRight className="h-4 w-4" /></Link>
                    <button type="button" onClick={openLivePreview} className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3.5 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:text-white">{copy.previewSystem}<ChevronRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} /></button>
                </div>
            </div>
            <img src={marketPosMockup} alt="Market POS product dashboard preview" loading="lazy" className="pointer-events-none absolute bottom-0 right-0 hidden h-0 w-0 object-contain opacity-0" />
        </section>
    );
};

const Metric = ({ icon: Icon, label, value, suffix, trend }) => (
    <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
        <div className="flex items-center justify-between gap-2"><span className="text-[11px] text-white/35">{label}</span><Icon className="h-4 w-4 text-gold-500/80" /></div>
        <p className="mt-4 font-serif text-2xl text-white">{value} <span className="font-sans text-[10px] text-white/30">{suffix}</span></p>
        <p className="mt-1 text-[10px] text-emerald-300/70">{trend}</p>
    </div>
);

export default ProductDemo;
