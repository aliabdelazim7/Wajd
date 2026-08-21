import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertTriangle, BarChart3, BriefcaseBusiness, Check, ChevronLeft, FileText,
    HelpCircle, History, Image as ImageIcon, LayoutDashboard, LogOut, Menu,
    PackageOpen, Pencil, Plus, RefreshCw, Save, Search, Settings2, Trash2,
    Upload, Users, X
} from 'lucide-react';

const TOKEN_KEY = 'wajd.admin.token';

const navItems = [
    { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { key: 'blocks', label: 'محتوى الموقع', icon: FileText },
    { key: 'packages', label: 'الباقات', icon: PackageOpen },
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
    slug: '', name_ar: '', name_en: '', subtitle_ar: '', subtitle_en: '', price_sar: 0,
    billing_cycle: 'monthly', features_ar: '', features_en: '', sort_order: 0,
    is_featured: false, is_published: true,
};

const emptyFaq = {
    question_ar: '', question_en: '', answer_ar: '', answer_en: '', sort_order: 0, is_published: true,
};

const emptyProject = {
    slug: '', name_ar: '', name_en: '', category_ar: '', category_en: '', description_ar: '',
    description_en: '', challenge_ar: '', challenge_en: '', strategy_ar: '', strategy_en: '',
    results: '{}', image_url: '', thumbnail_url: '', alt_text_ar: '', alt_text_en: '', sort_order: 0, is_published: true,
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
            setPayload(section === 'overview'
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
                body.sort_order = Number(body.sort_order || 0);
                body.features_ar = String(body.features_ar || '').split('\n').map((item) => item.trim()).filter(Boolean);
                body.features_en = String(body.features_en || '').split('\n').map((item) => item.trim()).filter(Boolean);
            } else if (active === 'faqs') {
                path = editor.id ? `/faqs/${editor.id}` : '/faqs';
                body.sort_order = Number(body.sort_order || 0);
            } else if (active === 'projects') {
                path = editor.id ? `/projects/${editor.id}` : '/projects';
                body.sort_order = Number(body.sort_order || 0);
                try { body.results = JSON.parse(body.results || '{}'); } catch { throw new Error('نتائج المشروع يجب أن تكون JSON صحيحة.'); }
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
            features_ar: Array.isArray(record.features_ar) ? record.features_ar.join('\n') : String(record.features_ar || ''),
            features_en: Array.isArray(record.features_en) ? record.features_en.join('\n') : String(record.features_en || ''),
        } : { ...emptyPackage });
        if (active === 'faqs') setEditor(record ? { ...record } : { ...emptyFaq });
        if (active === 'projects') setEditor(record ? { ...record, results: JSON.stringify(record.results || {}, null, 2) } : { ...emptyProject });
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
                            {(active === 'packages' || active === 'faqs' || active === 'projects' || active === 'blocks' || active === 'settings') && <CrudSection active={active} records={records} editor={editor} setEditor={setEditor} openEditor={openEditor} save={save} remove={remove} />}
                            {active === 'leads' && <LeadsSection records={records} search={search} setSearch={setSearch} updateLeadStatus={updateLeadStatus} remove={remove} />}
                            {active === 'media' && <MediaSection records={records} upload={upload} remove={remove} />}
                            {active === 'audit' && <AuditSection records={records} />}
                        </DashboardErrorBoundary>}
                    </div>
                </section>
            </div>
        </main>
    );
};

