import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { z } from "zod";

const router = Router();

const GenerateBody = z.object({
  activityType: z.string().min(1),
  audience: z.string().min(1),
  goal: z.string().min(1),
});

router.post("/generate/content", async (req, res) => {
  const parsed = GenerateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير مكتملة" });
    return;
  }

  const { activityType, audience, goal } = parsed.data;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      messages: [
        {
          role: "system",
          content: `أنت خبير تسويق رقمي محترف متخصص في كتابة المحتوى العربي للسوشيال ميديا. تكتب بأسلوب جذاب ومؤثر يناسب المنصات العربية. أجب دائماً بـ JSON فقط بدون أي نص إضافي.`,
        },
        {
          role: "user",
          content: `اكتب محتوى تسويقي احترافي لـ:
- نوع النشاط: ${activityType}
- الجمهور المستهدف: ${audience}
- الهدف التسويقي: ${goal}

أجب بـ JSON فقط بهذا الشكل بالضبط:
{"postIdea":"فكرة بوست جاهزة للنشر 3 جمل مع CTA","hook":"جملة Hook قوية جملة واحدة","adIdea":"فكرة إعلان ممول عنوان ووصف مختصر"}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    req.log.info({ raw: raw.slice(0, 200), model: "gpt-5.4" }, "OpenAI response");

    let result: Record<string, string> = {};
    if (raw) {
      try {
        // Try direct parse first
        result = JSON.parse(raw);
      } catch {
        // Try extracting JSON block
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            result = JSON.parse(match[0]);
          } catch {
            req.log.warn({ raw }, "Could not parse JSON from OpenAI response");
          }
        }
      }
    }

    res.json({
      postIdea: result.postIdea || generateFallback(activityType, goal, "post"),
      hook: result.hook || generateFallback(activityType, audience, "hook"),
      adIdea: result.adIdea || generateFallback(activityType, goal, "ad"),
    });
  } catch (err) {
    req.log.error({ err }, "Content generation failed");
    res.status(500).json({ error: "حدث خطأ أثناء التوليد، حاول مرة أخرى" });
  }
});

function generateFallback(activity: string, context: string, type: "post" | "hook" | "ad"): string {
  if (type === "hook") return `هل تعرف سر نجاح ${activity} الناجح؟ 🔥`;
  if (type === "post") return `${activity} بيقدملك تجربة فريدة لـ ${context}. تواصل معنا اليوم واستفد من عروضنا الحصرية! 💫`;
  return `${activity} — الخيار الأمثل لـ ${context}. احجز الآن!`;
}

export default router;
