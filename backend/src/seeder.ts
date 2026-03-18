import { buildings, classrooms } from "./database/schemas";
import { db, pool } from "./database";

async function main() {
  console.log("Seeding database...");

  const building = [
    { name: "សៀងណាំ", isActive: true },
    { name: "សុខតុញ", isActive: true },
  ];
  
  const classroom = [
    {number: 2, name: "ស្រុកកងមាស", buildingId: 1 },
  ];

  // await db.insert(buildings).values(building).onConflictDoUpdate({
  //   target: buildings.name,
  //   set: { isActive: true, updatedAt: new Date() }
  // });

  await db.insert(classrooms).values(classroom).onConflictDoUpdate({
    target: buildings.name,
    set: { updatedAt: new Date() }
  });

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await pool.end();
    process.exit(1);
  });