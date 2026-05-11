import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  blurb: text("blurb").notNull(),
  description: text("description").notNull().default(""),
  thumbnail: text("thumbnail").notNull().default(""),
  gallery: text("gallery", { mode: "json" }).$type<string[]>().notNull().default([]),
  stack: text("stack", { mode: "json" }).$type<string[]>().notNull().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  year: integer("year").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
