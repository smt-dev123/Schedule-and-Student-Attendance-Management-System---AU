import { db } from "./src/database";
import { user } from "./src/database/schemas/authentication";
import { eq } from "drizzle-orm";

async function run() {
  await db.update(user).set({ role: "admin" }).where(eq(user.email, "admin@gmail.com"));
  console.log("Updated admin@gmail.com to admin role");
  process.exit(0);
}
run();
