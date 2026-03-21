import { Hono } from "hono";
import { logger } from "hono/logger";
import { diMiddleware } from "./middlewares/di";
import buildingRoutes from "./routes/building.routes";
import classroomRoutes from "./routes/classroom.routes";
import academicLevelRoutes from "./routes/academic-level.routes";
import attendanceRoutes from "./routes/attendance.routes";
import departmentRoutes from "./routes/department.routes";
import facultyRoutes from "./routes/faculty.routes";
import scheduleRoutes from "./routes/schedule.routes";
import sessionTimeRoutes from "./routes/session-time.routes";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
import translationRoutes from "./routes/translation.routes";
import notificationRoutes from "./routes/notification.routes";
import authRoutes from "./routes/auth.routes";
import { auth } from "./lib/auth";
import { errorHandler } from "./middlewares/error";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

app.use("*", cors());
app.use("*", logger());
app.use("*", diMiddleware);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  }),
);

app.notFound((c) => c.json({ message: "Route not found" }, 404));

app.route("/buildings", buildingRoutes);
app.route("/classrooms", classroomRoutes);
app.route("/academic-levels", academicLevelRoutes);
app.route("/attendance", attendanceRoutes);
app.route("/departments", departmentRoutes);
app.route("/faculties", facultyRoutes);
app.route("/schedules", scheduleRoutes);
app.route("/session-times", sessionTimeRoutes);
app.route("/students", studentRoutes);
app.route("/teachers", teacherRoutes);
app.route("/translations", translationRoutes);
app.route("/notifications", notificationRoutes);
app.route("/authentications", authRoutes);

app.onError((e, c) => errorHandler(c, e));

export default app;
