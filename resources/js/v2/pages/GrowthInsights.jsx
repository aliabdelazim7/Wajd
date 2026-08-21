import { useEffect } from 'react';
import { ArrowUpRight, BookOpen, CalendarDays, ChevronRight, Clock3, ExternalLink, Quote, Sparkles } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../layout/Layout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getInsight, growthInsights } from '../utils/growthInsights.js';
import { trackAnalyticsEvent } from '../utils/analytics.js';

const GrowthInsights = () => {
    const { slug } = useParams();
    const { lang } = useApp();
    const isArabic = lang === 'ar';
    const article = slug ? getInsight(slug) : null;

    useEffect(() => {
        if (!article) return undefined;
        trackAnalyticsEvent('insight_opened', { article_id: article.slug });
        const node = document.createElement('script');
        node.type = 'application/ld+json';
        node.id = 'wajd-insight-schema';
        node.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title[lang],
            description: article.excerpt[lang],
            datePublished: article.publishedAt,
            author: { '@type': 'Organization', name: 'Wajd Agency' },
            publisher: { '@type': 'Organization', name: 'Wajd Agency' },
            mainEntityOfPage: `${window.location.origin}/insights/${article.slug}`,
            about: article.category[lang],
        });
        document.head.appendChild(node);
        return () => node.remove();
    }, [article, lang]);

    if (slug && !article) return <Navigate to="/insights" replace />;
    return article ? <InsightArticle article={article} isArabic={isArabic} lang={lang} /> : <InsightIndex isArabic={isArabic} lang={lang} />;
};

const InsightIndex = ({ isArabic, lang }) => {
    const copy = isArabic ? {
        eyebrow: 'GROWTH INSIGHTS', title: 'أفكار عملية لبناء نمو أهدأ وأوضح.', intro: 'نكتب عن التسويق، التقنية، القياس، وتجارب التجارة في الخليج — بدون وعود عامة وبدون مصطلحات لا تساعد على قرار.', featured: 'المقال المختار', read: 'اقرأ المقال', minutes: 'دقائق', source: 'مع مصادر واضحة', ctaTitle: 'هل تريد تحويل الفكرة إلى نظام؟', ctaBody: 'شاركنا الوضع الحالي، وسنساعدك على تحديد الاختناق قبل اختيار الأداة أو القناة.', cta: 'ابدأ محادثة عملية',
    } : {
        eyebrow: 'GROWTH INSIGHTS', title: 'Practical ideas for calmer, clearer growth.', intro: 'We write about marketing, technology, measurement, and commerce in the Gulf—without generic promises or jargon that does not help a decision.', featured: 'Featured insight', read: 'Read the insight', minutes: 'min read', source: 'Clear sources', ctaTitle: 'Want to turn the idea into a system?', ctaBody: 'Share where the business is today, and we will help identify the bottleneck before choosing a tool or channel.', cta: 'Start a practical conversation',
    };

    return <Layout><main dir={isArabic ? 'rtl' : 'ltr'} className="overflow-hidden"><section className="px-[5%] pb-16 pt-36 md:pb-24 md:pt-48"><div className="mx-auto max-w-7xl"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={isArabic ? 'text-right' : 'text-left'}><span className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gold-500"><BookOpen className="h-4 w-4" />{copy.eyebrow}</span><h1 className="max-w-5xl font-serif text-5xl leading-[0.98] md:text-8xl">{copy.title}</h1><p className="mt-7 max-w-2xl text-base leading-8 text-white/50 md:text-lg">{copy.intro}</p></motion.div></div></section><section className="section-padding pt-0"><div className="mx-auto max-w-7xl"><div className="mb-10 flex items-end justify-between gap-4"><h2 className="font-serif text-3xl md:text-4xl">{copy.featured}</h2><span className="text-xs text-white/30">{growthInsights.length} {isArabic ? 'مقالات' : 'insights'}</span></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{growthInsights.map((item, index) => <InsightCard key={item.slug} item={item} isArabic={isArabic} lang={lang} featured={index === 0} copy={copy} />)}</div><div className="mt-20 grid items-center gap-8 border-t border-white/8 pt-10 md:grid-cols-[1fr_auto]"><div className={isArabic ? 'text-right' : 'text-left'}><div className="mb-4 flex items-center gap-2 text-gold-500"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">{isArabic ? 'من الفكرة إلى التنفيذ' : 'FROM IDEA TO EXECUTION'}</span></div><h2 className="font-serif text-3xl">{copy.ctaTitle}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-white/40">{copy.ctaBody}</p></div><Link to="/contact" onClick={() => trackAnalyticsEvent('insights_cta_clicked', { location: 'insight_index' })} className="inline-flex items-center justify-center gap-3 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-bold text-obsidian-950 transition hover:bg-white">{copy.cta}<ArrowUpRight className="h-4 w-4" /></Link></div></div></section></main></Layout>;
};

