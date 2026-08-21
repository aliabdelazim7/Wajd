import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout.jsx';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Target, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getEvidenceProject } from '../utils/portfolioEvidence.js';

const projectsData = {
    'al-owaid': {
        name: 'براند العويد للعود',
        category: 'Performance Marketing',
        metric: '2.6x ROAS',
        outcome: 'Revenue Growth',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
        challenge: 'كان البراند يعاني من ارتفاع تكلفة الاستحواذ (CAC) وضعف في معدل التحويل على منصة سلة رغم جودة المنتج العالية.',
        strategy: 'قمنا بإعادة بناء مسار الشراء بالكامل، مع التركيز على المحتوى الإبداعي الذي يبرز فخامة العود السعودي، وتفعيل استراتيجية إعادة استهداف ذكية.',
        results: [
            'تحقيق عائد إعلاني 2.6x خلال أول 30 يوماً.',
            'زيادة معدل التحويل (CVR) بنسبة 45%.',
            'خفض تكلفة الاستحواذ بنسبة 30%.'
        ]
    },
    'toyo': {
        name: 'تطبيق تويو (Toyo)',
        category: 'Growth Engineering',
        metric: '2,500+',
        outcome: 'Conversions',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop',
        challenge: 'الحاجة إلى توسع سريع وكثيف في مناطق جغرافية محددة داخل المملكة مع الحفاظ على جودة المستخدمين النشطين.',
        strategy: 'هندسة حملات استحواذ تعتمد على البيانات الجغرافية اللحظية، مع تصميم عروض ترويجية مخصصة لكل منطقة لتعظيم معدلات التحميل والطلب.',
        results: [
            'أكثر من 2,500 عملية طلب ناجحة في شهر واحد.',
            'تصدر التطبيق لقائمة الأكثر تحميلاً في الفئة المستهدفة.',
            'تحسين تكلفة الطلب الواحد (CPO) بنسبة 25%.'
        ]
    },
    'qanatir': {
        name: 'براند قناطير الغذائي',
        category: 'Paid Social',
        metric: '2.5x ROAS',
        outcome: 'E-commerce Scale',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
        challenge: 'الرغبة في الانتقال من المبيعات التقليدية إلى التجارة الإلكترونية المباشرة للمستهلك (D2C) وبناء قاعدة عملاء مخلصين.',
        strategy: 'بناء استراتيجية محتوى تعتمد على "سرد القصص الغذائية" لجذب العائلات، مع حملات أداء مركزة على منصات Meta و TikTok.',
        results: [
            'تحقيق ROAS مستدام بمعدل 2.5x.',
            'بناء قاعدة بيانات تضم أكثر من 10,000 عميل مهتم.',
            'نمو المبيعات الشهرية بنسبة 200% في الربع الأول.'
        ]
    }
};

const projectsDataEn = {
    'al-owaid': {
        name: 'Al Owaid Oud', category: 'Performance Marketing', metric: '2.6x ROAS', outcome: 'Revenue Growth',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
        challenge: 'The brand faced a high customer acquisition cost (CAC) and a weak conversion rate on Salla despite strong product quality.',
        strategy: 'We rebuilt the purchase journey around creative that communicates the richness of Saudi oud, then activated a smart retargeting system.',
        results: ['Achieved a 2.6x ROAS within the first 30 days.', 'Increased conversion rate (CVR) by 45%.', 'Reduced acquisition cost by 30%.']
    },
    'toyo': {
        name: 'Toyo App', category: 'Growth Engineering', metric: '2,500+', outcome: 'Conversions',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop',
        challenge: 'The business needed rapid, concentrated expansion across selected regions while preserving the quality of active users.',
        strategy: 'We engineered acquisition campaigns around live geographic data and created localized offers to maximize installs and orders.',
        results: ['More than 2,500 successful orders in one month.', 'Reached the top of the target category’s download rankings.', 'Improved cost per order (CPO) by 25%.']
    },
    'qanatir': {
        name: 'Qanatir Food Brand', category: 'Paid Social', metric: '2.5x ROAS', outcome: 'E-commerce Scale',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
        challenge: 'The brand wanted to move from traditional sales to direct-to-consumer e-commerce and build a loyal customer base.',
        strategy: 'We built a food-storytelling content system for families, supported by focused performance campaigns across Meta and TikTok.',
        results: ['Sustained a 2.5x ROAS.', 'Built a database of more than 10,000 interested customers.', 'Grew monthly sales by 200% in the first quarter.']
    }
};

