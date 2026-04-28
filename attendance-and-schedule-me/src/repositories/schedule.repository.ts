import { type DrizzleDb, type Transaction } from "@/database";
import { academicYears, schedules, courses } from "@/database/schemas";
import type { Schedule, ScheduleByAcademicIsCurrent } from "@/types/academy";
import type {
  ScheduleInput,
  ScheduleUniqueKeyInput,
  ScheduleUpdateInput,
} from "@/validators/academy";
import { and, eq } from "drizzle-orm";

export class ScheduleRepository {
  constructor(private readonly db: DrizzleDb) {}

  async create(data: ScheduleInput, tx: Transaction): Promise<Schedule> {
    const client = tx || this.db;
    const [newSchedule] = await client
      .insert(schedules)
      .values(data)
      .returning();

    return newSchedule!;
  }

  async findAll(academicYearId?: number): Promise<Schedule[]> {
    return await this.db.query.schedules.findMany({
      where: academicYearId ? eq(schedules.academicYearId, academicYearId) : undefined,
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
    });
  }

  async findById(id: number): Promise<Schedule | null> {
    return await this.db.query.schedules
      .findFirst({
        where: eq(schedules.id, id),
        with: {
            faculty: true,
            department: true,
            academicLevel: true,
            classroom: {
                with: {
                    building: true
                }
            },
            courses: {
                with: {
                    teacher: true,
                    sessionTime: true
                }
            }
        }
      })
      .then((result) => (result as any) || null);
  }

  async findByUniqueKey(
    data: ScheduleUniqueKeyInput,
    tx: Transaction,
  ): Promise<Schedule | null> {
    const client = tx || this.db;
    return await client.query.schedules
      .findFirst({
        where: and(
          eq(schedules.facultyId, data.facultyId),
          eq(schedules.academicLevelId, data.academicLevelId),
          eq(schedules.generation, data.generation),
          eq(schedules.departmentId, data.departmentId),
          eq(schedules.semester, data.semester),
          eq(schedules.studyShift, data.studyShift),
        ),
      })
      .then((result) => result || null);
  }

  async update(id: number, data: ScheduleUpdateInput): Promise<Schedule> {
    const [updatedSchedule] = await this.db
      .update(schedules)
      .set(data)
      .where(eq(schedules.id, id))
      .returning();

    return updatedSchedule!;
  }

  async delete(id: number): Promise<Schedule> {
    return await this.db.transaction(async (tx) => {
      await tx.delete(courses).where(eq(courses.scheduleId, id));

      const [deletedSchedule] = await tx
        .delete(schedules)
        .where(eq(schedules.id, id))
        .returning();

      return deletedSchedule!;
    });
  }

  async getScheduleByAcademicIsCurrent(
    facultyId: number,
    departmentId: number,
  ): Promise<ScheduleByAcademicIsCurrent | null> {
    const schedule = await this.db.query.schedules.findFirst({
      where: and(
        eq(schedules.facultyId, facultyId),
        eq(schedules.departmentId, departmentId),
      ),
      columns: {
        generation: true,
        semester: true,
        semesterStart: true,
        semesterEnd: true,
        studyShift: true,
      },
      with: {
        faculty: {
          columns: {
            name: true,
          },
        },
        department: {
          columns: {
            name: true,
          },
        },
        academicLevel: {
          columns: {
            level: true,
          },
        },
        classroom: {
          columns: {
            name: true,
          },
          with: {
            building: {
              columns: {
                name: true,
              },
            },
          },
        },
        courses: {
          columns: {
            name: true,
            code: true,
            credits: true,
            day: true,
            firstSessionNote: true,
            secondSessionNote: true,
          },
          with: {
            sessionTime: {
              columns: {
                shift: true,
                firstSessionStartTime: true,
                firstSessionEndTime: true,
                secondSessionStartTime: true,
                secondSessionEndTime: true,
              },
            },
            teacher: {
              columns: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return schedule || null;
  }
}
