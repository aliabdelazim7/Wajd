import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Activity, AlertTriangle, BarChart3, BriefcaseBusiness, Check, ChevronLeft, Clock3,
    Eye, FileText, HelpCircle, History, Image as ImageIcon, LayoutDashboard, LogOut,
    Menu, MonitorSmartphone, MousePointerClick, PackageOpen, Pencil, Plus, RefreshCw,
    Save, Search, Settings2, Target, Trash2, Upload, Users, Wrench, X
} from 'lucide-react';

const TOKEN_KEY = 'wajd.admin.token';

const navItems = [
    { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { key: 'analytics', label: 'تحليلات الزوار', icon: Activity },
    { key: 'blocks', label: 'محتوى الموقع', icon: FileText },
    { key: 'packages', label: 'الباقات', icon: PackageOpen },
    { key: 'addons', label: 'الوحدات التقنية', icon: Wrench },
    { key: 'faqs', label: 'الأسئلة الشائعة', icon: HelpCircle },
    { key: 'projects', label: 'دراسات الحالة', icon: BriefcaseBusiness },
    { key: 'leads', label: 'العملاء المحتملون', icon: Users },
    { key: 'media', label: 'مكتبة الصور', icon: ImageIcon },
    { key: 'settings', label: 'الإعدادات', icon: Settings2 },
    { key: 'audit', label: 'سجل النشاط', icon: History },
];

const statusLabels = {
    new: 'جديد',
    contacted: 'تم التواصل',
    qualified: 'مؤهل',
    closed: 'مغلق',
    lost: 'غير مهتم',
};

const emptyPackage = {
    slug: '', category: 'marketing', name_ar: '', name_en: '', subtitle_ar: '', subtitle_en: '', price_sar: 0,
    price_one_time_sar: '', compare_at_price_sar: '', billing_cycle: 'monthly', cta_label_ar: '', cta_label_en: '',
    features_ar: '', features_en: '', metadata: '{}', sort_order: 0, is_featured: false, is_published: true,
};

const emptyAddon = {
    slug: '', category: 'technology', name_ar: '', name_en: '', subtitle_ar: '', subtitle_en: '', price_sar: 0,
    billing_cycle: 'one_time', tag_ar: '', tag_en: '', features_ar: '', features_en: '', metadata: '{}',
    sort_order: 0, is_featured: false, is_published: true,
};

const emptyFaq = {
    question_ar: '', question_en: '', answer_ar: '', answer_en: '', sort_order: 0, is_published: true,
};

const emptyProject = {
    slug: '', name_ar: '', name_en: '', category_ar: '', category_en: '', description_ar: '',
    description_en: '', challenge_ar: '', challenge_en: '', strategy_ar: '', strategy_en: '',
    metric_ar: '', metric_en: '', outcome_ar: '', outcome_en: '', evidence_note_ar: '', evidence_note_en: '',
    period_ar: '', period_en: '', results: '{}', results_ar: '[]', results_en: '[]', image_url: '', thumbnail_url: '', gallery: '[]', metadata: '{}',
    alt_text_ar: '', alt_text_en: '', sort_order: 0, is_published: true,
};

const emptyBlock = { key: '', locale: 'ar', title: '', body: '', data: '{}', is_published: true };
const emptySetting = { key: '', type: 'json', value: '{}' };

const getStoredToken = () => {
    try { return window.sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};

const setStoredToken = (token) => {
    try {
        if (token) window.sessionStorage.setItem(TOKEN_KEY, token);
        else window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
        // Session storage can be blocked; the in-memory token still works.
    }
};

const apiRequest = async (path, options = {}, token = null) => {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    const isFormData = options.body instanceof FormData;
    if (options.body && !isFormData) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`/api/admin${path}`, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401) throw new Error('UNAUTHORIZED');
        const validation = payload.errors ? Object.values(payload.errors).flat().join(' ') : '';
        throw new Error(validation || payload.message || 'تعذر تنفيذ العملية حالياً.');
    }
    return payload;
};

class DashboardErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Wajd CMS module render error', error, info);
    }

    retry = () => {
        this.setState({ hasError: false });
        this.props.onRetry?.();
    };

    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.08] p-10 text-center">
                <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-200" />
                <h2 className="font-serif text-2xl text-white">تعذر عرض هذه الوحدة</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/50">حدث خطأ غير متوقع أثناء تجهيز البيانات. بياناتك لم تتأثر؛ جرّب إعادة المحاولة أو انتقل لوحدة أخرى.</p>
                <button type="button" onClick={this.retry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-obsidian-950 transition hover:bg-white"><RefreshCw className="h-4 w-4" />إعادة المحاولة</button>
            </div>
        );
    }
}

const LoadingPanel = () => (
    <div role="status" aria-live="polite" className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/55">
        <RefreshCw className="mx-auto mb-4 h-6 w-6 animate-spin text-gold-500" />
        جاري تحميل بيانات هذه الوحدة...
    </div>
);

const ErrorPanel = ({ onRetry }) => (
    <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-500/[0.08] p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-200" />
        <h2 className="font-serif text-2xl text-white">تعذر تحميل بيانات هذه الوحدة</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/50">تحقق من الاتصال ثم أعد المحاولة. إذا استمرت المشكلة، ستظل بقية وحدات لوحة التحكم متاحة.</p>
        <button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-obsidian-950 transition hover:bg-white"><RefreshCw className="h-4 w-4" />إعادة المحاولة</button>
    </div>
);

const moduleEmptyCopy = {
    blocks: { title: 'لا يوجد محتوى مضاف بعد', description: 'أضف أول كتلة محتوى لإدارة النصوص العربية والإنجليزية من لوحة واحدة.' },
    packages: { title: 'لا توجد باقات بعد', description: 'أضف خططك الأساسية حتى تظهر في أداة بناء منظومة النمو.' },
    addons: { title: 'لا توجد وحدات تقنية بعد', description: 'أضف المتاجر والأنظمة والأتمتة التي يمكن للعميل تركيبها مع خطة النمو.' },
    faqs: { title: 'لا توجد أسئلة شائعة بعد', description: 'أضف الأسئلة التي تساعد العميل على اتخاذ قرار التواصل.' },
    projects: { title: 'لا توجد دراسات حالة بعد', description: 'أضف مشروعاً موثقاً لعرض التحدي والاستراتيجية والنتيجة.' },
    settings: { title: 'لا توجد إعدادات بعد', description: 'أضف إعداداً عاماً للموقع بصيغة JSON صحيحة.' },
};

