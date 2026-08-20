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

    @php
      $manifestPath = public_path('build/manifest.json');
      $manifest = [];
      if (file_exists($manifestPath)) {
          $content = file_get_contents($manifestPath);
          $manifest = json_decode($content, true) ?: [];
      }
      
      $jsFile = $manifest['resources/js/main.jsx']['file'] ?? 'assets/main-BRmYZbHa.js';
      $cssFile1 = $manifest['resources/js/main.jsx']['css'][0] ?? 'assets/main-CDPVEH3C.css';
      $cssFile2 = $manifest['resources/css/app.css']['file'] ?? 'assets/app-B-MMahtO.css';
    @endphp

    <link rel="stylesheet" href="{{ asset('build/' . $cssFile1) }}" />
    <link rel="stylesheet" href="{{ asset('build/' . $cssFile2) }}" />
    <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>

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
