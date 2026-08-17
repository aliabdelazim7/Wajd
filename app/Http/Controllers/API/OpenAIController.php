<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use OpenAI;

class OpenAIController extends Controller
{
    // POST /api/generate/content
    public function generateContent(Request $request)
    {
        $validated = $request->validate([
            'activityType' => 'required|string',
            'audience' => 'required|string',
            'goal' => 'required|string',
        ]);

        $activityType = $validated['activityType'];
        $audience = $validated['audience'];
        $goal = $validated['goal'];

        $apiKey = env('OPENAI_API_KEY');
        if (empty($apiKey)) {
            Log::warning('OPENAI_API_KEY is not set. Returning fallback content.');
            return response()->json($this->getGenerateFallback($activityType, $audience, $goal));
        }

        try {
            $client = OpenAI::client($apiKey);
            $response = $client->chat()->create([
                'model' => 'gpt-4o-mini', // stable cost-effective model, fallback for gpt-5.4 placeholder
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'أنت خبير تسويق رقمي محترف متخصص في كتابة المحتوى العربي للسوشيال ميديا. تكتب بأسلوب جذاب ومؤثر يناسب المنصات العربية. أجب دائماً بـ JSON فقط بدون أي نص إضافي.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "اكتب محتوى تسويقي احترافي لـ:\n- نوع النشاط: {$activityType}\n- الجمهور المستهدف: {$audience}\n- الهدف التسويقي: {$goal}\n\nأجب بـ JSON فقط بهذا الشكل بالضبط:\n{\"postIdea\":\"فكرة بوست جاهزة للنشر 3 جمل مع CTA\",\"hook\":\"جملة Hook قوية جملة واحدة\",\"adIdea\":\"فكرة إعلان ممول عنوان ووصف مختصر\"}"
                    ]
                ],
                'response_format' => ['type' => 'json_object']
            ]);

            $raw = $response->choices[0]->message->content ?? '';
            $result = json_decode($raw, true);

