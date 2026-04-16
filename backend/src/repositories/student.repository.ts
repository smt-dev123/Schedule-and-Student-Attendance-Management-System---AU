import { type DrizzleDb } from "@/database";
import {
  academicYears,
  schedules,
  studentAcademicYears,
  students,
} from "@/database/schemas";
import type { Student } from "@/types/academy";
import type {
  StudentInput,
  StudentPromoteInput,
  StudentQueryInput,
  StudentUpdateInput,
} from "@/validators/academy";
import { and, count, eq, ilike, inArray, SQL } from "drizzle-orm";

export class StudentRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(query: StudentQueryInput): Promise<{
    data: Student[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      facultyId,
      departmentId,
      academicLevelId,
      academicYearId,
      page,
      limit,
      name,
    } = query;

    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    const conditions: SQL[] = [];
    if (name?.trim()) conditions.push(ilike(students.name, `%${name.trim()}%`));
    if (facultyId && facultyId !== "all")
      conditions.push(eq(students.facultyId, Number(facultyId)));
    if (departmentId && departmentId !== "all")
      conditions.push(eq(students.departmentId, Number(departmentId)));
    if (academicLevelId && academicLevelId !== "all")
      conditions.push(eq(students.academicLevelId, Number(academicLevelId)));

    if (academicYearId && academicYearId !== "all") {
      conditions.push(
        inArray(
          students.id,
          this.db
            .select({ studentId: studentAcademicYears.studentId })
            .from(studentAcademicYears)
            .where(
              eq(studentAcademicYears.academicYearId, Number(academicYearId)),
            ),
        ),
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.students.findMany({
        where,
        limit: safeLimit,
        offset: (safePage - 1) * safeLimit,
        orderBy: (students, { desc }) => [desc(students.createdAt)],
        with: {
          faculty: true,
          department: true,
        },
      }),
      this.db.select({ total: count() }).from(students).where(where),
    ]);

    const total = countResult[0]?.total ?? 0;

    return { data, total, page: safePage, limit: safeLimit };
  }

  async findById(id: string): Promise<Student | undefined> {
    return this.db.query.students.findFirst({
      where: eq(students.id, id),
    });
  }

  async create(data: StudentInput): Promise<Student | undefined> {
    return await this.db.transaction(async (tx) => {
      const [student] = await tx.insert(students).values(data).returning();

      if (!student) return undefined;
      await tx.insert(studentAcademicYears).values({
        studentId: String(student.id),
        academicYearId: data.academicYearId,
      });

      return student;
    });
  }

  async promote(data: StudentPromoteInput): Promise<any> {
    return await this.db.transaction(async (tx) => {
      await tx
        .insert(studentAcademicYears)
        .values({
          studentId: data.studentId,
          academicYearId: Number(data.academicYearId),
        })
        .onConflictDoNothing();

      const [updatedStudent] = await tx
        .update(students)
        .set({
          academicYearId: Number(data.academicYearId),
          year: Number(data.year),
          semester: Number(data.semester),
        })
        .where(eq(students.id, data.studentId))
        .returning();

      return updatedStudent;
    });
  }

  async update(
    id: string,
    data: StudentUpdateInput,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async delete(id: string): Promise<Student | undefined> {
    const [deletedStudent] = await this.db
      .delete(students)
      .where(eq(students.id, id))
      .returning();
    return deletedStudent;
  }

  async findByFilter(filter: {
    facultyId?: number;
    departmentId?: number;
    generation?: number;
  }): Promise<Student[]> {
    const conditions: SQL[] = [];
    if (filter.facultyId)
      conditions.push(eq(students.facultyId, filter.facultyId));
    if (filter.departmentId)
      conditions.push(eq(students.departmentId, filter.departmentId));
    if (filter.generation)
      conditions.push(eq(students.generation, filter.generation));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    return this.db.query.students.findMany({
      where,
    });
  }

  async findScheduleByStudentIdAndAcademicYearId(studentId: string) {
    const [student, currentYear] = await Promise.all([
      this.db.query.students.findFirst({
        where: eq(students.id, studentId),
        columns: { id: true, academicLevelId: true, departmentId: true },
      }),
      this.db.query.academicYears.findFirst({
        where: eq(academicYears.isCurrent, true),
        columns: { id: true },
      }),
    ]);

    if (!student || !currentYear) return null;
    if (!student.academicLevelId || !student.departmentId) return null;

    return this.db.query.studentAcademicYears.findFirst({
      where: and(
        eq(studentAcademicYears.studentId, studentId),
        eq(studentAcademicYears.academicYearId, currentYear.id),
      ),
      with: {
        academicYear: {
          with: {
            schedules: {
              where: (schedules, { and, eq }) =>
                and(
                  eq(schedules.academicLevelId, student.academicLevelId!),
                  eq(schedules.departmentId, student.departmentId!),
                ),
              with: {
                courses: {
                  with: {
                    teacher: true,
                    sessionTime: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findScheduleByStudentIdAndCurrentAcademicYear(studentId: string) {
    const [student, currentYear] = await Promise.all([
      this.db.query.students.findFirst({
        where: eq(students.id, studentId),
        columns: { id: true, academicLevelId: true, departmentId: true },
      }),
      this.db.query.academicYears.findFirst({
        where: eq(academicYears.isCurrent, true),
        columns: { id: true },
      }),
    ]);

    if (!student || !currentYear) return null;
    if (!student.academicLevelId || !student.departmentId) return null;

    return this.db.query.schedules.findMany({
      where: and(
        eq(schedules.academicLevelId, student.academicLevelId),
        eq(schedules.departmentId, student.departmentId),
        eq(schedules.academicYearId, currentYear.id),
      ),
      with: {
        courses: {
          with: {
            teacher: true,
            sessionTime: true,
          },
        },
      },
    });
  }
}