const CaseStudy = () => {
    const { id } = useParams();
    const { lang } = useApp();
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const textAlign = lang === 'ar' ? 'text-right' : 'text-left';
    const copy = lang === 'ar' ? {
        back: 'العودة للأعمال', keyMetric: 'المؤشر الرئيسي', primaryOutcome: 'النتيجة الأساسية', strategyTitle: 'التحدي والاستراتيجية', challenge: 'التحدي', solution: 'الحل الهندسي', results: 'النتائج المحققة', cta: 'حقق نتائج مشابهة لعملك', loading: 'جاري تحميل دراسة الحالة...'
    } : {
        back: 'Back to work', keyMetric: 'Key metric', primaryOutcome: 'Primary outcome', strategyTitle: 'Challenge and strategy', challenge: 'The challenge', solution: 'The engineered solution', results: 'Results achieved', cta: 'Achieve similar results for your business', loading: 'Loading case study...'
    };
    const [remoteProject, setRemoteProject] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetch(`/api/content/projects/${id}?locale=${lang}`, { headers: { Accept: 'application/json' } })
            .then((response) => response.ok ? response.json() : null)
            .then((payload) => {
                if (mounted) setRemoteProject(payload?.data || null);
            })
            .catch(() => {
                if (mounted) setRemoteProject(null);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, [id, lang]);

    const fallbackProject = (lang === 'ar' ? projectsData : projectsDataEn)[id];
    const remoteProjectView = remoteProject ? {
        ...remoteProject,
        metric: Object.values(remoteProject.results || {})[0] || (lang === 'ar' ? 'أثر مثبت' : 'Proven impact'),
        outcome: lang === 'ar' ? 'النتيجة الأساسية' : 'Primary outcome',
        image: remoteProject.image_url || remoteProject.thumbnail_url,
        results: Array.isArray(remoteProject.results)
            ? remoteProject.results
            : Object.entries(remoteProject.results || {}).map(([key, value]) => `${key}: ${value}`),
    } : fallbackProject;
    const evidenceProject = getEvidenceProject(id, lang);
    const project = evidenceProject || remoteProjectView;

    const heroImage = (evidenceProject && evidenceProject.image) 
        ? (evidenceProject.slug === 'al-owaid' ? 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop' :
           evidenceProject.slug === 'toyo' ? 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop' :
           evidenceProject.slug === 'qanatir' ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' :
           evidenceProject.image)
        : (remoteProjectView.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop');

    if (project && lang === 'ar') {
        const arabicCategories = {
            'al-owaid': 'تسويق الأداء',
            toyo: 'هندسة النمو',
            qanatir: 'الإعلانات المدفوعة',
        };
        const arabicOutcomes = {
            'al-owaid': 'نمو الإيرادات',
            toyo: 'تحويلات',
            qanatir: 'توسع التجارة الإلكترونية',
        };
        project.category = arabicCategories[id] || project.category;
        project.outcome = arabicOutcomes[id] || project.outcome;
    }

    if (!project && loading) return (
        <Layout><div className="min-h-screen flex items-center justify-center text-white/50">{copy.loading}</div></Layout>
    );

    if (!project) return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-white text-2xl font-serif">Project Not Found</h1>
            </div>
        </Layout>
    );

    return (
        <Layout>
            {/* Hero Header */}
            <section className="relative pt-48 pb-20 px-[5%] overflow-hidden" dir={direction}>
                <div className="max-w-6xl mx-auto">
                    <Link to="/portfolio" className="inline-flex items-center gap-2 text-gold-500 hover:text-white transition-colors mb-12 font-arabic">
                        <ArrowLeft className="w-4 h-4 rotate-180" /> {copy.back}
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={textAlign}
                    >
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em] font-medium mb-6 block font-sans">{project.category}</span>
                        <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-12">{project.name}</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5">
                            <div>
                                <p className="text-4xl md:text-6xl font-serif text-gold-500 mb-2">{project.metric}</p>
                                <p className="text-xs uppercase tracking-widest text-white/40 font-sans">{copy.keyMetric}</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-6xl font-serif text-white mb-2">{project.outcome.split(' ')[0]}</p>
                                <p className="text-xs uppercase tracking-widest text-white/40 font-sans">{copy.primaryOutcome}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Image */}
            <section className="px-[5%] pb-24">
                <div className="max-w-7xl mx-auto aspect-video rounded-[3rem] overflow-hidden bg-obsidian-800 border border-white/5 shadow-2xl">
                    <img src={heroImage} alt={project.name} className="w-full h-full object-cover" />
                </div>
            </section>

            {project.evidenceImages?.length ? (
                <section className="px-[5%] pb-24" dir={direction}>
                    <div className="max-w-7xl mx-auto">
                        <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 ${textAlign}`}>
                            <div>
                                <span className="text-gold-500 text-xs uppercase tracking-[0.3em] font-medium mb-4 block font-sans">
                                    {lang === 'ar' ? 'دليل الأداء' : 'PERFORMANCE EVIDENCE'}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif text-white/90">
                                    {lang === 'ar' ? 'الأرقام كما ظهرت في لوحة الأداء' : 'The numbers as reported in the performance dashboard'}
                                </h2>
                            </div>
                            {project.period ? (
                                <p className="text-white/40 text-sm font-sans">{project.period}</p>
                            ) : null}
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.evidenceImages.slice(0, 12).map((image, index) => (
                                <figure key={`${image}-${index}`} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white">
                                    <img src={image} alt={`${project.name} ${lang === 'ar' ? 'نتيجة أداء' : 'performance result'} ${index + 1}`} className="w-full h-auto object-contain" loading={index > 1 ? 'lazy' : 'eager'} />
                                </figure>
                            ))}
                        </div>
                        {project.evidenceNote ? (
                            <p className={`mt-6 text-white/40 text-xs leading-relaxed ${textAlign}`}>{project.evidenceNote}</p>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {/* Strategy Content */}
            <section className="section-padding bg-obsidian-900" dir={direction}>
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24">
                    <div className="text-right">
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white/90">{copy.strategyTitle}</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-gold-500 font-arabic font-bold mb-4 flex items-center gap-2 justify-end">
                                    <Target className="w-5 h-5" /> {copy.challenge}
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed font-arabic">{project.challenge}</p>
                            </div>
                            <div>
                                <h3 className="text-gold-500 font-arabic font-bold mb-4 flex items-center gap-2 justify-end">
                                    <Zap className="w-5 h-5" /> {copy.solution}
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed font-arabic">{project.strategy}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-12 rounded-[3rem] border border-gold-500/10">
                        <h2 className={`text-3xl font-serif mb-10 ${textAlign}`}>{copy.results}</h2>
                        <div className="space-y-6">
                            {project.results.map((res, i) => (
                                <div key={i} className="flex items-start gap-4 justify-end text-right">
                                    <p className="text-white/80 text-xl font-arabic">{res}</p>
                                    <CheckCircle2 className="w-6 h-6 text-gold-500 shrink-0 mt-1" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-12 border-t border-white/5 text-center">
                            <Link to="/contact" className="inline-block bg-gold-500 text-obsidian-950 px-10 py-4 rounded-full font-arabic font-bold text-lg hover:scale-105 transition-transform">
                                {copy.cta}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CaseStudy;
