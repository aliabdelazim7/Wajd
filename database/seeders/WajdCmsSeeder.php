<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use App\Models\Faq;
use App\Models\Package;
use App\Models\PackageAddon;
use App\Models\PortfolioProject;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class WajdCmsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'brand' => [
                'name' => 'Wajd Agency',
                'name_ar' => 'وكالة وجد',
                'slogan_ar' => 'وَجْدٌ... لِلنَّتَائِجِ وُجِدْ.',
                'slogan_en' => 'Built for outcomes that matter.',
                'market' => 'Gulf',
                'currency' => 'SAR',
            ],
            'contact' => [
                'email' => 'wajd.marketing@gmail.com',
                'location_ar' => 'الرياض، المملكة العربية السعودية',
                'location_en' => 'Riyadh, Kingdom of Saudi Arabia',
                'instagram' => 'https://www.instagram.com/wajdagency',
                'linkedin' => 'https://www.linkedin.com/company/wajdagency',
                'facebook' => 'https://www.facebook.com/profile.php?id=61562980695038',
            ],
            'navigation' => [
                'links' => [
                    ['path' => '/', 'label_ar' => 'الرئيسية', 'label_en' => 'Home'],
                    ['path' => '/about', 'label_ar' => 'عن وجد', 'label_en' => 'About'],
                    ['path' => '/services', 'label_ar' => 'الخدمات', 'label_en' => 'Services'],
                    ['path' => '/portfolio', 'label_ar' => 'الأعمال', 'label_en' => 'Portfolio'],
                    ['path' => '/insights', 'label_ar' => 'رؤى النمو', 'label_en' => 'Insights'],
                    ['path' => '/contact', 'label_ar' => 'تواصل معنا', 'label_en' => 'Contact'],
                ],
                'cta_ar' => 'ابدأ محادثة',
                'cta_en' => 'Start a conversation',
            ],
            'form_options' => [
                'services' => [
                    ['value' => 'growth-engine', 'label_ar' => 'بناء منظومة نمو مخصصة', 'label_en' => 'Build a custom growth engine'],
                    ['value' => 'saas-pos', 'label_ar' => 'تطوير نظام SaaS / POS', 'label_en' => 'SaaS / POS Development'],
                    ['value' => 'ecommerce-setup', 'label_ar' => 'تجهيز متجر Salla / Zid / Shopify', 'label_en' => 'E-commerce Setup (Salla / Zid / Shopify)'],
                    ['value' => 'paid-ads', 'label_ar' => 'إعلانات ممولة', 'label_en' => 'Paid Advertising'],
                    ['value' => 'social-media', 'label_ar' => 'إدارة السوشيال ميديا', 'label_en' => 'Social Media Management'],
                    ['value' => 'content', 'label_ar' => 'صناعة المحتوى', 'label_en' => 'Content Creation'],
                    ['value' => 'branding', 'label_ar' => 'هوية وتجهيز العلامة', 'label_en' => 'Brand Identity'],
                    ['value' => 'not-sure', 'label_ar' => 'مش متأكد — محتاج ترشيح', 'label_en' => 'Not sure — recommend a path'],
                ],
                'industries' => [
                    ['value' => 'ecommerce', 'label_ar' => 'تجارة إلكترونية', 'label_en' => 'E-commerce'],
                    ['value' => 'restaurants', 'label_ar' => 'مطاعم ومقاهي', 'label_en' => 'Restaurants & cafés'],
                    ['value' => 'services', 'label_ar' => 'خدمات', 'label_en' => 'Services'],
                    ['value' => 'real-estate', 'label_ar' => 'عقارات', 'label_en' => 'Real estate'],
                    ['value' => 'education', 'label_ar' => 'تعليم وتدريب', 'label_en' => 'Education & training'],
                    ['value' => 'other', 'label_ar' => 'مجال آخر', 'label_en' => 'Other'],
                ],
                'budgets' => [
                    ['value' => '2000', 'label_ar' => '1,000 – 3,000 ريال', 'label_en' => 'SAR 1,000 – 3,000'],
                    ['value' => '5000', 'label_ar' => '3,000 – 10,000 ريال', 'label_en' => 'SAR 3,000 – 10,000'],
                    ['value' => '15000', 'label_ar' => '10,000 – 50,000+ ريال', 'label_en' => 'SAR 10,000 – 50,000+'],
                ],
                'preferences' => [
                    ['value' => 'whatsapp', 'label_ar' => 'واتساب', 'label_en' => 'WhatsApp'],
                    ['value' => 'phone', 'label_ar' => 'مكالمة هاتفية', 'label_en' => 'Phone call'],
                    ['value' => 'email', 'label_ar' => 'إيميل', 'label_en' => 'Email'],
                ],
            ],
            'product_demos' => [
                'ar' => ['marketMetrics' => [['key' => 'totalSales', 'label' => 'إجمالي المبيعات', 'value' => '24,780', 'suffix' => 'SAR', 'trend' => '+12.5%'], ['key' => 'orders', 'label' => 'الطلبات اليوم', 'value' => '48', 'suffix' => '', 'trend' => '+8.3%'], ['key' => 'stock', 'label' => 'حالة المخزون', 'value' => '92%', 'suffix' => '', 'trend' => 'Healthy']]],
                'en' => ['marketMetrics' => [['key' => 'totalSales', 'label' => 'Total sales', 'value' => '24,780', 'suffix' => 'SAR', 'trend' => '+12.5%'], ['key' => 'orders', 'label' => 'Orders today', 'value' => '48', 'suffix' => '', 'trend' => '+8.3%'], ['key' => 'stock', 'label' => 'Stock health', 'value' => '92%', 'suffix' => '', 'trend' => 'Healthy']]],
            ],
            'seo' => [
                'title_ar' => 'وكالة وجد للتسويق | نُوجِد الأثر الذي يتحول إلى مبيعات',
                'title_en' => 'Wajd Agency | Growth that turns into revenue',
                'description_ar' => 'شريك نمو عملي للمتاجر والبراندات الناشئة في الخليج.',
                'description_en' => 'A practical growth partner for Gulf startups, stores, and ambitious brands.',
            ],
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value, 'type' => 'json']);
        }

        $blocks = [
            ['key' => 'about.hero', 'locale' => 'ar', 'title' => 'نحن نُوجد لتحويل الإمكانات إلى أرباح.', 'body' => 'فلسفة وجد', 'data' => ['eyebrow' => 'فلسفتنا', 'highlight' => 'الإمكانات']],
            ['key' => 'about.hero', 'locale' => 'en', 'title' => 'We turn potential into profitable momentum.', 'body' => 'Our philosophy', 'data' => ['eyebrow' => 'Our philosophy', 'highlight' => 'potential']],
            ['key' => 'about.narrative', 'locale' => 'ar', 'title' => 'منهجية وجد', 'body' => 'في وجد، لا نؤمن بالتسويق كنشاط قائم بذاته. نؤمن بهندسة الإيرادات — من أول انتباه إلى آخر عملية شراء.', 'data' => ['paragraphs' => ['فريقنا مزيج من مهندسي الأداء، والمبدعين الاستراتيجيين، وعلماء البيانات الذين يتشاركون هدفاً واحداً: النمو المطلق لشركائنا.', 'لا نعمل لديك فقط؛ نعمل من أجل أرباحك الصافية.']]],
            ['key' => 'about.narrative', 'locale' => 'en', 'title' => 'The Wajd method', 'body' => 'At Wajd, marketing is not a collection of isolated tasks. It is revenue engineering — from the first moment of attention to the final purchase.', 'data' => ['paragraphs' => ['Our team brings together performance engineers, strategic creatives, and data thinkers around one goal: measurable growth for our partners.', 'We do not simply work for your brand; we work for the economics behind it.']]],
            ['key' => 'about.principles', 'locale' => 'ar', 'title' => 'مبادئنا الجوهرية', 'body' => 'القيم التي تحرك كل قرار نتخذه في سبيل نمو علامتك التجارية.', 'data' => ['items' => [['title' => 'شفافية مطلقة', 'desc' => 'لا توجد رسوم مخفية ولا بيانات محجوبة.'], ['title' => 'هوس بالنتائج', 'desc' => 'كل قرار يقاس مقابل نمو الإيرادات الفعلي.'], ['title' => 'أنظمة قابلة للتوسع', 'desc' => 'نبني نتائج قابلة للتنبؤ والقياس.']]]],
            ['key' => 'about.principles', 'locale' => 'en', 'title' => 'Our principles', 'body' => 'The values behind every decision we make for your growth.', 'data' => ['items' => [['title' => 'Radical transparency', 'desc' => 'No hidden fees and no hidden data.'], ['title' => 'Results obsession', 'desc' => 'Every decision is measured against real revenue growth.'], ['title' => 'Scalable systems', 'desc' => 'We build outcomes that can be predicted and measured.']]]],
            ['key' => 'services.hero', 'locale' => 'ar', 'title' => 'آليات النمو لدينا.', 'body' => 'نحن لا نقدم مهاماً تسويقية؛ نقدم نتائج تجارية ملموسة. كل خدمة هي آلية متخصصة في محرك الإيرادات الخاص بك.', 'data' => ['eyebrow' => 'قدراتنا']],
            ['key' => 'services.hero', 'locale' => 'en', 'title' => 'Growth mechanisms, built around your economics.', 'body' => 'We do not sell disconnected marketing tasks. We build specialized mechanisms around your revenue engine.', 'data' => ['eyebrow' => 'Capabilities']],
            ['key' => 'services.catalog', 'locale' => 'ar', 'title' => 'خدمات وجد', 'body' => '', 'data' => ['items' => [['title' => 'هندسة الاستحواذ', 'mechanism' => 'أنظمة مبيعات قابلة للتنبؤ', 'outcome' => 'نمو قاعدة العملاء', 'desc' => 'نبني آلات استحواذ خاصة تجد وتجذب عملاءك المثاليين على نطاق واسع.'], ['title' => 'تسويق الأداء', 'mechanism' => 'تحسين العائد الإعلاني ROAS', 'outcome' => 'توسيع نطاق الإيرادات', 'desc' => 'نحوّل الإنفاق الإعلاني إلى نمو ملموس ونحسن كل ريال مستثمر.'], ['title' => 'محتوى إبداعي عالي التأثير', 'mechanism' => 'سرد قصصي بصري', 'outcome' => 'جذب الانتباه والتحويل', 'desc' => 'نصمم أصولاً بصرية تكسب الانتباه وتحفز القرار الشرائي.'], ['title' => 'استراتيجية النمو', 'mechanism' => 'المخطط المعماري', 'outcome' => 'توسيع الحصة السوقية', 'desc' => 'نرسم رحلة العميل ونبني الأنظمة التقنية اللازمة للنمو.']]]],
            ['key' => 'services.catalog', 'locale' => 'en', 'title' => 'Wajd services', 'body' => '', 'data' => ['items' => [['title' => 'Acquisition engineering', 'mechanism' => 'Predictable sales systems', 'outcome' => 'Customer base growth', 'desc' => 'We build acquisition engines that find and attract your ideal customers at scale.'], ['title' => 'Performance marketing', 'mechanism' => 'ROAS optimization', 'outcome' => 'Revenue expansion', 'desc' => 'We turn ad spend into measurable growth and improve every invested riyal.'], ['title' => 'High-impact creative', 'mechanism' => 'Visual storytelling', 'outcome' => 'Attention and conversion', 'desc' => 'We design assets built to win attention and move people to action.'], ['title' => 'Growth strategy', 'mechanism' => 'The growth blueprint', 'outcome' => 'Market expansion', 'desc' => 'We map the customer journey and build the systems required to scale.']]]],
            ['key' => 'footer', 'locale' => 'ar', 'title' => 'نُوجد الأثر الذي يتحول إلى مبيعات حقيقية.', 'body' => 'وَجْدٌ... لِلنَّتَائِجِ وُجِدْ.', 'data' => []],
            ['key' => 'footer', 'locale' => 'en', 'title' => 'Digital impact that turns into real sales.', 'body' => 'Built for outcomes that matter.', 'data' => []],
            ['key' => 'home.hero', 'locale' => 'ar', 'title' => 'نُهندس النمو. ونُوجد الأثر.', 'body' => 'من أول اختبار إلى أول نتيجة قابلة للتوسع — شريك نمو عملي للبراندات والمتاجر في الخليج.', 'data' => ['badge' => 'نُوجد الأثر الذي يتحول إلى مبيعات.', 'title1' => 'نحن نبني', 'highlight' => 'النمو —', 'title2' => 'النتائج التي تُرى.', 'slogan' => 'وَجْدٌ... لِلنَّتَائِجِ وُجِدْ.', 'desc' => 'شريك نمو عملي للبراندات والمتاجر في الخليج — نبدأ من ميزانيتك الحالية ونبني معك ما يمكن قياسه وتوسيعه.', 'cta' => 'اطلب تدقيق النمو', 'metrics' => ['adSpend' => 'الإنفاق المُدار', 'maxRoas' => 'أعلى عائد', 'conversions' => 'تحويلات مُحققة', 'sectors' => 'قطاعات خدمناها']]],
            ['key' => 'home.hero', 'locale' => 'en', 'title' => 'We engineer growth. We create impact.', 'body' => 'From the first test to the first repeatable result — a practical growth partner for Gulf brands and stores.', 'data' => ['badge' => 'Impact that turns into revenue.', 'title1' => 'We build', 'highlight' => 'growth —', 'title2' => 'results people can see.', 'slogan' => 'Built for outcomes that matter.', 'desc' => 'A practical growth partner for Gulf brands and stores — starting from your current budget and building toward what can be measured and scaled.', 'cta' => 'Request a growth audit', 'metrics' => ['adSpend' => 'Managed spend', 'maxRoas' => 'Peak return', 'conversions' => 'Conversions', 'sectors' => 'Sectors served']]],
            ['key' => 'home.why_wajd', 'locale' => 'ar', 'title' => 'لماذا وجد؟', 'body' => 'لأنك لا تحتاج وعوداً أكبر من ميزانيتك. تحتاج قرارات واضحة، تنفيذ سريع، وشفافية في كل ريال.', 'data' => ['tag' => 'لماذا نحن؟', 'items' => [['title' => 'وضوح قبل الإنفاق', 'desc' => 'نحدد ما نختبره ولماذا قبل أن نطلب منك ريالاً إضافياً.'], ['title' => 'تنفيذ يناسب البداية', 'desc' => 'نبدأ من حجمك الحالي ونبني ما يمكن أن يكبر معك.'], ['title' => 'قرارات من البيانات', 'desc' => 'نربط الإبداع والأداء بمؤشرات مفهومة لا بمقاييس غرور.'], ['title' => 'شريك لا مورد', 'desc' => 'نفكر في اقتصاديات مشروعك وكأننا جزء من فريقك.']]]],
            ['key' => 'home.why_wajd', 'locale' => 'en', 'title' => 'Why Wajd?', 'body' => 'You do not need promises bigger than your budget. You need clear decisions, fast execution, and transparency on every riyal.', 'data' => ['tag' => 'Why us?', 'items' => [['title' => 'Clarity before spend', 'desc' => 'We define what we test and why before asking you to add another riyal.'], ['title' => 'Built for your stage', 'desc' => 'We start at your current size and build what can grow with you.'], ['title' => 'Decisions from data', 'desc' => 'We connect creative and performance to useful signals, not vanity metrics.'], ['title' => 'A partner, not a vendor', 'desc' => 'We think about your economics as if we were part of your team.']]]],
        ];

        foreach ($blocks as $block) {
            ContentBlock::updateOrCreate(
                ['key' => $block['key'], 'locale' => $block['locale']],
                collect($block)->except(['key', 'locale'])->all()
            );
        }

        $packages = [
            [
                'slug' => 'starter', 'category' => 'marketing', 'name_ar' => 'باقة الانطلاق', 'name_en' => 'Starter Plan',
                'subtitle_ar' => 'للبدايات الذكية', 'subtitle_en' => 'For smart beginnings', 'price_sar' => 350,
                'features_ar' => ['إدارة منصة اجتماعية واحدة', '4 أصول إبداعية', 'إعداد أولي للحملات', 'ملخص أداء شهري'],
                'features_en' => ['One social platform managed', '4 creative assets', 'Initial campaign setup', 'Monthly performance summary'],
                'cta_label_ar' => 'ابدأ من هنا', 'cta_label_en' => 'Start here', 'sort_order' => 1, 'is_featured' => false,
            ],
            [
                'slug' => 'growth', 'category' => 'marketing', 'name_ar' => 'باقة النمو', 'name_en' => 'Growth Plan',
                'subtitle_ar' => 'الأكثر طلباً', 'subtitle_en' => 'Most requested', 'price_sar' => 950,
                'features_ar' => ['إدارة منصتين اجتماعيتين', '12 أصلاً إبداعياً مع كتابة المحتوى', 'إدارة وتحسين الحملات', 'اختبار الجمهور والعروض', 'تقرير أداء شهري'],
                'features_en' => ['Two social platforms managed', '12 creative assets with copy', 'Campaign management and optimization', 'Audience and offer testing', 'Monthly performance report'],
                'cta_label_ar' => 'ابنِ خطة النمو', 'cta_label_en' => 'Build your growth plan', 'sort_order' => 2, 'is_featured' => true,
            ],
            [
                'slug' => 'partner', 'category' => 'marketing', 'name_ar' => 'باقة الشريك', 'name_en' => 'Partner Plan',
                'subtitle_ar' => 'للنمو المتكامل', 'subtitle_en' => 'For integrated growth', 'price_sar' => 2200,
                'features_ar' => ['استراتيجية نمو كاملة', 'خطة محتوى وحملات شهرية', 'إدارة مستمرة للإعلانات', 'تصاميم وفيديوهات قصيرة', 'تحسين رحلة العميل', 'جلسة استراتيجية شهرية'],
                'features_en' => ['Complete growth strategy', 'Monthly content and campaign plan', 'Ongoing ad management', 'Designs and short-form videos', 'Customer journey optimization', 'Monthly strategy session'],
                'cta_label_ar' => 'تحدث مع شريك نمو', 'cta_label_en' => 'Talk to a growth partner', 'sort_order' => 3, 'is_featured' => false,
            ],
        ];

        foreach ($packages as $package) {
            Package::updateOrCreate(['slug' => $package['slug']], array_merge($package, ['billing_cycle' => 'monthly', 'is_published' => true]));
        }

        $addons = [
            ['slug' => 'store-launch', 'category' => 'technology', 'name_ar' => 'إطلاق متجر احترافي', 'name_en' => 'Professional store launch', 'subtitle_ar' => 'Salla أو Zid أو Shopify مع تجهيز رحلة الشراء', 'subtitle_en' => 'Salla, Zid, or Shopify with a conversion-ready buying journey', 'price_sar' => 1800, 'billing_cycle' => 'one_time', 'tag_ar' => 'متاجر', 'tag_en' => 'Stores', 'sort_order' => 1],
            ['slug' => 'market-pos', 'category' => 'technology', 'name_ar' => 'نظام Market POS', 'name_en' => 'Market POS system', 'subtitle_ar' => 'نقاط بيع ومخزون وتشغيل يومي أكثر وضوحاً', 'subtitle_en' => 'Clearer point-of-sale, inventory, and daily operations', 'price_sar' => 2500, 'billing_cycle' => 'one_time', 'tag_ar' => 'أنظمة', 'tag_en' => 'Systems', 'sort_order' => 2],
            ['slug' => 'liftdesk-automation', 'category' => 'technology', 'name_ar' => 'أتمتة LiftDesk بالذكاء الاصطناعي', 'name_en' => 'LiftDesk AI automation', 'subtitle_ar' => 'تحويل الرسائل والتقارير إلى مهام وتنبيهات منظمة', 'subtitle_en' => 'Turn messages and reports into organized tasks and alerts', 'price_sar' => 750, 'billing_cycle' => 'monthly', 'tag_ar' => 'أتمتة', 'tag_en' => 'Automation', 'sort_order' => 3],
            ['slug' => 'custom-system', 'category' => 'technology', 'name_ar' => 'نظام مخصص لمشروعك', 'name_en' => 'Custom system for your business', 'subtitle_ar' => 'نطاق مخصص للوحة تحكم أو SaaS أو نظام عمليات', 'subtitle_en' => 'A tailored scope for a dashboard, SaaS, or operations system', 'price_sar' => 4500, 'billing_cycle' => 'one_time', 'tag_ar' => 'تطوير', 'tag_en' => 'Development', 'sort_order' => 4],
            ['slug' => 'tracking-dashboard', 'category' => 'technology', 'name_ar' => 'لوحة قياس الأداء', 'name_en' => 'Performance dashboard', 'subtitle_ar' => 'ربط المؤشرات الأساسية في لوحة واحدة مفهومة', 'subtitle_en' => 'Bring the core signals into one clear operating view', 'price_sar' => 600, 'billing_cycle' => 'one_time', 'tag_ar' => 'بيانات', 'tag_en' => 'Data', 'sort_order' => 5],
        ];

        foreach ($addons as $addon) {
            PackageAddon::updateOrCreate(['slug' => $addon['slug']], array_merge($addon, ['is_published' => true, 'is_featured' => false]));
        }

        $projects = [
            ['slug' => 'al-owaid', 'name_ar' => 'براند العويد للعود', 'name_en' => 'Al Owaid Oud', 'category_ar' => 'تسويق الأداء', 'category_en' => 'Performance Marketing', 'description_ar' => 'استراتيجية استحواذ لبراند عطور فاخر على منصة سلة.', 'description_en' => 'An acquisition strategy for a premium fragrance brand on Salla.', 'challenge_ar' => 'كان البراند يعاني من ارتفاع تكلفة الاستحواذ وضعف معدل التحويل رغم جودة المنتج.', 'challenge_en' => 'The brand faced high acquisition costs and weak conversion despite a strong product.', 'strategy_ar' => 'أعدنا بناء مسار الشراء وركزنا على محتوى يبرز فخامة العود مع إعادة استهداف ذكية.', 'strategy_en' => 'We rebuilt the purchase path, elevated the product through creative, and activated smarter retargeting.', 'results' => ['ROAS' => '2.6x', 'CVR' => '+45%', 'CAC' => '-30%'], 'image_url' => 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop', 'thumbnail_url' => 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop', 'alt_text_ar' => 'زجاجة عطر عود', 'alt_text_en' => 'Oud fragrance bottle', 'sort_order' => 1],
            ['slug' => 'toyo', 'name_ar' => 'تطبيق تويو', 'name_en' => 'Toyo App', 'category_ar' => 'هندسة النمو', 'category_en' => 'Growth Engineering', 'description_ar' => 'نمو محلي مكثف لخدمات التوصيل في السوق السعودي.', 'description_en' => 'Focused local growth for delivery services in Saudi Arabia.', 'challenge_ar' => 'الحاجة إلى توسع سريع في مناطق جغرافية محددة مع الحفاظ على جودة المستخدمين.', 'challenge_en' => 'The need to expand quickly across targeted geographies while protecting user quality.', 'strategy_ar' => 'هندسة حملات استحواذ تعتمد على البيانات الجغرافية وعروض مخصصة لكل منطقة.', 'strategy_en' => 'We engineered geo-led acquisition campaigns with tailored offers by area.', 'results' => ['Conversions' => '2,500+', 'CPO' => '-25%', 'Outcome' => 'طلبات ناجحة'], 'image_url' => 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop', 'thumbnail_url' => 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=600&auto=format&fit=crop', 'alt_text_ar' => 'توصيل طلبات', 'alt_text_en' => 'Delivery service', 'sort_order' => 2],
            ['slug' => 'qanatir', 'name_ar' => 'براند قناطير الغذائي', 'name_en' => 'Qanatir Food Brand', 'category_ar' => 'الإعلانات المدفوعة', 'category_en' => 'Paid Social', 'description_ar' => 'توسيع نطاق الإيرادات عبر المحتوى الإبداعي عالي الأداء.', 'description_en' => 'Expanding revenue through high-performing creative and paid social.', 'challenge_ar' => 'الانتقال من المبيعات التقليدية إلى التجارة الإلكترونية المباشرة وبناء قاعدة عملاء مخلصين.', 'challenge_en' => 'Moving from traditional sales to direct-to-consumer commerce and loyalty.', 'strategy_ar' => 'بناء سرد قصصي غذائي للعائلات مع حملات أداء مركزة على Meta وTikTok.', 'strategy_en' => 'We built family-led food storytelling with focused Meta and TikTok performance campaigns.', 'results' => ['ROAS' => '2.5x', 'Customers' => '10,000+', 'Sales Growth' => '+200%'], 'image_url' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop', 'thumbnail_url' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop', 'alt_text_ar' => 'طعام على مائدة', 'alt_text_en' => 'Food on a table', 'sort_order' => 3],
        ];

        foreach ($projects as $project) {
            PortfolioProject::updateOrCreate(['slug' => $project['slug']], array_merge($project, ['is_published' => true]));
        }

        $faqs = [
            ['question_ar' => 'ما الميزانية الإعلانية المناسبة للبدء؟', 'question_en' => 'What ad budget is right to start?', 'answer_ar' => 'يمكن أن نبدأ باختبار واضح من 1,000 إلى 2,000 ريال، ثم نزيد الاستثمار فقط عندما تظهر مؤشرات حقيقية على ما يعمل.', 'answer_en' => 'We can start with a focused test from SAR 1,000 to 2,000, then increase spend only when the data shows what works.', 'sort_order' => 1],
            ['question_ar' => 'متى نرى أول مؤشرات للنتائج؟', 'question_en' => 'When will we see the first signs of results?', 'answer_ar' => 'تظهر مؤشرات أولية خلال الأسبوع الأول، بينما تحتاج دورة تحسين النمو عادةً إلى 60–90 يوماً لبناء أساس قابل للتوسع.', 'answer_en' => 'Early signals can appear in the first week, while a meaningful optimization cycle usually needs 60–90 days to build a scalable base.', 'sort_order' => 2],
            ['question_ar' => 'هل الميزانية الإعلانية ضمن سعر الباقة؟', 'question_en' => 'Is ad spend included in the package price?', 'answer_ar' => 'لا. الباقة تغطي الإدارة والمحتوى والاستراتيجية، أما ميزانية الإعلانات فتُحدد منفصلة حسب هدفك وقدرتك الحالية.', 'answer_en' => 'No. The package covers management, creative, and strategy. Ad spend is separate and set around your current goals and capacity.', 'sort_order' => 3],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(['question_ar' => $faq['question_ar']], array_merge($faq, ['is_published' => true]));
        }

        $adminEmail = env('WAJD_ADMIN_EMAIL');
        $adminPassword = env('WAJD_ADMIN_PASSWORD');
        if ($adminEmail && $adminPassword) {
            User::updateOrCreate(
                ['email' => $adminEmail],
                ['name' => env('WAJD_ADMIN_NAME', 'Wajd Admin'), 'password' => Hash::make($adminPassword), 'is_admin' => true]
            );
        }
    }
}
