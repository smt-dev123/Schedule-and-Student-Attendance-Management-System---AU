import { eq, sql, desc } from "drizzle-orm";
import {
  user,
  students,
  teachers,
  departments,
  attendanceSummaries,
} from "../database/schemas";
import { type DrizzleDb } from "@/database";

export class DashboardRepository {
  constructor(private db: DrizzleDb) {}

  async getCounts() {
    const [staffRes, teacherRes, studentRes, dropoutRes] = await Promise.all([
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(user)
        .where(eq(user.role, "admin")),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(teachers)
        .where(eq(teachers.isActive, true)),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(students)
        .where(eq(students.educationalStatus, "enrolled")),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(students)
        .where(eq(students.educationalStatus, "dropped out")),
    ]);

    return {
      staffCount: staffRes[0].count,
      teacherCount: teacherRes[0].count,
      studentCount: studentRes[0].count,
      dropoutCount: dropoutRes[0].count,
    };
  }

  async getStudentsByDepartment() {
    const res = await this.db
      .select({
        name: departments.name,
        value: sql<number>`count(${students.id})::int`,
      })
      .from(students)
      .innerJoin(departments, eq(students.departmentId, departments.id))
      .where(eq(students.educationalStatus, "enrolled"))
      .groupBy(departments.id, departments.name);

    return res;
  }

  async getAttendanceTrend() {
    // past 7 days
    const res = await this.db.execute(sql`
      SELECT 
        to_char(date, 'Day') AS day,
        COUNT(*)::int AS count
      FROM attendance_records
      WHERE status = 'present' AND date >= current_date - interval '7 days'
      GROUP BY date
      ORDER BY date ASC;
    `);

    return res.rows.map((r) => ({
      day: String(r.day).trim(),
      count: Number(r.count),
    }));
  }

  async getTopAttendance() {
    const res = await this.db
      .select({
        name: students.name,
        gender: students.gender,
        department: departments.name,
        percentage: attendanceSummaries.presentPercentage,
      })
      .from(attendanceSummaries)
      .innerJoin(students, eq(attendanceSummaries.studentId, students.id))
      .innerJoin(
        departments,
        eq(attendanceSummaries.departmentId, departments.id),
      )
      .orderBy(desc(attendanceSummaries.presentPercentage))
      .limit(4);

    return res;
  }
}
