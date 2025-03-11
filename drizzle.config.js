export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.jsx",
  out: "./drizle",

  dbCredentials: {
    url: "postgresql://neondb_owner:npg_P3NCtSz6sDQv@ep-delicate-silence-a8fdq6jw-pooler.eastus2.azure.neon.tech/diagnosis-database?sslmode=require",
    connectionString:
      "postgresql://neondb_owner:npg_P3NCtSz6sDQv@ep-delicate-silence-a8fdq6jw-pooler.eastus2.azure.neon.tech/diagnosis-database?sslmode=require",
  },
};
