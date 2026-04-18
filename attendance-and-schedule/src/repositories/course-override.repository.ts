import { type DrizzleDb } from "@/database";
import { courseOverrides } from "@/database/schemas";
import { and, eq, sql } from "drizzle-orm";
import type {
  CourseOverrideInput,
  CourseOverrideUpdateInput,
} from "@/validators/academy";

export class CourseOverrideRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll() {
    return await this.db.query.courseOverrides.findMany({
      with: {
        originalCourse: true,
        replacementTeacher: true,
        replacementClassroom: true,
      },
      orderBy: (overrides, { desc }) => [desc(overrides.date)],
    });
  }

  async findByDate(date: string) {
    return await this.db.query.courseOverrides.findMany({
      where: eq(courseOverrides.date, date),
      with: {
        originalCourse: true,
        replacementTeacher: true,
        replacementClassroom: true,
      },
    });
  }

  async findById(id: number) {
    return await this.db.query.courseOverrides.findFirst({
      where: eq(courseOverrides.id, id),
      with: {
        originalCourse: true,
        replacementTeacher: true,
        replacementClassroom: true,
      },
    });
  }

  async create(data: CourseOverrideInput) {
    const [newOverride] = await this.db
      .insert(courseOverrides)
      .values({
        ...data,
        date: data.date.toISOString().split("T")[0],
      } as any)
      .returning();
    return newOverride;
  }

  async update(id: number, data: CourseOverrideUpdateInput) {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = data.date.toISOString().split("T")[0];
    }

    const [updated] = await this.db
      .update(courseOverrides)
      .set(updateData)
      .where(eq(courseOverrides.id, id))
      .returning();
    return updated;
  }

  async delete(id: number) {
    const [deleted] = await this.db
      .delete(courseOverrides)
      .where(eq(courseOverrides.id, id))
      .returning();
    return deleted;
  }
}
