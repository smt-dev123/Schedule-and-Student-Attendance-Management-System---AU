import type { DrizzleDb } from "@/database";
import type { CourseRepository } from "@/repositories/course.repository";
import type { ScheduleRepository } from "@/repositories/schedule.repository";
import type { StudentRepository } from "@/repositories/student.repository";
import type { Course, Schedule } from "@/types/academy";
import type {
  ScheduleUpdateInput,
  ScheduleUpdateWithCoursesInput,
  ScheduleWithCoursesInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export class ScheduleService {
  constructor(
    private readonly db: DrizzleDb,
    private readonly scheduleRepo: ScheduleRepository,
    private readonly courseRepo: CourseRepository,
    private readonly studentRepo: StudentRepository,
  ) {}

  async createSchedule(
    data: ScheduleWithCoursesInput,
  ): Promise<{ schedule: Schedule; courses: Course[] }> {
    const { schedule: scheduleData, courses: coursesData } = data;

    return this.db.transaction(async (tx) => {
      const existing = await this.scheduleRepo.findByUniqueKey(
        {
          facultyId: scheduleData.facultyId,
          academicLevelId: scheduleData.academicLevelId,
          departmentId: scheduleData.departmentId,
          semester: scheduleData.semester,
          studyShift: scheduleData.studyShift,
          generation: scheduleData.generation,
          year: scheduleData.year,
        },
        tx,
      );

      if (existing) {
        throw new HTTPException(409, { message: "Schedule already exists" });
      }

      const schedule = await this.scheduleRepo.create(scheduleData, tx);

      if (!schedule) {
        throw new HTTPException(500, {
          message: "Failed to create schedule",
        });
      }

      const courses = await this.courseRepo.createMany(
        coursesData.map((course) => ({
          ...course,
          scheduleId: schedule.id,
          academicYearId: schedule.academicYearId,
        })),
        tx,
      );

      await this.studentRepo.updateStudentAcademicYear(
        schedule.facultyId,
        schedule.departmentId,
        schedule.academicYearId,
        schedule.academicLevelId,
        tx,
      );

      return { schedule, courses };
    });
  }

  async findAll(query?: any): Promise<Schedule[]> {
    return this.scheduleRepo.findAll(query);
  }

  async findById(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
    return schedule;
  }

  async updateSchedule(
    id: number,
    data: ScheduleUpdateWithCoursesInput,
  ): Promise<Schedule> {
    const { schedule: scheduleData, courses: coursesData } = data;

    return this.db.transaction(async (tx) => {
      // 1. Update Schedule Metadata
      const updated = await this.scheduleRepo.update(id, scheduleData);
      if (!updated) {
        throw new HTTPException(404, { message: "Schedule not found" });
      }

      // 2. Update Courses if provided
      if (coursesData) {
        // Delete existing courses
        await this.courseRepo.deleteByScheduleId(id, tx);

        // Insert new courses
        await this.courseRepo.createMany(
          coursesData.map((course) => ({
            ...course,
            scheduleId: id,
            academicYearId: updated.academicYearId,
          })),
          tx,
        );
      }

      return updated;
    });
  }

  async deleteSchedule(id: number): Promise<void> {
    const deleted = await this.scheduleRepo.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
  }
}
