import { MajorRepository } from "@/repositories/major.repository";
import type { Major } from "@/types/academy";
import type {
  MajorInput,
  MajorUpdateInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export class MajorService {
  constructor(private readonly majorRepo: MajorRepository) {}

  async create(data: MajorInput): Promise<Major> {
    try {
      return await this.majorRepo.create(data);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, {
          message: `Major "${data.name}" already exists`,
        });
      }
      throw new HTTPException(500, { message: "Failed to create major" });
    }
  }

  async update(id: number, data: MajorUpdateInput): Promise<Major> {
    if (Object.keys(data).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }

    let updated: Major | undefined;
    try {
      updated = await this.majorRepo.update(id, data);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, {
          message: `Major "${data.name}" already exists`,
        });
      }
      throw new HTTPException(500, { message: "Failed to update major" });
    }

    if (!updated) {
      throw new HTTPException(404, { message: "Major not found" });
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    try {
      const deleted = await this.majorRepo.delete(id);
      if (!deleted) {
        throw new HTTPException(404, { message: "Major not found" });
      }
    } catch (error) {
       throw new HTTPException(500, { message: "Failed to delete major" });
    }
  }

  async findById(id: number): Promise<Major> {
    const major = await this.majorRepo.findById(id);
    if (!major) {
      throw new HTTPException(404, { message: "Major not found" });
    }
    return major;
  }

  async findAll(): Promise<Major[]> {
    return this.majorRepo.findAll();
  }
}
