
// Steps get you imports
import "dotenv/config"
import { defineConfig } from "drizzle-kit"
// initialize out =r definConfig
export default defineConfig({
   dialect: "postgresql",
   schema: "./src/drizzle/schema.ts",
   out: "./src/drizzle/migrations",
   dbCredentials: {
    url: process.env.DATABASE_URL as string,
   },
   verbose: true,
   strict: true
})