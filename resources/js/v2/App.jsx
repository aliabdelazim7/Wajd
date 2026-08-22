import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { startAnalytics, trackRouteView } from './utils/analytics.js';
import ScrollToTop from './components/ScrollToTop.jsx';
import { useApp } from './context/AppContext.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const CaseStudy = lazy(() => import('./pages/CaseStudy.jsx'));
const ClientPortal = lazy(() => import('./pages/ClientPortal.jsx'));
const GrowthInsights = lazy(() => import('./pages/GrowthInsights.jsx'));
const Error = lazy(() => import('./pages/Error.jsx'));
const RouteLoading = () => {
    const { lang } = useApp();
    const isArabic = lang === 'ar';

    return (
        <main dir={isArabic ? 'rtl' : 'ltr'} className="flex min-h-screen items-center justify-center bg-[#0b0b0a] px-6 text-center text-white">
            <div role="status" aria-live="polite">
                <span className="mb-4 block text-xs font-semibold tracking-[0.28em] text-gold-500">WAJD</span>
                <p className="font-serif text-2xl text-white/80">{isArabic ? 'بنجهز لك الصفحة...' : 'Preparing your page...'}</p>
            </div>
        </main>
    );
};

const pageMeta = {
    '/': {
        ar: { title: 'وكالة وجد | شريك النمو والتقنية في الخليج', description: 'وجد شريك نمو عملي للمتاجر والبراندات الطموحة في الخليج: نبني البنية التقنية ونحوّل التسويق إلى مبيعات قابلة للقياس.' },
        en: { title: 'Wajd Agency | Tech-Enabled Growth Partner in the Gulf', description: 'Wajd builds the technical infrastructure and growth systems Gulf stores and ambitious brands need to turn marketing into measurable revenue.' },
    },
    '/about': {
        ar: { title: 'عن وجد | شريك نمو وتقنية للعلامات الخليجية', description: 'تعرّف على منهجية وجد في ربط الاستراتيجية والتقنية والتسويق داخل منظومة نمو واحدة.' },
        en: { title: 'About Wajd | Growth & Technology Partner for Gulf Brands', description: 'Discover how Wajd connects strategy, technology, and marketing into one practical growth system.' },
    },
    '/services': {
        ar: { title: 'خدمات وجد | تسويق وتقنية وأنظمة نمو', description: 'من التسويق بالأداء والمتاجر إلى Market POS وLiftDesk والأتمتة: اختر ما تحتاجه وابنِ منظومة نموك.' },
        en: { title: 'Wajd Services | Marketing, Technology & Growth Systems', description: 'From performance marketing and commerce to Market POS, LiftDesk, and automation: build the growth system your business needs.' },
    },
    '/portfolio': {
        ar: { title: 'أعمال وجد | دراسات حالة للنمو والتقنية', description: 'استعرض مشاريع وجد في التسويق بالأداء، التجارة الإلكترونية، الأنظمة المخصصة، والأتمتة.' },
        en: { title: 'Wajd Work | Growth & Technology Case Studies', description: 'Explore Wajd case studies across performance marketing, commerce, custom systems, and automation.' },
    },
    '/contact': {
        ar: { title: 'تواصل مع وجد | ابنِ منظومة نموك', description: 'شاركنا هدفك، واختر الخطة والوحدات التي تحتاجها، وسنقترح لك منظومة نمو عملية تناسب مرحلتك.' },
        en: { title: 'Contact Wajd | Build Your Growth System', description: 'Tell us what you are building, choose the modules you need, and get a practical growth-system recommendation.' },
    },
    '/privacy': {
        ar: { title: 'سياسة الخصوصية | وكالة وجد', description: 'تعرف على طريقة تعامل وكالة وجد مع بيانات زوار الموقع والعملاء المحتملين.' },
        en: { title: 'Privacy Policy | Wajd Agency', description: 'Learn how Wajd Agency handles website visitor and prospective client information.' },
    },
    '/portal': {
        ar: { title: 'بوابة العميل | وكالة وجد', description: 'معاينة بوابة وجد لمتابعة تقدم المشروع والملفات والتقارير والقرارات القادمة في مساحة واحدة.' },
        en: { title: 'Client Portal Preview | Wajd Agency', description: 'Preview Wajd’s client workspace for project progress, files, reports, and next decisions.' },
    },
    '/insights': {
        ar: { title: 'رؤى النمو | وكالة وجد', description: 'أفكار عملية عن التسويق والتقنية والقياس والتجارة في السوق الخليجي، بمصادر واضحة وبدون وعود عامة.' },
        en: { title: 'Growth Insights | Wajd Agency', description: 'Practical, source-backed ideas on marketing, technology, measurement, and commerce in the Gulf.' },
    },
};

const ensureMeta = (selector, attribute, value) => {
    let node = document.head.querySelector(selector);
    if (!node) {
        node = document.createElement('meta');
        node.setAttribute(attribute, selector.includes('property=') ? selector.split('property="')[1].split('"')[0] : selector.split('name="')[1].split('"')[0]);
        document.head.appendChild(node);
    }
    node.setAttribute('content', value);
};

const ensureLink = (rel, hreflang, href) => {
    const selector = hreflang ? `link[rel="alternate"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let node = document.head.querySelector(selector);
    if (!node) {
        node = document.createElement('link');
        node.rel = rel;
        if (hreflang) node.hreflang = hreflang;
        document.head.appendChild(node);
    }
    node.href = href;
};

const AnalyticsManager = () => {
    const { lang } = useApp();
    const location = useLocation();

    useEffect(() => startAnalytics(), []);

    useEffect(() => {
        if (!location.pathname.startsWith('/admin')) {
            trackRouteView(location.pathname, lang);
        }
    }, [lang, location.pathname]);

    return null;
};

const SeoManager = () => {
    const { lang } = useApp();
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const isAdmin = pathname.startsWith('/admin');
        const routeKey = pathname.startsWith('/portfolio/') ? '/portfolio' : pathname;
        const content = pageMeta[routeKey]?.[lang] || pageMeta['/'][lang];
        const origin = window.location.origin;
        const canonical = `${origin}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
        const arUrl = `${origin}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}?lang=ar`;
        const enUrl = `${origin}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}?lang=en`;

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.title = isAdmin ? 'Wajd CMS | لوحة التحكم' : content.title;
        ensureMeta('meta[name="description"]', 'name', content.description);
        ensureMeta('meta[property="og:title"]', 'property', content.title);
        ensureMeta('meta[property="og:description"]', 'property', content.description);
        ensureMeta('meta[property="og:url"]', 'property', canonical);
        ensureMeta('meta[property="og:locale"]', 'property', lang === 'ar' ? 'ar_SA' : 'en_US');
        ensureMeta('meta[name="twitter:title"]', 'name', content.title);
        ensureMeta('meta[name="twitter:description"]', 'name', content.description);
        ensureMeta('meta[name="robots"]', 'name', isAdmin ? 'noindex,nofollow' : 'index,follow');
        ensureLink('canonical', null, canonical);
        ensureLink('alternate', 'ar', arUrl);
        ensureLink('alternate', 'en', enUrl);
        ensureLink('alternate', 'x-default', `${origin}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`);
    }, [lang, location.pathname]);

    return null;
};

const AppV2 = () => {
    return (
        <Router>
            <ScrollToTop />
            <AnalyticsManager />
            <SeoManager />
            <Suspense fallback={<RouteLoading />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/:id" element={<CaseStudy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/portal" element={<ClientPortal />} />
                    <Route path="/insights" element={<GrowthInsights />} />
                    <Route path="/insights/:slug" element={<GrowthInsights />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppV2;
