import type { CourseRepository } from "@/repositories/course.repository";
import type { CourseInput, CourseUpdateInput } from "@/validators/academy";
import type { Course } from "@/types/academy";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export class CourseService {
  constructor(private readonly courseRepo: CourseRepository) {}

  async getAllCourses(academicYearId?: number): Promise<Course[]> {
    return this.courseRepo.findAll(academicYearId);
  }

  async getCourseById(id: number): Promise<Course> {
    const course = await this.courseRepo.findOne(id);
    if (!course) {
      throw new HTTPException(404, { message: "Course not found" });
    }
    return course;
  }

  async createCourse(data: CourseInput): Promise<Course> {
    try {
      return await this.courseRepo.create(data);
    } catch (error: any) {
      const dbError = error.code === "23505" ? error : (error.cause?.code === "23505" ? error.cause : error);
      
      if (dbError.code === "23505") {
        if (dbError.constraint === "unique_schedule_day_classroom_time") {
          throw new HTTPException(409, {
            message: "Course already scheduled at this time for this group",
          });
        }
        if (dbError.constraint === "courses_code_key" || dbError.constraint === "courses_code_unique") {
          throw new HTTPException(409, {
            message: `Course with code "${data.code}" already exists`,
          });
        }
        throw new HTTPException(409, { message: "Course data conflict" });
      }
      throw error;
    }
  }

  async updateCourse(id: number, data: CourseUpdateInput): Promise<Course> {
    if (Object.keys(data).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }

    try {
      const updated = await this.courseRepo.update(id, data);
      if (!updated) {
        throw new HTTPException(404, { message: "Course not found" });
      }
      return updated;
    } catch (error: any) {
      const dbError = error.code === "23505" ? error : (error.cause?.code === "23505" ? error.cause : error);

      if (dbError.code === "23505") {
        if (dbError.constraint === "unique_schedule_day_classroom_time") {
          throw new HTTPException(409, {
            message: "Course already scheduled at this time for this group",
          });
        }
        if (dbError.constraint === "courses_code_key" || dbError.constraint === "courses_code_unique") {
          throw new HTTPException(409, {
            message: `Course with code "${data.code}" already exists`,
          });
        }
        throw new HTTPException(409, { message: "Course data conflict" });
      }
      throw error;
    }
  }

  async deleteCourse(id: number): Promise<void> {
    await this.courseRepo.delete(id);
  }
}