const Overview = ({ payload }) => {
    const counts = payload?.counts || {};
    return <div className="space-y-8"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="كل العملاء المحتملين" value={counts.leads} hint="إجمالي الطلبات المسجلة" icon={Users} /><StatCard label="طلبات جديدة" value={counts.new_leads} hint="تحتاج متابعة أولية" icon={BarChart3} accent /><StatCard label="الباقات المنشورة" value={counts.packages} hint="متاحة في الموقع" icon={PackageOpen} /><StatCard label="دراسات الحالة" value={counts.projects} hint="تدعم الثقة والبيع" icon={BriefcaseBusiness} /><StatCard label="الأسئلة الشائعة" value={counts.faqs} hint="تقلل تردد العميل" icon={HelpCircle} /></div><div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="flex items-center justify-between border-b border-white/10 p-5"><h2 className="font-serif text-xl">آخر الطلبات</h2><span className="text-xs text-white/35">آخر 8 طلبات</span></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-right text-sm"><thead className="text-white/35"><tr><th className="p-4">الاسم</th><th className="p-4">الخدمة</th><th className="p-4">الميزانية</th><th className="p-4">الحالة</th><th className="p-4">التاريخ</th></tr></thead><tbody>{(payload?.recent_leads || []).map((lead) => <tr key={lead.id} className="border-t border-white/5"><td className="p-4"><strong>{lead.name}</strong>{lead.company_name && <><br /><span className="text-xs text-white/50">{lead.company_name}</span></>}<br /><span className="text-xs text-white/35">{lead.email}</span></td><td className="p-4 text-white/60">{lead.service || '—'}{lead.package_selection && <p className="mt-2 text-xs text-gold-500">{lead.package_selection.basePlan?.name || 'Growth Engine'}{lead.package_selection.addons?.length ? ` + ${lead.package_selection.addons.length} وحدة` : ''}</p>}</td><td className="p-4 text-gold-500">{lead.budget_sar ? `${Number(lead.budget_sar).toLocaleString()} SAR` : '—'}</td><td className="p-4"><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{statusLabels[lead.status] || lead.status}</span></td><td className="p-4 text-white/35">{new Date(lead.created_at).toLocaleDateString('ar-SA')}</td></tr>)}{!payload?.recent_leads?.length && <tr><td colSpan="5" className="p-10 text-center text-white/35">لا توجد طلبات بعد.</td></tr>}</tbody></table></div></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h2 className="mb-5 font-serif text-xl">آخر النشاطات</h2><div className="space-y-4">{(payload?.recent_activity || []).map((activity) => <div key={activity.id} className="flex items-start gap-3 border-b border-white/5 pb-4"><div className="mt-1 h-2 w-2 rounded-full bg-gold-500" /><div><p className="text-sm text-white/75">{activity.action} · {activity.entity}</p><p className="mt-1 text-xs text-white/35">{activity.user?.name || 'System'} · {new Date(activity.created_at).toLocaleString('ar-SA')}</p></div></div>)}{!payload?.recent_activity?.length && <p className="text-sm text-white/35">سيظهر النشاط الإداري هنا.</p>}</div></div></div></div>;
};

