@php
    $manifest = [];
    $manifestPath = public_path('build/manifest.json');
    if (is_file($manifestPath)) {
        $manifest = json_decode((string) file_get_contents($manifestPath), true) ?: [];
    }
    $mainEntry = $manifest['resources/js/main.jsx'] ?? [];
    $mainScript = $mainEntry['file'] ?? null;
    $mainCss = $mainEntry['css'][0] ?? null;
    $appCss = $manifest['resources/css/app.css']['file'] ?? null;
    $locale = request()->cookie('wajd_locale') === 'en' ? 'en' : 'ar';
    $title = $locale === 'en' ? 'Wajd Agency | Tech-Enabled Growth Partner in the Gulf' : 'وكالة وجد | شريك النمو والتقنية في الخليج';
    $description = $locale === 'en'
        ? 'Wajd builds the technical infrastructure and growth systems Gulf stores and ambitious brands need to turn marketing into measurable revenue.'
        : 'وجد شريك نمو عملي للمتاجر والبراندات الطموحة في الخليج: نبني البنية التقنية ونحوّل التسويق إلى مبيعات قابلة للقياس.';
@endphp
<!doctype html>
<html lang="{{ $locale }}" dir="{{ $locale === 'en' ? 'ltr' : 'rtl' }}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo-dark.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index,follow" />
    <meta name="theme-color" content="#050505" />
    <link rel="canonical" href="{{ url('/') }}" />
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Wajd Agency" />
    <meta property="og:locale" content="{{ $locale === 'en' ? 'en_US' : 'ar_SA' }}" />
    <meta property="og:title" content="{{ $title }}" />
    <meta property="og:description" content="{{ $description }}" />
    <meta property="og:url" content="{{ url('/') }}" />
    <meta property="og:image" content="{{ url('/logo-dark.png') }}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{ $title }}" />
    <meta name="twitter:description" content="{{ $description }}" />
    <meta name="twitter:image" content="{{ url('/logo-dark.png') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    @if ($mainCss)<link rel="stylesheet" href="{{ asset('build/' . $mainCss) }}" />@endif
    @if ($appCss)<link rel="stylesheet" href="{{ asset('build/' . $appCss) }}" />@endif
    @if ($mainScript)<script type="module" src="{{ asset('build/' . $mainScript) }}"></script>@endif
    <script type="application/ld+json">{!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        'name' => 'Wajd Agency',
        'alternateName' => 'وكالة وجد',
        'url' => url('/'),
        'logo' => url('/logo-dark.png'),
        'email' => 'mailto:wajd.marketing@gmail.com',
        'areaServed' => ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
        'sameAs' => ['https://linktr.ee/wajd.agency'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
  </head>
  <body class="bg-[#050505]">
    <div id="root"></div>
  </body>
</html>
