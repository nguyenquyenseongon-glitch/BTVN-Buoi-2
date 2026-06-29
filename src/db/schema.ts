import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Bảng "leads" — lưu thông tin khách để lại khi cần tư vấn thuế/kế toán.
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 160 }),
  topic: varchar("topic", { length: 100 }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
