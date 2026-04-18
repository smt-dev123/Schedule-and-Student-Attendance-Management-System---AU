import { type DrizzleDb } from "@/database";
import { attendanceRecords } from "@/database/schemas";
import type { AttendanceRecord } from "@/types/attendance";
import type { MarkAttendanceInput } from "@/validators/attendance";
import { and, eq, sql } from "drizzle-orm";

export class AttendanceRepository {
  constructor(private readonly db: DrizzleDb) {}

  async markAttendance(
    datas: MarkAttendanceInput[],
  ): Promise<AttendanceRecord[]> {
    const attendance = await this.db
      .insert(attendanceRecords)
      .values(datas)
      .onConflictDoUpdate({
        target: [attendanceRecords.courseId, attendanceRecords.studentId, attendanceRecords.date, attendanceRecords.session],
        set: {
          status: sql`EXCLUDED.status`,
          notes: sql`EXCLUDED.notes`,
          recordedBy: sql`EXCLUDED.recorded_by`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        }
      })
      .returning();
    return attendance;
  }

  async getAttendanceByStudentId(studentId: string) {
    return await this.db.query.attendanceRecords.findMany({
      where: eq(attendanceRecords.studentId, studentId),
      with: {
        course: true,
      },
    });
  }

  async findAttendanceByStudentIdCourseIdAndDate(
    studentId: string,
    courseId: number,
    date: Date,
  ) {
    return await this.db.query.attendanceRecords.findFirst({
      where: and(
        eq(attendanceRecords.studentId, studentId),
        eq(attendanceRecords.courseId, courseId),
        eq(attendanceRecords.date, date.toDateString()),
      ),
    });
  }

  async getAttendanceByCourseAndDate(courseId: number, date: Date) {
    return await this.db.query.attendanceRecords.findMany({
      where: and(
        eq(attendanceRecords.courseId, courseId),
        eq(attendanceRecords.date, date.toDateString()),
      ),
    });
  }

  async getAttendanceByCourseId(courseId: number) {
    return await this.db.query.attendanceRecords.findMany({
      where: eq(attendanceRecords.courseId, courseId),
    });
  }
}