const ModuleEmptyState = ({ active, onAdd }) => {
    const copy = moduleEmptyCopy[active] || { title: 'لا توجد عناصر بعد', description: 'ابدأ بإضافة أول عنصر من الزر أعلاه.' };
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <FileText className="h-8 w-8 text-gold-500/70" />
            <h3 className="font-serif text-xl text-white">{copy.title}</h3>
            <p className="max-w-md text-sm leading-7 text-white/40">{copy.description}</p>
            <Button type="button" variant="secondary" onClick={onAdd}><Plus className="h-4 w-4" />إضافة عنصر</Button>
        </div>
    );
};

const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-gold-500/60';
const labelClass = 'mb-2 block text-xs font-bold tracking-wide text-white/45';

const Field = ({ label, children, className = '' }) => (
    <label className={`block ${className}`}>
        <span className={labelClass}>{label}</span>
        {children}
    </label>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            variant === 'primary' ? 'bg-gold-500 text-obsidian-950 hover:bg-white' :
            variant === 'danger' ? 'border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20' :
            'border border-white/10 bg-white/[0.04] text-white/70 hover:border-gold-500/30 hover:text-white'
        } ${className}`}
    >{children}</button>
);

const AdminLogin = ({ onAuthenticated }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = await apiRequest('/login', {
                method: 'POST', body: JSON.stringify(form),
            });
            setStoredToken(payload.data.token);
            onAuthenticated(payload.data);
        } catch (exception) {
            setError(exception.message === 'UNAUTHORIZED' ? 'بيانات الدخول غير صحيحة.' : exception.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main dir="rtl" className="min-h-screen bg-[#070707] px-5 py-12 text-white">
            <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
                <form onSubmit={submit} className="w-full rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30 md:p-10">
                    <div className="mb-10 text-center">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-gold-500">WAJD CMS</p>
                        <h1 className="mb-3 font-serif text-4xl">لوحة إدارة وجد</h1>
                        <p className="text-sm leading-7 text-white/45">تحكم في المحتوى، الباقات، دراسات الحالة، والعملاء المحتملين من مكان واحد.</p>
                    </div>
                    <div className="space-y-5">
                        <Field label="البريد الإلكتروني">
                            <input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} placeholder="admin@wajd.agency" />
                        </Field>
                        <Field label="كلمة المرور">
                            <input required type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={inputClass} placeholder="••••••••••••" />
                        </Field>
                        {error && <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm leading-6 text-red-200"><AlertTriangle className="mt-1 h-4 w-4 shrink-0" />{error}</div>}
                        <Button type="submit" disabled={loading} className="w-full py-4">{loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}<ChevronLeft className="h-4 w-4" /></Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const StatCard = ({ label, value, hint, icon: Icon, accent = false }) => (
    <div className={`rounded-2xl border p-5 ${accent ? 'border-gold-500/30 bg-gold-500/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}>
        <div className="mb-5 flex items-center justify-between"><span className="text-sm text-white/45">{label}</span><Icon className={`h-5 w-5 ${accent ? 'text-gold-500' : 'text-white/35'}`} /></div>
        <strong className="block font-serif text-4xl text-white">{value ?? 0}</strong>
        {hint && <span className="mt-2 block text-xs text-white/30">{hint}</span>}
    </div>
);

const DashboardIntro = ({ payload }) => {
    const counts = payload?.counts || {};
    const totalLeads = Number(counts.leads || 0);
    const newLeads = Number(counts.new_leads || 0);
    const followUpRate = totalLeads ? Math.round((newLeads / totalLeads) * 100) : 0;

    return <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gold-500/20 bg-gold-500/[0.035] p-5 md:flex-row md:items-center md:justify-between md:p-6"><div><p className="text-xs font-bold tracking-[0.22em] text-gold-500">تشغيل منظومة وجد</p><h2 className="mt-2 font-serif text-2xl md:text-3xl">أهم ما يحتاج انتباهك اليوم</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">ابدأ بالطلبات الجديدة، ثم راجع آخر التعديلات قبل تحديث المحتوى أو الباقات.</p></div><div className="grid grid-cols-2 gap-3 text-center md:min-w-[260px]"><div className="rounded-xl border border-white/10 bg-black/20 p-3"><strong className="block font-serif text-2xl text-gold-500">{newLeads}</strong><span className="text-[11px] text-white/35">طلبات تحتاج متابعة</span></div><div className="rounded-xl border border-white/10 bg-black/20 p-3"><strong className="block font-serif text-2xl text-white">{followUpRate}%</strong><span className="text-[11px] text-white/35">من إجمالي الطلبات</span></div></div></div>;
};

