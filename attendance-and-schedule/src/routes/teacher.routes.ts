import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  teacherIdParamSchema,
  teacherQuerySchema,
  teacherCreateSchema,
  teacherUpdateSchema,
} from "@/validators/academy";
import type { Variables } from "@/types/middleware";
import authentication from "@/middlewares/auth";
import requirePermission from "@/middlewares/permission";
import { auth } from "@/lib/auth";
import { upload } from "@/middlewares/upload";
import { deleteFile } from "@/utils/upload";

const router = new Hono<{ Variables: Variables }>();

router.use(authentication);

router.get("/", zValidator("query", teacherQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { teacherService } = c.var.container;
  const teachers = await teacherService.findAll(query);
  return c.json(teachers);
});

router.get("/profile/me", async (c) => {
  const { teacherService } = c.var.container;
  const user = c.get("user");
  return c.json(user);
});

router.post(
  "/",
  // requirePermission("teacher", "create"),
  upload("image"),
  zValidator("form", teacherCreateSchema),
  async (c) => {
    const { teacherService } = c.var.container;
    const data = c.req.valid("form");
    const image = c.get("upload");
    try {
      const { user } = await auth.api.createUser({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: "teacher",
        },
      });
      const teacher = await teacherService.create({
        name: user.name,
        email: user.email,
        phone: data.phone,
        gender: data.gender,
        academicLevelId: data.academicLevelId,
        facultyId: data.facultyId,
        isActive: data.isActive,
        userId: user.id,
        image: image?.url,
      });
      return c.json(teacher);
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
  requirePermission("teacher", "update"),
  upload("image"),
  zValidator("param", teacherIdParamSchema),
  zValidator("form", teacherUpdateSchema),
  async (c) => {
    const id = c.req.valid("param").id;
    const data = c.req.valid("form");
    const image = c.get("upload");
    const { teacherService } = c.var.container;
    try {
      const teacher = await teacherService.update(
        id,
        data,
        image?.url,
        image?.filename,
      );
      return c.json(teacher);
    } catch (error) {
      if (image?.filename) {
        await deleteFile(image.filename).catch(() => {});
      }
      throw error;
    }
  },
);

router.delete(
  "/:id",
  requirePermission("teacher", "delete"),
  zValidator("param", teacherIdParamSchema),
  async (c) => {
    const id = c.req.valid("param").id;
    const { teacherService } = c.var.container;
    const teacher = await teacherService.delete(id);
    return c.json(teacher);
  },
);

export default router;
