import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Target, Flame } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}{suffix}
    </span>
  );
}

export default function StoryScene() {
  const scene1Ref = useRef(null);
  const scene1InView = useInView(scene1Ref, { once: false, margin: "-20%" });

  const scene2Ref = useRef(null);
  const scene2InView = useInView(scene2Ref, { once: false, margin: "-20%" });

  const scene3Ref = useRef(null);
  const scene3InView = useInView(scene3Ref, { once: false, margin: "-20%" });

  return (
    <div className="flex flex-col">
      {/* Scene 1 — 73% */}
      <div ref={scene1Ref} className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-[#050000]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-destructive/10 to-transparent blur-3xl pointer-events-none" />

        <div className="container px-6 z-10 text-center">
          {/* Pre-text above the number */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={scene1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="text-white/40 text-xl md:text-3xl font-semibold mb-6 tracking-wide"
          >
            83% من الشركات بتصرف بدون نتائج
          </motion.p>

          {/* Animated counter */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={scene1InView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
            transition={{ duration: 1, type: "spring", delay: 0.1 }}
            className="text-8xl md:text-[12rem] font-black text-destructive leading-none mb-6 drop-shadow-[0_0_40px_rgba(204,0,0,0.4)]"
          >
            {scene1InView && <AnimatedCounter target={73} suffix="%" />}
          </motion.div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={scene1InView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight"
          >
            من الشركات بتصرف على التسويق{" "}
            <br className="hidden md:block" />
            <span className="text-foreground/50">بدون نتائج قابلة للقياس</span>
          </motion.p>
        </div>
      </div>

      {/* Scene 2 */}
      <div ref={scene2Ref} className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-[#030303]">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="container px-6 z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <motion.h2
              initial={{ x: 50, opacity: 0 }}
              animate={scene2InView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
            >
              وجد بتحول التسويق{" "}
              <span className="text-primary block">لنتائج</span>
            </motion.h2>
            <motion.p
              initial={{ x: 50, opacity: 0 }}
              animate={scene2InView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-3xl text-foreground/70"
            >
              بنشتغل بالبيانات، مش بالحظ
            </motion.p>
          </div>
          <div className="flex-1 relative w-full aspect-square max-w-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={scene2InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="w-full h-full relative"
            >
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 border border-primary/40 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />
              <div className="absolute inset-16 border-2 border-primary/60 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/20 backdrop-blur-xl rounded-full shadow-[0_0_50px_rgba(212,175,55,0.5)] flex items-center justify-center border border-primary/50">
                  <Target size={48} className="text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scene 3 */}
      <div ref={scene3Ref} className="min-h-[100dvh] flex items-center justify-center relative py-20 bg-black">
        <div className="container px-6 z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={scene3InView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">قدراتنا في الملعب</h2>
            <p className="text-xl text-foreground/60">أسلحة النمو اللي بنستخدمها عشان نكبر البزنس بتاعك</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={40} />, title: "محتوى يصنع الأثر", desc: "محتوى مش بس شكله حلو، محتوى بيبيع وبيحول المتابع لعميل", delay: 0.2 },
              { icon: <Target size={40} />, title: "إعلانات تحقق نتائج", desc: "بندير ميزانيتك كأنها فلوسنا، استهداف دقيق وعائد استثمار مضاعف", delay: 0.4 },
              { icon: <Flame size={40} />, title: "براند تقيل يدوم", desc: "هوية بصرية ولفظية تعلق في دماغ العميل وتخليه يختارك أنت", delay: 0.6 },
            ].map((power, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={scene3InView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: power.delay }}
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-colors duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_0px_rgba(212,175,55,0)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  {power.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{power.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{power.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
