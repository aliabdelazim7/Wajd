<?php

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?? '/';

// If it's an API request, boot Laravel
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

// For all web requests, serve the high-performance static HTML shell for the React SPA
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

    <link rel="stylesheet" href="/build/assets/main-CDPVEH3C.css" />
    <link rel="stylesheet" href="/build/assets/app-B-MMahtO.css" />
    <script type="module" src="/build/assets/main-BRmYZbHa.js"></script>

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
