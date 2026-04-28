import { Hono } from "hono";
import authentication from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/roles";
import { zValidator } from "@hono/zod-validator";
import { courseSchema, courseUpdateSchema } from "@/validators/academy";

const router = new Hono();

router.get(
  "/",
  // authentication,
  // roleMiddleware("teacher", "admin"),
  async (c) => {
    const { courseService } = c.var.container;
    const academicYearId = c.req.query("academicYearId");
    const courses = await courseService.getAllCourses(
      academicYearId ? parseInt(academicYearId) : undefined,
    );
    return c.json({ data: courses });
  },
);

router.get(
  "/:id",
  async (c) => {
    const { courseService } = c.var.container;
    const id = parseInt(c.req.param("id"));
    const course = await courseService.getCourseById(id);
    return c.json({ data: course });
  },
);

router.get(
  "/:id/students",
  // authentication,
  // roleMiddleware("teacher", "admin"),
  async (c) => {
    const { scheduleService } = c.var.container;
    const id = parseInt(c.req.param("id"));
    const students = await scheduleService.getStudentsByCourseId(id);
    return c.json(students);
  },
);

router.post(
  "/",
  // authentication,
  // roleMiddleware("admin"),
  zValidator("json", courseSchema),
  async (c) => {
    const { courseService } = c.var.container;
    const body = c.req.valid("json");
    const course = await courseService.createCourse(body);
    return c.json({ data: course }, 201);
  },
);

router.put(
  "/:id",
  // authentication,
  // roleMiddleware("admin"),
  zValidator("json", courseUpdateSchema),
  async (c) => {
    const { courseService } = c.var.container;
    const id = parseInt(c.req.param("id"));
    const body = c.req.valid("json");
    const course = await courseService.updateCourse(id, body);
    return c.json({ data: course });
  },
);

router.delete(
  "/:id",
  // authentication,
  // roleMiddleware("admin"),
  async (c) => {
    const { courseService } = c.var.container;
    const id = parseInt(c.req.param("id"));
    await courseService.deleteCourse(id);
    return c.json({ message: "Course deleted successfully" });
  },
);

export default router;
