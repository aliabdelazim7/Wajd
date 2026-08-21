import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const messageFor = (eventType, lang) => {
    const messages = lang === 'ar' ? {
        lead_submitted: 'أحد أصحاب المشاريع أرسل تفاصيله لبدء محادثة نمو.',
        demo_request_clicked: 'أحد الزوار فتح معاينة نظام وجد.',
        roi_plan_requested: 'أحد الزوار طلب مراجعة أرقام العائد المتوقعة.',
        portal_request_clicked: 'أحد الزوار استكشف فكرة بوابة العميل.',
    } : {
        lead_submitted: 'A business owner submitted a brief to start a growth conversation.',
        demo_request_clicked: 'A visitor opened a Wajd system preview.',
        roi_plan_requested: 'A visitor requested a review of their projected growth numbers.',
        portal_request_clicked: 'A visitor explored the client portal concept.',
    };
    return messages[eventType] || (lang === 'ar' ? 'يوجد تفاعل جديد مع منصة وجد.' : 'There is fresh activity on the Wajd platform.');
};

const relativeTime = (value, lang) => {
    const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
    if (lang === 'ar') return minutes === 1 ? 'منذ دقيقة' : `منذ ${minutes} دقائق`;
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
};

const LiveActivityToast = () => {
    const { lang } = useApp();
    const isArabic = lang === 'ar';
    const [toast, setToast] = useState(null);
    const seenIds = useRef(new Set());

    useEffect(() => {
        let alive = true;
        const load = async () => {
            try {
                const response = await fetch('/api/activity/recent', { headers: { Accept: 'application/json' } });
                if (!response.ok) return;
                const payload = await response.json();
                const next = (payload.data || []).find((item) => !seenIds.current.has(item.id));
                (payload.data || []).forEach((item) => seenIds.current.add(item.id));
                if (!alive || !next) return;
                setToast(next);
                window.setTimeout(() => { if (alive) setToast(null); }, 8500);
            } catch {
                // The toast is a progressive enhancement; never affect the page if activity is unavailable.
            }
        };
        load();
        const timer = window.setInterval(load, 45000);
        return () => { alive = false; window.clearInterval(timer); };
    }, []);

    return <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 18, x: isArabic ? -18 : 18 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 12 }} role="status" aria-live="polite" dir={isArabic ? 'rtl' : 'ltr'} className={`fixed bottom-5 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-gold-500/25 bg-[#171613]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl ${isArabic ? 'left-4 sm:left-6' : 'right-4 sm:right-6'}`}><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500"><CheckCircle2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="mb-1 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-500"><Sparkles className="h-3 w-3" /> {isArabic ? 'نشاط حي' : 'Live activity'}</span><span className="text-[10px] text-white/30">{relativeTime(toast.created_at, lang)}</span></div><p className="text-sm leading-6 text-white/75">{messageFor(toast.event_type, lang)}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] text-white/30">Wajd Growth Platform <ArrowUpRight className="h-3 w-3" /></span></div></div></motion.div>}</AnimatePresence>;
};

export default LiveActivityToast;
