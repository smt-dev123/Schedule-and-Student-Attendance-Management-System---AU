import type { DrizzleDb } from "@/database";
import { academicYears, schedules } from "@/database/schemas";
import type { AcademicYear } from "@/types/academy";
import type {
  AcademicYearInput,
  AcademicYearUpdateInput,
} from "@/validators/academy";
import { eq } from "drizzle-orm";

export class AcademicYearRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll() {
    return await this.db.query.academicYears.findMany();
  }

  async findById(id: number) {
    return await this.db.query.academicYears.findFirst({
      where: eq(academicYears.id, id),
    });
  }

  async create(data: AcademicYearInput): Promise<AcademicYear> {
    const [academicYear] = await this.db
      .insert(academicYears)
      .values(data)
      .returning();
    return academicYear!;
  }

  async update(
    id: number,
    data: AcademicYearUpdateInput,
  ): Promise<AcademicYear> {
    const [updated] = await this.db
      .update(academicYears)
      .set(data)
      .where(eq(academicYears.id, id))
      .returning();
    return updated!;
  }

  async delete(id: number): Promise<AcademicYear> {
    const [deleted] = await this.db
      .delete(academicYears)
      .where(eq(academicYears.id, id))
      .returning();
    return deleted!;
  }
}
