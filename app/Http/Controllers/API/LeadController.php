<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    // GET /api/leads - List all leads
    public function index()
    {
        try {
            $leads = Lead::orderBy('id', 'desc')->get();
            return response()->json($leads);
        } catch (\Exception $e) {
            Log::error('Failed to fetch leads: ' . $e->getMessage());
            return response()->json(['error' => 'خطأ في جلب الطلبات'], 500);
        }
    }

    // POST /api/leads/submit - Save a new lead
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'pageUrl' => 'nullable|string',
            'service' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        try {
            // Check if pageUrl is valid URL, clean it up
            $pageUrl = $request->input('pageUrl') ?? $request->input('page_url');
            if ($pageUrl) {
                if (!str_starts_with($pageUrl, 'http://') && !str_starts_with($pageUrl, 'https://')) {
                    $pageUrl = 'https://' . $pageUrl;
                }
            }

            // Create lead
            $lead = Lead::create([
                'name' => $request->input('name') ?? 'عميل جديد',
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'service' => $request->input('service') ?? 'تحليل البراند',
                'description' => $request->input('message') ?? 'رابط الصفحة: ' . $pageUrl,
                'status' => 'New'
            ]);

            // Optional: Send email notification via FormSubmit.co
            $recipientEmail = 'wajd.marketing@gmail.com';
            try {
                Http::asJson()->post("https://formsubmit.co/ajax/{$recipientEmail}", [
                    'الاسم' => $lead->name,
                    'البريد الإلكتروني' => $lead->email,
                    'رقم الجوال' => $lead->phone,
                    'الخدمة/المجال' => $lead->service,
                    'رابط الصفحة' => $pageUrl,
                    'الرسالة/التفاصيل' => $lead->description,
                    '_subject' => "طلب استشارة جديد من: {$lead->name}",
                    '_captcha' => 'false'
                ]);
            } catch (\Exception $mailErr) {
                Log::warning('FormSubmit notification failed: ' . $mailErr->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'تم استلاف طلبك بنجاح! سيتواصل معك فريق وجد خلال 24 ساعة.',
                'lead' => $lead
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to save lead: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى'], 500);
        }
    }

    // PATCH /api/leads/{id}/status - Update lead status
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:New,Contacted,Done,new,contacted,done',
        ]);

        try {
            $lead = Lead::findOrFail($id);
            $lead->update([
                'status' => ucfirst(strtolower($validated['status']))
            ]);

            return response()->json($lead);
        } catch (\Exception $e) {
            Log::error('Failed to update lead status: ' . $e->getMessage());
            return response()->json(['error' => 'خطأ في تحديث حالة الطلب'], 500);
        }
    }
}