const CrudSection = ({ active, records, editor, setEditor, openEditor, save, remove }) => {
    const titles = { blocks: 'محتوى الموقع', packages: 'الباقات الشهرية', faqs: 'الأسئلة الشائعة', projects: 'دراسات الحالة', settings: 'إعدادات الموقع' };
    const resources = { packages: 'packages', faqs: 'faqs', projects: 'projects', blocks: 'blocks', settings: 'settings' };
    const newLabel = active === 'blocks' ? 'إضافة محتوى' : active === 'settings' ? 'إضافة إعداد' : 'إضافة جديد';
    return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-3xl">{titles[active]}</h2><p className="mt-2 text-sm text-white/40">كل تعديل هنا ينعكس على محتوى الموقع بعد ربط الواجهة بالـ API.</p></div><Button onClick={() => openEditor()}><Plus className="h-4 w-4" />{newLabel}</Button></div>{editor && <EditorPanel active={active} editor={editor} setEditor={setEditor} save={save} onClose={() => setEditor(null)} />}{!editor && <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead className="text-white/35"><tr>{active === 'packages' && <><th className="p-4">الباقة</th><th className="p-4">السعر</th><th className="p-4">المميزات</th></>}{active === 'faqs' && <><th className="p-4">السؤال بالعربية</th><th className="p-4">السؤال بالإنجليزية</th></>}{active === 'projects' && <><th className="p-4">المشروع</th><th className="p-4">التصنيف</th><th className="p-4">الصورة</th></>}{active === 'blocks' && <><th className="p-4">المفتاح</th><th className="p-4">اللغة</th><th className="p-4">العنوان</th></>}{active === 'settings' && <><th className="p-4">المفتاح</th><th className="p-4">القيمة</th></>}</tr></thead><tbody>{records.map((record) => <tr key={record.id} className="border-t border-white/5 align-top"><td className="p-4">{active === 'packages' ? <><strong>{record.name_ar}</strong><br /><span className="text-xs text-white/35">{record.name_en}</span></> : active === 'faqs' ? record.question_ar : active === 'projects' ? <><strong>{record.name_ar}</strong><br /><span className="text-xs text-white/35">{record.slug}</span></> : active === 'blocks' ? <><strong>{record.key}</strong><br /><span className="text-xs text-white/35">{record.title}</span></> : record.key}</td>{active === 'packages' && <><td className="p-4 text-gold-500">{Number(record.price_sar || 0).toLocaleString()} SAR</td><td className="max-w-sm p-4 text-white/55">{(record.features_ar || []).slice(0, 3).join(' · ')}</td></>}{active === 'faqs' && <td className="p-4 text-white/55">{record.question_en}</td>}{active === 'projects' && <><td className="p-4 text-white/55">{record.category_ar || '—'}</td><td className="p-4">{record.image_url ? <img src={record.image_url} alt={record.alt_text_ar || record.name_ar} className="h-12 w-20 rounded-lg object-cover" /> : '—'}</td></>}{active === 'blocks' && <><td className="p-4 text-gold-500">{record.locale}</td><td className="p-4 text-white/55">{record.title || '—'}</td></>}{active === 'settings' && <td className="max-w-md p-4 text-white/55"><code className="text-xs">{JSON.stringify(record.value)}</code></td>}<td className="p-4"><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => openEditor(record)}><Pencil className="h-4 w-4" />تعديل</Button><Button variant="danger" onClick={() => remove(record.id, resources[active])}><Trash2 className="h-4 w-4" />حذف</Button></div></td></tr>)}{!records.length && <tr><td colSpan="6" className="p-5"><ModuleEmptyState active={active} onAdd={() => openEditor()} /></td></tr>}</tbody></table></div></div>}</div>;
};

