<?php

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?? '/';

// If it's an API request, boot Laravel.
if (str_starts_with($path, '/api') || str_starts_with($path, '/up')) {
    define('LARAVEL_START', microtime(true));

    if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
        require $maintenance;
    }

    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $response = $app->handleRequest(\Illuminate\Http\Request::capture());
    $response->send();
    $app->terminate($response);
    exit;
}

$siteUrl = 'https://www.wajd-agency.com';
$requestedLocale = strtolower((string) ($_GET['lang'] ?? ($_COOKIE['wajd_locale'] ?? 'ar')));
$locale = in_array($requestedLocale, ['ar', 'en'], true) ? $requestedLocale : 'ar';
$isEnglish = $locale === 'en';
$dir = $isEnglish ? 'ltr' : 'rtl';

$meta = [
    '/' => [
        'ar' => ['title' => 'وكالة وجد | شريك النمو والتقنية في الخليج', 'description' => 'وجد شريك نمو عملي للمتاجر والبراندات الطموحة في الخليج: نبني البنية التقنية ونحوّل التسويق إلى مبيعات قابلة للقياس.'],
        'en' => ['title' => 'Wajd Agency | Tech-Enabled Growth Partner in the Gulf', 'description' => 'Wajd builds the technical infrastructure and growth systems Gulf stores and ambitious brands need to turn marketing into measurable revenue.'],
    ],
    'about' => [
        'ar' => ['title' => 'عن وجد | شريك نمو وتقنية للعلامات الخليجية', 'description' => 'تعرّف على منهجية وجد في ربط الاستراتيجية والتقنية والتسويق داخل منظومة نمو واحدة.'],
        'en' => ['title' => 'About Wajd | Growth & Technology Partner for Gulf Brands', 'description' => 'Discover how Wajd connects strategy, technology, and marketing into one practical growth system.'],
    ],
    'services' => [
        'ar' => ['title' => 'خدمات وجد | تسويق وتقنية وأنظمة نمو', 'description' => 'من التسويق بالأداء والمتاجر إلى Market POS وLiftDesk والأتمتة: اختر ما تحتاجه وابنِ منظومة نموك.'],
        'en' => ['title' => 'Wajd Services | Marketing, Technology & Growth Systems', 'description' => 'From performance marketing and commerce to Market POS, LiftDesk, and automation: build the growth system your business needs.'],
    ],
    'portfolio' => [
        'ar' => ['title' => 'أعمال وجد | دراسات حالة للنمو والتقنية', 'description' => 'استعرض مشاريع وجد في التسويق بالأداء، التجارة الإلكترونية، الأنظمة المخصصة، والأتمتة.'],
        'en' => ['title' => 'Wajd Work | Growth & Technology Case Studies', 'description' => 'Explore Wajd case studies across performance marketing, commerce, custom systems, and automation.'],
    ],
    'contact' => [
        'ar' => ['title' => 'تواصل مع وجد | ابنِ منظومة نموك', 'description' => 'شاركنا هدفك، واختر الخطة والوحدات التي تحتاجها، وسنقترح لك منظومة نمو عملية تناسب مرحلتك.'],
        'en' => ['title' => 'Contact Wajd | Build Your Growth System', 'description' => 'Tell us what you are building, choose the modules you need, and get a practical growth-system recommendation.'],
    ],
    'privacy' => [
        'ar' => ['title' => 'سياسة الخصوصية | وكالة وجد', 'description' => 'تعرف على طريقة تعامل وكالة وجد مع بيانات زوار الموقع والعملاء المحتملين.'],
        'en' => ['title' => 'Privacy Policy | Wajd Agency', 'description' => 'Learn how Wajd Agency handles website visitor and prospective client information.'],
    ],
];

$segments = trim($path, '/');
$routeKey = $segments === '' ? '/' : explode('/', $segments)[0];
$pageMeta = $meta[$routeKey][$locale] ?? $meta['/'][$locale];
$title = $pageMeta['title'];
$description = $pageMeta['description'];
$canonicalPath = $path === '/' ? '/' : '/' . trim($path, '/');
$canonical = $siteUrl . $canonicalPath;
$robots = str_starts_with($path, '/admin') ? 'noindex,nofollow' : 'index,follow';

$manifest = [];
$manifestPath = __DIR__ . '/build/manifest.json';
if (is_file($manifestPath)) {
    $decodedManifest = json_decode((string) file_get_contents($manifestPath), true);
    if (is_array($decodedManifest)) {
        $manifest = $decodedManifest;
    }
}
$mainEntry = $manifest['resources/js/main.jsx'] ?? [];
$mainScript = $mainEntry['file'] ?? 'assets/main-YndK74aO.js';
$mainCss = $mainEntry['css'][0] ?? null;
$appEntry = $manifest['resources/css/app.css'] ?? [];
$appCss = $appEntry['file'] ?? null;

