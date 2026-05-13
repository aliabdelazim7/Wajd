import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, FileText, Zap, Megaphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Result = { postIdea: string; hook: string; adIdea: string };

const ACTIVITY_OPTIONS = [
  "مطعم / كافيه", "متجر إلكتروني", "عيادة / صحة",
  "تعليم / كورسات", "عقارات", "فيتنس / رياضة",
  "موضة / ملابس", "تقنية / برمجة", "خدمات احترافية", "سياحة / سفر",
];
const AUDIENCE_OPTIONS = [
  "شباب 18-25", "بالغون 25-35", "أمهات وعائلات",
  "رجال أعمال", "طلاب", "مهتمون بالصحة", "محبو التقنية",
];
const GOAL_OPTIONS = [
  "زيادة المبيعات", "بناء الوعي بالبراند", "جلب حجوزات",
  "زيادة المتابعين", "توليد Leads", "إطلاق منتج جديد",
];

function SelectPill({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div>
      <p className="text-white/50 text-sm mb-3 font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              value === o
                ? "bg-primary text-black border-primary shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                : "bg-white/5 text-white/60 border-white/10 hover:border-primary/40 hover:text-white"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  text,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-[#0d0d0d] border rounded-2xl p-6 relative overflow-hidden group ${color}`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center opacity-80">
          {icon}
        </div>
        <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-white leading-relaxed text-[15px]">{text}</p>
    </motion.div>
  );
}

export default function AIExperience({ asModal = false }: { asModal?: boolean }) {
  const [activity, setActivity] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const canGenerate = activity && audience && goal && !loading;

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityType: activity, audience, goal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setResult(data);
    } catch (e: any) {
      setError(e.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setActivity("");
    setAudience("");
    setGoal("");
  };

  return (
    <div className={asModal ? "" : "py-32 bg-[#030303] relative overflow-hidden border-y border-white/5"} id="ai-experience">
      {!asModal && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent)] pointer-events-none" />
      )}

      <div className={`relative z-10 ${asModal ? "" : "container px-6 max-w-4xl mx-auto"}`}>
        {!asModal && (
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-primary text-xs font-semibold tracking-widest uppercase">ذكاء اصطناعي</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-4"
            >
              جرب قوة وجد{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">
                بنفسك
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/50"
            >
              اختار نشاطك وجمهورك وهدفك — الذكاء الاصطناعي يولّد محتواك في ثواني
            </motion.p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/8 rounded-3xl p-8 space-y-8 shadow-2xl"
            >
              <SelectPill options={ACTIVITY_OPTIONS} value={activity} onChange={setActivity} label="نوع النشاط" />
              <SelectPill options={AUDIENCE_OPTIONS} value={audience} onChange={setAudience} label="الجمهور المستهدف" />
              <SelectPill options={GOAL_OPTIONS} value={goal} onChange={setGoal} label="الهدف التسويقي" />

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <Button
                onClick={generate}
                disabled={!canGenerate}
                className="w-full h-16 text-lg font-black bg-primary text-black hover:bg-primary/90 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:shadow-[0_0_50px_rgba(212,175,55,0.45)] transition-all duration-300 disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 size={20} className="animate-spin" />
                    الذكاء الاصطناعي شغّال...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Sparkles size={20} />
                    توليد المحتوى
                  </span>
                )}
              </Button>

              {!activity && !audience && !goal && (
                <p className="text-center text-white/20 text-sm">اختر الخيارات أعلاه للبدء</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <ResultCard
                icon={<Zap size={18} className="text-primary" />}
                label="Hook — جملة الشد"
                text={result.hook}
                color="border-primary/20"
                delay={0}
              />
              <ResultCard
                icon={<FileText size={18} className="text-blue-400" />}
                label="فكرة البوست"
                text={result.postIdea}
                color="border-blue-500/20"
                delay={0.15}
              />
              <ResultCard
                icon={<Megaphone size={18} className="text-pink-400" />}
                label="فكرة الإعلان"
                text={result.adIdea}
                color="border-pink-500/20"
                delay={0.3}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 pt-2"
              >
                <Button
                  onClick={reset}
                  variant="outline"
                  className="flex-1 h-12 border-white/15 text-white hover:bg-white/5 gap-2"
                >
                  <RefreshCw size={16} />
                  جرب مرة أخرى
                </Button>
                <Button
                  onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex-1 h-12 bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  ابدأ مع وجد
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
