import { Router } from "express";
import { db } from "@workspace/db";
import { portfolioItemsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const metricSchema = z.object({
  label: z.string(),
  value: z.number(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  decimals: z.number().int().default(0),
});

const createSchema = z.object({
  client: z.string().min(1),
  period: z.string().min(1),
  tag: z.string().min(1),
  color: z.string().min(1).default("amber"),
  metrics: z.array(metricSchema).min(1).max(6),
  screenshotUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

// GET /api/portfolio
router.get("/portfolio", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(portfolioItemsTable)
      .orderBy(asc(portfolioItemsTable.sortOrder), asc(portfolioItemsTable.createdAt));
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch portfolio items");
    res.status(500).json({ error: "خطأ في جلب البيانات" });
  }
});

// POST /api/portfolio
router.post("/portfolio", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صحيحة" });
    return;
  }

  try {
    const [item] = await db
      .insert(portfolioItemsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to create portfolio item");
    res.status(500).json({ error: "خطأ في الحفظ" });
  }
});

// DELETE /api/portfolio/:id
router.delete("/portfolio/:id", async (req, res) => {
  const id = parseInt(req.params["id"] ?? "");
  if (isNaN(id)) {
    res.status(400).json({ error: "معرف غير صحيح" });
    return;
  }

  try {
    const deleted = await db
      .delete(portfolioItemsTable)
      .where(eq(portfolioItemsTable.id, id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "العنصر غير موجود" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete portfolio item");
    res.status(500).json({ error: "خطأ في الحذف" });
  }
});

export default router;
