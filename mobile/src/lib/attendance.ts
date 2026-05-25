import type { CoursesType } from "@/types";

export const checkAttendanceAccess = (
  course: CoursesType | undefined,
  selectedDate: string,
  role: string,
) => {
  if (!course || !role) return { canEdit: false, reason: "Loading data..." };

  if (role === "admin" || role === "manager") return { canEdit: true };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Teachers can only mark attendance for the current date
  if (selectedDate !== todayStr) {
    return {
      canEdit: false,
      reason: "You can only mark attendance for the current date.",
    };
  }

  // Check if it's the correct day of the week for the course
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[now.getDay()];

  if (course.day !== currentDay) {
    return {
      canEdit: false,
      reason: `Today is not a scheduled day for ${course.name}.`,
    };
  }

  // Check time window: from firstSessionStartTime to secondSessionEndTime + 15 minutes
  const startTime = course.schedule?.sessionTime?.firstSessionStartTime;
  const endTime = course.schedule?.sessionTime?.secondSessionEndTime;

  if (!startTime || !endTime) {
    return {
      canEdit: false,
      reason: "No official schedule time available for this course.",
    };
  }

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const startDate = new Date(now);
  startDate.setHours(startH, startM, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(endH, endM, 0, 0);
  endDate.setMinutes(endDate.getMinutes() + 15); // 15 minutes buffer

  if (now < startDate) {
    return {
      canEdit: false,
      reason: `You can mark attendance from ${startTime} onwards.`,
    };
  }

  if (now > endDate) {
    return {
      canEdit: false,
      reason: `Attendance marking time has expired (must be marked within 15 minutes after the session ends).`,
    };
  }

  return { canEdit: true };
};
