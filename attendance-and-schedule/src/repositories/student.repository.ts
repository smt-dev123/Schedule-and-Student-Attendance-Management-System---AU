import { type DrizzleDb, type Transaction } from "@/database";
import {
  academicYears,
  schedules,
  studentAcademicYears,
  students,
} from "@/database/schemas";
import type {
  CreateStudent,
  Student,
  StudentPromoteInput,
} from "@/types/academy";
import { generateId } from "@/utils/generate-id";
import type {
  StudentQueryInput,
  StudentUpdateInput,
} from "@/validators/academy";
import { and, count, eq, ilike, SQL } from "drizzle-orm";

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
    if (academicYearId && academicYearId !== "all")
      conditions.push(eq(students.academicYearId, Number(academicYearId)));
    if (academicLevelId && academicLevelId !== "all")
      conditions.push(eq(students.academicLevelId, Number(academicLevelId)));

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

  async findById(id: number): Promise<Student | undefined> {
    return this.db.query.students.findFirst({
      where: eq(students.id, id),
    });
  }

  async findByUserId(id: string): Promise<Student | undefined> {
    return this.db.query.students.findFirst({
      where: eq(students.userId, id),
    });
  }

  async create(
    data: CreateStudent,
    tx: Transaction,
  ): Promise<Student | undefined> {
    const studentId = generateId();
    const [student] = await tx
      .insert(students)
      .values({ ...data, id: studentId })
      .returning();
    return student;
  }

  async update(
    id: number,
    data: StudentUpdateInput,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(students)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async delete(id: number): Promise<Student | undefined> {
    const [student] = await this.db
      .delete(students)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async findByFilter(data: {
    facultyId?: number;
    departmentId?: number;
    generation?: number;
  }): Promise<Student[]> {
    const conditions: SQL[] = [];
    if (data.facultyId) conditions.push(eq(students.facultyId, data.facultyId));
    if (data.departmentId)
      conditions.push(eq(students.departmentId, data.departmentId));
    if (data.generation)
      conditions.push(eq(students.generation, data.generation));

    return this.db.query.students.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
    });
  }

  async updateStudentAcademicYear(
    facultyId: number,
    departmentId: number,
    academicYearId: number,
    academicLevelId: number,
    tx: Transaction,
  ): Promise<void> {
    await tx
      .update(students)
      .set({ academicYearId, updatedAt: new Date() })
      .where(
        and(
          eq(students.facultyId, facultyId),
          eq(students.departmentId, departmentId),
          eq(students.academicLevelId, academicLevelId),
        ),
      );
  }

  async findScheduleByStudentIdAndCurrentAcademicYear(
    userId: string,
    semester: number,
  ) {
    const [student, currentYear] = await Promise.all([
      this.db.query.students.findFirst({
        where: eq(students.userId, userId),
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
        eq(schedules.departmentId, student.departmentId),
        eq(schedules.academicLevelId, student.academicLevelId),
        eq(schedules.academicYearId, currentYear.id),
        eq(schedules.semester, semester),
      ),
      columns: {
        generation: true,
        semester: true,
        semesterStart: true,
        semesterEnd: true,
        studyShift: true,
      },
      with: {
        academicYear: { columns: { name: true } },
        faculty: { columns: { name: true } },
        department: { columns: { name: true } },
        academicLevel: { columns: { level: true } },
        classroom: {
          columns: { name: true },
          with: {
            building: { columns: { name: true } },
          },
        },
        courses: {
          columns: {
            name: true,
            code: true,
            credits: true,
            day: true,
            hours: true,
          },
          with: {
            teacher: { columns: { name: true, phone: true } },
          },
        },
      },
    });
  }

  async promote(data: StudentPromoteInput): Promise<Student | undefined> {
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
          semester: Number(data.semester),
          year: Number(data.year),
          updatedAt: new Date(),
        })
        .where(eq(students.id, data.studentId))
        .returning();

      return updatedStudent;
    });
  }
}
