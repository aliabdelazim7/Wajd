import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, Mail, Phone, Calendar, RefreshCw,
  LayoutDashboard, Users, ImagePlus, Trash2, Plus,
  CheckCircle2, Clock, PhoneCall, TrendingUp, Inbox,
  ChevronDown, X, Upload, Image, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import img1 from "@assets/1_1777748284175.png";
import img5 from "@assets/5_1777748284178.png";
import img7 from "@assets/7_1777748284179.png";

// ─── Types ───────────────────────────────────────────────────────────────────
type LeadStatus = "new" | "contacted" | "done";
type Lead = {
  id: number;
  pageUrl: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
};

type Metric = {
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
};

type PortfolioItem = {
  id: number;
  client: string;
  period: string;
  tag: string;
  color: string;
  metrics: Metric[];
  screenshotUrl?: string | null;
  sortOrder: number;
  createdAt: string;
};

// ─── Static cases (always shown at top) ──────────────────────────────────────
const STATIC_CASES = [
  {
    id: "static-1",
    client: "براند العويد",
    period: "نوفمبر 2025",
    tag: "متجر إلكتروني",
    color: "amber",
    screenshot: img1,
    metrics: [
      { label: "إجمالي المبيعات", value: 897421, prefix: "₺", suffix: "", decimals: 0 },
      { label: "عدد الطلبات",     value: 2938,   prefix: "",  suffix: " طلب", decimals: 0 },
      { label: "زيارات المتجر",   value: 511600, prefix: "",  suffix: " زيارة", decimals: 0 },
      { label: "عملاء جدد",       value: 2895,   prefix: "",  suffix: " عميل", decimals: 0 },
    ],
  },
  {
    id: "static-2",
    client: "براند العويد",
    period: "يناير 2026",
    tag: "إعلانات TikTok",
    color: "pink",
    screenshot: img5,
    metrics: [
      { label: "ROAS",       value: 6.45,  prefix: "", suffix: "x",     decimals: 2 },
      { label: "مشتريات",   value: 1833,  prefix: "", suffix: " شراء", decimals: 0 },
      { label: "Checkouts", value: 14642, prefix: "", suffix: "",       decimals: 0 },
      { label: "الإنفاق",   value: 23229, prefix: "$", suffix: "",     decimals: 0 },
    ],
  },
  {
    id: "static-3",
    client: "براند العويد",
    period: "نوفمبر 2025",
    tag: "إعلانات Meta",
    color: "blue",
    screenshot: img7,
    metrics: [
      { label: "ROAS",           value: 2.51,   prefix: "",    suffix: "x",     decimals: 2 },
      { label: "مشتريات",       value: 1350,   prefix: "",    suffix: " شراء", decimals: 0 },
      { label: "إضافة للسلة",   value: 10798,  prefix: "",    suffix: "",      decimals: 0 },
      { label: "الإنفاق",       value: 132372, prefix: "ر.س", suffix: "",      decimals: 0 },
    ],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; icon: React.ReactNode }> = {
  new:       { label: "جديد",        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",    icon: <Inbox size={12} /> },
  contacted: { label: "تم التواصل", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <PhoneCall size={12} /> },
  done:      { label: "مكتمل",      color: "bg-green-500/10 text-green-400 border-green-500/20", icon: <CheckCircle2 size={12} /> },
};

const COLOR_OPTIONS = [
  { id: "amber",  label: "ذهبي",    cls: "bg-amber-500"  },
  { id: "blue",   label: "أزرق",    cls: "bg-blue-500"   },
  { id: "pink",   label: "وردي",    cls: "bg-pink-500"   },
  { id: "green",  label: "أخضر",    cls: "bg-green-500"  },
  { id: "purple", label: "بنفسجي", cls: "bg-purple-500" },
  { id: "red",    label: "أحمر",    cls: "bg-red-500"    },
];

const COLOR_HEX: Record<string, string> = {
  amber: "#f59e0b", blue: "#3b82f6", pink: "#ec4899",
  green: "#22c55e", purple: "#a855f7", red: "#ef4444",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`${color} border border-white/8 rounded-2xl p-5 flex items-center justify-between`}>
      <div>
        <p className="text-white/50 text-xs mb-1">{label}</p>
        <p className="text-white text-2xl font-black">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">{icon}</div>
    </div>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────
function StatusDropdown({ leadId, current, onUpdate }: {
  leadId: number; current: LeadStatus; onUpdate: (id: number, s: LeadStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[current];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}
      >
        {cfg.icon}{cfg.label}<ChevronDown size={11} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 top-8 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[140px]"
          >
            {(["new", "contacted", "done"] as LeadStatus[]).map((s) => (
              <button key={s} onClick={() => { onUpdate(leadId, s); setOpen(false); }}
                className={`w-full text-right px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/5 transition-colors ${s === current ? "text-primary" : "text-white/70"}`}
              >
                {STATUS_CONFIG[s].icon}{STATUS_CONFIG[s].label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Image Uploader ───────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("يرجى اختيار صورة"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("الحجم الأقصى 5 ميجا"); return; }
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ في الرفع");
      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="text-white/50 text-xs block mb-2">صورة الكارت (اختياري)</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 h-36">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center text-white transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 right-2 bg-green-500/90 text-white text-xs px-2 py-0.5 rounded-full">
            تم الرفع ✓
          </div>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/15 hover:border-primary/40 rounded-xl h-36 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
        >
          {uploading ? (
            <RefreshCw size={24} className="text-primary animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-white/30 group-hover:text-primary transition-colors" />
              <p className="text-white/30 text-sm group-hover:text-white/60 transition-colors">اسحب صورة هنا أو اضغط للاختيار</p>
              <p className="text-white/20 text-xs">PNG, JPG, WebP — حد أقصى 5MB</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ─── Add/Edit Portfolio Form ───────────────────────────────────────────────────
function AddPortfolioForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [form, setForm] = useState({ client: "", period: "", tag: "", color: "amber" });
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "", value: 0, prefix: "", suffix: "", decimals: 0 },
  ]);

  const reset = () => {
    setForm({ client: "", period: "", tag: "", color: "amber" });
    setMetrics([{ label: "", value: 0, prefix: "", suffix: "", decimals: 0 }]);
    setScreenshotUrl("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!form.client || !form.period || !form.tag) return;
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, metrics, screenshotUrl: screenshotUrl || null }),
      });
      if (res.ok) { reset(); onCreated(); }
    } finally { setSaving(false); }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="bg-primary text-black hover:bg-primary/90 font-bold gap-2">
        <Plus size={16} />إضافة كارت جديد
      </Button>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border border-primary/30 rounded-2xl p-6 space-y-5 shadow-[0_0_30px_rgba(212,175,55,0.08)]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Plus size={18} className="text-primary" />إضافة كارت بورتفوليو
        </h3>
        <button onClick={reset} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
      </div>

      {/* Image upload */}
      <ImageUploader value={screenshotUrl} onChange={setScreenshotUrl} />

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: "client", label: "اسم البراند", placeholder: "مثال: براند الشمس" },
          { key: "period", label: "الفترة الزمنية", placeholder: "مثال: يناير 2026" },
          { key: "tag", label: "نوع الخدمة", placeholder: "مثال: إعلانات Meta" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-white/50 text-xs block mb-1">{label}</label>
            <input
              type="text" placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary/50 transition-colors placeholder-white/20"
            />
          </div>
        ))}
      </div>

      {/* Color picker */}
      <div>
        <label className="text-white/50 text-xs block mb-2">لون الكارت</label>
        <div className="flex gap-3 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button key={c.id} onClick={() => setForm((f) => ({ ...f, color: c.id }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                form.color === c.id ? "border-white text-white bg-white/10" : "border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${c.cls}`} />{c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-white/50 text-xs font-semibold">الأرقام والمقاييس</label>
          {metrics.length < 6 && (
            <button onClick={() => setMetrics((m) => [...m, { label: "", value: 0, prefix: "", suffix: "", decimals: 0 }])}
              className="text-primary text-xs flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Plus size={12} />إضافة رقم
            </button>
          )}
        </div>

        <div className="space-y-2">
          {metrics.map((m, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" placeholder="التسمية (مثال: ROAS)" value={m.label}
                onChange={(e) => setMetrics((prev) => prev.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
                className="col-span-4 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-primary/50 placeholder-white/20"
              />
              <input type="number" placeholder="القيمة" value={m.value}
                onChange={(e) => setMetrics((prev) => prev.map((x, idx) => idx === i ? { ...x, value: parseFloat(e.target.value) || 0 } : x))}
                className="col-span-3 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-primary/50"
              />
              <input type="text" placeholder="قبل (₺)" value={m.prefix}
                onChange={(e) => setMetrics((prev) => prev.map((x, idx) => idx === i ? { ...x, prefix: e.target.value } : x))}
                className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-primary/50 placeholder-white/20"
              />
              <input type="text" placeholder="بعد (x)" value={m.suffix}
                onChange={(e) => setMetrics((prev) => prev.map((x, idx) => idx === i ? { ...x, suffix: e.target.value } : x))}
                className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-primary/50 placeholder-white/20"
              />
              {metrics.length > 1 ? (
                <button onClick={() => setMetrics((prev) => prev.filter((_, idx) => idx !== i))}
                  className="col-span-1 text-red-400/50 hover:text-red-400 flex justify-center transition-colors">
                  <X size={14} />
                </button>
              ) : <div className="col-span-1" />}
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs mt-2">الخانات العشرية: 0 = رقم صحيح، 2 = مثلاً 6.45</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSubmit} disabled={saving || !form.client || !form.period || !form.tag}
          className="bg-primary text-black hover:bg-primary/90 font-bold gap-2">
          {saving ? <><RefreshCw size={14} className="animate-spin" />جاري الحفظ...</> : <><Plus size={14} />حفظ الكارت</>}
        </Button>
        <Button variant="outline" onClick={reset} className="border-white/20 text-white hover:bg-white/5">إلغاء</Button>
      </div>
    </motion.div>
  );
}

// ─── Portfolio Card ────────────────────────────────────────────────────────────
function PortfolioCard({ item, onDelete, deleting, isStatic = false }: {
  item: PortfolioItem | typeof STATIC_CASES[0];
  onDelete?: () => void;
  deleting?: boolean;
  isStatic?: boolean;
}) {
  const colorCls = COLOR_OPTIONS.find((c) => c.id === item.color)?.cls ?? "bg-amber-500";
  const hex = COLOR_HEX[item.color] ?? "#f59e0b";
  const screenshot = "screenshot" in item ? item.screenshot : (item as PortfolioItem).screenshotUrl;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden group transition-colors"
    >
      {/* Screenshot or color bar */}
      {screenshot ? (
        <div className="relative h-36 overflow-hidden">
          <img src={screenshot as string} alt={item.client}
            className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute top-2 right-2">
            <span className="text-xs font-bold border rounded-full px-2 py-0.5 backdrop-blur-sm"
              style={{ color: hex, borderColor: hex + "40", background: hex + "15" }}>
              {item.tag}
            </span>
          </div>
          {isStatic && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
              <Lock size={10} className="text-white/40" />
              <span className="text-white/40 text-xs">ثابت</span>
            </div>
          )}
        </div>
      ) : (
        <div className={`h-2 w-full ${colorCls}`} />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-bold">{item.client}</h3>
            <p className="text-white/40 text-xs mt-0.5">
              {!screenshot && <span className="inline-flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${colorCls}`} />
              </span>}
              {item.tag} · {item.period}
            </p>
          </div>
          {isStatic ? (
            <span className="text-white/20 text-xs border border-white/10 rounded-full px-2 py-0.5">ثابت</span>
          ) : onDelete && (
            <button onClick={onDelete} disabled={deleting}
              className="text-red-400/40 hover:text-red-400 transition-colors p-1" title="حذف">
              {deleting ? <RefreshCw size={15} className="animate-spin" /> : <Trash2 size={15} />}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {item.metrics.map((m, mi) => (
            <div key={mi} className="bg-white/3 rounded-lg p-3">
              <p className="text-white/35 text-xs mb-0.5">{m.label}</p>
              <p className="text-white font-bold text-sm">
                {m.prefix}
                {m.decimals > 0 ? m.value.toFixed(m.decimals) : m.value.toLocaleString("en-US")}
                {m.suffix}
              </p>
            </div>
          ))}
        </div>

        {"createdAt" in item && (
          <p className="text-white/20 text-xs mt-3">أُضيف {formatDate((item as PortfolioItem).createdAt)}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = "overview" | "leads" | "portfolio";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, portRes] = await Promise.all([fetch("/api/leads"), fetch("/api/portfolio")]);
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (portRes.ok) setPortfolio(await portRes.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateLeadStatus = async (id: number, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch {}
  };

  const deletePortfolioItem = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) setPortfolio((prev) => prev.filter((p) => p.id !== id));
    } finally { setDeletingId(null); }
  };

  const newCount       = leads.filter((l) => l.status === "new").length;
  const contactedCount = leads.filter((l) => l.status === "contacted").length;
  const doneCount      = leads.filter((l) => l.status === "done").length;
  const totalPortfolio = STATIC_CASES.length + portfolio.length;

  const TABS = [
    { id: "overview"  as Tab, label: "نظرة عامة",  icon: <LayoutDashboard size={16} /> },
    { id: "leads"     as Tab, label: "الطلبات",     icon: <Users size={16} />, badge: newCount },
    { id: "portfolio" as Tab, label: "البورتفوليو", icon: <ImagePlus size={16} />, badge: portfolio.length },
  ];

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* ── Header ── */}
      <div className="border-b border-white/10 bg-[#070707] sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary font-black text-xl">وجد</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60 text-sm font-medium">لوحة التحكم</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}
            className="border-white/20 text-white hover:bg-white/5 gap-2">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />تحديث
          </Button>
        </div>

        <div className="container max-w-6xl mx-auto px-6 flex gap-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {t.icon}{t.label}
              {t.badge != null && t.badge > 0 && (
                <span className="bg-primary text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <h2 className="text-2xl font-black text-white">نظرة عامة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="إجمالي الطلبات" value={leads.length} icon={<Users size={20} className="text-primary" />} color="bg-primary/10" />
                <StatCard label="طلبات جديدة" value={newCount} icon={<Inbox size={20} className="text-blue-400" />} color="bg-blue-500/10" />
                <StatCard label="تم التواصل" value={contactedCount} icon={<PhoneCall size={20} className="text-amber-400" />} color="bg-amber-500/10" />
                <StatCard label="مكتملة" value={doneCount} icon={<CheckCircle2 size={20} className="text-green-400" />} color="bg-green-500/10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard label="كروت البورتفوليو" value={`${totalPortfolio} (${STATIC_CASES.length} ثابت + ${portfolio.length} مضاف)`}
                  icon={<TrendingUp size={20} className="text-purple-400" />} color="bg-purple-500/10" />
                <StatCard label="آخر طلب"
                  value={leads[0] ? new Date(leads[0].createdAt).toLocaleDateString("ar-EG") : "—"}
                  icon={<Clock size={20} className="text-white/50" />} color="bg-white/5" />
              </div>

              {leads.filter((l) => l.status === "new").length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm font-semibold mb-3 flex items-center gap-2">
                    <Inbox size={14} />الطلبات الجديدة التي تحتاج تواصل
                  </h3>
                  <div className="space-y-2">
                    {leads.filter((l) => l.status === "new").slice(0, 5).map((lead) => (
                      <div key={lead.id} className="bg-[#0a0a0a] border border-blue-500/20 rounded-xl px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Mail size={14} className="text-white/30" />
                          <span className="text-white text-sm">{lead.email}</span>
                          <a href={`tel:${lead.phone}`} className="text-primary text-sm hover:underline flex items-center gap-1">
                            <Phone size={12} />{lead.phone}
                          </a>
                        </div>
                        <button onClick={() => updateLeadStatus(lead.id, "contacted")}
                          className="text-xs text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 hover:bg-amber-500/10 transition-colors">
                          تم التواصل
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Leads ── */}
          {tab === "leads" && (
            <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">الطلبات <span className="text-white/30 text-lg mr-2">({leads.length})</span></h2>
                <div className="flex gap-2">
                  {(["new", "contacted", "done"] as LeadStatus[]).map((s) => (
                    <span key={s} className={`border rounded-full px-3 py-1 text-xs ${STATUS_CONFIG[s].color}`}>
                      {leads.filter((l) => l.status === s).length} {STATUS_CONFIG[s].label}
                    </span>
                  ))}
                </div>
              </div>

              {loading && <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" /></div>}

              {!loading && leads.length === 0 && (
                <div className="text-center py-24 text-white/30">
                  <Inbox size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-bold mb-1">لا توجد طلبات بعد</p>
                  <p className="text-sm">ستظهر هنا فور وصولها من الموقع</p>
                </div>
              )}

              <div className="grid gap-3">
                {leads.map((lead, i) => (
                  <motion.div key={lead.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-[#0a0a0a] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <p className="text-white/30 text-xs mb-1">الصفحة</p>
                        <a href={lead.pageUrl} target="_blank" rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 truncate">
                          <ExternalLink size={12} className="shrink-0" />
                          <span className="truncate">{lead.pageUrl.replace(/^https?:\/\//, "")}</span>
                        </a>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs mb-1">الإيميل</p>
                        <a href={`mailto:${lead.email}`}
                          className="text-white text-sm flex items-center gap-1 hover:text-primary transition-colors truncate">
                          <Mail size={12} className="text-white/30 shrink-0" />{lead.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs mb-1">الهاتف</p>
                        <a href={`tel:${lead.phone}`}
                          className="text-white text-sm flex items-center gap-1 hover:text-primary transition-colors">
                          <Phone size={12} className="text-white/30 shrink-0" />{lead.phone}
                        </a>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusDropdown leadId={lead.id} current={lead.status as LeadStatus} onUpdate={updateLeadStatus} />
                        <span className="text-white/25 text-xs flex items-center gap-1">
                          <Calendar size={11} />{formatDate(lead.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Portfolio ── */}
          {tab === "portfolio" && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    البورتفوليو
                    <span className="text-white/30 text-lg mr-2">({totalPortfolio} كارت)</span>
                  </h2>
                  <p className="text-white/35 text-sm mt-1">
                    {STATIC_CASES.length} كروت ثابتة · {portfolio.length} كارت مضاف · كلهم بيظهروا على الموقع
                  </p>
                </div>
                <AddPortfolioForm onCreated={fetchAll} />
              </div>

              {/* Static section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Lock size={14} className="text-white/30" />
                  <h3 className="text-white/50 text-sm font-semibold uppercase tracking-widest">الكروت الثابتة — براند العويد</h3>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STATIC_CASES.map((item) => (
                    <PortfolioCard
                      key={item.id}
                      item={item as any}
                      isStatic
                    />
                  ))}
                </div>
              </div>

              {/* Dynamic section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ImagePlus size={14} className="text-primary/60" />
                  <h3 className="text-white/50 text-sm font-semibold uppercase tracking-widest">الكروت المضافة</h3>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {loading && <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" /></div>}

                {!loading && portfolio.length === 0 && (
                  <div className="border-2 border-dashed border-white/8 rounded-2xl text-center py-16 text-white/30">
                    <ImagePlus size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-bold mb-1">لا توجد كروت مضافة بعد</p>
                    <p className="text-sm mb-4">اضغط "إضافة كارت جديد" في الأعلى لإضافة أول كارت</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map((item, i) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      onDelete={() => deletePortfolioItem(item.id)}
                      deleting={deletingId === item.id}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
