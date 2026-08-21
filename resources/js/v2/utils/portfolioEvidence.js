const portfolioAssets = import.meta.glob('../assets/portfolio_redacted/**/*.{png,jpg,jpeg,webp}', {
    eager: true,
    import: 'default',
    query: '?url',
});

const assetsFor = (folder) => Object.entries(portfolioAssets)
    .filter(([path]) => {
        const p = path.toLowerCase();
        const f = folder.toLowerCase();
        return p.includes(`/${f}/`) || p.includes(`_${f}/`);
    })
    .sort(([a], [b]) => {
        const score = (path) => /\/2\.6\.|\/2\.54\.|\/2\.5\.|\/2\.10\.|\/2\.3\.|\/1\.8\.|\/2500\.|\/10\.png$/i.test(path) ? 0 : 1;
        return score(a) - score(b) || a.localeCompare(b);
    })
    .map(([, url]) => url);

const evidence = {
    'al-owaid': {
        folder: 'al-owaid',
        heroImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'براند العويد للعود', en: 'Al Owaid Oud' },
        category: { ar: 'تسويق الأداء', en: 'Performance Marketing' },
        metric: { ar: '2.62x ROAS', en: '2.62x ROAS' },
        outcome: { ar: 'عائد شراء مثبت', en: 'Verified purchase return' },
        description: {
            ar: 'استراتيجية استحواذ لبراند عطور فاخر على منصة سلة، مع تحسين رحلة الشراء وإعادة الاستهداف.',
            en: 'An acquisition strategy for a premium fragrance brand on Salla, with a sharper purchase journey and retargeting system.',
        },
        challenge: {
            ar: 'كان المطلوب رفع كفاءة الاستحواذ وتحويل الاهتمام بالمنتج إلى عمليات شراء قابلة للقياس.',
            en: 'The brief was to improve acquisition efficiency and turn product interest into measurable purchases.',
        },
        strategy: {
            ar: 'إعادة بناء الرسائل الإبداعية ومسار الشراء، ثم تحسين الحملات بناءً على إشارات السلة والدفع والشراء.',
            en: 'We refined the creative message and purchase path, then optimized campaigns around cart, checkout, and purchase signals.',
        },
        metrics: [
            { ar: 'عائد شراء 2.62x', en: '2.62x purchase ROAS' },
            { ar: '1,137 عملية شراء', en: '1,137 purchases' },
            { ar: '8,274 إضافة إلى السلة', en: '8,274 adds to cart' },
            { ar: 'إنفاق إعلاني $28,268.79', en: '$28,268.79 ad spend' },
        ],
        period: 'Nov 1–29, 2025',
    },
    barner: {
        folder: 'barner',
        heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'براند بارنر', en: 'Barner Brand' },
        category: { ar: 'استحواذ وتحسين ميتا', en: 'Acquisition & Meta Optimization' },
        metric: { ar: '2.10x ROAS', en: '2.10x ROAS' },
        outcome: { ar: '40 عملية شراء', en: '40 purchases' },
        description: {
            ar: 'تحسين حملات الاستحواذ من خلال اختبار الإعلانات والجماهير وربط كل مرحلة من القمع بالشراء.',
            en: 'Acquisition optimization built around creative and audience testing, with each funnel stage tied back to purchase.',
        },
        challenge: {
            ar: 'الحاجة إلى تقليل الهدر الإعلاني وتحويل الإضافات إلى السلة والدفع إلى عمليات شراء أكثر كفاءة.',
            en: 'The challenge was to reduce wasted spend and convert cart and checkout intent into more efficient purchases.',
        },
        strategy: {
            ar: 'تحليل حملات ميتا، إعادة توزيع الإنفاق، وتحسين الإعلانات والجماهير وفقاً لإشارات القمع الفعلية.',
            en: 'We analyzed Meta campaigns, reallocated spend, and improved creative and audiences using real funnel signals.',
        },
        metrics: [
            { ar: 'متوسط عائد شراء 2.10x', en: '2.10x average purchase ROAS' },
            { ar: '40 عملية شراء', en: '40 purchases' },
            { ar: '146 إضافة إلى السلة', en: '146 adds to cart' },
            { ar: 'قيمة شراء $3,223.72', en: '$3,223.72 purchase conversion value' },
        ],
        period: 'Oct 1–31, 2025',
    },
    toyo: {
        folder: 'toyo',
        heroImage: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'تطبيق تويو', en: 'Toyo App' },
        category: { ar: 'هندسة النمو', en: 'Growth Engineering' },
        metric: { ar: 'KWD 2,567.558', en: 'KWD 2,567.558' },
        outcome: { ar: 'إجمالي المبيعات', en: 'Total sales' },
        description: {
            ar: 'توسيع الأداء التجاري لخدمة توصيل مع التركيز على الطلبات، قيمة السلة، وتحسين قابلية التوسع.',
            en: 'Commercial growth for a delivery service focused on orders, basket value, and scalable performance.',
        },
        challenge: {
            ar: 'الحاجة إلى زيادة المبيعات والطلبات مع الحفاظ على كفاءة التشغيل في فترة مقارنة واضحة.',
            en: 'The business needed more sales and orders while maintaining operational efficiency across a comparable period.',
        },
        strategy: {
            ar: 'تحسين الاستحواذ والعروض وقراءة مؤشرات المبيعات والطلبات والمنتجات المباعة لاتخاذ قرارات توسع أفضل.',
            en: 'We improved acquisition and offers while using sales, orders, and product data to guide better scaling decisions.',
        },
        metrics: [
            { ar: 'إجمالي مبيعات KWD 2,567.558', en: 'KWD 2,567.558 total sales' },
            { ar: '130 طلباً', en: '130 orders' },
            { ar: '251 منتجاً مباعاً', en: '251 products sold' },
            { ar: 'متوسط قيمة الطلب KWD 19.320', en: 'KWD 19.320 average order value' },
        ],
        period: 'Mar 1–31, 2025',
    },
    qanatir: {
        folder: 'qanatir',
        heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'براند قناطير الغذائي', en: 'Qanatir Food Brand' },
        category: { ar: 'الإعلانات المدفوعة', en: 'Paid Social' },
        metric: { ar: '2.54x ROAS', en: '2.54x ROAS' },
        outcome: { ar: '22 عملية شراء', en: '22 purchases' },
        description: {
            ar: 'توسيع التجارة الإلكترونية عبر محتوى أداء وحملات مدفوعة تربط الإنفاق بالشراء الفعلي.',
            en: 'E-commerce growth through performance creative and paid campaigns tied to actual purchase outcomes.',
        },
        challenge: {
            ar: 'تحويل الاهتمام بالمنتج الغذائي إلى عمليات شراء قابلة للقياس بميزانية اختبار منضبطة.',
            en: 'The challenge was to turn food-product interest into measurable purchases with disciplined test spend.',
        },
        strategy: {
            ar: 'اختبار الإبداع والجمهور وتحسين الحملات وفقاً لمراحل الدفع والشراء، لا وفقاً للتفاعل السطحي فقط.',
            en: 'We tested creative and audiences, optimizing against checkout and purchase stages rather than surface engagement alone.',
        },
        metrics: [
            { ar: 'عائد شراء 2.54x', en: '2.54x purchase ROAS' },
            { ar: '22 عملية شراء', en: '22 purchases' },
            { ar: 'قيمة شراء $1,249.74', en: '$1,249.74 purchase value' },
            { ar: '175 بدءاً للدفع', en: '175 checkouts started' },
        ],
        period: 'Aug 1–31, 2025',
    },
    jassar: {
        folder: 'jassar',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bbbda595c7c8?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'مؤسسة جسار التجارية', en: 'Jassar Trading' },
        category: { ar: 'تحسين رحلة التحويل', en: 'Conversion Journey' },
        metric: { ar: '3,228 طلباً', en: '3,228 orders' },
        outcome: { ar: 'نمو التجارة', en: 'Commerce growth' },
        description: {
            ar: 'تحسين مسار التجارة وتحويل الزيارات إلى طلبات وعملاء ضمن تجربة قياس واضحة.',
            en: 'A commerce journey optimized to turn visits into orders and customers through clearer measurement.',
        },
        challenge: {
            ar: 'الحاجة إلى فهم القمع التجاري بالكامل من الزيارات وحتى الطلبات والعملاء.',
            en: 'The business needed visibility across the full commerce funnel, from visits to orders and customers.',
        },
        strategy: {
            ar: 'قراءة مسار الزيارة والمنتج والسلة والطلب، مع تحسين نقاط التسرب في تجربة الشراء.',
            en: 'We mapped the visit, product, cart, and order journey, then improved the main drop-off points in the buying experience.',
        },
        metrics: [
            { ar: '3,228 طلباً', en: '3,228 orders' },
            { ar: '137,893 زيارة', en: '137,893 sessions' },
            { ar: '3,177 عميلاً', en: '3,177 customers' },
            { ar: 'إجمالي مبيعات 626,170.85', en: '626,170.85 total sales' },
        ],
        period: null,
    },
    flash: {
        folder: 'flash',
        heroImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'براند فلاش', en: 'Flash Brand' },
        category: { ar: 'نمو متعدد القنوات', en: 'Omnichannel Growth' },
        metric: { ar: '2.34x ROAS', en: '2.34x ROAS' },
        outcome: { ar: '242 عملية شراء', en: '242 purchases' },
        description: {
            ar: 'تحسين الأداء المدفوع عبر حملات مرتبطة بقيمة الشراء ونقاط بدء الدفع.',
            en: 'Paid performance optimization tied to purchase value and checkout-start signals.',
        },
        challenge: {
            ar: 'رفع كفاءة الإنفاق وتحسين نسبة الانتقال من بدء الدفع إلى الشراء.',
            en: 'The goal was to improve spend efficiency and strengthen the path from checkout start to purchase.',
        },
        strategy: {
            ar: 'تطوير الإعلانات والجماهير وتحسين الحملات بناءً على قيمة الشراء والتكلفة لكل بدء دفع.',
            en: 'We improved creative and audiences using purchase value and cost-per-checkout signals.',
        },
        metrics: [
            { ar: 'عائد شراء 2.34x', en: '2.34x purchase ROAS' },
            { ar: '242 عملية شراء', en: '242 purchases' },
            { ar: 'قيمة شراء $15,260.71', en: '$15,260.71 purchase value' },
            { ar: '524 بدءاً للدفع', en: '524 checkouts started' },
        ],
        period: 'May 1–31, 2025',
    },
    kamalz: {
        folder: 'kamalz',
        heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'براند كاملز', en: 'Kamalz Brand' },
        category: { ar: 'تحسين الاستحواذ', en: 'Acquisition Optimization' },
        metric: { ar: '1.89x ROAS', en: '1.89x ROAS' },
        outcome: { ar: '39 عملية شراء', en: '39 purchases' },
        description: {
            ar: 'حملة أداء بإنفاق مضبوط لتحويل الزيارات وبدء الدفع إلى مشتريات قابلة للقياس.',
            en: 'A disciplined performance campaign converting traffic and checkout intent into measurable purchases.',
        },
        challenge: {
            ar: 'اختبار كفاءة الإنفاق وتحسين المراحل السابقة للشراء دون توسيع الميزانية بلا دليل.',
            en: 'The brief was to test spend efficiency and improve pre-purchase stages before scaling the budget.',
        },
        strategy: {
            ar: 'متابعة تكلفة بدء الدفع وقيمة الشراء والعائد، ثم تحسين توزيع الإنفاق على الإعلانات الأفضل.',
            en: 'We tracked checkout cost, purchase value, and return, then shifted spend toward the strongest ads.',
        },
        metrics: [
            { ar: 'عائد شراء 1.89x', en: '1.89x purchase ROAS' },
            { ar: '39 عملية شراء', en: '39 purchases' },
            { ar: 'قيمة شراء $2,823.10', en: '$2,823.10 purchase value' },
            { ar: '173 بدءاً للدفع', en: '173 checkouts started' },
        ],
        period: 'Aug 1–31, 2025',
    },
    manabet: {
        folder: 'manabet',
        heroImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000&auto=format&fit=crop',
        name: { ar: 'منابت', en: 'Manabet' },
        category: { ar: 'نمو التجارة الإلكترونية', en: 'E-commerce Growth' },
        metric: { ar: 'KWD 753.76', en: 'KWD 753.76' },
        outcome: { ar: 'إجمالي المبيعات', en: 'Total sales' },
        description: {
            ar: 'تحسين أداء المتجر عبر متابعة المبيعات والطلبات والزيارات والعملاء في لوحة تشغيل واحدة.',
            en: 'Store performance tracked through a single operating view for sales, orders, visits, and customers.',
        },
        challenge: {
            ar: 'الحاجة إلى رؤية أبسط لما يحدث داخل المتجر من الزيارة إلى الطلب والعميل.',
            en: 'The business needed a clearer view of what happens inside the store from visit to order and customer.',
        },
        strategy: {
            ar: 'ربط مؤشرات المتجر الأساسية في قراءة واحدة تساعد على اتخاذ قرارات نمو أسرع.',
            en: 'We brought the core store signals into one view to support faster growth decisions.',
        },
        metrics: [
            { ar: 'إجمالي مبيعات KWD 753.76', en: 'KWD 753.76 total sales' },
            { ar: '66 طلباً', en: '66 orders' },
            { ar: '2,340 زيارة', en: '2,340 visits' },
            { ar: '60 عميلاً', en: '60 customers' },
        ],
        period: null,
    },
};