const Admin = () => {
    const [token, setToken] = useState(getStoredToken);
    const [user, setUser] = useState(null);
    const [active, setActive] = useState('overview');
    const [payload, setPayload] = useState(null);
    const [payloadSection, setPayloadSection] = useState(null);
    const [loading, setLoading] = useState(Boolean(token));
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [editor, setEditor] = useState(null);
    const [mobileNav, setMobileNav] = useState(false);
    const [search, setSearch] = useState('');
    const requestId = useRef(0);

    const notify = useCallback((message) => {
        setNotice(message);
        window.setTimeout(() => setNotice(''), 3200);
    }, []);

    const logout = useCallback(async () => {
        try { if (token) await apiRequest('/logout', { method: 'POST' }, token); } catch { /* local logout still succeeds */ }
        setStoredToken(null);
        setToken(null);
        setUser(null);
    }, [token]);

    const load = useCallback(async (section = active) => {
        if (!token) return;
        const currentRequest = requestId.current + 1;
        requestId.current = currentRequest;
        setLoading(true);
        setError('');
        try {
            const endpoint = section === 'audit' ? '/audit-logs' : `/${section}`;
            const response = await apiRequest(endpoint, {}, token);
            if (currentRequest !== requestId.current) return;
            // Admin endpoints return either a collection or a paginator under `data`.
            // Normalize every non-overview section to an array before rendering so a
            // delayed/nested response can never crash a tab into a blank screen.
            const sectionData = response.data;
            setPayload(section === 'overview' || section === 'analytics'
                ? (sectionData || {})
                : (Array.isArray(sectionData) ? sectionData : (Array.isArray(sectionData?.data) ? sectionData.data : [])));
            setPayloadSection(section);
        } catch (exception) {
            if (currentRequest !== requestId.current) return;
            if (exception.message === 'UNAUTHORIZED') return logout();
            setError(exception.message);
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, [active, logout, token]);

    useEffect(() => {
        if (!token) return;
        apiRequest('/me', {}, token).then((response) => setUser(response.data)).catch(() => logout());
    }, [logout, token]);

    useEffect(() => { load(active); }, [active, load]);

    const save = async (event) => {
        event.preventDefault();
        if (!editor) return;
        setLoading(true);
        setError('');
        try {
            let path = '';
            let method = editor.id ? 'PUT' : 'POST';
            let body = { ...editor };
            delete body.id;
            if (active === 'packages') {
                path = editor.id ? `/packages/${editor.id}` : '/packages';
                body.price_sar = Number(body.price_sar);
                body.price_one_time_sar = body.price_one_time_sar === '' ? null : Number(body.price_one_time_sar);
                body.compare_at_price_sar = body.compare_at_price_sar === '' ? null : Number(body.compare_at_price_sar);
                body.sort_order = Number(body.sort_order || 0);
                body.features_ar = String(body.features_ar || '').split('\n').map((item) => item.trim()).filter(Boolean);
                body.features_en = String(body.features_en || '').split('\n').map((item) => item.trim()).filter(Boolean);
                try { body.metadata = JSON.parse(body.metadata || '{}'); } catch { throw new Error('بيانات الباقة يجب أن تكون JSON صحيحة.'); }
            } else if (active === 'addons') {
                path = editor.id ? `/addons/${editor.id}` : '/addons';
                body.price_sar = Number(body.price_sar);
                body.sort_order = Number(body.sort_order || 0);
                body.features_ar = String(body.features_ar || '').split('\n').map((item) => item.trim()).filter(Boolean);
                body.features_en = String(body.features_en || '').split('\n').map((item) => item.trim()).filter(Boolean);
                try { body.metadata = JSON.parse(body.metadata || '{}'); } catch { throw new Error('بيانات الوحدة التقنية يجب أن تكون JSON صحيحة.'); }
            } else if (active === 'faqs') {
                path = editor.id ? `/faqs/${editor.id}` : '/faqs';
                body.sort_order = Number(body.sort_order || 0);
            } else if (active === 'projects') {
                path = editor.id ? `/projects/${editor.id}` : '/projects';
                body.sort_order = Number(body.sort_order || 0);
                try {
                    body.results = JSON.parse(body.results || '{}');
                    body.results_ar = JSON.parse(body.results_ar || '[]');
                    body.results_en = JSON.parse(body.results_en || '[]');
                    body.gallery = JSON.parse(body.gallery || '[]');
                    body.metadata = JSON.parse(body.metadata || '{}');
                } catch { throw new Error('نتائج أو معرض أو بيانات المشروع يجب أن تكون JSON صحيحة.'); }
            } else if (active === 'blocks') {
                path = '/blocks';
                method = 'PUT';
                try { body.data = JSON.parse(body.data || '{}'); } catch { throw new Error('بيانات المحتوى يجب أن تكون JSON صحيحة.'); }
            } else if (active === 'settings') {
                path = '/settings';
                method = 'PUT';
                try { body.value = JSON.parse(body.value || '{}'); } catch { throw new Error('قيمة الإعداد يجب أن تكون JSON صحيحة.'); }
            }
            await apiRequest(path, { method, body: JSON.stringify(body) }, token);
            setEditor(null);
            notify('تم الحفظ بنجاح.');
            await load(active);
        } catch (exception) {
            if (exception.message === 'UNAUTHORIZED') return logout();
            setError(exception.message);
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id, resource) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
        try {
            await apiRequest(`/${resource}/${id}`, { method: 'DELETE' }, token);
            notify('تم الحذف بنجاح.');
            await load(active);
        } catch (exception) {
            if (exception.message === 'UNAUTHORIZED') return logout();
            setError(exception.message);
        }
    };

    const updateLeadStatus = async (id, status) => {
        try {
            await apiRequest(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
            notify('تم تحديث حالة العميل المحتمل.');
            await load('leads');
        } catch (exception) { setError(exception.message); }
    };

    const triggerLeadFollowUp = async (id) => {
        try {
            const response = await apiRequest(`/leads/${id}/follow-up`, { method: 'POST' }, token);
            notify(response.message || 'تم تشغيل المتابعة.');
            await load('leads');
        } catch (exception) { setError(exception.message); }
    };

    const upload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const body = new FormData();
        body.append('image', file);
        try {
            await apiRequest('/media', { method: 'POST', body }, token);
            notify('تم رفع الصورة.');
            await load('media');
        } catch (exception) { setError(exception.message); }
        event.target.value = '';
    };

    const records = useMemo(() => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
    }, [payload]);
    const hasPayloadForActive = payloadSection === active && payload !== null;

    if (!token) return <AdminLogin onAuthenticated={(data) => { setToken(data.token); setUser(data.user); }} />;

    const openEditor = (record = null) => {
        if (active === 'packages') setEditor(record ? {
            ...record,
            price_one_time_sar: record.price_one_time_sar ?? '',
            compare_at_price_sar: record.compare_at_price_sar ?? '',
            features_ar: Array.isArray(record.features_ar) ? record.features_ar.join('\n') : String(record.features_ar || ''),
            features_en: Array.isArray(record.features_en) ? record.features_en.join('\n') : String(record.features_en || ''),
            metadata: JSON.stringify(record.metadata || {}, null, 2),
        } : { ...emptyPackage });
        if (active === 'addons') setEditor(record ? {
            ...record,
            features_ar: Array.isArray(record.features_ar) ? record.features_ar.join('\n') : String(record.features_ar || ''),
            features_en: Array.isArray(record.features_en) ? record.features_en.join('\n') : String(record.features_en || ''),
            metadata: JSON.stringify(record.metadata || {}, null, 2),
        } : { ...emptyAddon });
        if (active === 'faqs') setEditor(record ? { ...record } : { ...emptyFaq });
        if (active === 'projects') setEditor(record ? {
            ...record,
            results: JSON.stringify(record.results || {}, null, 2),
            results_ar: JSON.stringify(record.results_ar || record.results || [], null, 2),
            results_en: JSON.stringify(record.results_en || record.results || [], null, 2),
            gallery: JSON.stringify(record.gallery || [], null, 2),
            metadata: JSON.stringify(record.metadata || {}, null, 2),
        } : { ...emptyProject });
        if (active === 'blocks') setEditor(record ? { ...record, data: JSON.stringify(record.data || {}, null, 2) } : { ...emptyBlock });
        if (active === 'settings') setEditor(record ? { ...record, value: JSON.stringify(record.value || {}, null, 2) } : { ...emptySetting });
    };

    const pageTitle = navItems.find((item) => item.key === active)?.label || 'لوحة التحكم';

    return (
        <main dir="rtl" className="min-h-screen bg-[#070707] text-white">
            <div className="flex min-h-screen">
                {mobileNav && <button aria-label="إغلاق القائمة" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-black/70 lg:hidden" />}
                <aside className={`fixed inset-y-0 right-0 z-40 w-72 border-l border-white/10 bg-[#0b0b0b] p-5 transition-transform lg:static lg:translate-x-0 ${mobileNav ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="mb-10 flex items-center justify-between px-2"><div><p className="text-xs font-bold tracking-[0.3em] text-gold-500">WAJD CMS</p><p className="mt-2 font-serif text-xl">لوحة التحكم</p></div><button onClick={() => setMobileNav(false)} className="text-white/50 lg:hidden"><X /></button></div>
                    <nav className="space-y-1">
                        {navItems.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => { setActive(key); setEditor(null); setMobileNav(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition ${active === key ? 'bg-gold-500 text-obsidian-950' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}
                    </nav>
                    <div className="absolute bottom-5 left-5 right-5 border-t border-white/10 pt-5"><div className="mb-4 px-2 text-xs text-white/40">{user?.name || 'Admin'}<br /><span className="text-white/20">{user?.email}</span></div><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-200/70 transition hover:bg-red-500/10"><LogOut className="h-4 w-4" />تسجيل الخروج</button></div>
                </aside>

                <section className="min-w-0 flex-1">
                    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070707]/90 px-5 py-4 backdrop-blur-xl md:px-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-xl border border-white/10 p-2 text-white/70 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-xs text-white/35">Wajd Agency / CMS</p><h1 className="mt-1 font-serif text-2xl">{pageTitle}</h1></div></div><div className="flex items-center gap-2"><Button variant="secondary" onClick={() => load(active)} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />تحديث</Button><a href="/" target="_blank" rel="noreferrer" className="hidden rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 transition hover:text-white md:inline-flex">عرض الموقع</a></div></div></header>

                    <div className="mx-auto max-w-[1500px] p-5 md:p-8">
                        {notice && <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-100 shadow-xl"><Check className="h-4 w-4" />{notice}</div>}
                        {error && <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100"><span className="flex items-start gap-2"><AlertTriangle className="mt-1 h-4 w-4 shrink-0" />{error}</span><button onClick={() => setError('')}><X className="h-4 w-4" /></button></div>}
                        {loading && !hasPayloadForActive && <LoadingPanel />}
                        {!loading && error && !hasPayloadForActive && <ErrorPanel onRetry={() => load(active)} />}
                        {hasPayloadForActive && <DashboardErrorBoundary onRetry={() => load(active)}>
                            {active === 'overview' && <><DashboardIntro payload={payload} /><Overview payload={payload} /></>}
                            {active === 'analytics' && <AnalyticsSection payload={payload} />}
                            {(active === 'packages' || active === 'addons' || active === 'faqs' || active === 'projects' || active === 'blocks' || active === 'settings') && <CrudSection active={active} records={records} editor={editor} setEditor={setEditor} openEditor={openEditor} save={save} remove={remove} />}
                            {active === 'leads' && <LeadsSection records={records} search={search} setSearch={setSearch} updateLeadStatus={updateLeadStatus} triggerLeadFollowUp={triggerLeadFollowUp} remove={remove} />}
                            {active === 'media' && <MediaSection records={records} upload={upload} remove={remove} />}
                            {active === 'audit' && <AuditSection records={records} />}
                        </DashboardErrorBoundary>}
                    </div>
                </section>
            </div>
        </main>
    );
};

const analyticsEventLabels = {
    page_view: 'مشاهدة صفحة',
    scroll_depth: 'تقدم في التصفح',
    cta_clicked: 'ضغط على دعوة إجراء',
    builder_started: 'بدأ بناء المنظومة',
    builder_base_selected: 'اختار خطة أساسية',
    builder_addon_toggled: 'غيّر وحدة إضافية',
    builder_continue_clicked: 'تابع إلى التواصل',
    contact_form_viewed: 'فتح نموذج التواصل',
    contact_form_started: 'بدأ نموذج التواصل',
    lead_submit_clicked: 'ضغط إرسال الطلب',
    lead_submit_attempted: 'حاول إرسال طلب',
    lead_submitted: 'أرسل طلباً جديداً',
    engagement_heartbeat: 'تفاعل مستمر',
    session_pause: 'غادر الصفحة مؤقتاً',
    session_resume: 'عاد للموقع',
    session_end: 'انتهت الجلسة',
    demo_tab_switched: 'تنقل داخل معاينة المنتج',
    demo_walkthrough_clicked: 'طلب شرح المنتج',
    demo_live_preview_clicked: 'فتح معاينة حية',
    demo_request_clicked: 'طلب بناء نظام',
    roi_calculator_used: 'شغّل حاسبة العائد',
    roi_plan_requested: 'طلب مراجعة أرقام العائد',
    portal_preview_tab_clicked: 'تنقل داخل معاينة البوابة',
    portal_message_clicked: 'طلب تحديث من البوابة',
    portal_request_clicked: 'طلب بوابة عميل',
};

const formatDuration = (seconds) => {
    const value = Math.max(0, Number(seconds || 0));
    if (value < 60) return `${value}ث`;
    const minutes = Math.floor(value / 60);
    const remaining = value % 60;
    return `${minutes}د ${remaining}ث`;
};

const formatAnalyticsDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
};

const TrendChart = ({ data = [] }) => {
    const values = data.map((item) => Number(item.sessions || 0));
    const max = Math.max(...values, 1);
    const width = 760;
    const height = 220;
    const points = data.map((item, index) => {
        const x = data.length <= 1 ? width / 2 : (index / (data.length - 1)) * width;
        const y = height - ((Number(item.sessions || 0) / max) * (height - 30)) - 15;
        return `${x},${y}`;
    }).join(' ');

    return <div className="min-h-[270px] rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="font-serif text-xl">حركة الزيارات</h3><p className="mt-1 text-xs text-white/35">عدد الجلسات المسجلة يومياً</p></div><Activity className="h-5 w-5 text-gold-500" /></div>
        {data.length ? <>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-[205px] w-full" role="img" aria-label="رسم بياني للجلسات اليومية">
                <line x1="0" y1={height - 15} x2={width} y2={height - 15} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <polyline points={points} fill="none" stroke="#c5a862" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {data.map((item, index) => {
                    const [x, y] = points.split(' ')[index].split(',');
                    return <circle key={`${item.date}-${index}`} cx={x} cy={y} r="4" fill="#070707" stroke="#c5a862" strokeWidth="3" />;
                })}
            </svg>
            <div className="flex justify-between gap-3 text-[11px] text-white/30"><span>{formatAnalyticsDate(data[0]?.date)}</span><span>{formatAnalyticsDate(data[data.length - 1]?.date)}</span></div>
        </> : <div className="flex min-h-[205px] items-center justify-center text-sm text-white/35">لم تبدأ البيانات بالتجمع بعد.</div>}
    </div>;
};

const AnalyticsBarList = ({ items = [], label, valueKey = 'sessions', labelKey = 'label', suffix = '' }) => {
    const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);
    return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-serif text-xl">{label}</h3><Target className="h-5 w-5 text-gold-500" /></div><div className="space-y-4">{items.length ? items.map((item, index) => { const value = Number(item[valueKey] || 0); const title = item[labelKey] || '—'; return <div key={`${title}-${index}`}><div className="mb-2 flex items-center justify-between gap-4 text-sm"><span className="truncate text-white/65" dir="ltr">{title}</span><strong className="shrink-0 text-gold-500">{value}{suffix}</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold-500" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} /></div></div>; }) : <p className="text-sm text-white/35">لا توجد بيانات كافية في الفترة الحالية.</p>}</div></div>;
};

const AnalyticsSection = ({ payload }) => {
    const summary = payload?.summary || {};
    const trend = payload?.trend || [];
    const intentBreakdown = (payload?.intent_breakdown || []).map((item) => ({ ...item, bucket: item.bucket === 'high' ? 'اهتمام مرتفع' : item.bucket === 'medium' ? 'اهتمام متوسط' : 'اهتمام منخفض' }));
    const addonRows = (payload?.top_addons || []).map((item) => ({ ...item, label: item.name || item.id }));
    const deviceRows = (payload?.device_breakdown || []).map((item) => ({ ...item, label: item.device === 'mobile' ? 'موبايل' : item.device === 'tablet' ? 'تابلت' : 'كمبيوتر' }));

    return <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold tracking-[0.22em] text-gold-500">GROWTH COMMAND CENTER</p><h2 className="mt-2 font-serif text-3xl md:text-4xl">الزوار لم يشاهدوا فقط — ماذا فعلوا؟</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-white/45">اقرأ نية الزائر من سلوكه: مدة الجلسة، التصفح، تفاعل Growth Engine، وبدء التواصل. الأرقام مبنية على الأحداث المسجلة من الموقع خلال آخر {payload?.period_days || 30} يوماً.</p></div><span className="inline-flex items-center gap-2 self-start rounded-full border border-green-400/20 bg-green-500/10 px-3 py-2 text-xs text-green-100"><span className="h-2 w-2 rounded-full bg-green-400" />التتبع يعمل</span></div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="الجلسات" value={summary.sessions} hint="زيارات قابلة للتحليل" icon={Eye} accent />
            <StatCard label="الزوار الفريدون" value={summary.unique_visitors} hint="بدون تكرار visitor ID" icon={Users} />
            <StatCard label="متوسط الجلسة" value={formatDuration(summary.average_duration)} hint="وقت التفاعل المسجل" icon={Clock3} />
            <StatCard label="جلسات متفاعلة" value={`${summary.engagement_rate || 0}%`} hint={`${summary.engaged_sessions || 0} جلسة`} icon={MousePointerClick} />
            <StatCard label="اهتمام مرتفع" value={summary.high_intent_sessions} hint={`${summary.leads || 0} طلبات خلال الفترة`} icon={Target} accent />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"><TrendChart data={trend} /><AnalyticsBarList items={intentBreakdown} label="توزيع نية الزوار" valueKey="sessions" labelKey="bucket" /></div>
        <div className="grid gap-6 lg:grid-cols-2"><AnalyticsBarList items={addonRows} label="أكثر الوحدات التقنية اهتماماً" valueKey="selections" labelKey="label" suffix=" اختيار" /><AnalyticsBarList items={deviceRows} label="الأجهزة المستخدمة" valueKey="sessions" labelKey="label" suffix=" جلسة" /></div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]"><AnalyticsBarList items={(payload?.top_pages || []).map((item) => ({ ...item, label: item.path }))} label="أكثر الصفحات زيارة" valueKey="views" labelKey="label" suffix=" مشاهدة" /><div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><h3 className="font-serif text-xl">النشاط الحي</h3><p className="mt-1 text-xs text-white/35">آخر إشارات سلوكية وصلت للنظام</p></div><Activity className="h-5 w-5 text-gold-500" /></div><div className="max-h-[420px] overflow-y-auto">{(payload?.live_activity || []).length ? <div className="divide-y divide-white/5">{payload.live_activity.map((item) => <div key={item.id} className="flex items-start gap-3 p-4"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-500" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-white/80">{analyticsEventLabels[item.event_type] || item.event_type}</p><span className={`rounded-full px-2 py-1 text-[10px] ${Number(item.intent_score) >= 50 ? 'bg-gold-500/15 text-gold-500' : 'bg-white/10 text-white/45'}`}>نية {item.intent_score || 0}</span></div><p className="mt-1 truncate text-xs text-white/35" dir="ltr">{item.page_path}</p><p className="mt-1 text-[11px] text-white/25">{item.locale === 'en' ? 'English' : 'العربية'} · {new Date(item.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p></div></div>)}</div> : <p className="p-8 text-center text-sm text-white/35">ستظهر الأنشطة هنا مع دخول زوار جدد.</p>}</div></div></div>

        <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><p className="text-xs text-white/35">الطلبات من الزيارات</p><strong className="mt-2 block font-serif text-3xl text-gold-500">{summary.lead_conversion_rate || 0}%</strong><p className="mt-2 text-xs leading-6 text-white/35">مؤشر أولي يحتاج قراءة مع حجم البيانات.</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><p className="text-xs text-white/35">تقدم التصفح</p><strong className="mt-2 block font-serif text-3xl text-white">{(payload?.top_events || []).find((item) => item.event_type === 'scroll_depth')?.total || 0}</strong><p className="mt-2 text-xs leading-6 text-white/35">إشارات وصول إلى نقاط أعمق في الصفحة.</p></div><div className="rounded-2xl border border-gold-500/20 bg-gold-500/[0.05] p-5"><p className="text-xs text-gold-500/80">قرار عملي</p><strong className="mt-2 block font-serif text-xl text-white">تابع الاهتمام المرتفع أولاً</strong><p className="mt-2 text-xs leading-6 text-white/45">أي جلسة فوق 50 نقطة نية تستحق أولوية في إعادة الاستهداف أو المتابعة.</p></div></div>
    </div>;
};

const Overview = ({ payload }) => {
    const counts = payload?.counts || {};
    return <div className="space-y-8"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><StatCard label="كل العملاء المحتملين" value={counts.leads} hint="إجمالي الطلبات المسجلة" icon={Users} /><StatCard label="طلبات جديدة" value={counts.new_leads} hint="تحتاج متابعة أولية" icon={BarChart3} accent /><StatCard label="الباقات المنشورة" value={counts.packages} hint="متاحة في الموقع" icon={PackageOpen} /><StatCard label="الوحدات التقنية" value={counts.addons} hint="إضافات قابلة للتركيب" icon={Wrench} /><StatCard label="دراسات الحالة" value={counts.projects} hint="تدعم الثقة والبيع" icon={BriefcaseBusiness} /><StatCard label="الأسئلة الشائعة" value={counts.faqs} hint="تقلل تردد العميل" icon={HelpCircle} /></div><div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="flex items-center justify-between border-b border-white/10 p-5"><h2 className="font-serif text-xl">آخر الطلبات</h2><span className="text-xs text-white/35">آخر 8 طلبات</span></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-right text-sm"><thead className="text-white/35"><tr><th className="p-4">الاسم</th><th className="p-4">الخدمة</th><th className="p-4">الميزانية</th><th className="p-4">الحالة</th><th className="p-4">التاريخ</th></tr></thead><tbody>{(payload?.recent_leads || []).map((lead) => <tr key={lead.id} className="border-t border-white/5"><td className="p-4"><strong>{lead.name}</strong>{lead.company_name && <><br /><span className="text-xs text-white/50">{lead.company_name}</span></>}<br /><span className="text-xs text-white/35">{lead.email}</span></td><td className="p-4 text-white/60">{lead.service || '—'}{lead.package_selection && <p className="mt-2 text-xs text-gold-500">{lead.package_selection.basePlan?.name || 'Growth Engine'}{lead.package_selection.addons?.length ? ` + ${lead.package_selection.addons.length} وحدة` : ''}</p>}</td><td className="p-4 text-gold-500">{lead.budget_sar ? `${Number(lead.budget_sar).toLocaleString()} SAR` : '—'}</td><td className="p-4"><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{statusLabels[lead.status] || lead.status}</span></td><td className="p-4 text-white/35">{new Date(lead.created_at).toLocaleDateString('ar-SA')}</td></tr>)}{!payload?.recent_leads?.length && <tr><td colSpan="5" className="p-10 text-center text-white/35">لا توجد طلبات بعد.</td></tr>}</tbody></table></div></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h2 className="mb-5 font-serif text-xl">آخر النشاطات</h2><div className="space-y-4">{(payload?.recent_activity || []).map((activity) => <div key={activity.id} className="flex items-start gap-3 border-b border-white/5 pb-4"><div className="mt-1 h-2 w-2 rounded-full bg-gold-500" /><div><p className="text-sm text-white/75">{activity.action} · {activity.entity}</p><p className="mt-1 text-xs text-white/35">{activity.user?.name || 'System'} · {new Date(activity.created_at).toLocaleString('ar-SA')}</p></div></div>)}{!payload?.recent_activity?.length && <p className="text-sm text-white/35">سيظهر النشاط الإداري هنا.</p>}</div></div></div></div>;
};

const CrudSection = ({ active, records, editor, setEditor, openEditor, save, remove }) => {
    const titles = { blocks: 'محتوى الموقع', packages: 'الباقات والخطط', addons: 'الوحدات التقنية', faqs: 'الأسئلة الشائعة', projects: 'دراسات الحالة', settings: 'إعدادات الموقع' };
    const resources = { packages: 'packages', addons: 'addons', faqs: 'faqs', projects: 'projects', blocks: 'blocks', settings: 'settings' };
    const newLabel = active === 'blocks' ? 'إضافة محتوى' : active === 'settings' ? 'إضافة إعداد' : active === 'addons' ? 'إضافة وحدة تقنية' : active === 'faqs' ? 'إضافة سؤال' : active === 'projects' ? 'إضافة دراسة حالة' : 'إضافة باقة';
    return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-3xl">{titles[active]}</h2><p className="mt-2 text-sm text-white/40">كل تعديل هنا ينعكس على محتوى الموقع بعد ربط الواجهة بالـ API.</p></div><Button onClick={() => openEditor()}><Plus className="h-4 w-4" />{newLabel}</Button></div>{editor && <EditorPanel active={active} editor={editor} setEditor={setEditor} save={save} onClose={() => setEditor(null)} />}{!editor && <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead className="text-white/35"><tr>{(active === 'packages' || active === 'addons') && <><th className="p-4">العنصر</th><th className="p-4">النوع</th><th className="p-4">السعر</th><th className="p-4">المميزات</th></>}{active === 'faqs' && <><th className="p-4">السؤال بالعربية</th><th className="p-4">السؤال بالإنجليزية</th></>}{active === 'projects' && <><th className="p-4">المشروع</th><th className="p-4">التصنيف</th><th className="p-4">الصورة</th></>}{active === 'blocks' && <><th className="p-4">المفتاح</th><th className="p-4">اللغة</th><th className="p-4">العنوان</th></>}{active === 'settings' && <><th className="p-4">المفتاح</th><th className="p-4">القيمة</th></>}</tr></thead><tbody>{records.map((record) => <tr key={record.id} className="border-t border-white/5 align-top"><td className="p-4">{active === 'packages' || active === 'addons' ? <><strong>{record.name_ar}</strong><br /><span className="text-xs text-white/35">{record.name_en}</span><br /><span className="text-[10px] text-white/30">{record.category}</span></> : active === 'faqs' ? record.question_ar : active === 'projects' ? <><strong>{record.name_ar}</strong><br /><span className="text-xs text-white/35">{record.slug}</span></> : active === 'blocks' ? <><strong>{record.key}</strong><br /><span className="text-xs text-white/35">{record.title}</span></> : record.key}</td>{(active === 'packages' || active === 'addons') && <><td className="p-4 text-white/55">{record.billing_cycle === 'monthly' ? 'شهري' : record.billing_cycle === 'one_time' ? 'مرة واحدة' : record.billing_cycle}</td><td className="p-4 text-gold-500">{Number(record.price_sar || 0).toLocaleString()} SAR</td><td className="max-w-sm p-4 text-white/55">{(record.features_ar || []).slice(0, 3).join(' · ') || record.subtitle_ar || '—'}</td></>}{active === 'faqs' && <td className="p-4 text-white/55">{record.question_en}</td>}{active === 'projects' && <><td className="p-4 text-white/55">{record.category_ar || '—'}</td><td className="p-4">{record.image_url ? <img src={record.image_url} alt={record.alt_text_ar || record.name_ar} className="h-12 w-20 rounded-lg object-cover" /> : '—'}</td></>}{active === 'blocks' && <><td className="p-4 text-gold-500">{record.locale}</td><td className="p-4 text-white/55">{record.title || '—'}</td></>}{active === 'settings' && <td className="max-w-md p-4 text-white/55"><code className="text-xs">{JSON.stringify(record.value)}</code></td>}<td className="p-4"><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => openEditor(record)}><Pencil className="h-4 w-4" />تعديل</Button><Button variant="danger" onClick={() => remove(record.id, resources[active])}><Trash2 className="h-4 w-4" />حذف</Button></div></td></tr>)}{!records.length && <tr><td colSpan="6" className="p-5"><ModuleEmptyState active={active} onAdd={() => openEditor()} /></td></tr>}</tbody></table></div></div>}</div>;
};

const EditorPanel = ({ active, editor, setEditor, save, onClose }) => {
    const update = (key, value) => setEditor({ ...editor, [key]: value });
    const field = (label, key, type = 'text', className = '') => <Field label={label} className={className}>{type === 'textarea' ? <textarea rows="4" value={editor[key] ?? ''} onChange={(event) => update(key, event.target.value)} className={inputClass} /> : <input type={type} value={editor[key] ?? ''} onChange={(event) => update(key, event.target.value)} className={inputClass} />}</Field>;
    const selectField = (label, key, options) => <Field label={label}><select value={editor[key] ?? ''} onChange={(event) => update(key, event.target.value)} className={inputClass}>{options.map(([value, optionLabel]) => <option key={value} value={value} className="bg-[#121212]">{optionLabel}</option>)}</select></Field>;
    return <form onSubmit={save} className="rounded-2xl border border-gold-500/20 bg-gold-500/[0.035] p-5 md:p-7"><div className="mb-6 flex items-center justify-between"><h3 className="font-serif text-2xl">{editor.id ? 'تعديل العنصر' : 'إضافة عنصر جديد'}</h3><button type="button" onClick={onClose} className="text-white/50 hover:text-white"><X /></button></div><div className="grid gap-5 md:grid-cols-2">{active === 'packages' && <>{field('المعرف اللاتيني', 'slug')} {selectField('تصنيف الباقة', 'category', [['marketing', 'تسويق'], ['technology', 'تقنية'], ['hybrid', 'هجينة']])} {field('الاسم بالعربية', 'name_ar')} {field('الاسم بالإنجليزية', 'name_en')} {field('العنوان الفرعي بالعربية', 'subtitle_ar')} {field('العنوان الفرعي بالإنجليزية', 'subtitle_en')} {field('السعر الشهري بالريال', 'price_sar', 'number')} {field('السعر لمرة واحدة بالريال', 'price_one_time_sar', 'number')} {field('السعر قبل الخصم بالريال', 'compare_at_price_sar', 'number')} {selectField('دورة الفوترة', 'billing_cycle', [['monthly', 'شهري'], ['one_time', 'مرة واحدة'], ['custom', 'حسب النطاق']])} {field('زر الإجراء بالعربية', 'cta_label_ar')} {field('زر الإجراء بالإنجليزية', 'cta_label_en')} {field('الترتيب', 'sort_order', 'number')} {field('مميزات العربية — كل سطر ميزة', 'features_ar', 'textarea', 'md:col-span-2')} {field('مميزات الإنجليزية — كل سطر ميزة', 'features_en', 'textarea', 'md:col-span-2')} {field('بيانات إضافية بصيغة JSON', 'metadata', 'textarea', 'md:col-span-2')}</>}{active === 'addons' && <>{field('المعرف اللاتيني', 'slug')} {selectField('تصنيف الوحدة', 'category', [['technology', 'تقنية'], ['service', 'خدمة'], ['hybrid', 'هجينة']])} {field('الاسم بالعربية', 'name_ar')} {field('الاسم بالإنجليزية', 'name_en')} {field('الوصف المختصر بالعربية', 'subtitle_ar')} {field('الوصف المختصر بالإنجليزية', 'subtitle_en')} {field('السعر بالريال', 'price_sar', 'number')} {selectField('دورة الفوترة', 'billing_cycle', [['monthly', 'شهري'], ['one_time', 'مرة واحدة'], ['custom', 'حسب النطاق']])} {field('التصنيف الظاهر بالعربية', 'tag_ar')} {field('التصنيف الظاهر بالإنجليزية', 'tag_en')} {field('الترتيب', 'sort_order', 'number')} {field('المميزات بالعربية — كل سطر ميزة', 'features_ar', 'textarea', 'md:col-span-2')} {field('المميزات بالإنجليزية — كل سطر ميزة', 'features_en', 'textarea', 'md:col-span-2')} {field('بيانات إضافية بصيغة JSON', 'metadata', 'textarea', 'md:col-span-2')}</>}{active === 'faqs' && <>{field('السؤال بالعربية', 'question_ar', 'textarea')} {field('السؤال بالإنجليزية', 'question_en', 'textarea')} {field('الإجابة بالعربية', 'answer_ar', 'textarea')} {field('الإجابة بالإنجليزية', 'answer_en', 'textarea')} {field('الترتيب', 'sort_order', 'number')}</>}{active === 'projects' && <>{field('المعرف اللاتيني', 'slug')} {field('الاسم بالعربية', 'name_ar')} {field('الاسم بالإنجليزية', 'name_en')} {field('التصنيف بالعربية', 'category_ar')} {field('التصنيف بالإنجليزية', 'category_en')} {field('الوصف بالعربية', 'description_ar', 'textarea')} {field('الوصف بالإنجليزية', 'description_en', 'textarea')} {field('التحدي بالعربية', 'challenge_ar', 'textarea')} {field('التحدي بالإنجليزية', 'challenge_en', 'textarea')} {field('الاستراتيجية بالعربية', 'strategy_ar', 'textarea')} {field('الاستراتيجية بالإنجليزية', 'strategy_en', 'textarea')} {field('المؤشر الرئيسي بالعربية', 'metric_ar')} {field('المؤشر الرئيسي بالإنجليزية', 'metric_en')} {field('النتيجة الأساسية بالعربية', 'outcome_ar')} {field('النتيجة الأساسية بالإنجليزية', 'outcome_en')} {field('الفترة بالعربية', 'period_ar')} {field('الفترة بالإنجليزية', 'period_en')} {field('رابط الصورة الرئيسية', 'image_url')} {field('رابط الصورة المصغرة', 'thumbnail_url')} {field('النص البديل بالعربية', 'alt_text_ar')} {field('النص البديل بالإنجليزية', 'alt_text_en')} {field('النتائج المشتركة بصيغة JSON — توافق قديم', 'results', 'textarea', 'md:col-span-2')} {field('نتائج العربية بصيغة JSON — كل سطر نتيجة', 'results_ar', 'textarea', 'md:col-span-2')} {field('نتائج الإنجليزية بصيغة JSON — كل سطر نتيجة', 'results_en', 'textarea', 'md:col-span-2')} {field('معرض الصور بصيغة JSON — روابط مرتبة', 'gallery', 'textarea', 'md:col-span-2')} {field('ملاحظة الإثبات بالعربية', 'evidence_note_ar', 'textarea', 'md:col-span-2')} {field('ملاحظة الإثبات بالإنجليزية', 'evidence_note_en', 'textarea', 'md:col-span-2')} {field('بيانات إضافية بصيغة JSON', 'metadata', 'textarea', 'md:col-span-2')} {field('الترتيب', 'sort_order', 'number')}</>}{active === 'blocks' && <>{field('مفتاح المحتوى', 'key')} {field('اللغة', 'locale')} {field('العنوان', 'title')} {field('نص المحتوى', 'body', 'textarea', 'md:col-span-2')} {field('بيانات إضافية بصيغة JSON', 'data', 'textarea', 'md:col-span-2')}</>}{active === 'settings' && <>{field('مفتاح الإعداد', 'key')} {field('نوع الإعداد', 'type')} {field('القيمة بصيغة JSON', 'value', 'textarea', 'md:col-span-2')}</>}</div><div className="mt-6 flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-sm text-white/65"><input type="checkbox" checked={Boolean(editor.is_published)} onChange={(event) => update('is_published', event.target.checked)} />منشور على الموقع</label>{(active === 'packages' || active === 'addons') && <label className="flex items-center gap-2 text-sm text-white/65"><input type="checkbox" checked={Boolean(editor.is_featured)} onChange={(event) => update('is_featured', event.target.checked)} />باقة مميزة</label>}<div className="mr-auto flex gap-2"><Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button><Button type="submit"><Save className="h-4 w-4" />حفظ التغييرات</Button></div></div></form>;
};

const LeadsSection = ({ records, search, setSearch, updateLeadStatus, triggerLeadFollowUp, remove }) => <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-3xl">العملاء المحتملون</h2><p className="mt-2 text-sm text-white/40">تابع كل العملاء الذين تواصلوا معك من الموقع وحدّث مراحل المتابعة.</p></div><div className="relative"><Search className="absolute right-3 top-3 h-4 w-4 text-white/30" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو البريد" className={`${inputClass} w-72 pr-10`} /></div></div><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"><table className="w-full min-w-[1000px] text-right text-sm"><thead className="text-white/35"><tr><th className="p-4">العميل</th><th className="p-4">التواصل</th><th className="p-4">الخدمة</th><th className="p-4">الميزانية</th><th className="p-4">الحالة</th><th className="p-4">التاريخ</th><th className="p-4">إجراء</th></tr></thead><tbody>{records.filter((lead) => `${lead.name} ${lead.company_name || ''} ${lead.email || ''} ${lead.phone || ''} ${lead.industry || ''}`.toLowerCase().includes(search.toLowerCase())).map((lead) => <tr key={lead.id} className="border-t border-white/5 align-top"><td className="p-4"><strong>{lead.name}</strong>{lead.company_name && <p className="mt-1 text-xs text-white/50">{lead.company_name}</p>}{lead.industry && <p className="mt-1 text-xs text-white/35">{lead.industry}</p>}{lead.message && <p className="mt-2 max-w-xs text-xs leading-5 text-white/35">{lead.message}</p>}</td><td className="p-4 text-white/60">{lead.email}<br />{lead.phone || '—'}{lead.contact_preference && <><br /><span className="text-xs text-white/35">يفضل: {lead.contact_preference}</span></>}</td><td className="p-4 text-white/55">{lead.service || 'غير محددة'}{lead.package_selection && <div className="mt-2 max-w-xs text-xs leading-5 text-gold-500"><strong>{lead.package_selection.basePlan?.name || 'Growth Engine'}</strong>{(lead.package_selection.addons || []).length > 0 && <><br />{lead.package_selection.addons.map((addon) => addon.name).join(' · ')}</>}</div>}</td><td className="p-4 text-gold-500">{lead.budget_sar ? `${Number(lead.budget_sar).toLocaleString()} SAR` : '—'}</td><td className="p-4"><select value={lead.status} onChange={(event) => updateLeadStatus(lead.id, event.target.value)} className="rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-xs text-white"><option value="new">جديد</option><option value="contacted">تم التواصل</option><option value="qualified">مؤهل</option><option value="closed">مغلق</option><option value="lost">غير مهتم</option></select></td><td className="p-4 text-white/35">{new Date(lead.created_at).toLocaleDateString('ar-SA')}</td><td className="p-4"><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => triggerLeadFollowUp(lead.id)}><Clock3 className="h-4 w-4" />{lead.nurture_stage === 'follow_up_sent' ? 'أُرسلت' : 'إرسال متابعة'}</Button><Button variant="danger" onClick={() => remove(lead.id, 'leads')}><Trash2 className="h-4 w-4" />حذف</Button></div><p className="mt-2 text-[10px] text-white/30">{lead.portal_status === 'invited' ? 'بوابة العميل: مفعّلة' : lead.nurture_stage === 'welcome_sent' ? 'رسالة الترحيب: أُرسلت' : 'المتابعة: تحتاج إعداد القناة'}</p></td></tr>)}{!records.length && <tr><td colSpan="7" className="p-12 text-center text-white/35">لا توجد طلبات مطابقة.</td></tr>}</tbody></table></div></div>;

const MediaSection = ({ records, upload, remove }) => <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-3xl">مكتبة الصور</h2><p className="mt-2 text-sm text-white/40">ارفع الصور إلى التخزين المتصل بالمشروع واستخدم روابطها في دراسات الحالة والمحتوى.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-obsidian-950 transition hover:bg-white"><Upload className="h-4 w-4" />رفع صورة<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={upload} className="hidden" /></label></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{records.map((asset) => <div key={asset.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="aspect-square bg-white/5"><img src={asset.url} alt={asset.alt_text || asset.filename} className="h-full w-full object-cover" /></div><div className="flex items-center justify-between gap-2 p-3"><p className="truncate text-xs text-white/55">{asset.filename}</p><button onClick={() => remove(asset.id, 'media')} className="shrink-0 text-red-200/60 hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div></div>)}{!records.length && <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/35">مكتبة الصور فارغة.</div>}</div></div>;

const AuditSection = ({ records }) => <div className="space-y-5"><div><h2 className="font-serif text-3xl">سجل النشاط</h2><p className="mt-2 text-sm text-white/40">سجل قابل للمراجعة لكل تغيير إداري على بيانات الموقع.</p></div><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"><table className="w-full min-w-[800px] text-right text-sm"><thead className="text-white/35"><tr><th className="p-4">التاريخ</th><th className="p-4">المستخدم</th><th className="p-4">الإجراء</th><th className="p-4">العنصر</th><th className="p-4">بيانات إضافية</th></tr></thead><tbody>{records.map((item) => <tr key={item.id} className="border-t border-white/5"><td className="p-4 text-white/35">{new Date(item.created_at).toLocaleString('ar-SA')}</td><td className="p-4">{item.user?.name || 'System'}</td><td className="p-4 text-gold-500">{item.action}</td><td className="p-4 text-white/60">{item.entity} #{item.entity_id || '—'}</td><td className="max-w-sm p-4 text-xs text-white/40"><code>{JSON.stringify(item.metadata || {})}</code></td></tr>)}{!records.length && <tr><td colSpan="5" className="p-12 text-center text-white/35">لا توجد نشاطات مسجلة.</td></tr>}</tbody></table></div></div>;

export default Admin;
