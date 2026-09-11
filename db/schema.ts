import {integer,sqliteTable,text,index,check} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";
export const devices=sqliteTable("devices",{
 id:integer("id").primaryKey({autoIncrement:true}),customer:text("customer").notNull(),contact:text("contact").notNull().default(""),device:text("device").notNull(),notes:text("notes").notNull().default(""),amount:integer("amount").notNull(),payment:text("payment").notNull().default("unpaid"),status:text("status").notNull().default("charging"),createdAt:text("created_at").notNull(),paidAt:text("paid_at"),collectedAt:text("collected_at")
},t=>[index("idx_devices_created").on(t.createdAt),check("valid_amount",sql`${t.amount} >= 0 AND ${t.amount} <= 1000000000`),check("valid_payment",sql`${t.payment} IN ('unpaid','cash','transfer')`),check("valid_status",sql`${t.status} IN ('charging','ready','collected')`)]);
