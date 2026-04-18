import { type DrizzleDb, type Transaction } from "@/database";
import { courses } from "@/database/schemas";
import type { Course } from "@/types/academy";
import type { CourseInput, CourseUpdateInput } from "@/validators/academy";
import { eq, inArray } from "drizzle-orm";
import { schedules } from "@/database/schemas";

export class CourseRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne(id: number): Promise<Course | undefined> {
    return await this.db.query.courses.findFirst({
      where: eq(courses.id, id),
      with: {
        teacher: true,
        sessionTime: true,
        schedule: {
          with: {
            faculty: true,
            department: true,
            academicLevel: true,
            classroom: {
              with: {
                building: true
              }
            }
          }
        }
      }
    }) as any;
  }

  async findAll(academicYearId?: number): Promise<Course[]> {
    if (academicYearId) {
      return await this.db.query.courses.findMany({
        where: inArray(
          courses.scheduleId,
          this.db
            .select({ id: schedules.id })
            .from(schedules)
            .where(eq(schedules.academicYearId, academicYearId))
        ),
        with: {
          teacher: true,
          sessionTime: true,
          schedule: {
            with: {
              classroom: true
            }
          }
        }
      });
    }

    return await this.db.query.courses.findMany({
      with: {
        teacher: true,
        sessionTime: true,
        schedule: {
          with: {
            classroom: true
          }
        }
      }
    });
  }

  async create(courseData: CourseInput): Promise<Course> {
    const [newCourse] = await this.db
      .insert(courses)
      .values(courseData)
      .returning();
    return newCourse!;
  }

  async createMany(
    courseDatas: CourseInput[],
    tx?: Transaction,
  ): Promise<Course[]> {
    const client = tx || this.db;
    const newCourses = await client
      .insert(courses)
      .values(courseDatas)
      .returning();
    return newCourses;
  }

  async update(
    id: number,
    courseData: CourseUpdateInput,
  ): Promise<Course | undefined> {
    const [updatedCourse] = await this.db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async delete(id: number): Promise<Course> {
    const [deletedCourse] = await this.db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning();
    return deletedCourse!;
  }
}
