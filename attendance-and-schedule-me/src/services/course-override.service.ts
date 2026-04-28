import { CourseOverrideRepository } from "@/repositories/course-override.repository";
import type {
  CourseOverrideInput,
  CourseOverrideUpdateInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class CourseOverrideService {
  constructor(private readonly repository: CourseOverrideRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findByDate(date: string) {
    return this.repository.findByDate(date);
  }

  async findById(id: number) {
    const override = await this.repository.findById(id);
    if (!override) {
      throw new HTTPException(404, { message: "Override not found" });
    }
    return override;
  }

  async create(data: CourseOverrideInput) {
    return this.repository.create(data);
  }

  async update(id: number, data: CourseOverrideUpdateInput) {
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new HTTPException(404, { message: "Override not found" });
    }
    return updated;
  }

  async delete(id: number) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Override not found" });
    }
    return deleted;
  }
}