$faqItems = $isEnglish ? [
    ['question' => 'What ad budget do you recommend to start?', 'answer' => 'We start with a focused test from SAR 1,000 to 2,000, then increase spend only when the data shows what works.'],
    ['question' => 'When can I expect to see tangible results?', 'answer' => 'Early indicators can appear in the first week, while a meaningful growth cycle usually needs 60–90 days to build a scalable base.'],
    ['question' => 'Do you provide creative content production?', 'answer' => 'Yes. We design visual assets built for attention and conversion, connecting creative decisions to audience data.'],
    ['question' => 'How do you ensure data transparency?', 'answer' => 'We keep performance visible and explain where every riyal goes and which decisions are producing a return.'],
] : [
    ['question' => 'ما هي الميزانية الإعلانية التي تنصحون بها للبدء؟', 'answer' => 'نبدأ باختبار إعلاني من 1,000 إلى 2,000 ريال، ثم نزيد الاستثمار فقط عندما تظهر مؤشرات واضحة على ما يعمل.'],
    ['question' => 'متى يمكنني توقع رؤية نتائج ملموسة؟', 'answer' => 'تظهر مؤشرات الأداء الأولى خلال الأسبوع الأول، بينما تحتاج دورة النمو الكاملة عادةً إلى 60–90 يوماً لبناء أساس قابل للتوسع.'],
    ['question' => 'هل تقدمون خدمات صناعة المحتوى الإبداعي؟', 'answer' => 'نعم، نصمم أصولاً بصرية موجهة لجذب الانتباه والتحويل، مع ربط الإبداع بما تظهره بيانات الجمهور.'],
    ['question' => 'كيف تضمنون شفافية الأرقام والبيانات؟', 'answer' => 'نشاركك مؤشرات الأداء بوضوح ونشرح أين يذهب كل ريال وما الذي يحقق عائداً فعلياً.'],
];

$schema = [
    '@context' => 'https://schema.org',
    '@graph' => [
        [
            '@type' => ['Organization', 'LocalBusiness'],
            '@id' => $siteUrl . '/#organization',
            'name' => 'Wajd Agency',
            'alternateName' => 'وكالة وجد',
            'url' => $siteUrl,
            'logo' => $siteUrl . '/logo-dark.png',
            'description' => 'Tech-enabled growth partner for Gulf brands, stores, and ambitious operators.',
            'email' => 'mailto:wajd.marketing@gmail.com',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => 'Riyadh',
                'addressCountry' => 'SA',
            ],
            'areaServed' => ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
            'sameAs' => ['https://linktr.ee/wajd.agency'],
        ],
        [
            '@type' => 'WebSite',
            '@id' => $siteUrl . '/#website',
            'url' => $siteUrl,
            'name' => 'Wajd Agency',
            'publisher' => ['@id' => $siteUrl . '/#organization'],
            'inLanguage' => $locale === 'ar' ? 'ar' : 'en',
        ],
        [
            '@type' => 'FAQPage',
            '@id' => $siteUrl . '/#faq',
            'mainEntity' => array_map(static fn (array $item) => [
                '@type' => 'Question',
                'name' => $item['question'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['answer']],
            ], $faqItems),
        ],
        [
            '@type' => 'OfferCatalog',
            '@id' => $siteUrl . '/services#catalog',
            'name' => 'Wajd Growth Engine',
            'itemListElement' => [
                ['@type' => 'Offer', 'priceCurrency' => 'SAR', 'price' => '350', 'itemOffered' => ['@type' => 'Service', 'name' => 'Starter Growth Plan']],
                ['@type' => 'Offer', 'priceCurrency' => 'SAR', 'price' => '950', 'itemOffered' => ['@type' => 'Service', 'name' => 'Growth Plan']],
                ['@type' => 'Offer', 'priceCurrency' => 'SAR', 'price' => '2200', 'itemOffered' => ['@type' => 'Service', 'name' => 'Partner Growth Plan']],
                ['@type' => 'Service', 'name' => 'Market POS and custom operating systems'],
                ['@type' => 'Service', 'name' => 'LiftDesk AI automation'],
                ['@type' => 'Service', 'name' => 'Shopify, Salla, and Zid commerce infrastructure'],
                ['@type' => 'Service', 'name' => 'Performance marketing and acquisition systems'],
            ],
        ],
    ],
];
?>
<!doctype html>
<html lang="<?= htmlspecialchars($locale, ENT_QUOTES, 'UTF-8') ?>" dir="<?= htmlspecialchars($dir, ENT_QUOTES, 'UTF-8') ?>">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo-dark.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="<?= htmlspecialchars($robots, ENT_QUOTES, 'UTF-8') ?>" />
    <meta name="theme-color" content="#050505" />
    <link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>" />
    <link rel="alternate" hreflang="ar" href="<?= htmlspecialchars($canonicalPath === '/' ? $siteUrl . '/?lang=ar' : $siteUrl . $canonicalPath . '?lang=ar', ENT_QUOTES, 'UTF-8') ?>" />
    <link rel="alternate" hreflang="en" href="<?= htmlspecialchars($canonicalPath === '/' ? $siteUrl . '/?lang=en' : $siteUrl . $canonicalPath . '?lang=en', ENT_QUOTES, 'UTF-8') ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= htmlspecialchars($siteUrl . $canonicalPath, ENT_QUOTES, 'UTF-8') ?>" />

    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
    <meta name="description" content="<?= htmlspecialchars($description, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Wajd Agency" />
    <meta property="og:locale" content="<?= $isEnglish ? 'en_US' : 'ar_SA' ?>" />
    <meta property="og:title" content="<?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($description, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:image" content="<?= $siteUrl ?>/logo-dark.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?>" />
    <meta name="twitter:description" content="<?= htmlspecialchars($description, ENT_QUOTES, 'UTF-8') ?>" />
    <meta name="twitter:image" content="<?= $siteUrl ?>/logo-dark.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

    <?php if ($mainCss): ?><link rel="stylesheet" href="/build/<?= htmlspecialchars($mainCss, ENT_QUOTES, 'UTF-8') ?>" /><?php endif; ?>
    <?php if ($appCss): ?><link rel="stylesheet" href="/build/<?= htmlspecialchars($appCss, ENT_QUOTES, 'UTF-8') ?>" /><?php endif; ?>
    <script type="module" src="/build/<?= htmlspecialchars($mainScript, ENT_QUOTES, 'UTF-8') ?>"></script>
    <script type="application/ld+json"><?= json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
  </head>
  <body class="bg-[#050505]">
    <div id="root"></div>
  </body>
</html>
