<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreLeadRequest;
use App\Mail\NewLeadNotification;
use App\Models\Lead;
use App\Services\GrowthEngineCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class LeadController extends Controller
{
    public function submit(StoreLeadRequest $request): JsonResponse
    {
        if ($request->filled('website')) {
            return response()->json(['message' => 'تم استلام الطلب.'], 202);
        }

        $data = $request->validated();
        $data['package_selection'] = GrowthEngineCatalog::normalize($data['package_selection'] ?? null);
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
            if ($recipient && config('mail.default') !== 'log') {
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

        $this->sendTelegramNotification($lead);

        return response()->json([
            'data' => ['id' => $lead->id],
            'message' => 'تم استلام طلبك بنجاح.',
        ], 201);
    }

    private function sendTelegramNotification(Lead $lead): void
    {
        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (!$token || !$chatId) {
            return;
        }

        $budget = $lead->budget_sar ? number_format($lead->budget_sar) . ' SAR' : 'غير مذكورة';
        $package = $lead->package_selection;
        $packageLines = $package ? array_merge(
            ['🛒 المنظومة: ' . ($package['basePlan']['name'] ?? 'خطة غير محددة') . ' — ' . number_format($package['basePlan']['price'] ?? 0) . ' SAR / شهرياً'],
            collect($package['addons'] ?? [])->map(fn (array $addon) => '➕ ' . $addon['name'] . ' — ' . number_format($addon['price']) . ' SAR / ' . ($addon['type'] === 'monthly' ? 'شهرياً' : 'مرة واحدة'))->all(),
            ['📊 الإجمالي الشهري المبدئي: ' . number_format($package['monthlyTotal'] ?? 0) . ' SAR'],
            ($package['oneTimeTotal'] ?? 0) > 0 ? ['💳 إضافات مرة واحدة: ' . number_format($package['oneTimeTotal']) . ' SAR'] : []
        ) : [];
        $contactPreference = match ($lead->contact_preference) {
            'phone' => 'مكالمة هاتفية',
            'whatsapp' => 'واتساب',
            'email' => 'البريد الإلكتروني',
            default => 'غير محددة',
        };
        $text = implode("\n", [
            '🔔 عميل جديد | Wajd Agency',
            '',
            '👤 الاسم: ' . $lead->name,
            '🏢 الشركة: ' . ($lead->company_name ?: 'غير مذكورة'),
            '✉️ البريد: ' . $lead->email,
            '📞 الهاتف: ' . $lead->phone,
            '💬 يفضّل التواصل عبر: ' . $contactPreference,
            '🧩 الخدمة: ' . $lead->service,
            '📌 المجال: ' . $lead->industry,
            '💰 الميزانية: ' . $budget,
            ...$packageLines,
            '🌐 اللغة: ' . strtoupper($lead->locale ?: 'ar'),
            '🔗 الصفحة: ' . ($lead->page_url ?: 'غير مذكورة'),
            '',
            '📝 الرسالة:',
            Str::limit($lead->message ?: 'لم يكتب العميل رسالة.', 1500),
            '',
            'افتح لوحة التحكم لمتابعة الحالة وتحديثها.',
        ]);

        try {
            $response = Http::asForm()
                ->timeout(8)
                ->post("https://api.telegram.org/bot{$token}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => $text,
                ]);

            if (!$response->successful() || !$response->json('ok')) {
                throw new \RuntimeException('Telegram API rejected the notification.');
            }
        } catch (\Throwable $exception) {
            Log::error('Lead Telegram notification failed', [
                'lead_id' => $lead->id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    public function legacyIndex(): JsonResponse
    {
        return response()->json(['message' => 'هذا المسار مخصص للوحة الإدارة.'], 403);
    }
}
