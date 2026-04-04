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
      page = 1,
      limit = 10,
      name,
    } = query;

    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    const conditions: SQL[] = [];

    if (name?.trim()) {
      conditions.push(ilike(students.name, `%${name.trim()}%`));
    }

    if (academicYearId) {
      // បញ្ជាក់៖ ត្រូវប្រាកដថា academicYearId ជា Number
      conditions.push(eq(students.academicYearId, Number(academicYearId)));
    }

    if (facultyId && facultyId !== null) {
      conditions.push(eq(students.facultyId, Number(facultyId)));
    }

    if (departmentId && departmentId !== null) {
      conditions.push(eq(students.departmentId, Number(departmentId)));
    }

    if (academicLevelId && academicLevelId !== null) {
      conditions.push(eq(students.academicLevelId, Number(academicLevelId)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const countResult = await this.db
      .select({ total: count() })
      .from(students)
      .where(where);

    const total = Number(countResult[0]?.total ?? 0);

    let offset = (safePage - 1) * safeLimit;
    let finalPage = safePage;

    if (offset >= total && total > 0) {
      offset = 0;
      finalPage = 1;
    }

    // ៥. ទាញយកទិន្នន័យពិតប្រាកដ
    const data = await this.db.query.students.findMany({
      where,
      limit: safeLimit,
      offset: offset,
      orderBy: (students, { desc }) => [desc(students.createdAt)],
      with: {
        faculty: true,
        department: true,
      },
    });

    return {
      data,
      total,
      page: finalPage,
      limit: safeLimit,
    };
  }

  async create(data: StudentInput): Promise<Student | undefined> {
    const [student] = await this.db.insert(students).values(data).returning();
    return student;
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
