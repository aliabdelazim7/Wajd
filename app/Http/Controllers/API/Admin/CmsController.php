<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ContentBlock;
use App\Models\Faq;
use App\Models\Lead;
use App\Models\Package;
use App\Models\PortfolioProject;
use App\Models\SiteSetting;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CmsController extends Controller
{
    public function __construct(private readonly AuditService $audit)
    {
    }

    public function overview(): JsonResponse
    {
        return response()->json([
            'data' => [
                'counts' => [
                    'leads' => Lead::count(),
                    'new_leads' => Lead::where('status', Lead::STATUS_NEW)->count(),
                    'packages' => Package::where('is_published', true)->count(),
                    'faqs' => Faq::where('is_published', true)->count(),
                    'projects' => PortfolioProject::where('is_published', true)->count(),
                    'content_blocks' => ContentBlock::where('is_published', true)->count(),
                ],
                'recent_leads' => Lead::query()
                    ->select(['id', 'name', 'company_name', 'email', 'phone', 'service', 'industry', 'contact_preference', 'budget_sar', 'status', 'created_at'])
                    ->latest()
                    ->limit(8)
                    ->get(),
                'recent_activity' => AuditLog::query()
                    ->with('user:id,name,email')
                    ->latest()
                    ->limit(8)
                    ->get(),
            ],
        ]);
    }

    public function settings(): JsonResponse
    {
        return response()->json(['data' => SiteSetting::query()->orderBy('key')->get()]);
    }

    public function upsertSetting(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9._-]+$/'],
            'value' => ['required', 'array'],
            'type' => ['nullable', 'string', 'max:30'],
        ]);

        $setting = DB::transaction(function () use ($data) {
            return SiteSetting::updateOrCreate(
                ['key' => $data['key']],
                ['value' => $data['value'], 'type' => $data['type'] ?? 'json']
            );
        });

        $this->audit->record($request, 'upsert', 'site_setting', $setting->id, ['key' => $setting->key]);

        return response()->json(['data' => $setting, 'message' => 'تم حفظ إعدادات الموقع.']);
    }

    public function deleteSetting(Request $request, SiteSetting $setting): JsonResponse
    {
        $setting->delete();
        $this->audit->record($request, 'delete', 'site_setting', $setting->id, ['key' => $setting->key]);

        return response()->json(['message' => 'تم حذف الإعداد.']);
    }

    public function blocks(): JsonResponse
    {
        return response()->json(['data' => ContentBlock::query()->orderBy('key')->orderBy('locale')->get()]);
    }

    public function upsertBlock(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9._-]+$/'],
            'locale' => ['required', 'string', Rule::in(['ar', 'en'])],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $block = DB::transaction(function () use ($data) {
            return ContentBlock::updateOrCreate(
                ['key' => $data['key'], 'locale' => $data['locale']],
                [
                    'title' => $data['title'] ?? null,
                    'body' => $data['body'] ?? null,
                    'data' => $data['data'] ?? null,
                    'is_published' => $data['is_published'] ?? true,
                ]
            );
        });

        $this->audit->record($request, 'upsert', 'content_block', $block->id, ['key' => $block->key, 'locale' => $block->locale]);

        return response()->json(['data' => $block, 'message' => 'تم حفظ المحتوى.']);
    }

    public function deleteBlock(Request $request, ContentBlock $block): JsonResponse
    {
        $block->delete();
        $this->audit->record($request, 'delete', 'content_block', $block->id);

        return response()->json(['message' => 'تم حذف المحتوى.']);
    }

    public function packages(): JsonResponse
    {
        return response()->json(['data' => Package::query()->orderBy('sort_order')->orderBy('id')->get()]);
    }

    public function storePackage(Request $request): JsonResponse
    {
        $data = $this->packageData($request);
        $package = Package::create($data);
        $this->audit->record($request, 'create', 'package', $package->id, ['slug' => $package->slug]);

        return response()->json(['data' => $package, 'message' => 'تم إنشاء الباقة.'], 201);
    }

    public function updatePackage(Request $request, Package $package): JsonResponse
    {
        $data = $this->packageData($request, $package);
        $package->update($data);
        $this->audit->record($request, 'update', 'package', $package->id, ['slug' => $package->slug]);

        return response()->json(['data' => $package->fresh(), 'message' => 'تم تحديث الباقة.']);
    }

    public function deletePackage(Request $request, Package $package): JsonResponse
    {
        $package->delete();
        $this->audit->record($request, 'delete', 'package', $package->id, ['slug' => $package->slug]);

        return response()->json(['message' => 'تم حذف الباقة.']);
    }

    public function faqs(): JsonResponse
    {
        return response()->json(['data' => Faq::query()->orderBy('sort_order')->orderBy('id')->get()]);
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $faq = Faq::create($this->faqData($request));
        $this->audit->record($request, 'create', 'faq', $faq->id);

        return response()->json(['data' => $faq, 'message' => 'تم إنشاء السؤال.'], 201);
    }

    public function updateFaq(Request $request, Faq $faq): JsonResponse
    {
        $faq->update($this->faqData($request));
        $this->audit->record($request, 'update', 'faq', $faq->id);

        return response()->json(['data' => $faq->fresh(), 'message' => 'تم تحديث السؤال.']);
    }

    public function deleteFaq(Request $request, Faq $faq): JsonResponse
    {
        $faq->delete();
        $this->audit->record($request, 'delete', 'faq', $faq->id);

        return response()->json(['message' => 'تم حذف السؤال.']);
    }

    public function projects(): JsonResponse
    {
        return response()->json(['data' => PortfolioProject::query()->orderBy('sort_order')->orderBy('id')->get()]);
    }

    public function storeProject(Request $request): JsonResponse
    {
        $project = PortfolioProject::create($this->projectData($request));
        $this->audit->record($request, 'create', 'portfolio_project', $project->id, ['slug' => $project->slug]);

        return response()->json(['data' => $project, 'message' => 'تم إنشاء المشروع.'], 201);
    }

    public function updateProject(Request $request, PortfolioProject $project): JsonResponse
    {
        $project->update($this->projectData($request, $project));
        $this->audit->record($request, 'update', 'portfolio_project', $project->id, ['slug' => $project->slug]);

        return response()->json(['data' => $project->fresh(), 'message' => 'تم تحديث المشروع.']);
    }

    public function deleteProject(Request $request, PortfolioProject $project): JsonResponse
    {
        $project->delete();
        $this->audit->record($request, 'delete', 'portfolio_project', $project->id, ['slug' => $project->slug]);

        return response()->json(['message' => 'تم حذف المشروع.']);
    }

    public function leads(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', 'string', Rule::in(Lead::STATUSES)],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = Lead::query()->select([
            'id', 'name', 'company_name', 'email', 'phone', 'page_url', 'service', 'industry',
            'contact_preference', 'budget_sar', 'message', 'locale', 'source', 'status',
            'consent_at', 'created_at', 'updated_at',
        ])->recent();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($builder) use ($term) {
                $builder->where('name', 'like', "%{$term}%")
                    ->orWhere('company_name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%")
                    ->orWhere('industry', 'like', "%{$term}%");
            });
        }

        return response()->json(['data' => $query->paginate(20)]);
    }

    public function updateLeadStatus(Request $request, Lead $lead): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'string', Rule::in(Lead::STATUSES)]]);
        $oldStatus = $lead->status;
        $lead->update(['status' => $data['status']]);
        $this->audit->record($request, 'status_change', 'lead', $lead->id, ['from' => $oldStatus, 'to' => $lead->status]);

        return response()->json(['data' => $lead->fresh(), 'message' => 'تم تحديث حالة العميل المحتمل.']);
    }

    public function deleteLead(Request $request, Lead $lead): JsonResponse
    {
        $lead->delete();
        $this->audit->record($request, 'delete', 'lead', $lead->id);

        return response()->json(['message' => 'تم حذف العميل المحتمل.']);
    }

    public function auditLogs(): JsonResponse
    {
        return response()->json([
            'data' => AuditLog::query()->with('user:id,name,email')->latest()->paginate(30),
        ]);
    }

    private function packageData(Request $request, ?Package $package = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/', Rule::unique('packages', 'slug')->ignore($package?->id)],
            'name_ar' => ['required', 'string', 'max:120'],
            'name_en' => ['required', 'string', 'max:120'],
            'subtitle_ar' => ['nullable', 'string', 'max:255'],
            'subtitle_en' => ['nullable', 'string', 'max:255'],
            'price_sar' => ['required', 'integer', 'min:0', 'max:10000000'],
            'billing_cycle' => ['required', 'string', 'max:30'],
            'features_ar' => ['required', 'array', 'max:30'],
            'features_ar.*' => ['string', 'max:255'],
            'features_en' => ['required', 'array', 'max:30'],
            'features_en.*' => ['string', 'max:255'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
        ]);
    }

    private function faqData(Request $request): array
    {
        return $request->validate([
            'question_ar' => ['required', 'string', 'max:1000'],
            'question_en' => ['required', 'string', 'max:1000'],
            'answer_ar' => ['required', 'string', 'max:10000'],
            'answer_en' => ['required', 'string', 'max:10000'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
            'is_published' => ['sometimes', 'boolean'],
        ]);
    }

    private function projectData(Request $request, ?PortfolioProject $project = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('portfolio_projects', 'slug')->ignore($project?->id)],
            'name_ar' => ['required', 'string', 'max:160'],
            'name_en' => ['required', 'string', 'max:160'],
            'category_ar' => ['nullable', 'string', 'max:120'],
            'category_en' => ['nullable', 'string', 'max:120'],
            'description_ar' => ['nullable', 'string', 'max:3000'],
            'description_en' => ['nullable', 'string', 'max:3000'],
            'challenge_ar' => ['nullable', 'string', 'max:10000'],
            'challenge_en' => ['nullable', 'string', 'max:10000'],
            'strategy_ar' => ['nullable', 'string', 'max:10000'],
            'strategy_en' => ['nullable', 'string', 'max:10000'],
            'results' => ['nullable', 'array', 'max:30'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'thumbnail_url' => ['nullable', 'string', 'max:2048'],
            'alt_text_ar' => ['nullable', 'string', 'max:255'],
            'alt_text_en' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
            'is_published' => ['sometimes', 'boolean'],
        ]);
    }
}
