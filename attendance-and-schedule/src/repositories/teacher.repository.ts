import { type DrizzleDb } from "@/database";
import { teachers } from "@/database/schemas";
import type {
  CreateTeacher,
  Teacher,
  TeacherQueryInput,
  UpdateTeacher,
} from "@/types/academy";
import { generateId } from "@/utils/generate-id";
import { and, count, eq, ilike, SQL } from "drizzle-orm";

export class TeacherRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(query: TeacherQueryInput): Promise<{
    data: Teacher[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { name, facultyId, academicLevelId, page, limit } = query;
    const conditions: SQL[] = [];
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    if (name?.trim()) conditions.push(ilike(teachers.name, `%${name.trim()}%`));
    if (facultyId && facultyId !== "all")
      conditions.push(eq(teachers.facultyId, Number(facultyId)));
    if (academicLevelId)
      conditions.push(eq(teachers.academicLevelId, academicLevelId));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.teachers.findMany({
        where,
        with: {
          academicLevel: {
            columns: {
              id: true,
              level: true,
            },
          },
          faculty: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
        limit: safeLimit,
        offset: (safePage - 1) * safeLimit,
      }),
      this.db.select({ total: count() }).from(teachers).where(where),
    ]);

    const total = countResult[0]?.total ?? 0;

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async findById(id: number): Promise<Teacher | undefined> {
    return await this.db.query.teachers.findFirst({
      where: eq(teachers.id, id),
    });
  }

  async findByUserId(id: string): Promise<Teacher | undefined> {
    return await this.db.query.teachers.findFirst({
      where: eq(teachers.userId, id),
      with: {
        academicLevel: {
          columns: {
            id: true,
            level: true,
          },
        },
        faculty: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: CreateTeacher): Promise<Teacher> {
    const teacherId = generateId();
    const [teacher] = await this.db
      .insert(teachers)
      .values({ ...data, id: teacherId })
      .returning();
    return teacher!;
  }

  async update(id: number, data: UpdateTeacher): Promise<Teacher | undefined> {
    const [teacher] = await this.db
      .update(teachers)
      .set(data)
      .where(eq(teachers.id, id))
      .returning();
    return teacher;
  }

  async delete(id: number): Promise<Teacher> {
    const [deleted] = await this.db
      .delete(teachers)
      .where(eq(teachers.id, id))
      .returning();
    return deleted!;
  }
}
