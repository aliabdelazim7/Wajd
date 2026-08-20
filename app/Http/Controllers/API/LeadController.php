<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreLeadRequest;
use App\Mail\NewLeadNotification;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
        } catch (\Throwable $exception) {
            Log::error('Lead submission failed', [
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json(['message' => 'تعذر حفظ الطلب حالياً. حاول مرة أخرى.'], 500);
        }

        try {
            $recipient = config('mail.lead_notification_address');
            if ($recipient) {
                Mail::to($recipient)->send(new NewLeadNotification($lead));
            }
        } catch (\Throwable $exception) {
            // Never turn a saved lead into a failed user submission if SMTP is temporarily unavailable.
            Log::error('Lead notification email failed', [
                'lead_id' => $lead->id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'data' => ['id' => $lead->id],
            'message' => 'تم استلام طلبك بنجاح.',
        ], 201);
    }

    public function legacyIndex(): JsonResponse
    {
        return response()->json(['message' => 'هذا المسار مخصص للوحة الإدارة.'], 403);
    }
}
