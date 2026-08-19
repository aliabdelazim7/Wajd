<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo-dark.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>وكالة وجد للتسويق | نُوجِد الأثر الذي يتحول إلى مبيعات</title>
    <meta name="description" content="وجد للتسويق — شريك نمو عملي للمتاجر والبراندات الناشئة في الخليج." />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

    @php
      $manifestPath = public_path('build/manifest.json');
      $manifest = file_exists($manifestPath) ? (json_decode(file_get_contents($manifestPath), true) ?: []) : [];
      $jsEntry = $manifest['resources/js/main.jsx'] ?? null;
      $cssEntry = $manifest['resources/css/app.css'] ?? null;
    @endphp

    @if($jsEntry)
      @if(!empty($jsEntry['css']))
        @foreach($jsEntry['css'] as $cssFile)
          <link rel="stylesheet" href="{{ asset('build/' . $cssFile) }}" />
        @endforeach
      @endif
      @if($cssEntry)
        <link rel="stylesheet" href="{{ asset('build/' . $cssEntry['file']) }}" />
      @endif
      <script type="module" src="{{ asset('build/' . $jsEntry['file']) }}"></script>
    @else
      @viteReactRefresh
      @vite(['resources/js/main.jsx', 'resources/css/app.css'])
    @endif
  </head>
  <body class="bg-[#050505]">
    <div id="root"></div>
  </body>
</html>