const EditorPanel = ({ active, editor, setEditor, save, onClose }) => {
    const update = (key, value) => setEditor({ ...editor, [key]: value });
    const field = (label, key, type = 'text', className = '') => <Field label={label} className={className}>{type === 'textarea' ? <textarea rows="4" value={editor[key] ?? ''} onChange={(event) => update(key, event.target.value)} className={inputClass} /> : <input type={type} value={editor[key] ?? ''} onChange={(event) => update(key, event.target.value)} className={inputClass} />}</Field>;
    return <form onSubmit={save} className="rounded-2xl border border-gold-500/20 bg-gold-500/[0.035] p-5 md:p-7"><div className="mb-6 flex items-center justify-between"><h3 className="font-serif text-2xl">{editor.id ? 'تعديل العنصر' : 'إضافة عنصر جديد'}</h3><button type="button" onClick={onClose} className="text-white/50 hover:text-white"><X /></button></div><div className="grid gap-5 md:grid-cols-2">{active === 'packages' && <>{field('المعرف اللاتيني', 'slug')} {field('الاسم بالعربية', 'name_ar')} {field('الاسم بالإنجليزية', 'name_en')} {field('العنوان الفرعي بالعربية', 'subtitle_ar')} {field('العنوان الفرعي بالإنجليزية', 'subtitle_en')} {field('السعر الشهري بالريال', 'price_sar', 'number')} {field('الترتيب', 'sort_order', 'number')} {field('مميزات العربية — كل سطر ميزة', 'features_ar', 'textarea', 'md:col-span-2')} {field('مميزات الإنجليزية — كل سطر ميزة', 'features_en', 'textarea', 'md:col-span-2')}</>}{active === 'faqs' && <>{field('السؤال بالعربية', 'question_ar', 'textarea')} {field('السؤال بالإنجليزية', 'question_en', 'textarea')} {field('الإجابة بالعربية', 'answer_ar', 'textarea')} {field('الإجابة بالإنجليزية', 'answer_en', 'textarea')} {field('الترتيب', 'sort_order', 'number')}</>}{active === 'projects' && <>{field('المعرف اللاتيني', 'slug')} {field('الاسم بالعربية', 'name_ar')} {field('الاسم بالإنجليزية', 'name_en')} {field('التصنيف بالعربية', 'category_ar')} {field('التصنيف بالإنجليزية', 'category_en')} {field('الوصف بالعربية', 'description_ar', 'textarea')} {field('الوصف بالإنجليزية', 'description_en', 'textarea')} {field('التحدي بالعربية', 'challenge_ar', 'textarea')} {field('التحدي بالإنجليزية', 'challenge_en', 'textarea')} {field('الاستراتيجية بالعربية', 'strategy_ar', 'textarea')} {field('الاستراتيجية بالإنجليزية', 'strategy_en', 'textarea')} {field('رابط الصورة الرئيسية', 'image_url')} {field('رابط الصورة المصغرة', 'thumbnail_url')} {field('النص البديل بالعربية', 'alt_text_ar')} {field('النص البديل بالإنجليزية', 'alt_text_en')} {field('النتائج بصيغة JSON', 'results', 'textarea', 'md:col-span-2')} {field('الترتيب', 'sort_order', 'number')}</>}{active === 'blocks' && <>{field('مفتاح المحتوى', 'key')} {field('اللغة', 'locale')} {field('العنوان', 'title')} {field('نص المحتوى', 'body', 'textarea', 'md:col-span-2')} {field('بيانات إضافية بصيغة JSON', 'data', 'textarea', 'md:col-span-2')}</>}{active === 'settings' && <>{field('مفتاح الإعداد', 'key')} {field('نوع الإعداد', 'type')} {field('القيمة بصيغة JSON', 'value', 'textarea', 'md:col-span-2')}</>}</div><div className="mt-6 flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-sm text-white/65"><input type="checkbox" checked={Boolean(editor.is_published)} onChange={(event) => update('is_published', event.target.checked)} />منشور على الموقع</label>{active === 'packages' && <label className="flex items-center gap-2 text-sm text-white/65"><input type="checkbox" checked={Boolean(editor.is_featured)} onChange={(event) => update('is_featured', event.target.checked)} />باقة مميزة</label>}<div className="mr-auto flex gap-2"><Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button><Button type="submit"><Save className="h-4 w-4" />حفظ التغييرات</Button></div></div></form>;
};

