import { db } from "@/database";
import { students, courses } from "@/database/schemas";
import { and, eq } from "drizzle-orm";
import type { CourseRepository } from "@/repositories/course.repository";
import { ScheduleRepository } from "@/repositories/schedule.repository";
import type { Course, Schedule } from "@/types/academy";
import type {
  ScheduleUpdateInput,
  ScheduleWithCoursesInput,
  ScheduleWithCoursesUpdateInput
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export class ScheduleService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  async createSchedule(
    data: ScheduleWithCoursesInput,
  ): Promise<{ schedule: Schedule; courses: Course[] }> {
    try {
      const { schedule: scheduleData, courses: courseDatas } = data;
      return await db.transaction(async (tx) => {
        const existingSchedule = await this.scheduleRepo.findByUniqueKey(
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

        if (existingSchedule) {
          throw new HTTPException(409, { message: "Schedule already exists" });
        }

        const schedule = await this.scheduleRepo.create(scheduleData, tx);
        if (!schedule) {
          throw new HTTPException(500, {
            message: "Failed to create schedule",
          });
        }

        const coursesWithSchedule = courseDatas.map((course) => ({
          ...course,
          scheduleId: schedule.id,
        }));

        const courses = await this.courseRepo.createMany(
          coursesWithSchedule,
          tx,
        );
        return { schedule, courses };
      });
    } catch (error: any) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      if (error.code === "23505") {
        if (error.constraint === "unique_schedule_day_classroom_time") {
          throw new HTTPException(409, {
            message: "One or more courses have schedule conflicts (same time and place)",
          });
        }
        if (error.constraint === "courses_code_key" || error.constraint === "courses_code_unique") {
          throw new HTTPException(409, {
            message: "One or more courses have duplicate codes",
          });
        }
        throw new HTTPException(409, { message: "Schedule or course data conflict" });
      }
      throw new HTTPException(500, { message: "Internal server error" });
    }
  }

  async findAll(academicYearId?: number): Promise<Schedule[]> {
    return this.scheduleRepo.findAll(academicYearId);
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
    data: ScheduleWithCoursesUpdateInput,
  ): Promise<Schedule> {
    const { schedule: scheduleData, courses: courseDatas } = data;

    if (Object.keys(scheduleData).length === 0 && (!courseDatas || courseDatas.length === 0)) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }

    try {
      return await db.transaction(async (tx) => {
        let updated: Schedule | null = null;

        if (Object.keys(scheduleData).length > 0) {
          updated = await this.scheduleRepo.update(id, scheduleData);
        } else {
          updated = await this.scheduleRepo.findById(id);
        }

        if (!updated) {
          throw new HTTPException(404, { message: "Schedule not found" });
        }

        if (courseDatas && courseDatas.length > 0) {
          // Fetch existing courses for this schedule
          const existingCourses = await tx.query.courses.findMany({
            where: eq(courses.scheduleId, id),
          });

          const incomingIds = courseDatas.map((c: any) => c.id).filter((id: number | undefined) => id !== undefined);

          // Find courses to delete (exist in DB but not in payload)
          const toDelete = existingCourses.filter((c: any) => !incomingIds.includes(c.id));
          for (const course of toDelete) {
            await tx.delete(courses).where(eq(courses.id, course.id));
          }

          // Handle upserts
          for (const courseData of courseDatas) {
            if (courseData.id) {
              // Update existing
              await tx.update(courses).set(courseData).where(eq(courses.id, courseData.id));
            } else {
              // Create new
              await tx.insert(courses).values({ ...courseData, scheduleId: id } as any);
            }
          }
        }

        return updated;
      });
    } catch (error: any) {
      if (error instanceof HTTPException) throw error;
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, { message: "Schedule or course conflict" });
      }
      throw new HTTPException(500, { message: "Failed to update schedule" });
    }
  }

  async deleteSchedule(id: number): Promise<void> {
    try {
      const deleted = await this.scheduleRepo.delete(id);
      if (!deleted) {
        throw new HTTPException(404, { message: "Schedule not found" });
      }
    } catch (error: any) {
      if (error instanceof DatabaseError && error.code === "23503") {
        throw new HTTPException(409, { message: "Cannot delete schedule because it is linked to existing attendance records or other data." });
      }
      throw error;
    }
  }

  async getStudentsByCourseId(courseId: number) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: { schedule: true }
    });
    if (!course || !course.schedule) throw new HTTPException(404, { message: "Course not found" });

    const schedule = course.schedule;
    
    const matchingStudents = await db.query.students.findMany({
        where: and(
            eq(students.facultyId, schedule.facultyId),
            eq(students.departmentId, schedule.departmentId),
            eq(students.academicLevelId, schedule.academicLevelId),
            eq(students.generation, schedule.generation),
            eq(students.year, schedule.year),
            eq(students.semester, schedule.semester),
            eq(students.isActive, true)
        )
    });
    return matchingStudents;
  }
}
