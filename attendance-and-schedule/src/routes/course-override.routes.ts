import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { courseOverrideSchema, courseOverrideUpdateSchema } from "@/validators/academy";
import { z } from "zod";

const router = new Hono();

router.get("/", async (c) => {
  const { courseOverrideService } = c.var.container;
  const date = c.req.query("date");
  if (date) {
    const overrides = await courseOverrideService.findByDate(date);
    return c.json(overrides);
  }
  const overrides = await courseOverrideService.findAll();
  return c.json(overrides);
});

router.get("/daily", async (c) => {
  const { scheduleService } = c.var.container;
  const date = c.req.query("date");
  const facultyId = c.req.query("facultyId");
  
  if (!date) {
    return c.json({ message: "Date is required" }, 400);
  }

  const schedule = await scheduleService.getDailySchedule(
    date, 
    facultyId ? parseInt(facultyId) : undefined
  );
  return c.json(schedule);
});

router.get("/:id", async (c) => {
  const { courseOverrideService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const override = await courseOverrideService.findById(id);
  return c.json(override);
});

router.post("/", zValidator("json", courseOverrideSchema), async (c) => {
  const { courseOverrideService } = c.var.container;
  const data = c.req.valid("json");
  const override = await courseOverrideService.create(data);
  return c.json(override);
});

router.put("/:id", zValidator("json", courseOverrideUpdateSchema), async (c) => {
  const { courseOverrideService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const override = await courseOverrideService.update(id, data);
  return c.json(override);
});

router.delete("/:id", async (c) => {
  const { courseOverrideService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const deleted = await courseOverrideService.delete(id);
  return c.json(deleted);
});

export default router;