const InsightCard = ({ item, isArabic, lang, featured, copy }) => <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`group flex h-full flex-col rounded-[1.75rem] border p-6 transition ${featured ? 'border-gold-500/30 bg-gold-500/[0.05] md:col-span-2 lg:col-span-2' : 'border-white/10 bg-white/[0.02] hover:border-gold-500/25'}`}><div className="mb-7 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-white/30"><span className="text-gold-500">{item.category[lang]}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{item.readTime} {copy.minutes}</span></div><h3 className={`font-serif leading-tight text-white/90 ${featured ? 'max-w-2xl text-3xl md:text-5xl' : 'text-2xl'}`}>{item.title[lang]}</h3><p className="mt-5 max-w-2xl text-sm leading-7 text-white/45">{item.excerpt[lang]}</p><div className="mt-auto flex items-center justify-between gap-4 border-t border-white/8 pt-6"><span className="inline-flex items-center gap-2 text-xs text-white/30"><CalendarDays className="h-3.5 w-3.5" />{formatDate(item.publishedAt, lang)}</span><Link to={`/insights/${item.slug}`} onClick={() => trackAnalyticsEvent('insight_clicked', { article_id: item.slug })} className="inline-flex items-center gap-2 text-sm font-semibold text-gold-500 transition group-hover:text-white">{copy.read}<ArrowUpRight className="h-4 w-4" /></Link></div></motion.article>;

const InsightArticle = ({ article, isArabic, lang }) => {
    const copy = isArabic ? { back: 'كل المقالات', eyebrow: 'GROWTH INSIGHTS', source: 'المصادر', faq: 'أسئلة شائعة', next: 'مقال آخر', cta: 'ناقش مشروعك مع وجد', note: 'نكتب لنوضح القرار، لا لنبيع نتيجة مضمونة.' } : { back: 'All insights', eyebrow: 'GROWTH INSIGHTS', source: 'Sources', faq: 'Frequently asked questions', next: 'Read another insight', cta: 'Discuss your project with Wajd', note: 'We write to clarify a decision, not to sell a guaranteed result.' };
    return <Layout><main dir={isArabic ? 'rtl' : 'ltr'} className="overflow-hidden"><article className="px-[5%] pb-24 pt-36 md:pt-48"><div className="mx-auto max-w-4xl"><Link to="/insights" className="mb-10 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-gold-500"><ChevronRight className={`h-4 w-4 ${isArabic ? '' : 'rotate-180'}`} />{copy.back}</Link><header className={isArabic ? 'text-right' : 'text-left'}><div className="mb-5 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.17em] text-white/30"><span className="text-gold-500">{copy.eyebrow}</span><span>{article.category[lang]}</span><span>{article.readTime} {isArabic ? 'دقائق قراءة' : 'min read'}</span></div><h1 className="font-serif text-5xl leading-[1.02] md:text-8xl">{article.title[lang]}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-white/50">{article.excerpt[lang]}</p></header><div className="my-12 grid gap-3 md:grid-cols-3">{article.takeaways[lang].map((point) => <div key={point} className="border-y border-gold-500/20 bg-gold-500/[0.045] p-4 text-sm leading-6 text-white/65"><span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-gold-500">{isArabic ? 'خلاصة' : 'Takeaway'}</span>{point}</div>)}</div><div className="space-y-12">{article.sections.map((section) => <section key={section.heading[lang]} className="border-b border-white/8 pb-10 last:border-b-0"><h2 className="font-serif text-3xl leading-tight md:text-5xl">{section.heading[lang]}</h2><p className="mt-5 text-base leading-9 text-white/60 md:text-lg">{section.body[lang]}</p></section>)}</div><aside className="my-12 flex items-start gap-4 border-y border-white/8 py-7"><Quote className="mt-1 h-5 w-5 shrink-0 text-gold-500" /><p className="text-sm leading-7 text-white/40">{copy.note}</p></aside><section className="border-t border-white/8 pt-10"><h2 className="font-serif text-3xl">{copy.source}</h2><div className="mt-5 space-y-3">{article.sources.map((source) => <a key={source.url} href={source.url.startsWith('/') ? source.url : source.url} target={source.url.startsWith('/') ? undefined : '_blank'} rel={source.url.startsWith('/') ? undefined : 'noopener noreferrer'} className="flex items-start gap-3 text-sm leading-7 text-white/50 transition hover:text-gold-500"><ExternalLink className="mt-1 h-4 w-4 shrink-0" />{source.label[lang]}</a>)}</div></section><section className="mt-12 border-t border-white/8 pt-10"><h2 className="font-serif text-3xl">{copy.faq}</h2><div className="mt-5 space-y-4">{article.faq.map((item) => <details key={item.q[lang]} className="border-b border-white/8 pb-4"><summary className="cursor-pointer list-none py-2 text-base font-semibold text-white/75">{item.q[lang]}</summary><p className="pb-2 text-sm leading-7 text-white/45">{item.a[lang]}</p></details>)}</div></section><div className="mt-14 flex flex-col gap-5 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between"><p className="font-serif text-2xl">{copy.next}</p><Link to="/contact" onClick={() => trackAnalyticsEvent('insights_cta_clicked', { article_id: article.slug })} className="inline-flex items-center justify-center gap-3 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-bold text-obsidian-950 transition hover:bg-white">{copy.cta}<ArrowUpRight className="h-4 w-4" /></Link></div></div></article></main></Layout>;
};

const formatDate = (value, lang) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));

export default GrowthInsights;
