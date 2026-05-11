import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./local.db";
const isTurso = url.startsWith("libsql://") || url.startsWith("https://");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: isTurso ? "turso" : "sqlite",
  dbCredentials: isTurso
    ? { url, authToken: process.env.DATABASE_AUTH_TOKEN }
    : { url },
} satisfies Config;
