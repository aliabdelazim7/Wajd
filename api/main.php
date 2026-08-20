<?php

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?? '/';
$forwardedPath = $_GET['route'] ?? ($_GET['__path'] ?? null);

$isApi = str_starts_with($path, '/api') || 
         str_starts_with($path, '/up') || 
         str_starts_with($path, '/health-check') ||
         (is_string($forwardedPath) && (str_starts_with($forwardedPath, '/api') || str_starts_with($forwardedPath, '/up')));

if ($isApi) {
    if (is_string($forwardedPath) && (str_starts_with($forwardedPath, '/api') || str_starts_with($forwardedPath, '/up'))) {
        $query = $_GET;
        unset($query['route'], $query['__path']);

        $_SERVER['REQUEST_URI'] = $forwardedPath.($query !== [] ? '?'.http_build_query($query) : '');
        $_SERVER['PATH_INFO'] = $forwardedPath;
        $_SERVER['QUERY_STRING'] = http_build_query($query);
    }

    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    $_SERVER['PHP_SELF'] = '/api/index.php';
    $_SERVER['DOCUMENT_URI'] = '/api/index.php';

    define('LARAVEL_START', microtime(true));

    // Ensure /tmp directories exist for Laravel
    if (!is_dir('/tmp/views')) {
        @mkdir('/tmp/views', 0777, true);
    }
    if (!is_dir('/tmp/sessions')) {
        @mkdir('/tmp/sessions', 0777, true);
    }

    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    
    $response = $app->handleRequest(\Illuminate\Http\Request::capture());
    $response->send();
    $app->terminate($response);
    exit;
}

// Load manifest to get hashed asset paths
$manifestPath = __DIR__.'/../public/build/manifest.json';
$assets = [
    'css' => [],
    'js' => ''
];

if (file_exists($manifestPath)) {
    $manifest = json_decode(file_get_contents($manifestPath), true);
    if (isset($manifest['resources/js/main.jsx'])) {
        $assets['js'] = '/build/' . $manifest['resources/js/main.jsx']['file'];
        if (isset($manifest['resources/js/main.jsx']['css'])) {
            foreach ($manifest['resources/js/main.jsx']['css'] as $cssFile) {
                $assets['css'][] = '/build/' . $cssFile;
            }
        }
    }
    if (isset($manifest['resources/css/app.css'])) {
        $assets['css'][] = '/build/' . $manifest['resources/css/app.css']['file'];
    }
}

// For web requests, output HTML directly
?>
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo-dark.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>وكالة وجد | شريك الحلول التقنية والنمو في الخليج</title>
    <meta name="description" content="وكالة وجد (Wajd) — نُهندس الحلول التقنية والنمو للمتاجر والبراندات الطموحة في السعودية والإمارات. تطوير أنظمة SaaS، متاجر إلكترونية، وأداء تسويقي مبني على النتائج." />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

    <?php foreach ($assets['css'] as $css): ?>
    <link rel="stylesheet" href="<?php echo $css; ?>" />
    <?php endforeach; ?>
    
    <?php if ($assets['js']): ?>
    <script type="module" src="<?php echo $assets['js']; ?>"></script>
    <?php endif; ?>

    <!-- Organization & Service Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Wajd Agency",
      "alternateName": "وكالة وجد",
      "url": "https://www.wajd-agency.com",
      "logo": "https://www.wajd-agency.com/logo-dark.png",
      "description": "Tech-Enabled Growth Partner specializing in SaaS development and performance marketing for the Gulf market.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Riyadh",
        "addressCountry": "SA"
      },
      "sameAs": [
        "https://linktr.ee/wajd.agency"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Wajd Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "SaaS & POS Development",
              "description": "Custom software solutions for retail and enterprise management."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "E-commerce Infrastructure",
              "description": "Full setup and optimization for Salla, Zid, and Shopify."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Performance Marketing",
              "description": "ROI-focused digital advertising across all major platforms."
            }
          }
        ]
      }
    }
    </script>
  </head>
  <body class="bg-[#050505]">
    <div id="root"></div>
  </body>
</html>
