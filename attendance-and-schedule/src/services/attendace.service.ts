import type {
  AttendanceRecord,
  CourseAttendanceSummary,
} from "@/types/attendance";
import type {
  BulkAttendanceInput,
  MarkAttendanceInput,
} from "@/validators/attendance";
import type { AttendanceRepository } from "@/repositories/attendance.repository";
import { HTTPException } from "hono/http-exception";
import type { ScheduleService } from "./schedule.service";

export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly scheduleService: ScheduleService
  ) {}

  async markBulkAttendance(
    input: BulkAttendanceInput,
  ): Promise<AttendanceRecord[]> {
    const records: MarkAttendanceInput[] = input.mark.map((mark) => ({
      courseId: input.courseId,
      studentId: mark.studentId,
      date: input.date,
      status: mark.status,
      session: input.session,
      notes: mark.notes,
      recordedBy: input.recordedBy,
    }));

    return this.attendanceRepository.markAttendance(records);
  }

  async generateAttendanceReportForStudent(
    studentId: string,
  ): Promise<Record<string, CourseAttendanceSummary>> {
    const report =
      await this.attendanceRepository.getAttendanceByStudentId(studentId);

    const counts = report.reduce<
      Record<
        string,
        { late: number; absent: number; present: number; excused: number }
      >
    >((acc, row) => {
      const courseName = row.course.name;
      if (!acc[courseName]) {
        acc[courseName] = { late: 0, absent: 0, present: 0, excused: 0 };
      }
      switch (row.status) {
        case "absent":
          acc[courseName].absent++;
          break;
        case "present":
          acc[courseName].present++;
          break;
        case "late":
          acc[courseName].late++;
          break;
        case "excused":
          acc[courseName].excused++;
          break;
      }
      return acc;
    }, {});

    return Object.fromEntries(
      Object.entries(counts).map(([courseName, c]) => {
        const total = c.absent + c.present + c.late + c.excused;
        const absentPercentage = total > 0 ? (c.absent / total) * 100 : 0;
        const excusedPercentage = total > 0 ? (c.excused / total) * 100 : 0;
        return [
          courseName,
          {
            ...c,
            absentPercentage,
            excusedPercentage,
            absentAndExcusePercentage: absentPercentage + excusedPercentage,
          },
        ];
      }),
    );
  }

  async generateAttendanceReportForCourse(courseId: number) {
    const students = await this.scheduleService.getStudentsByCourseId(courseId);
    const attendanceRecords = await this.attendanceRepository.getAttendanceByCourseId(courseId);

    const report = students.map((student) => {
      const studentRecords = attendanceRecords.filter((record) => record.studentId === student.id);
      
      let present = 0;
      let absent = 0;
      let late = 0;
      let excused = 0;

      studentRecords.forEach((record) => {
        switch (record.status) {
          case "present": present++; break;
          case "absent": absent++; break;
          case "late": late++; break;
          case "excused": excused++; break;
        }
      });

      const totalAbsent = absent + excused; // Mimicking the frontend logic where leave + absent = totalAbsent
      
      // Calculate score based on frontend logic: Math.max(0, 100 - (absent + leave) * 5)
      // Here leave means excused. Wait, frontend uses `student.leave` for excused? We'll map `excused` to `leave`.
      const score = Math.max(0, 10 - totalAbsent * 0.5); // If percentage is 100-(absent*5), score out of 10 might be 10 - absent*0.5

      return {
        id: student.id,
        name: student.name,
        gender: student.gender,
        status: student.educationalStatus === "enrolled" ? "Enrolled" : "Dropped out",
        phone: student.phone,
        leave: excused,
        absent: absent,
        score: student.educationalStatus === "dropped out" ? 0 : score,
      };
    });

    return report;
  }

  async getAttendanceByStudentId(
    studentId: string,
  ): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.getAttendanceByStudentId(studentId);
  }

  async getAttendanceByCourseAndDate(courseId: number, date: Date) {
    return this.attendanceRepository.getAttendanceByCourseAndDate(courseId, date);
  }
}
