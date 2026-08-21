import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { startAnalytics, trackRouteView } from './utils/analytics.js';
import Home from './pages/Home.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import About from './pages/About.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Services from './pages/Services.jsx';
import Admin from './pages/Admin.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Error from './pages/Error.jsx';
import { useApp } from './context/AppContext.jsx';

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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<CaseStudy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/services" element={<Services />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
};

export default AppV2;
