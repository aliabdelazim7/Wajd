import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, insertLeadSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { SubmitLeadBody } from "@workspace/api-zod";
import { z } from "zod";

const router = Router();

// POST /api/leads/submit — save new lead
router.post("/leads/submit", async (req, res) => {
  const parseResult = SubmitLeadBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "يرجى ملء جميع الحقول بشكل صحيح" });
    return;
  }

  const { pageUrl, email, phone } = parseResult.data;

  try {
    const u = new URL(pageUrl.startsWith("http") ? pageUrl : `https://${pageUrl}`);
    if (!["http:", "https:"].includes(u.protocol)) throw new Error();
  } catch {
    res.status(400).json({ error: "رابط الصفحة غير صحيح" });
    return;
  }

  try {
    const insertData = insertLeadSchema.parse({
      pageUrl: pageUrl.startsWith("http") ? pageUrl : `https://${pageUrl}`,
      email,
      phone,
      status: "new",
    });

    await db.insert(leadsTable).values(insertData);

    res.json({
      success: true,
      message: "تم استلام طلبك! سيتواصل معك فريق وجد خلال 24 ساعة",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save lead");
    res.status(500).json({ error: "حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى" });
  }
});

// GET /api/leads — list all leads for admin
router.get("/leads", async (req, res) => {
  try {
    const leads = await db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.createdAt));
    res.json(leads);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch leads");
    res.status(500).json({ error: "خطأ في جلب الطلبات" });
  }
});

// PATCH /api/leads/:id/status — update lead status
router.patch("/leads/:id/status", async (req, res) => {
  const id = parseInt(req.params["id"] ?? "");
  if (isNaN(id)) {
    res.status(400).json({ error: "معرف غير صحيح" });
    return;
  }

  const parsed = z.object({ status: z.enum(["new", "contacted", "done"]) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "حالة غير صحيحة" });
    return;
  }

  try {
    const [updated] = await db
      .update(leadsTable)
      .set({ status: parsed.data.status })
      .where(eq(leadsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "الطلب غير موجود" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update lead status");
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

export default router;
