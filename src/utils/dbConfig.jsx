import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

//Developer's permission needed to get private keys
const dbConnectionString = import.meta.env.VITE_DB_CONNECTION;
if (!dbConnectionString) {
  throw new Error("❌ Database connection string is missing! Check your .env file.");
}


const sql = neon(dbConnectionString);

export const db = drizzle(sql, { schema });

//verifying the database connection
db.select().from(schema.Users).limit(1)
  .then(res => console.log("DB Connected:", res))
  .catch(err => console.error("DB Connection Failed:", err));