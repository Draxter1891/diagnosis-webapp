import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const sql = neon(
  "postgresql://neondb_owner:npg_P3NCtSz6sDQv@ep-delicate-silence-a8fdq6jw-pooler.eastus2.azure.neon.tech/diagnosis-database?sslmode=require",
);

export const db = drizzle(sql, { schema });