export const getEvidenceProject = (slug, lang = 'ar') => {
    const item = evidence[slug];
    if (!item) return null;
    const images = assetsFor(item.folder);
    return {
        id: slug,
        slug,
        name: item.name[lang],
        category: item.category[lang],
        metric: item.metric[lang],
        outcome: item.outcome[lang],
        description: item.description[lang],
        challenge: item.challenge[lang],
        strategy: item.strategy[lang],
        results: item.metrics.map((metric) => metric[lang]),
        metrics: item.metrics.map((metric) => metric[lang]),
        period: item.period,
        evidenceImages: images,
        image: item.heroImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
        evidenceNote: lang === 'ar'
            ? 'الأرقام المعروضة مأخوذة من لقطات لوحات الأداء المقدمة من العميل، والفترة موضحة حيث ظهرت في المصدر.'
            : 'The figures are taken from the supplied performance-dashboard screenshots; the period is shown where visible in the source.',
    };
};

export const getAllEvidenceProjects = (lang = 'ar') => Object.keys(evidence).map((slug) => getEvidenceProject(slug, lang));

export const mergePortfolioProjects = (remoteProjects = [], lang = 'ar') => {
    const localProjects = getAllEvidenceProjects(lang);
    const remoteBySlug = new Map((remoteProjects || []).map((project) => [project.slug, project]));
    const merged = localProjects.map((localProject) => ({ ...remoteBySlug.get(localProject.slug), ...localProject }));
    const remainingRemote = (remoteProjects || []).filter((project) => !evidence[project.slug]);
    return [...merged, ...remainingRemote];
};

export default evidence;
