import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioMetricSchema = z.object({
  label: z.string(),
  value: z.number(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  decimals: z.number().int().default(0),
});
export type PortfolioMetric = z.infer<typeof portfolioMetricSchema>;

export const portfolioItemsTable = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  client: text("client").notNull(),
  period: text("period").notNull(),
  tag: text("tag").notNull(),
  color: text("color").notNull().default("amber"),
  metrics: jsonb("metrics").notNull().$type<PortfolioMetric[]>(),
  screenshotUrl: text("screenshot_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItemsTable.$inferSelect;
