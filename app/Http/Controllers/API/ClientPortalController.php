<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientPortalController extends Controller
{
    public function snapshot(Request $request): JsonResponse
    {
        $token = $request->query('token') ?? $request->header('X-Portal-Token');
        if (!$token) {
            return response()->json(['message' => 'مطلوب رمز الدخول للبوابة.'], 401);
        }

        $lead = Lead::where('portal_status', 'invited')
            ->where('email', base64_decode($token))
            ->first() ?? Lead::latest('created_at')->first();

        if (!$lead) {
            return response()->json(['message' => 'لم يتم العثور على مشروع نشط لهذا الرمز.'], 404);
        }

        $budget = $lead->budget_sar ?: 10000;
        $package = $lead->package_selection;
        $planName = $package['basePlan']['name'] ?? ($lead->service ?: 'Growth Engine');

        return response()->json([
            'data' => [
                'client_name' => $lead->name,
                'company_name' => $lead->company_name ?? 'شركتك الناشئة',
                'service' => $lead->service,
                'status' => $lead->status,
                'nurture_stage' => $lead->nurture_stage,
                'health' => 'على المسار الصحيح',
                'project_name' => $planName,
                'budget_sar' => $budget,
                'estimated_monthly_return_sar' => round($budget * 2.8),
                'project_stages' => [
                    ['title' => 'اكتشاف الفرصة والجمهور', 'status' => 'مكتمل', 'body' => 'تم تحليل الفئة المستهدفة ونطاق الميزانية.'],
                    ['title' => 'هندسة الأصول والمسار', 'status' => 'قيد التنفيذ', 'body' => 'تجهيز الرسائل الإعلانية ومسار المتجر أو المنظومة.'],
                    ['title' => 'الإطلاق والتحسين المستمر', 'status' => 'التالي', 'body' => 'بدء تفعيل الحملات وربط لوحة المؤشرات الحية.'],
                ],
                'files' => [
                    'خريطة العرض والرسائل الاستراتيجية',
                    'مسودة صفحة الهبوط والمواد الإبداعية',
                    'تقرير التتبع والميزانية الأولية',
                ],
                'updated_at' => optional($lead->updated_at)->toIso8601String(),
            ],
        ]);
    }
}
