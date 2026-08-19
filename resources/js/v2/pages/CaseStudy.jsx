import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout.jsx';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Target, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

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

const CaseStudy = () => {
    const { id } = useParams();
    const { lang } = useApp();
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

    const fallbackProject = projectsData[id];
    const project = remoteProject ? {
        ...remoteProject,
        metric: Object.values(remoteProject.results || {})[0] || (lang === 'ar' ? 'أثر مثبت' : 'Proven impact'),
        outcome: lang === 'ar' ? 'النتيجة الأساسية' : 'Primary outcome',
        image: remoteProject.image_url || remoteProject.thumbnail_url,
        results: Array.isArray(remoteProject.results)
            ? remoteProject.results
            : Object.entries(remoteProject.results || {}).map(([key, value]) => `${key}: ${value}`),
    } : fallbackProject;

    if (!project && loading) return (
        <Layout><div className="min-h-screen flex items-center justify-center text-white/50">جاري تحميل دراسة الحالة...</div></Layout>
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
            <section className="relative pt-48 pb-20 px-[5%] overflow-hidden" dir="rtl">
                <div className="max-w-6xl mx-auto">
                    <Link to="/portfolio" className="inline-flex items-center gap-2 text-gold-500 hover:text-white transition-colors mb-12 font-arabic">
                        <ArrowLeft className="w-4 h-4 rotate-180" /> العودة للأعمال
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-right"
                    >
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em] font-medium mb-6 block font-sans">{project.category}</span>
                        <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-12">{project.name}</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5">
                            <div>
                                <p className="text-4xl md:text-6xl font-serif text-gold-500 mb-2">{project.metric}</p>
                                <p className="text-xs uppercase tracking-widest text-white/40 font-sans">Key Metric</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-6xl font-serif text-white mb-2">{project.outcome.split(' ')[0]}</p>
                                <p className="text-xs uppercase tracking-widest text-white/40 font-sans">Primary Outcome</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Image */}
            <section className="px-[5%] pb-24">
                <div className="max-w-7xl mx-auto aspect-video rounded-[3rem] overflow-hidden bg-obsidian-800 border border-white/5 shadow-2xl">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                </div>
            </section>

            {/* Strategy Content */}
            <section className="section-padding bg-obsidian-900" dir="rtl">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24">
                    <div className="text-right">
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white/90">التحدي والاستراتيجية</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-gold-500 font-arabic font-bold mb-4 flex items-center gap-2 justify-end">
                                    <Target className="w-5 h-5" /> التحدي
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed font-arabic">{project.challenge}</p>
                            </div>
                            <div>
                                <h3 className="text-gold-500 font-arabic font-bold mb-4 flex items-center gap-2 justify-end">
                                    <Zap className="w-5 h-5" /> الحل الهندسي
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed font-arabic">{project.strategy}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-12 rounded-[3rem] border border-gold-500/10">
                        <h2 className="text-3xl font-serif mb-10 text-right">النتائج المحققة</h2>
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
                                حقق نتائج مشابهة لعملك
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CaseStudy;
