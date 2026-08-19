<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreLeadRequest;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    public function submit(StoreLeadRequest $request): JsonResponse
    {
        if ($request->filled('website')) {
            return response()->json(['message' => 'تم استلام الطلب.'], 202);
        }

        $data = $request->validated();
        $data['source'] = $data['source'] ?? 'website';
        $data['status'] = Lead::STATUS_NEW;
        $data['ip_address'] = $request->ip();
        $data['user_agent'] = $request->userAgent();
        $data['consent_at'] = $request->boolean('consent') ? Carbon::now() : null;
        unset($data['consent'], $data['website']);

        $recentDuplicate = Lead::query()
            ->where('email', $data['email'])
            ->where('name', $data['name'])
            ->where('created_at', '>=', Carbon::now()->subMinutes(30))
            ->exists();

        if ($recentDuplicate) {
            return response()->json([
                'data' => ['duplicate' => true],
                'message' => 'تم استلام طلبك بالفعل وسنتواصل معك قريباً.',
            ]);
        }

        try {
            $lead = Lead::create($data);

            return response()->json([
                'data' => ['id' => $lead->id],
                'message' => 'تم استلام طلبك بنجاح.',
            ], 201);
        } catch (\Throwable $exception) {
            Log::error('Lead submission failed', [
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json(['message' => 'تعذر حفظ الطلب حالياً. حاول مرة أخرى.'], 500);
        }
    }

    public function legacyIndex(): JsonResponse
    {
        return response()->json(['message' => 'هذا المسار مخصص للوحة الإدارة.'], 403);
    }
}
