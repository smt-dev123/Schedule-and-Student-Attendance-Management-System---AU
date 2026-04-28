import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  bulkAttendanceSchema,
  attendanceReportQuerySchema,
} from "@/validators/attendance";
import { roleMiddleware } from "@/middlewares/roles";
import authentication from "@/middlewares/auth";
import type { Variables } from "@/types/middleware";

const router = new Hono<{ Variables: Variables }>();

router.post(
  "/bulk",
  authentication,
  roleMiddleware("admin", "staff", "teacher"),
  zValidator("json", bulkAttendanceSchema),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const { attendanceService } = c.get("container");
    const result = await attendanceService.markBulkAttendance(data, user.id);
    return c.json(result);
  },
);

router.get(
  "/student/:id",
  authentication,
  roleMiddleware("admin", "staff", "teacher"),
  async (c) => {
    const id = c.req.param("id");
    const { attendanceService } = c.get("container");
    const records = await attendanceService.getAttendanceByStudentId(
      Number(id),
    );
    return c.json(records);
  },
);

router.get(
  "/report",
  authentication,
  roleMiddleware("admin", "staff", "teacher"),
  zValidator("query", attendanceReportQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { attendanceService } = c.get("container");
    const records = await attendanceService.attendanceReport(query);
    return c.json(records);
  },
);

export default router;
