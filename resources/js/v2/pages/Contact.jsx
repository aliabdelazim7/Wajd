import React, { useState } from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';
import {
    ArrowUpLeft,
    Building2,
    CheckCircle2,
    ChevronDown,
    Globe,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useLocation } from 'react-router-dom';
import { trackAnalyticsEvent } from '../utils/analytics.js';

const fieldClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-white/25 focus:border-gold-500/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-gold-500/10';
const labelClass = 'mb-2 block text-sm font-medium text-white/65';

const Contact = () => {
    const { lang } = useApp();
    const location = useLocation();
    const isArabic = lang === 'ar';
    const packageBuilder = location.state?.packageBuilder || null;
    const roiSnapshot = location.state?.roiSnapshot || null;
    const builderSummary = packageBuilder ? [
        `${packageBuilder.basePlan?.name || ''} — ${Number(packageBuilder.basePlan?.price || 0).toLocaleString()} SAR / ${lang === 'ar' ? 'شهرياً' : 'monthly'}`,
        ...(packageBuilder.addons || []).map((addon) => `${addon.name} — ${Number(addon.price || 0).toLocaleString()} SAR / ${addon.type === 'monthly' ? (lang === 'ar' ? 'شهرياً' : 'monthly') : (lang === 'ar' ? 'مرة واحدة' : 'one-time')}`),
        `${lang === 'ar' ? 'الإجمالي الشهري المبدئي' : 'Indicative monthly total'}: ${Number(packageBuilder.monthlyTotal || 0).toLocaleString()} SAR`,
        ...(Number(packageBuilder.oneTimeTotal || 0) > 0 ? [`${lang === 'ar' ? 'إضافات تدفع مرة واحدة' : 'One-time add-ons'}: ${Number(packageBuilder.oneTimeTotal).toLocaleString()} SAR`] : []),
    ].filter(Boolean).join('\\n') : '';
    const roiSummary = roiSnapshot ? [
        `${lang === 'ar' ? 'ملخص حاسبة العائد:' : 'ROI calculator snapshot:'}`,
        `${lang === 'ar' ? 'الميزانية الإعلانية' : 'Ad budget'}: ${Number(roiSnapshot.budget || 0).toLocaleString()} SAR`,
        `${lang === 'ar' ? 'متوسط الطلب' : 'Average order value'}: ${Number(roiSnapshot.averageOrderValue || 0).toLocaleString()} SAR`,
        `${lang === 'ar' ? 'الهامش' : 'Margin'}: ${Number(roiSnapshot.margin || 0)}%`,
        `${lang === 'ar' ? 'الإيراد المتوقع في السيناريو' : 'Scenario revenue'}: ${Number(roiSnapshot.projectedRevenue || 0).toLocaleString()} SAR`,
        `${lang === 'ar' ? 'ROAS نقطة التعادل التقريبية' : 'Approx. break-even ROAS'}: ${Number(roiSnapshot.breakEvenRoas || 0).toFixed(1)}x`,
    ].join('\\n') : '';
    const initialBrief = packageBuilder
        ? `${lang === 'ar' ? 'المنظومة المختارة:' : 'Selected growth-engine build:'}\\n${builderSummary}`
        : roiSummary;
    const [formData, setFormData] = useState({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        website: '',
        service: packageBuilder || roiSnapshot ? 'growth-engine' : '',
        industry: '',
        budget_sar: '',
        contact_preference: 'whatsapp',
        message: initialBrief,
        package_selection: packageBuilder || null,
        consent: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        trackAnalyticsEvent('contact_form_viewed', {
            has_builder_selection: Boolean(packageBuilder),
            has_roi_snapshot: Boolean(roiSnapshot),
            service: packageBuilder || roiSnapshot ? 'growth-engine' : null,
        });
    }, [packageBuilder]);

    const copy = isArabic ? {
        eyebrow: 'خلينا نتكلم',
        title: 'جاهز تكبّر شغلك؟',
        titleAccent: 'نبدأ من هنا.',
        intro: 'احكيلنا عن مشروعك كما هو، ونرجع لك بخطوة واضحة تناسب احتياجك وميزانيتك.',
        channels: 'تواصل معنا مباشرة',
        emailLabel: 'البريد الإلكتروني',
        socialLabel: 'تابعنا على المنصات',
        locationLabel: 'موقعنا',
        location: 'الرياض، المملكة العربية السعودية',
        formTitle: 'خلينا نبدأ من هنا',
        formIntro: 'كلما عرفنا عن مشروعك أكثر، قدرنا نساعدك بشكل أدق.',
        name: 'اسمك الكامل',
        namePlaceholder: 'اكتب اسمك',
        company: 'اسم الشركة أو المشروع',
        companyPlaceholder: 'مثال: متجر وجد',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'name@company.com',
        phone: 'رقم الجوال / واتساب',
        phonePlaceholder: '+966 5X XXX XXXX',
        website: 'رابط الموقع أو حساب السوشيال',
        websitePlaceholder: 'https://yourbrand.com',
            service: 'إيه اللي محتاج مساعدة فيه؟',
            servicePlaceholder: 'اختار الخدمة الأقرب لاحتياجك',
            services: [
                ['growth-engine', 'بناء منظومة نمو مخصصة'],
                ['saas-pos', 'تطوير نظام (SaaS / POS)'],
            ['ecommerce-setup', 'تجهيز متجر (Salla / Zid / Shopify)'],
            ['paid-ads', 'إعلانات ممولة (سناب، تيك توك، جوجل)'],
            ['social-media', 'إدارة السوشيال ميديا'],
            ['content', 'صناعة المحتوى'],
            ['branding', 'هوية وتجهيز العلامة'],
            ['not-sure', 'مش متأكد — محتاج ترشيح'],
        ],
        industry: 'مجال نشاطك',
        industryPlaceholder: 'اختار مجال نشاطك',
        industries: [
            ['ecommerce', 'تجارة إلكترونية'],
            ['restaurants', 'مطاعم ومقاهي'],
            ['services', 'خدمات'],
            ['real-estate', 'عقارات'],
            ['education', 'تعليم وتدريب'],
            ['other', 'مجال آخر'],
        ],
        budget: 'الميزانية الشهرية للتسويق',
        budgetPlaceholder: 'اختار النطاق الأقرب لميزانيتك',
        budgets: [['2000', '1,000 – 3,000 ريال'], ['5000', '3,000 – 10,000 ريال'], ['15000', '10,000 – 50,000+ ريال']],
        preference: 'تفضّل نتواصل معك إزاي؟',
        preferences: [['whatsapp', 'واتساب'], ['phone', 'مكالمة هاتفية'], ['email', 'إيميل']],
        message: 'احكيلنا عن هدفك أو التحدي اللي بتواجهه',
        messagePlaceholder: 'مثلاً: عايز أزود الطلبات، أطلق منتج جديد، أو أرتب تسويق البراند...',
        consent: 'أوافق على استخدام بياناتي للتواصل معي بخصوص هذا الطلب.',
        submit: 'خلينا نبدأ',
        submitting: 'جاري الإرسال...',
        successTitle: 'وصلتنا تفاصيلك',
        successText: 'شكراً لثقتك. هنتواصل معك قريباً بخطوة واضحة تناسب مشروعك.',
        error: 'تعذر إرسال الطلب حالياً. حاول مرة أخرى.',
    } : {
        eyebrow: "LET'S TALK",
        title: 'Ready to grow your business?',
        titleAccent: 'Start here.',
        intro: 'Tell us where your business is today, and we’ll come back with a clear next step that fits your goals and budget.',
        channels: 'Reach us directly',
        emailLabel: 'Email us',
        socialLabel: 'Follow us',
        locationLabel: 'Based in',
        location: 'Riyadh, Kingdom of Saudi Arabia',
        formTitle: "Let's start here",
        formIntro: 'The more we know about your business, the more useful our first conversation can be.',
        name: 'Full name',
        namePlaceholder: 'Your name',
        company: 'Company or project name',
        companyPlaceholder: 'e.g. Wajd Store',
        email: 'Email address',
        emailPlaceholder: 'name@company.com',
        phone: 'Mobile / WhatsApp number',
        phonePlaceholder: '+966 5X XXX XXXX',
        website: 'Website or social profile',
        websitePlaceholder: 'https://yourbrand.com',
        service: 'What would you like help with?',
        servicePlaceholder: 'Choose the closest fit',
        services: [
            ['growth-engine', 'Build a custom growth engine'],
            ['saas-pos', 'SaaS / POS Development'],
            ['ecommerce-setup', 'E-commerce Setup (Salla / Zid / Shopify)'],
            ['paid-ads', 'Paid Advertising (Snap, TikTok, Google)'],
            ['social-media', 'Social Media Management'],
            ['content', 'Content Creation'],
            ['branding', 'Brand Identity'],
            ['not-sure', 'Not sure — recommend a path'],
        ],
        industry: 'Your industry',
        industryPlaceholder: 'Choose your industry',
        industries: [
            ['ecommerce', 'E-commerce'],
            ['restaurants', 'Restaurants & cafés'],
            ['services', 'Services'],
            ['real-estate', 'Real estate'],
            ['education', 'Education & training'],
            ['other', 'Other'],
        ],
        budget: 'Monthly marketing budget',
        budgetPlaceholder: 'Choose the closest range',
        budgets: [['2000', 'SAR 1,000 – 3,000'], ['5000', 'SAR 3,000 – 10,000'], ['15000', 'SAR 10,000 – 50,000+']],
        preference: 'How should we reach you?',
        preferences: [['whatsapp', 'WhatsApp'], ['phone', 'Phone call'], ['email', 'Email']],
        message: 'Tell us about your goal or challenge',
        messagePlaceholder: 'For example: increase enquiries, launch a product, or organize your brand marketing...',
        consent: 'I agree that my information may be used to contact me about this request.',
        submit: 'Start the conversation',
        submitting: 'Sending...',
        successTitle: 'We got your details',
        successText: 'Thank you for reaching out. We’ll be in touch soon with a clear next step for your business.',
        error: 'We could not send your request right now. Please try again.',
    };

    const update = (key, value) => setFormData((current) => ({ ...current, [key]: value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        trackAnalyticsEvent('lead_submit_attempted', {
            service: formData.service,
            industry: formData.industry,
            budget_sar: formData.budget_sar,
            has_builder_selection: Boolean(packageBuilder),
            has_roi_snapshot: Boolean(roiSnapshot),
        });
        setSubmitting(true);
        setError('');
        try {
            const response = await fetch('/api/leads/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    page_url: formData.website || undefined,
                    locale: lang,
                    source: 'website-contact-form',
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const validation = payload.errors ? Object.values(payload.errors).flat().join(' ') : '';
                throw new Error(validation || payload.message || copy.error);
            }
            trackAnalyticsEvent('lead_submitted', {
                service: formData.service,
                industry: formData.industry,
                budget_sar: formData.budget_sar,
                contact_preference: formData.contact_preference,
                has_builder_selection: Boolean(packageBuilder),
            });
            setSuccess(true);
        } catch (submitError) {
            setError(submitError.message || copy.error);
        } finally {
            setSubmitting(false);
        }
    };

    const SelectField = ({ label, value, onChange, placeholder, options, required = true }) => (
        <label className="block">
            <span className={labelClass}>{label}{required && <span className="mr-1 text-gold-500">*</span>}</span>
            <span className="relative block">
                <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} appearance-none ${isArabic ? 'pr-5 pl-11' : 'pl-5 pr-11'}`}>
                    <option value="" className="bg-[#1b1a17]">{placeholder}</option>
                    {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue} className="bg-[#1b1a17]">{optionLabel}</option>)}
                </select>
                <ChevronDown className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500 ${isArabic ? 'left-4' : 'right-4'}`} />
            </span>
        </label>
    );

    return (
        <Layout>
            <main dir={isArabic ? 'rtl' : 'ltr'} className="overflow-hidden">
                <section className="px-[5%] pb-16 pt-36 md:pb-24 md:pt-48">
                    <div className="mx-auto max-w-6xl">
                        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="mb-5 block text-xs font-semibold tracking-[0.28em] text-gold-500">{copy.eyebrow}</span>
                            <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                                <h1 className="max-w-4xl font-serif text-5xl leading-[0.98] md:text-7xl lg:text-8xl">{copy.title}<br /><span className="italic text-gold-500">{copy.titleAccent}</span></h1>
                                <p className="max-w-sm text-base leading-8 text-white/55 md:text-lg">{copy.intro}</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="section-padding pt-0">
                    <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                        <motion.aside initial={{ opacity: 0, x: isArabic ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 md:p-9">
                            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-500"><Sparkles className="h-5 w-5" /></div>
                            <h2 className="mb-8 font-serif text-3xl md:text-4xl">{copy.channels}</h2>
                            <div className="space-y-7">
                                <div className="flex gap-4"><Mail className="mt-1 h-5 w-5 shrink-0 text-gold-500" /><div><p className="mb-1 text-xs uppercase tracking-[0.18em] text-white/35">{copy.emailLabel}</p><a href="mailto:wajd.marketing@gmail.com" className="break-all text-lg text-white/80 transition hover:text-gold-500">wajd.marketing@gmail.com</a></div></div>
                                <div className="flex gap-4"><Globe className="mt-1 h-5 w-5 shrink-0 text-gold-500" /><div><p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/35">{copy.socialLabel}</p><div className="flex gap-4"><a href="https://www.instagram.com/wajdagency" target="_blank" rel="noopener noreferrer" className="text-white/50 transition hover:text-gold-500"><Globe className="h-5 w-5" /></a><a href="https://www.linkedin.com/company/wajdagency" target="_blank" rel="noopener noreferrer" className="text-white/50 transition hover:text-gold-500"><ArrowUpLeft className="h-5 w-5" /></a><a href="https://www.facebook.com/profile.php?id=61562980695038" target="_blank" rel="noopener noreferrer" className="text-white/50 transition hover:text-gold-500"><MessageSquare className="h-5 w-5" /></a></div></div></div>
                                <div className="flex gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-500" /><div><p className="mb-1 text-xs uppercase tracking-[0.18em] text-white/35">{copy.locationLabel}</p><p className="text-lg leading-8 text-white/75">{copy.location}</p></div></div>
                            </div>
                        </motion.aside>

                        <motion.div initial={{ opacity: 0, x: isArabic ? -24 : 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-[2rem] border border-gold-500/20 bg-[#171613] p-6 shadow-2xl shadow-black/30 md:p-10">
                            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
                            <div className="relative">
                                <div className="mb-8 border-b border-white/10 pb-7"><h2 className="font-serif text-3xl md:text-4xl">{copy.formTitle}</h2><p className="mt-3 text-sm leading-7 text-white/45">{copy.formIntro}</p></div>
                                {packageBuilder && !success && <div className={`mb-7 rounded-2xl border border-gold-500/25 bg-gold-500/[0.06] p-5 ${isArabic ? 'text-right' : 'text-left'}`}><div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">{isArabic ? 'المنظومة التي اخترتها' : 'Your selected build'}</p><span className="text-xs text-white/35">{isArabic ? 'سنراجعها معك' : 'We will review it with you'}</span></div><pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-white/70">{builderSummary}</pre></div>}
                                {success ? <div className="py-16 text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10"><CheckCircle2 className="h-8 w-8 text-gold-500" /></div><h3 className="mb-4 font-serif text-3xl text-gold-500">{copy.successTitle}</h3><p className="mx-auto max-w-md text-base leading-8 text-white/60">{copy.successText}</p></div> : <form data-analytics-event="contact_form_started" data-analytics-location="contact_form" className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <label className="block"><span className={labelClass}>{copy.name}<span className="mr-1 text-gold-500">*</span></span><input required type="text" autoComplete="name" value={formData.name} onChange={(event) => update('name', event.target.value)} className={fieldClass} placeholder={copy.namePlaceholder} /></label>
                                        <label className="block"><span className={labelClass}>{copy.company}</span><input type="text" autoComplete="organization" value={formData.company_name} onChange={(event) => update('company_name', event.target.value)} className={fieldClass} placeholder={copy.companyPlaceholder} /></label>
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <label className="block"><span className={labelClass}>{copy.email}<span className="mr-1 text-gold-500">*</span></span><input required type="email" autoComplete="email" value={formData.email} onChange={(event) => update('email', event.target.value)} className={fieldClass} placeholder={copy.emailPlaceholder} /></label>
                                        <label className="block"><span className={labelClass}>{copy.phone}<span className="mr-1 text-gold-500">*</span></span><input required type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => update('phone', event.target.value)} className={`${fieldClass} font-sans`} placeholder={copy.phonePlaceholder} /></label>
                                    </div>
                                    <label className="block"><span className={labelClass}>{copy.website}</span><input type="url" autoComplete="url" value={formData.website} onChange={(event) => update('website', event.target.value)} className={`${fieldClass} font-sans`} placeholder={copy.websitePlaceholder} /></label>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <SelectField label={copy.service} value={formData.service} onChange={(value) => update('service', value)} placeholder={copy.servicePlaceholder} options={copy.services} />
                                        <SelectField label={copy.industry} value={formData.industry} onChange={(value) => update('industry', value)} placeholder={copy.industryPlaceholder} options={copy.industries} />
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <SelectField label={copy.budget} value={formData.budget_sar} onChange={(value) => update('budget_sar', value)} placeholder={copy.budgetPlaceholder} options={copy.budgets} />
                                        <SelectField label={copy.preference} value={formData.contact_preference} onChange={(value) => update('contact_preference', value)} placeholder={copy.preference} options={copy.preferences} />
                                    </div>
                                    <label className="block"><span className={labelClass}>{copy.message}</span><textarea rows="4" value={formData.message} onChange={(event) => update('message', event.target.value)} className={`${fieldClass} resize-none leading-7`} placeholder={copy.messagePlaceholder} /></label>
                                    {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
                                    <label className="flex items-start gap-3 text-sm leading-6 text-white/45"><input required type="checkbox" checked={formData.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 accent-gold-500" />{copy.consent}</label>
                                    <button data-analytics-event="lead_submit_clicked" data-analytics-location="contact_form" disabled={submitting} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gold-500 px-6 py-4 text-base font-bold text-obsidian-950 shadow-xl shadow-gold-500/10 transition hover:bg-gold-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? copy.submitting : copy.submit}<Send className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>
                                </form>}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </Layout>
    );
};

export default Contact;
