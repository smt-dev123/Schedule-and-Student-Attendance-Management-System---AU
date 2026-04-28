import { type DrizzleDb, type Transaction } from "@/database";
import { schedules } from "@/database/schemas";
import type { Schedule } from "@/types/academy";
import type {
  ScheduleInput,
  ScheduleUniqueKeyInput,
  ScheduleUpdateInput,
} from "@/validators/academy";
import { and, eq } from "drizzle-orm";

export class ScheduleRepository {
  constructor(private readonly db: DrizzleDb) {}

  async create(
    data: ScheduleInput,
    tx: Transaction,
  ): Promise<Schedule | undefined> {
    const [schedule] = await tx.insert(schedules).values(data).returning();
    return schedule;
  }

  async findAll(): Promise<Schedule[]> {
    return this.db.query.schedules.findMany({
      with: {
        faculty: { columns: { id: true, name: true } },
        department: { columns: { id: true, name: true } },
        academicLevel: { columns: { id: true, level: true } },
        academicYear: { columns: { id: true, name: true } },
        classroom: { columns: { id: true, name: true } },
        sessionTime: {
          columns: {
            id: true,
            firstSessionStartTime: true,
            firstSessionEndTime: true,
            secondSessionStartTime: true,
            secondSessionEndTime: true,
          },
        },
        courses: {
          with: {
            teacher: { columns: { id: true, name: true, phone: true } },
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Schedule | null> {
    const schedule = await this.db.query.schedules.findFirst({
      where: eq(schedules.id, id),
      with: {
        faculty: { columns: { id: true, name: true } },
        department: { columns: { id: true, name: true } },
        academicLevel: { columns: { id: true, level: true } },
        academicYear: { columns: { id: true, name: true } },
        classroom: { columns: { id: true, name: true } },
        sessionTime: {
          columns: {
            id: true,
            firstSessionStartTime: true,
            firstSessionEndTime: true,
            secondSessionStartTime: true,
            secondSessionEndTime: true,
          },
        },
        courses: {
          with: {
            teacher: { columns: { id: true, name: true, phone: true } },
          },
        },
      },
    });
    return schedule ?? null;
  }

  async findByUniqueKey(
    data: ScheduleUniqueKeyInput,
    tx: Transaction,
  ): Promise<Schedule | null> {
    const schedule = await tx.query.schedules.findFirst({
      where: and(
        eq(schedules.facultyId, data.facultyId),
        eq(schedules.academicLevelId, data.academicLevelId),
        eq(schedules.generation, data.generation),
        eq(schedules.departmentId, data.departmentId),
        eq(schedules.semester, data.semester),
        eq(schedules.studyShift, data.studyShift),
        eq(schedules.year, data.year),
      ),
      with: {
        faculty: { columns: { id: true, name: true } },
        department: { columns: { id: true, name: true } },
        academicLevel: { columns: { id: true, level: true } },
        academicYear: { columns: { id: true, name: true } },
        classroom: { columns: { id: true, name: true } },
        sessionTime: {
          columns: {
            id: true,
            firstSessionStartTime: true,
            firstSessionEndTime: true,
            secondSessionStartTime: true,
            secondSessionEndTime: true,
          },
        },
        courses: {
          with: {
            teacher: { columns: { id: true, name: true, phone: true } },
          },
        },
      },
    });
    return schedule ?? null;
  }

  async update(
    id: number,
    data: ScheduleUpdateInput,
  ): Promise<Schedule | undefined> {
    const [schedule] = await this.db
      .update(schedules)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schedules.id, id))
      .returning();
    return schedule;
  }

  async delete(id: number): Promise<Schedule | undefined> {
    const [schedule] = await this.db
      .delete(schedules)
      .where(eq(schedules.id, id))
      .returning();
    return schedule;
  }
}
