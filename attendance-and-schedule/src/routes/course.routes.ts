import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  courseSchema,
  courseUpdateSchema,
  courseQuerySchema,
} from "@/validators/academy";

const router = new Hono();

router.get("/", zValidator("query", courseQuerySchema), async (c) => {
  const { courseService } = c.var.container;
  const query = c.req.valid("query");
  const result = await courseService.findAll(query);
  return c.json(result);
});

router.get("/:id", async (c) => {
  const { courseService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const course = await courseService.findById(id);
  return c.json({ data: course });
});

router.get("/:id/students", async (c) => {
  const { courseService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const students = await courseService.getCourseStudents(id);
  return c.json({ data: students });
});

router.post("/", zValidator("json", courseSchema), async (c) => {
  const { courseService } = c.var.container;
  const data = c.req.valid("json");
  const course = await courseService.create(data);
  return c.json({ data: course });
});

router.put("/:id", zValidator("json", courseUpdateSchema), async (c) => {
  const { courseService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const course = await courseService.update(id, data);
  return c.json({ data: course });
});

router.delete("/:id", async (c) => {
  const { courseService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  await courseService.delete(id);
  return c.json({ message: "Course deleted successfully" });
});

export default router;
