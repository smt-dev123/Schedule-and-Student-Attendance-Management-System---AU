import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  studentCreateSchema,
  studentPromoteSchema,
  studentQuerySchema,
  studentUpdateSchema,
} from "@/validators/academy";
import authentication from "@/middlewares/auth";
import { auth } from "@/lib/auth";
import requirePermission from "@/middlewares/permission";
import z from "zod";
import type { Variables } from "@/types/middleware";
import { upload } from "@/middlewares/upload";
import { deleteFile } from "@/utils/upload";

const router = new Hono<{ Variables: Variables }>();

router.get(
  "/",
  // authentication,
  // requirePermission("student", "read"),
  zValidator("query", studentQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { studentService } = c.var.container;
    const students = await studentService.findAll(query);
    return c.json(students);
  },
);

router.get(
  "/profile/me",
  authentication,
  requirePermission("student", "read-own"),
  async (c) => {
    const user = c.get("user");
    return c.json(user);
  },
);

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { studentService } = c.var.container;
  const student = await studentService.findByUserId(id);
  return c.json(student);
});

router.post(
  "/",
  upload("image"),
  zValidator("form", studentCreateSchema),
  async (c) => {
    const data = c.req.valid("form");
    const image = c.get("upload");

    try {
      const { user } = await auth.api.createUser({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: "student",
        },
      });
      const { studentService } = c.var.container;
      const student = await studentService.create({
        ...data,
        userId: user.id,
        image: image?.url,
      });
      return c.json(student);
    } catch (error) {
      if (image?.filename) {
        await deleteFile(image.filename).catch(() => {});
      }
      throw error;
    }
  },
);

router.put(
  "/:id",
  upload("image"),
  zValidator("form", studentUpdateSchema),
  async (c) => {
    const id = c.req.param("id") as unknown as number;
    const data = c.req.valid("form");
    const image = c.get("upload");
    const { studentService } = c.var.container;
    try {
      const student = await studentService.update(
        id,
        data,
        image?.url,
        image?.filename,
      );
      return c.json(student);
    } catch (error) {
      if (image?.filename) {
        await deleteFile(image.filename).catch(() => {});
      }
      throw error;
    }
  },
);

router.delete("/:id", async (c) => {
  const id = c.req.param("id") as unknown as number;
  const { studentService } = c.var.container;
  const student = await studentService.delete(id);
  return c.json(student);
});

router.get("/attendance/report", authentication, async (c) => {
  const user = c.get("user");
  const { studentService } = c.var.container;
  const records = await studentService.generateAttendanceReportForStudent(
    user.id,
  );
  return c.json(records);
});

router.get(
  "/schedule/current-academic-year",
  authentication,
  requirePermission("schedule", "read-own"),
  zValidator("query", z.object({ semester: z.coerce.number().optional() })),
  async (c) => {
    const user = c.get("user");
    const { semester = 1 } = c.req.valid("query");
    const { studentService } = c.var.container;
    const schedule =
      await studentService.findScheduleByStudentIdAndCurrentAcademicYear(
        user.id,
        semester,
      );
    return c.json(schedule);
  },
);

router.post(
  "/promote",
  authentication,
  requirePermission("student", "promote"),
  zValidator("json", studentPromoteSchema),
  async (c) => {
    const { studentService } = c.var.container;
    const data = c.req.valid("json");
    const student = await studentService.promote(data);
    return c.json(student);
  },
);

export default router;
