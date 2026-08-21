import { useMemo, useState } from 'react';
import { ArrowUpRight, PlayCircle, Quote, ShieldCheck, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { trackAnalyticsEvent } from '../utils/analytics.js';

const SocialProof = ({ projects = [] }) => {
    const { lang, content } = useApp();
    const isArabic = lang === 'ar';
    const [activeVideo, setActiveVideo] = useState(null);
    const configuredVideos = content?.settings?.social_proof?.videos || [];
    const videos = useMemo(() => configuredVideos.filter((video) => video?.src && video?.title), [configuredVideos]);
    const copy = isArabic ? {
        eyebrow: 'الدليل قبل الكلام',
        title: 'نشوف الأثر، مش بس نسمع الوعود.',
        body: 'النتيجة القوية تحتاج سياقاً: ماذا كان التحدي؟ ماذا بنينا؟ وما الذي تغيّر فعلاً؟ لذلك نجمع بين شهادات العملاء، لقطات الأنظمة، ودراسات الحالة القابلة للمراجعة.',
        videoTitle: 'شهادات العملاء بالفيديو',
        videoEmpty: 'أضف أول شهادة فيديو من لوحة التحكم لتظهر هنا بجانب الدليل العملي.',
        videoCta: 'أرسل لنا قصة عميلك',
        evidence: 'دليل أعمال قابل للمراجعة',
        evidenceEmpty: 'استكشف دراسات الحالة لرؤية الاستراتيجية والنتائج والمواد الداعمة.',
        open: 'شاهد الدراسة',
        disclaimer: 'كل نتيجة مرتبطة بسياق المشروع، واللقطات المعروضة لا تمثل وعداً بنتيجة مستقبلية.',
    } : {
        eyebrow: 'PROOF BEFORE PROMISES',
        title: 'See the work. Then hear the story.',
        body: 'A strong outcome needs context: what was broken, what we built, and what actually changed. That is why Wajd combines client stories, system walkthroughs, and reviewable case studies.',
        videoTitle: 'Video testimonials',
        videoEmpty: 'Add your first video testimonial from the CMS and it will appear here beside the practical proof.',
        videoCta: 'Share a client story',
        evidence: 'Reviewable work evidence',
        evidenceEmpty: 'Explore the case studies to see strategy, outcomes, and supporting assets.',
        open: 'Open case study',
        disclaimer: 'Every outcome is context-dependent. Displayed evidence is not a promise of future performance.',
    };

    return <section className="section-padding bg-[#10100e]" dir={isArabic ? 'rtl' : 'ltr'}><div className="mx-auto max-w-7xl"><div className={`mb-14 max-w-3xl ${isArabic ? 'mr-0 text-right' : 'ml-0 text-left'}`}><span className="mb-5 block text-xs font-semibold tracking-[0.28em] text-gold-500">{copy.eyebrow}</span><h2 className="font-serif text-4xl leading-tight md:text-6xl">{copy.title}</h2><p className="mt-6 text-base leading-8 text-white/45 md:text-lg">{copy.body}</p></div><div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div className="rounded-[2rem] border border-gold-500/20 bg-gold-500/[0.045] p-6 md:p-8"><div className="mb-8 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500"><Video className="h-5 w-5" /></div><h3 className="font-serif text-2xl">{copy.videoTitle}</h3></div><span className="text-[10px] uppercase tracking-[0.18em] text-white/25">{videos.length ? `${videos.length} ${isArabic ? 'فيديو' : 'videos'}` : 'CMS ready'}</span></div>{videos.length ? <div className="space-y-5">{videos.map((video, index) => <div key={`${video.src}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"><div className="relative aspect-video bg-black"><video controls preload="metadata" poster={video.poster || undefined} className="h-full w-full object-cover" onPlay={() => { setActiveVideo(index); trackAnalyticsEvent('video_testimonial_played', { video_id: video.id || index }); }}><source src={video.src} type={video.type || 'video/mp4'} /></video>{activeVideo === index && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white/70">{isArabic ? 'قيد التشغيل' : 'Playing'}</span>}</div><div className="p-4"><p className="font-semibold text-white/80">{isArabic ? video.title_ar || video.title : video.title_en || video.title}</p>{(video.role || video.company) && <p className="mt-1 text-xs text-white/35">{[video.role, video.company].filter(Boolean).join(' · ')}</p>}</div></div>)}</div> : <div className="flex min-h-[265px] flex-col items-center justify-center text-center"><PlayCircle className="mb-5 h-12 w-12 text-gold-500/70" /><p className="max-w-sm text-sm leading-7 text-white/45">{copy.videoEmpty}</p><Link to="/contact" onClick={() => trackAnalyticsEvent('testimonial_cta_clicked', { location: 'social_proof' })} className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-5 py-3 text-sm font-bold text-gold-500 transition hover:bg-gold-500 hover:text-obsidian-950">{copy.videoCta}<ArrowUpRight className="h-4 w-4" /></Link></div>}</div><div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 md:p-8"><div className="mb-8 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><ShieldCheck className="h-5 w-5" /></div><h3 className="font-serif text-2xl">{copy.evidence}</h3></div>{projects.length ? <div className="space-y-3">{projects.slice(0, 3).map((project, index) => <motion.div key={project.id || index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex items-center gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5"><img src={project.image} alt={project.name} loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-black/25" /></div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-white/75">{project.name}</p><p className="mt-1 truncate text-xs text-white/35">{project.metric}</p></div><Link to={`/portfolio/${project.id}`} onClick={() => trackAnalyticsEvent('case_study_opened_from_proof', { project_id: project.id })} className="shrink-0 text-white/35 transition hover:text-gold-500" aria-label={`${copy.open}: ${project.name}`}><ArrowUpRight className="h-5 w-5" /></Link></motion.div>)}</div> : <p className="text-sm leading-7 text-white/45">{copy.evidenceEmpty}</p>}<div className="mt-8 flex items-start gap-3 border-t border-white/8 pt-6"><Quote className="mt-1 h-4 w-4 shrink-0 text-gold-500" /><p className="text-xs leading-6 text-white/30">{copy.disclaimer}</p></div></div></div></div></section>;
};

export default SocialProof;
