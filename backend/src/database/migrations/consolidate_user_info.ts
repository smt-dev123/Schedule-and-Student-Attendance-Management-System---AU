import { db } from "../index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting consolidation migration...");

  try {
    // 1. Add gender and dob to user table
    console.log("Adding gender and dob to user table...");
    await db.execute(sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS gender text;`);
    await db.execute(sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS dob timestamp;`);

    // 2. Migrate data from teachers to user
    console.log("Migrating data from teachers to user...");
    await db.execute(sql`
      UPDATE "user" u
      SET 
        name = t.name,
        email = t.email,
        phone = t.phone,
        address = t.address,
        gender = t.gender,
        image = COALESCE(u.image, t.image)
      FROM teachers t
      WHERE u.id = t.user_id
    `);

    // 3. Migrate data from students to user
    console.log("Migrating data from students to user...");
    await db.execute(sql`
      UPDATE "user" u
      SET 
        name = s.name,
        email = s.email,
        phone = COALESCE(u.phone, s.phone),
        address = COALESCE(u.address, s.address),
        gender = s.gender,
        dob = s.dob,
        image = COALESCE(u.image, s.image)
      FROM students s
      WHERE u.id = s.user_id
    `);

    // 4. Remove columns from teachers
    console.log("Removing redundant columns from teachers...");
    await db.execute(sql`ALTER TABLE teachers DROP COLUMN IF EXISTS name;`);
    await db.execute(sql`ALTER TABLE teachers DROP COLUMN IF EXISTS email;`);
    await db.execute(sql`ALTER TABLE teachers DROP COLUMN IF EXISTS phone;`);
    await db.execute(sql`ALTER TABLE teachers DROP COLUMN IF EXISTS address;`);
    await db.execute(sql`ALTER TABLE teachers DROP COLUMN IF EXISTS gender;`);
    await db.execute(sql`ALTER TABLE teachers DROP COLUMN IF EXISTS image;`);

    // 5. Remove columns from students
    console.log("Removing redundant columns from students...");
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS name;`);
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS email;`);
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS phone;`);
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS address;`);
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS gender;`);
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS dob;`);
    await db.execute(sql`ALTER TABLE students DROP COLUMN IF EXISTS image;`);

    console.log("Consolidation migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
