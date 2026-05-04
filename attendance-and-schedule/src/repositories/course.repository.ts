// repository
import { type DrizzleDb, type Transaction } from "@/database";
import { courses, students } from "@/database/schemas";
import type { Course } from "@/types/academy";
import type { CourseInput, CourseUpdateInput, CourseQueryInput } from "@/validators/academy";
import { and, eq, sql } from "drizzle-orm";

const SESSION_DURATION = 1.5; // hours per session

export class CourseRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne(id: number, tx?: Transaction): Promise<Course | undefined> {
    const client = tx ?? this.db;
    return client.query.courses.findFirst({
      where: eq(courses.id, id),
      with: {
        schedule: {
          with: {
            faculty: true,
            academicLevel: true,
            sessionTime: true,
            classroom: true,
            department: true,
          },
        },
        teacher: true,
      },
    });
  }

  async findAll(query: CourseQueryInput): Promise<{
    data: Course[]
    total: number
    page: number
    limit: number
  }> {
    const { academicYearId, page = 1, limit = 10 } = query
    const offset = (page - 1) * limit

    const where = academicYearId ? eq(courses.academicYearId, academicYearId) : undefined

    const data = await this.db.query.courses.findMany({
      where,
      limit,
      offset,
      with: {
        schedule: {
          with: {
            faculty: true,
            academicLevel: true,
            sessionTime: true,
            classroom: true,
            department: true,
          },
        },
        teacher: true,
      },
    })

    const totalResult = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(courses)
      .where(where)

    const total = totalResult[0]?.total ?? 0

    return {
      data,
      total: Number(total),
      page,
      limit,
    }
  }

  async create(data: CourseInput): Promise<Course | undefined> {
    const session = Number(data.hours) / SESSION_DURATION;
    const [course] = await this.db
      .insert(courses)
      .values({
        ...data,
        session,
        totalHoursLeft: data.hours,
        totalSessionLeft: session,
      })
      .returning();
    return course;
  }

  async createMany(data: CourseInput[], tx?: Transaction): Promise<Course[]> {
    const client = tx ?? this.db;
    return client
      .insert(courses)
      .values(
        data.map((d) => ({
          ...d,
          session: Number(d.hours) / SESSION_DURATION,
          totalHoursLeft: d.hours,
          totalSessionLeft: Number(d.hours) / SESSION_DURATION,
        })),
      )
      .returning();
  }

  async update(
    id: number,
    data: CourseUpdateInput,
  ): Promise<Course | undefined> {
    const [course] = await this.db
      .update(courses)
      .set({ ...data, updatedAt: new Date() }) // ← updatedAt kept fresh
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async delete(id: number): Promise<Course | undefined> {
    const [course] = await this.db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteByScheduleId(
    scheduleId: number,
    tx?: Transaction,
  ): Promise<void> {
    const client = tx ?? this.db;
    await client.delete(courses).where(eq(courses.scheduleId, scheduleId));
  }

  async updateCourseHoursAndSession(
    id: number,
    hours: string,
    tx?: Transaction,
  ): Promise<Course | undefined> {
    const client = tx ?? this.db;
    const [course] = await client
      .update(courses)
      .set({
        totalHoursLeft: sql`${courses.totalHoursLeft} - ${hours}::numeric`,
        totalSessionLeft: sql`${courses.totalSessionLeft} - 1`,
        updatedAt: new Date(), // ← updatedAt kept fresh
      })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async getCourseStudents(courseId: number): Promise<any[]> {
    const course = await this.db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: { schedule: true },
    });

    if (!course || !course.schedule) return [];

    const { schedule } = course;
    return this.db.query.students.findMany({
      where: and(
        eq(students.facultyId, schedule.facultyId),
        eq(students.departmentId, schedule.departmentId),
        eq(students.academicLevelId, schedule.academicLevelId),
        eq(students.generation, schedule.generation),
        eq(students.semester, schedule.semester),
        eq(students.academicYearId, schedule.academicYearId),
      ),
    });
  }
}
