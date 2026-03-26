import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:4000", "http://127.0.0.1:4000", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    storage: "database",
  },
  emailAndPassword: {
    enabled: true,
  },
  email: {
    enabled: true,
  },
  plugins: [twoFactor()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
      },
    },
  },
});