            return response()->json([
                'postIdea' => $result['postIdea'] ?? $this->generateFallbackItem($activityType, $goal, 'post'),
                'hook' => $result['hook'] ?? $this->generateFallbackItem($activityType, $audience, 'hook'),
                'adIdea' => $result['adIdea'] ?? $this->generateFallbackItem($activityType, $goal, 'ad')
            ]);

        } catch (\Exception $e) {
            Log::error('Content generation failed: ' . $e->getMessage());
            return response()->json($this->getGenerateFallback($activityType, $audience, $goal));
        }
    }

    // POST /api/brand/analyze
    public function analyzeBrand(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|string',
        ]);

        $url = $validated['url'];
        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
            $url = 'https://' . $url;
        }

        $apiKey = env('OPENAI_API_KEY');

        // Scrape page content
        $scrapedContent = '';
        try {
            $response = Http::timeout(10)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ])->get($url);

            if ($response->successful()) {
                $html = $response->body();
                $scrapedContent = $this->parseHtmlSignals($html, $url);
            } else {
                $scrapedContent = "URL: {$url}\nDomain: " . parse_url($url, PHP_URL_HOST);
            }
        } catch (\Exception $fetchErr) {
            Log::warning("Failed to fetch brand page: " . $fetchErr->getMessage());
            $scrapedContent = "URL: {$url}\nDomain: " . parse_url($url, PHP_URL_HOST);
        }

        if (empty($apiKey)) {
            Log::warning('OPENAI_API_KEY is not set. Returning static analysis fallback.');
            return response()->json($this->getBrandAnalysisFallback($url));
        }

        try {
            $client = OpenAI::client($apiKey);
            $response = $client->chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "أنت خبير تسويق رقمي متخصص في تحليل البراند وهوية العلامات التجارية. مهمتك تحليل أي صفحة أو موقع وتقديم تقرير احترافي ومفصل بالعربية.\nتحليلك يجب أن يكون:\n- دقيقاً ومبنياً على المعطيات المتاحة\n- عملياً وقابلاً للتطبيق\n- واضحاً وبأسلوب احترافي\n- باللغة العربية بالكامل"
                    ],
                    [
                        'role' => 'user',
                        'content' => "حلّل البراند التالي بناءً على بيانات الصفحة:\n\n{$scrapedContent}\n\nقدم تحليلاً شاملاً بصيغة JSON فقط:\n{\n  \"brandName\": \"اسم البراند أو الصفحة\",\n  \"brandPersonality\": \"تقييم شخصية البراند وأسلوبه وهويته (2-3 جمل)\",\n  \"strengths\": \"نقاط القوة الرئيسية في البراند (2-3 نقاط)\",\n  \"weaknesses\": \"مجالات تحتاج تحسين (2-3 نقاط)\",\n  \"contentStrategy\": \"توصية لاستراتيجية المحتوى المناسبة (2-3 جمل)\",\n  \"targetAudience\": \"الجمهور المستهدف المحدد أو الموصى به (جملة أو جملتين)\"\n}"
                    ]
                ],
                'response_format' => ['type' => 'json_object']
            ]);

            $raw = $response->choices[0]->message->content ?? '';
            $result = json_decode($raw, true);

            $host = parse_url($url, PHP_URL_HOST);
            return response()->json([
                'brandName' => $result['brandName'] ?? $host,
                'brandPersonality' => $result['brandPersonality'] ?? 'هوية رقمية طموحة تسعى للتميز والمنافسة في السوق.',
                'strengths' => $result['strengths'] ?? 'حضور رقمي واضح وتصميم عصري يعبر عن البراند بشكل جيد.',
                'weaknesses' => $result['weaknesses'] ?? 'حاجة لتحسين معدل التحويل (CRO) وتوضيح المزايا التنافسية.',
                'contentStrategy' => $result['contentStrategy'] ?? 'التركيز على بناء الثقة من خلال آراء العملاء وتوفير محتوى تعليمي.',
                'targetAudience' => $result['targetAudience'] ?? 'الشباب والبالغون المهتمون بالخدمات الرقمية العصرية.'
            ]);

        } catch (\Exception $e) {
            Log::error('Brand analysis failed: ' . $e->getMessage());
            return response()->json($this->getBrandAnalysisFallback($url));
        }
    }

    // Helper to extract clean signals from HTML page
    private function parseHtmlSignals($html, $url)
    {
        // Title
        $title = '';
        if (preg_match('/<title>(.*?)<\/title>/is', $html, $matches)) {
            $title = trim($matches[1]);
        }

        // Meta Description
        $description = '';
        if (preg_match('/<meta\s+[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches)) {
            $description = trim($matches[1]);
        } elseif (preg_match('/<meta\s+[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']/is', $html, $matches)) {
            $description = trim($matches[1]);
        }

        // Headings
        $headings = [];
        if (preg_match_all('/<h[1-3]>(.*?)<\/h[1-3]>/is', $html, $matches)) {
            foreach ($matches[1] as $heading) {
                $cleaned = trim(strip_tags($heading));
                if (!empty($cleaned)) {
                    $headings[] = $cleaned;
                }
            }
        }
        $headingsStr = implode(' | ', array_slice($headings, 0, 10));

        // Strip scripts and styles
        $bodyText = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
        $bodyText = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $bodyText);
        $bodyText = strip_tags($bodyText);
        $bodyText = preg_replace('/\s+/', ' ', $bodyText);
        $bodyText = trim(mb_substr($bodyText, 0, 2000));

        return "URL: {$url}\nTitle: {$title}\nDescription: {$description}\nHeadings: {$headingsStr}\nContent: {$bodyText}";
    }

    private function getGenerateFallback($activity, $audience, $goal)
    {
        return [
            'postIdea' => $this->generateFallbackItem($activity, $goal, 'post'),
            'hook' => $this->generateFallbackItem($activity, $audience, 'hook'),
            'adIdea' => $this->generateFallbackItem($activity, $goal, 'ad')
        ];
    }

    private function generateFallbackItem($activity, $context, $type)
    {
        if ($type === 'hook') {
            return "هل تعرف سر نجاح {$activity} المتميز؟ 🔥";
        }
        if ($type === 'post') {
            return "{$activity} يقدم لك تجربة فريدة ومتميزة لتحقيق {$context}. تواصل معنا اليوم واستفد من عروضنا الحصرية! 💫";
        }
        return "{$activity} — الخيار الأمثل لـ {$context}. احجز الآن واستفد من عرض خاص!";
    }

    private function getBrandAnalysisFallback($url)
    {
        $host = parse_url($url, PHP_URL_HOST);
        return [
            'brandName' => $host,
            'brandPersonality' => 'براند عصري يتطلع لزيادة تواجده الرقمي وتقديم خدمات مميزة لعملائه.',
            'strengths' => 'موقع ذو مظهر جذاب ورابط واضح، يسهل على العملاء الوصول إليه.',
            'weaknesses' => 'حاجة إلى تحسين سرعة الأداء وكتابة نصوص أكثر توجيهاً للمبيعات.',
            'contentStrategy' => 'يُنصح بالتركيز على إبراز قيمة العروض وشهادات العملاء الحقيقيين.',
            'targetAudience' => 'المهتمون بالخدمات المتاحة للبراند في الفئة العمرية ما بين 20 إلى 45 سنة.'
        ];
    }
}
