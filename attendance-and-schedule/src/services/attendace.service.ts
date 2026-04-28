import type {
  AttendanceData,
  AttendanceInput,
  AttendanceRecord,
  AttendanceReportQuery,
} from "@/types/attendance";
import type {
  BulkAttendanceInput,
  MarkAttendanceInput,
} from "@/validators/attendance";
import type { AttendanceRepository } from "@/repositories/attendance.repository";
import type { CourseRepository } from "@/repositories/course.repository";
import type { DrizzleDb } from "@/database";
import { HTTPException } from "hono/http-exception";
import { teachers } from "@/database/schemas";
import { eq } from "drizzle-orm";

export class AttendanceService {
  constructor(
    private readonly db: DrizzleDb,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async markBulkAttendance(
    input: BulkAttendanceInput,
    userId: string,
  ): Promise<AttendanceRecord[]> {
    const teacher = await this.db.query.teachers.findFirst({
      where: eq(teachers.userId, userId),
      columns: { id: true },
    });

    if (!teacher) {
      throw new HTTPException(404, { message: "Teacher not found" });
    }

    const records: AttendanceInput[] = input.mark.map((mark) => ({
      courseId: input.courseId,
      studentId: mark.studentId,
      date: input.date,
      status: mark.status,
      session: input.session,
      academicYearId: input.academicYearId,
      notes: mark.notes,
      recordedBy: teacher.id,
    }));

    return this.db.transaction(async (tx) => {
      const course = await this.courseRepository.findOne(input.courseId, tx);

      if (!course) {
        throw new HTTPException(404, { message: "Course not found" });
      }

      if (course.totalSessionLeft <= 0) {
        throw new HTTPException(400, {
          message: "No sessions left for this course",
        });
      }

      const existenceChecks = await Promise.all(
        records.map((record) =>
          this.attendanceRepository.findAttendanceByStudentIdCourseIdAndDate(
            record.studentId,
            record.courseId,
            new Date(record.date),
            record.session,
          ),
        ),
      );

      if (existenceChecks.some(Boolean)) {
        throw new HTTPException(409, { message: "Attendance already marked" });
      }

      const [attendance] = await Promise.all([
        this.attendanceRepository.markAttendance(records, tx),
        this.courseRepository.updateCourseHoursAndSession(
          input.courseId,
          "1.5",
          tx,
        ),
      ]);

      await Promise.all(
        records.map(async (record) => {
          await this.attendanceRepository.incrementAttendanceSummary(
            record.studentId,
            record.courseId,
            input.academicYearId,
            input.facultyId,
            input.departmentId,
            record.status,
            course.session,
            course.totalSessionLeft,
            tx,
          );
          await this.attendanceRepository.recalculateSummaryPercentages(
            record.studentId,
            record.courseId,
            input.academicYearId,
            tx,
          );
        }),
      );

      return attendance;
    });
  }

  async updateAttendanceStatus(
    studentId: number,
    courseId: number,
    date: Date,
    session: number,
    oldStatus: "present" | "absent" | "late" | "excused",
    newStatus: "present" | "absent" | "late" | "excused",
    academicYearId: number,
  ) {
    return this.db.transaction(async (tx) => {
      const course = await this.courseRepository.findOne(courseId, tx);

      if (!course) {
        throw new HTTPException(404, { message: "Course not found" });
      }

      const [updated] = await Promise.all([
        this.attendanceRepository.updateAttendanceStatus(
          studentId,
          courseId,
          date,
          session,
          newStatus,
          tx,
        ),
        this.attendanceRepository.adjustAttendanceSummary(
          studentId,
          courseId,
          academicYearId,
          oldStatus,
          newStatus,
          tx,
        ),
      ]);

      await this.attendanceRepository.recalculateSummaryPercentages(
        studentId,
        courseId,
        academicYearId,
        tx,
      );

      return updated;
    });
  }

  async getAttendanceByStudentId(
    studentId: number,
  ): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.getAttendanceByStudentId(studentId);
  }

  async attendanceReport(query: AttendanceReportQuery) {
    return this.attendanceRepository.getAttendanceSummaryByCourseAndCohort(
      query,
    );
  }
}
