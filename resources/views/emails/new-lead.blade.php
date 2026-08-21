@php
    $contactPreference = match ($lead->contact_preference) {
        'phone' => 'مكالمة هاتفية',
        'whatsapp' => 'واتساب',
        'email' => 'البريد الإلكتروني',
        default => 'غير محددة',
    };
    $package = $lead->package_selection;
@endphp
<!doctype html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>عميل جديد | Wajd</title>
</head>
<body style="margin:0;background:#111;color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;line-height:1.7;">
    <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
        <div style="padding:24px;border:1px solid #3d3525;border-radius:16px;background:#171717;">
            <div style="color:#c9a96a;letter-spacing:4px;font-weight:700;font-size:13px;">WAJD AGENCY</div>
            <h1 style="margin:12px 0 6px;font-size:28px;color:#fff;">عميل جديد مهتم بخدماتك</h1>
            <p style="margin:0 0 24px;color:#bcbcbc;">وصلت تفاصيل جديدة من نموذج التواصل على الموقع.</p>

            <table role="presentation" style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:10px 0;color:#aaa;width:38%;">الاسم</td><td style="padding:10px 0;color:#fff;font-weight:700;">{{ $lead->name }}</td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">الشركة أو المشروع</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $lead->company_name ?: 'غير مذكور' }}</td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">البريد الإلكتروني</td><td style="padding:10px 0;border-top:1px solid #2b2b2b;"><a href="mailto:{{ $lead->email }}" style="color:#d7b66f;">{{ $lead->email }}</a></td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">رقم الهاتف</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $lead->phone }}</td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">يفضل التواصل عبر</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $contactPreference }}</td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">الخدمة</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $lead->service }}</td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">مجال النشاط</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $lead->industry }}</td></tr>
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">الميزانية</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $lead->budget_sar ? number_format($lead->budget_sar) . ' SAR' : 'غير مذكورة' }}</td></tr>
                @if($package)
                    <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">خطة الأساس</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ $package['basePlan']['name'] ?? '—' }} — {{ number_format($package['basePlan']['price'] ?? 0) }} SAR / شهرياً</td></tr>
                    <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">الوحدات المضافة</td><td style="padding:10px 0;color:#fff;border-top:1px solid #2b2b2b;">{{ collect($package['addons'] ?? [])->map(fn($addon) => ($addon['name'] ?? '—') . ' — ' . number_format($addon['price'] ?? 0) . ' SAR')->implode('، ') ?: 'لا توجد' }}</td></tr>
                    <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">الإجمالي المبدئي</td><td style="padding:10px 0;color:#d7b66f;border-top:1px solid #2b2b2b;">{{ number_format($package['monthlyTotal'] ?? 0) }} SAR شهرياً @if(($package['oneTimeTotal'] ?? 0) > 0) + {{ number_format($package['oneTimeTotal']) }} SAR مرة واحدة @endif</td></tr>
                @endif
                <tr><td style="padding:10px 0;color:#aaa;border-top:1px solid #2b2b2b;">رابط الموقع أو الحساب</td><td style="padding:10px 0;border-top:1px solid #2b2b2b;word-break:break-word;">{{ $lead->page_url ?: 'غير مذكور' }}</td></tr>
            </table>

            <div style="margin-top:24px;padding:18px;border-radius:12px;background:#101010;border:1px solid #2b2b2b;">
                <div style="color:#aaa;font-size:13px;margin-bottom:8px;">الهدف أو التحدي</div>
                <div style="white-space:pre-wrap;color:#fff;">{{ $lead->message ?: 'لم يكتب العميل تفاصيل إضافية.' }}</div>
            </div>

            <p style="margin:24px 0 0;color:#777;font-size:12px;">يمكنك متابعة العميل وتحديث حالته من لوحة تحكم Wajd.</p>
        </div>
    </div>
</body>
</html>
