//Developer's permission needed to get private keys

import {defineConfig} from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables


export default defineConfig({
  dialect: "postgresql",
  schema: "./src/utils/schema.jsx",
  out: "./drizle",

  dbCredentials: {
    url: process.env.VITE_DB_CONNECTION,
    connectionString: process.env.VITE_DB_CONNECTION,
  },
})
