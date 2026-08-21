<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use App\Models\Faq;
use App\Models\Package;
use App\Models\PackageAddon;
use App\Models\PortfolioProject;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'ar') === 'en' ? 'en' : 'ar';

        $publicSettingKeys = ['brand', 'contact', 'seo', 'social_proof', 'site_options', 'partners', 'form_options', 'hero_metrics', 'navigation', 'product_demos'];
        $settings = SiteSetting::query()
            ->whereIn('key', $publicSettingKeys)
            ->get()
            ->mapWithKeys(fn (SiteSetting $setting) => [$setting->key => $setting->value]);

        return response()->json([
            'data' => [
                'locale' => $locale,
                'settings' => $settings,
                'blocks' => ContentBlock::query()->where('is_published', true)->where('locale', $locale)->get(),
                'packages' => Package::published()->get()->map(fn (Package $package) => [
                    'id' => $package->id,
                    'slug' => $package->slug,
                    'name' => $locale === 'en' ? $package->name_en : $package->name_ar,
                    'subtitle' => $locale === 'en' ? $package->subtitle_en : $package->subtitle_ar,
                    'category' => $package->category,
                    'price_sar' => $package->price_sar,
                    'price_one_time_sar' => $package->price_one_time_sar,
                    'compare_at_price_sar' => $package->compare_at_price_sar,
                    'billing_cycle' => $package->billing_cycle,
                    'cta_label' => $locale === 'en' ? $package->cta_label_en : $package->cta_label_ar,
                    'features' => $locale === 'en' ? ($package->features_en ?? []) : ($package->features_ar ?? []),
                    'metadata' => $package->metadata ?? [],
                    'is_featured' => $package->is_featured,
                ]),
                'addons' => PackageAddon::published()->get()->map(fn (PackageAddon $addon) => [
                    'id' => $addon->id,
                    'slug' => $addon->slug,
                    'category' => $addon->category,
                    'name' => $locale === 'en' ? $addon->name_en : $addon->name_ar,
                    'subtitle' => $locale === 'en' ? $addon->subtitle_en : $addon->subtitle_ar,
                    'price' => $addon->price_sar,
                    'type' => $addon->billing_cycle,
                    'tag' => $locale === 'en' ? $addon->tag_en : $addon->tag_ar,
                    'features' => $locale === 'en' ? ($addon->features_en ?? []) : ($addon->features_ar ?? []),
                    'metadata' => $addon->metadata ?? [],
                    'is_featured' => $addon->is_featured,
                ]),
                'faqs' => Faq::published()->get()->map(fn (Faq $faq) => [
                    'id' => $faq->id,
                    'question' => $locale === 'en' ? $faq->question_en : $faq->question_ar,
                    'answer' => $locale === 'en' ? $faq->answer_en : $faq->answer_ar,
                ]),
                'projects' => PortfolioProject::published()->get()->map(fn (PortfolioProject $project) => [
                    'id' => $project->id,
                    'slug' => $project->slug,
                    'name' => $locale === 'en' ? $project->name_en : $project->name_ar,
                    'category' => $locale === 'en' ? $project->category_en : $project->category_ar,
                    'description' => $locale === 'en' ? $project->description_en : $project->description_ar,
                    'image_url' => $project->image_url,
                    'thumbnail_url' => $project->thumbnail_url,
                    'alt_text' => $locale === 'en' ? $project->alt_text_en : $project->alt_text_ar,
                    'metric' => $locale === 'en' ? $project->metric_en : $project->metric_ar,
                    'outcome' => $locale === 'en' ? $project->outcome_en : $project->outcome_ar,
                    'results' => $project->results ?? [],
                    'gallery' => $project->gallery ?? [],
                    'evidence_note' => $locale === 'en' ? $project->evidence_note_en : $project->evidence_note_ar,
                    'period' => $locale === 'en' ? $project->period_en : $project->period_ar,
                ]),
            ],
        ])->header('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    }

    public function project(Request $request, string $slug): JsonResponse
    {
        $locale = $request->query('locale', 'ar') === 'en' ? 'en' : 'ar';
        $project = PortfolioProject::query()->published()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $project->id,
                'slug' => $project->slug,
                'name' => $locale === 'en' ? $project->name_en : $project->name_ar,
                'category' => $locale === 'en' ? $project->category_en : $project->category_ar,
                'description' => $locale === 'en' ? $project->description_en : $project->description_ar,
                'challenge' => $locale === 'en' ? $project->challenge_en : $project->challenge_ar,
                'strategy' => $locale === 'en' ? $project->strategy_en : $project->strategy_ar,
                'metric' => $locale === 'en' ? $project->metric_en : $project->metric_ar,
                'outcome' => $locale === 'en' ? $project->outcome_en : $project->outcome_ar,
                'results' => $project->results ?? [],
                'image_url' => $project->image_url,
                'thumbnail_url' => $project->thumbnail_url,
                'gallery' => $project->gallery ?? [],
                'evidence_note' => $locale === 'en' ? $project->evidence_note_en : $project->evidence_note_ar,
                'period' => $locale === 'en' ? $project->period_en : $project->period_ar,
                'alt_text' => $locale === 'en' ? $project->alt_text_en : $project->alt_text_ar,
            ],
        ])->header('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    }
}
