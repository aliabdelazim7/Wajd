import { Router } from "express";
import * as cheerio from "cheerio";
import { openai } from "@workspace/integrations-openai-ai-server";
import { AnalyzeBrandBody, AnalyzeBrandResponse } from "@workspace/api-zod";

const router = Router();

async function fetchPageContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "ar,en;q=0.5",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove scripts, styles, and irrelevant tags
  $("script, style, noscript, iframe, nav, footer").remove();

  // Extract useful text signals
  const title = $("title").text().trim();
  const metaDesc =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";
  const ogTitle =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[property="twitter:title"]').attr("content") ||
    "";
  const ogSiteName =
    $('meta[property="og:site_name"]').attr("content") || "";
  const headings = $("h1, h2, h3")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
    .slice(0, 10)
    .join(" | ");
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 2000);

  return [
    `URL: ${url}`,
    title ? `Title: ${title}` : "",
    ogTitle ? `OG Title: ${ogTitle}` : "",
    ogSiteName ? `Site Name: ${ogSiteName}` : "",
    metaDesc ? `Description: ${metaDesc}` : "",
    headings ? `Headings: ${headings}` : "",
    bodyText ? `Page Content: ${bodyText}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

router.post("/brand/analyze", async (req, res) => {
  const parseResult = AnalyzeBrandBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "يرجى إدخال رابط صحيح" });
    return;
  }

  const { url } = parseResult.data;

  // Basic URL validation
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    res.status(400).json({ error: "الرابط غير صحيح، يرجى إدخال رابط كامل يبدأ بـ https://" });
    return;
  }

  try {
    let pageContent: string;
    try {
      pageContent = await fetchPageContent(url);
    } catch (fetchErr) {
      req.log.warn({ fetchErr, url }, "Failed to fetch page, proceeding with URL only");
      pageContent = `URL: ${url}\nDomain: ${parsedUrl.hostname}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1500,
      messages: [
        {
          role: "system",
          content: `أنت خبير تسويق رقمي متخصص في تحليل البراند وهوية العلامات التجارية. مهمتك تحليل أي صفحة أو موقع وتقديم تقرير احترافي ومفصل بالعربية.
تحليلك يجب أن يكون:
- دقيقاً ومبنياً على المعطيات المتاحة
- عملياً وقابلاً للتطبيق
- واضحاً وبأسلوب احترافي
- باللغة العربية بالكامل`,
        },
        {
          role: "user",
          content: `حلّل البراند التالي بناءً على بيانات الصفحة:

${pageContent}

قدم تحليلاً شاملاً بصيغة JSON فقط:
{
  "brandName": "اسم البراند أو الصفحة",
  "brandPersonality": "تقييم شخصية البراند وأسلوبه وهويته (2-3 جمل)",
  "strengths": "نقاط القوة الرئيسية في البراند (2-3 نقاط)",
  "weaknesses": "مجالات تحتاج تحسين (2-3 نقاط)",
  "contentStrategy": "توصية لاستراتيجية المحتوى المناسبة (2-3 جمل)",
  "targetAudience": "الجمهور المستهدف المحدد أو الموصى به (جملة أو جملتين)"
}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    let parsed: Record<string, string> = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      parsed = {};
    }

    const responseData = {
      brandName: parsed.brandName ?? parsedUrl.hostname,
      brandPersonality: parsed.brandPersonality ?? "لم يتمكن النظام من تحديد شخصية البراند",
      strengths: parsed.strengths ?? "يحتاج مزيداً من البيانات للتحليل",
      weaknesses: parsed.weaknesses ?? "يحتاج مزيداً من البيانات للتحليل",
      contentStrategy: parsed.contentStrategy ?? "يُنصح بمراجعة خبراء وجد لتحليل أعمق",
      targetAudience: parsed.targetAudience ?? "لم يتم تحديد الجمهور المستهدف بشكل كافٍ",
    };

    const validated = AnalyzeBrandResponse.safeParse(responseData);
    if (!validated.success) {
      res.status(500).json({ error: "خطأ في معالجة نتائج التحليل" });
      return;
    }

    res.json(validated.data);
  } catch (err) {
    req.log.error({ err }, "Brand analysis failed");
    res.status(500).json({ error: "حدث خطأ أثناء التحليل، يرجى المحاولة لاحقاً" });
  }
});

export default router;
