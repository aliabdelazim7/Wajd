<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use App\Models\Faq;
use App\Models\Package;
use App\Models\PortfolioProject;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'ar') === 'en' ? 'en' : 'ar';

        $publicSettingKeys = ['brand', 'contact', 'seo'];
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
                    'price_sar' => $package->price_sar,
                    'billing_cycle' => $package->billing_cycle,
                    'features' => $locale === 'en' ? ($package->features_en ?? []) : ($package->features_ar ?? []),
                    'is_featured' => $package->is_featured,
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
                    'results' => $project->results ?? [],
                ]),
            ],
        ])->header('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
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
                'results' => $project->results ?? [],
                'image_url' => $project->image_url,
                'thumbnail_url' => $project->thumbnail_url,
                'alt_text' => $locale === 'en' ? $project->alt_text_en : $project->alt_text_ar,
            ],
        ])->header('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    }
}
