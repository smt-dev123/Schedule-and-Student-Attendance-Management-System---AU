import { type DrizzleDb } from "@/database";
import { majors } from "@/database/schemas";
import type { Major } from "@/types/academy";
import type {
  MajorInput,
  MajorUpdateInput,
} from "@/validators/academy";
import { and, eq } from "drizzle-orm";

export class MajorRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(facultyId?: number): Promise<Major[]> {
    const conditions: any[] = [];
    if (facultyId) {
      conditions.push(eq(majors.facultyId, facultyId));
    }

    return await this.db.query.majors.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        faculty: true,
      },
      orderBy: (majors, { desc }) => [desc(majors.createdAt)],
    });
  }

  async findById(id: number): Promise<Major | undefined> {
    return await this.db.query.majors.findFirst({
      where: eq(majors.id, id),
      with: {
        faculty: true,
      },
    });
  }

  async create(data: MajorInput): Promise<Major> {
    const [newMajor] = await this.db
      .insert(majors)
      .values(data)
      .returning();
    return newMajor!;
  }

  async update(
    id: number,
    data: MajorUpdateInput,
  ): Promise<Major | undefined> {
    const [updated] = await this.db
      .update(majors)
      .set(data)
      .where(eq(majors.id, id))
      .returning();
    return updated;
  }

  async delete(id: number): Promise<Major> {
    const [deleted] = await this.db
      .delete(majors)
      .where(eq(majors.id, id))
      .returning();
    return deleted!;
  }
}