const LeadsSection = ({ records, search, setSearch, updateLeadStatus, remove }) => <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-3xl">العملاء المحتملون</h2><p className="mt-2 text-sm text-white/40">تابع كل العملاء الذين تواصلوا معك من الموقع وحدّث مراحل المتابعة.</p></div><div className="relative"><Search className="absolute right-3 top-3 h-4 w-4 text-white/30" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو البريد" className={`${inputClass} w-72 pr-10`} /></div></div><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"><table className="w-full min-w-[1000px] text-right text-sm"><thead className="text-white/35"><tr><th className="p-4">العميل</th><th className="p-4">التواصل</th><th className="p-4">الخدمة</th><th className="p-4">الميزانية</th><th className="p-4">الحالة</th><th className="p-4">التاريخ</th><th className="p-4">إجراء</th></tr></thead><tbody>{records.filter((lead) => `${lead.name} ${lead.company_name || ''} ${lead.email || ''} ${lead.phone || ''} ${lead.industry || ''}`.toLowerCase().includes(search.toLowerCase())).map((lead) => <tr key={lead.id} className="border-t border-white/5 align-top"><td className="p-4"><strong>{lead.name}</strong>{lead.company_name && <p className="mt-1 text-xs text-white/50">{lead.company_name}</p>}{lead.industry && <p className="mt-1 text-xs text-white/35">{lead.industry}</p>}{lead.message && <p className="mt-2 max-w-xs text-xs leading-5 text-white/35">{lead.message}</p>}</td><td className="p-4 text-white/60">{lead.email}<br />{lead.phone || '—'}{lead.contact_preference && <><br /><span className="text-xs text-white/35">يفضل: {lead.contact_preference}</span></>}</td><td className="p-4 text-white/55">{lead.service || 'غير محددة'}{lead.package_selection && <div className="mt-2 max-w-xs text-xs leading-5 text-gold-500"><strong>{lead.package_selection.basePlan?.name || 'Growth Engine'}</strong>{(lead.package_selection.addons || []).length > 0 && <><br />{lead.package_selection.addons.map((addon) => addon.name).join(' · ')}</>}</div>}</td><td className="p-4 text-gold-500">{lead.budget_sar ? `${Number(lead.budget_sar).toLocaleString()} SAR` : '—'}</td><td className="p-4"><select value={lead.status} onChange={(event) => updateLeadStatus(lead.id, event.target.value)} className="rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-xs text-white"><option value="new">جديد</option><option value="contacted">تم التواصل</option><option value="qualified">مؤهل</option><option value="closed">مغلق</option><option value="lost">غير مهتم</option></select></td><td className="p-4 text-white/35">{new Date(lead.created_at).toLocaleDateString('ar-SA')}</td><td className="p-4"><Button variant="danger" onClick={() => remove(lead.id, 'leads')}><Trash2 className="h-4 w-4" />حذف</Button></td></tr>)}{!records.length && <tr><td colSpan="7" className="p-12 text-center text-white/35">لا توجد طلبات مطابقة.</td></tr>}</tbody></table></div></div>;

const MediaSection = ({ records, upload, remove }) => <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-3xl">مكتبة الصور</h2><p className="mt-2 text-sm text-white/40">ارفع الصور إلى التخزين المتصل بالمشروع واستخدم روابطها في دراسات الحالة والمحتوى.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-obsidian-950 transition hover:bg-white"><Upload className="h-4 w-4" />رفع صورة<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={upload} className="hidden" /></label></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{records.map((asset) => <div key={asset.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="aspect-square bg-white/5"><img src={asset.url} alt={asset.alt_text || asset.filename} className="h-full w-full object-cover" /></div><div className="flex items-center justify-between gap-2 p-3"><p className="truncate text-xs text-white/55">{asset.filename}</p><button onClick={() => remove(asset.id, 'media')} className="shrink-0 text-red-200/60 hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div></div>)}{!records.length && <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/35">مكتبة الصور فارغة.</div>}</div></div>;

const AuditSection = ({ records }) => <div className="space-y-5"><div><h2 className="font-serif text-3xl">سجل النشاط</h2><p className="mt-2 text-sm text-white/40">سجل قابل للمراجعة لكل تغيير إداري على بيانات الموقع.</p></div><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"><table className="w-full min-w-[800px] text-right text-sm"><thead className="text-white/35"><tr><th className="p-4">التاريخ</th><th className="p-4">المستخدم</th><th className="p-4">الإجراء</th><th className="p-4">العنصر</th><th className="p-4">بيانات إضافية</th></tr></thead><tbody>{records.map((item) => <tr key={item.id} className="border-t border-white/5"><td className="p-4 text-white/35">{new Date(item.created_at).toLocaleString('ar-SA')}</td><td className="p-4">{item.user?.name || 'System'}</td><td className="p-4 text-gold-500">{item.action}</td><td className="p-4 text-white/60">{item.entity} #{item.entity_id || '—'}</td><td className="max-w-sm p-4 text-xs text-white/40"><code>{JSON.stringify(item.metadata || {})}</code></td></tr>)}{!records.length && <tr><td colSpan="5" className="p-12 text-center text-white/35">لا توجد نشاطات مسجلة.</td></tr>}</tbody></table></div></div>;

export default Admin;
