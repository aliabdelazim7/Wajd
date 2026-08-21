import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BarChart3, Check, ChevronRight, Clock3, FolderOpen, LayoutDashboard, MessageCircle, ShieldCheck, Sparkles, Target, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layout/Layout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { trackAnalyticsEvent } from '../utils/analytics.js';

const ClientPortal = () => {
    const { lang } = useApp();
    const isArabic = lang === 'ar';
    const [activeTab, setActiveTab] = useState('timeline');

    const copy = isArabic ? {
        eyebrow: 'معاينة بوابة العميل',
        title: 'كل ما يحدث في مشروعك… في مكان واحد.',
        intro: 'بوابة العميل المقترحة من وجد تجمع التقدم، الملفات، التقارير، والقرارات القادمة في مساحة واضحة بدل الرسائل المتناثرة.',
        preview: 'بيانات تجريبية للشرح',
        project: 'مشروع نمو تجريبي',
        health: 'صحة المشروع',
        healthy: 'على المسار',
        next: 'الخطوة القادمة',
        nextValue: 'مراجعة صفحة المنتج',
        openItems: 'مهام مفتوحة',
        tabs: { timeline: 'خط سير المشروع', assets: 'الملفات', reports: 'التقارير' },
        timelineTitle: 'التقدم والقرارات',
        timeline: [
            ['اكتشاف الفرصة', 'تم اعتماد الأولويات والرسالة الأساسية', 'مكتمل'],
            ['بناء الأصول', 'مراجعة صفحة الهبوط والمواد الإبداعية', 'قيد التنفيذ'],
            ['إطلاق واختبار', 'تجهيز التتبع وبدء أول دورة تحسين', 'التالي'],
        ],
        files: ['خريطة الرسائل والعروض', 'نسخة صفحة الهبوط', 'تقرير الأداء الأولي'],
        report: 'ملخص الأداء',
        reportBody: 'عندما يبدأ المشروع، يرى العميل المؤشرات الأساسية والتوصيات القادمة بنفس اللغة التي يفهمها فريقه.',
        contact: 'اطلب بوابة لمشروعك',
        message: 'هل لديك مشروع يحتاج متابعة منظمة؟ نبدأ بنطاق بسيط ثم نوسّع البوابة حسب احتياج فريقك.',
        security: 'صلاحيات واضحة • مشاركة ملفات • سجل قرارات',
    } : {
        eyebrow: 'CLIENT PORTAL PREVIEW',
        title: 'Everything your project needs.\nOne clear workspace.',
        intro: 'Wajd’s proposed client portal brings progress, files, reports, and next decisions into one calm operating space instead of scattered messages.',
        preview: 'Sample data for demonstration',
        project: 'Sample growth project',
        health: 'Project health',
        healthy: 'On track',
        next: 'Next milestone',
        nextValue: 'Product page review',
        openItems: 'Open items',
        tabs: { timeline: 'Timeline', assets: 'Assets', reports: 'Reports' },
        timelineTitle: 'Progress and decisions',
        timeline: [
            ['Opportunity discovery', 'Priorities and core message approved', 'Complete'],
            ['Asset production', 'Landing page and creative review', 'In progress'],
            ['Launch and testing', 'Tracking setup and first optimization cycle', 'Next'],
        ],
        files: ['Message and offer map', 'Landing page draft', 'First performance report'],
        report: 'Performance summary',
        reportBody: 'Once a project starts, clients see the metrics and next recommendations in the same language their team uses to make decisions.',
        contact: 'Request a portal for my project',
        message: 'Have a project that needs organized follow-through? Start small, then expand the workspace as your team needs it.',
        security: 'Clear permissions • File sharing • Decision log',
    };

    const tabClick = (tab) => {
        setActiveTab(tab);
        trackAnalyticsEvent('portal_preview_tab_clicked', { tab });
    };

    return (
        <Layout>
            <main dir={isArabic ? 'rtl' : 'ltr'} className="overflow-hidden">
                <section className="px-[5%] pb-16 pt-36 md:pb-24 md:pt-48">
                    <div className="mx-auto max-w-7xl">
                        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={isArabic ? 'text-right' : 'text-left'}>
                            <span className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gold-500"><LayoutDashboard className="h-4 w-4" /> {copy.eyebrow}</span>
                            <h1 className="max-w-5xl whitespace-pre-line font-serif text-5xl leading-[0.98] md:text-8xl">{copy.title}</h1>
                            <p className={`mt-7 max-w-2xl text-base leading-8 text-white/50 md:text-lg ${isArabic ? 'ml-0 mr-auto' : ''}`}>{copy.intro}</p>
                        </motion.div>
                    </div>
                </section>

                <section className="section-padding pt-0">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3 text-sm font-semibold text-white/80"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 text-xs font-black text-obsidian-950">W</span>{copy.project}</div><span className="rounded-full border border-gold-500/20 bg-gold-500/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-500">{copy.preview}</span></div>
                        <div className="grid min-h-[660px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#121210] shadow-2xl shadow-black/30 lg:grid-cols-[220px_minmax(0,1fr)]">
                            <aside className="border-b border-white/8 bg-black/10 p-5 lg:border-b-0 lg:border-e">
                                <p className="mb-7 text-[10px] uppercase tracking-[0.2em] text-white/25">{isArabic ? 'مساحة العمل' : 'Workspace'}</p>
                                <div className="space-y-2"><div className="flex items-center gap-3 rounded-xl bg-gold-500/10 px-3 py-3 text-sm text-gold-500"><LayoutDashboard className="h-4 w-4" /> {isArabic ? 'نظرة عامة' : 'Overview'}</div><div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/40"><FolderOpen className="h-4 w-4" /> {isArabic ? 'الملفات' : 'Files'}</div><div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/40"><MessageCircle className="h-4 w-4" /> {isArabic ? 'التحديثات' : 'Updates'}</div></div>
                                <div className="mt-16 border-t border-white/8 pt-6"><p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/25">{isArabic ? 'مراحل المشروع' : 'Project stages'}</p><div className="space-y-5">{['اكتشاف', 'بناء', 'إطلاق'].map((stage, index) => <div key={stage} className="flex items-start gap-3"><div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${index === 0 ? 'border-emerald-400 bg-emerald-400 text-obsidian-950' : index === 1 ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-white/15 text-white/20'}`}>{index === 0 ? <Check className="h-3 w-3" /> : index + 1}</div><span className={`text-sm ${index === 2 ? 'text-white/25' : 'text-white/60'}`}>{isArabic ? stage : ['Discovery', 'Build', 'Launch'][index]}</span></div>)}</div></div>
                            </aside>
                            <div className="min-w-0 p-5 md:p-8">
                                <div className={`mb-7 flex flex-wrap items-start justify-between gap-5 ${isArabic ? 'text-right' : 'text-left'}`}><div><p className="text-xs uppercase tracking-[0.2em] text-gold-500">{isArabic ? 'آخر تحديث منذ ساعتين' : 'Updated 2 hours ago'}</p><h2 className="mt-2 font-serif text-3xl text-white md:text-4xl">{isArabic ? 'صباح الخير، علي' : 'Good morning, Ali'}</h2></div><button type="button" onClick={() => trackAnalyticsEvent('portal_message_clicked', { location: 'portal_preview' })} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 transition hover:border-gold-500/40 hover:text-gold-500"><MessageCircle className="h-4 w-4" /> {isArabic ? 'أرسل تحديثاً' : 'Send an update'}</button></div>
                                <div className="grid gap-3 md:grid-cols-3"><KpiCard icon={ShieldCheck} label={copy.health} value={copy.healthy} accent /><KpiCard icon={Target} label={copy.next} value={copy.nextValue} /><KpiCard icon={Clock3} label={copy.openItems} value="04" /></div>
                                <div className="mt-8 flex gap-1 overflow-x-auto border-b border-white/8">{Object.entries(copy.tabs).map(([tab, label]) => <button key={tab} type="button" onClick={() => tabClick(tab)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab ? 'border-gold-500 text-gold-500' : 'border-transparent text-white/35 hover:text-white/70'}`}>{label}</button>)}</div>
                                <div className="pt-7">
                                    {activeTab === 'timeline' && <div><div className={`mb-5 flex items-center justify-between gap-4 ${isArabic ? 'text-right' : 'text-left'}`}><h3 className="font-serif text-2xl text-white">{copy.timelineTitle}</h3><span className="text-xs text-white/25">4 / 6 {isArabic ? 'مهام' : 'tasks'}</span></div><div className="space-y-3">{copy.timeline.map(([title, body, status], index) => <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4"><div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${index === 0 ? 'bg-emerald-400/10 text-emerald-300' : index === 1 ? 'bg-gold-500/10 text-gold-500' : 'bg-white/5 text-white/35'}`}>{index === 0 ? <Check className="h-4 w-4" /> : index === 1 ? <Clock3 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</div><div className={`min-w-0 flex-1 ${isArabic ? 'text-right' : 'text-left'}`}><p className="font-semibold text-white/75">{title}</p><p className="mt-1 text-sm leading-6 text-white/35">{body}</p></div><span className="shrink-0 text-xs text-white/30">{status}</span></div>)}</div></div>}
                                    {activeTab === 'assets' && <div><div className="mb-5 flex items-center justify-between gap-4"><h3 className="font-serif text-2xl text-white">{copy.tabs.assets}</h3><UploadCloud className="h-5 w-5 text-gold-500" /></div><div className="grid gap-3 sm:grid-cols-2">{copy.files.map((file, index) => <div key={file} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"><FileIcon index={index} /><p className="mt-4 text-sm font-semibold text-white/70">{file}</p><p className="mt-1 text-xs text-white/25">{isArabic ? 'متاح للمراجعة' : 'Available for review'}</p></div>)}</div></div>}
                                    {activeTab === 'reports' && <div className="rounded-2xl border border-gold-500/20 bg-gold-500/[0.05] p-6"><div className="flex items-start gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500"><BarChart3 className="h-5 w-5" /></div><div className={isArabic ? 'text-right' : 'text-left'}><h3 className="font-serif text-2xl text-white">{copy.report}</h3><p className="mt-3 max-w-xl text-sm leading-7 text-white/45">{copy.reportBody}</p><div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/50">ROAS</span><span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/50">CAC</span><span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/50">Conversion rate</span></div></div></div></div>}
                                </div>
                            </div>
                        </div>
                        <div className={`mt-8 flex flex-col gap-5 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between ${isArabic ? 'text-right' : 'text-left'}`}><div className="flex items-start gap-3"><Sparkles className="mt-1 h-4 w-4 shrink-0 text-gold-500" /><p className="max-w-xl text-sm leading-7 text-white/40">{copy.message}</p></div><Link to="/contact" onClick={() => trackAnalyticsEvent('portal_request_clicked', { location: 'portal_preview' })} className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-bold text-obsidian-950 transition hover:bg-white">{copy.contact}<ArrowUpRight className="h-4 w-4" /></Link></div>
                        <p className="mt-5 text-center text-xs text-white/25">{copy.security}</p>
                    </div>
                </section>
            </main>
        </Layout>
    );
};

const KpiCard = ({ icon: Icon, label, value, accent = false }) => <div className={`rounded-2xl border p-4 ${accent ? 'border-emerald-400/20 bg-emerald-400/[0.05]' : 'border-white/8 bg-white/[0.02]'}`}><div className="flex items-center justify-between gap-3"><span className="text-xs text-white/35">{label}</span><Icon className={`h-4 w-4 ${accent ? 'text-emerald-300' : 'text-gold-500'}`} /></div><p className={`mt-4 font-serif text-xl ${accent ? 'text-emerald-300' : 'text-white/75'}`}>{value}</p></div>;
const FileIcon = ({ index }) => <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500">{index === 0 ? <Target className="h-4 w-4" /> : index === 1 ? <FolderOpen className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}</div>;

export default ClientPortal;
