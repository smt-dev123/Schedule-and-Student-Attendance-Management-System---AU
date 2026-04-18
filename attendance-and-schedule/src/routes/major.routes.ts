import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { majorSchema, majorUpdateSchema } from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { majorService } = c.var.container;
  const majors = await majorService.findAll();
  return c.json({ data: majors });
});

router.get("/:id", async (c) => {
  const { majorService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const major = await majorService.findById(id);
  return c.json({ data: major });
});

router.post("/", zValidator("json", majorSchema), async (c) => {
  const { majorService } = c.var.container;
  const data = c.req.valid("json");
  const major = await majorService.create(data);
  return c.json({ data: major });
});

router.put("/:id", zValidator("json", majorUpdateSchema), async (c) => {
  const { majorService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const major = await majorService.update(id, data);
  return c.json({ data: major });
});

router.delete("/:id", async (c) => {
  const { majorService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  await majorService.delete(id);
  return c.json({ message: "Major deleted successfully" });
});

export default router;
