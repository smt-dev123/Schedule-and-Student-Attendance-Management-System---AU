import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  dashboard: ["read"],
  building: ["create", "read", "update", "delete"],
  classroom: ["create", "read", "update", "delete"],
  faculty: ["create", "read", "update", "delete"],
  department: ["create", "read", "update", "delete"],
  academicLevel: ["create", "read", "update", "delete"],
  skill: ["create", "read", "update", "delete"],
  academicYear: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  sessionTime: ["create", "read", "update", "delete"],
  schedule: ["create", "read", "update", "delete", "read-own"],
  student: [
    "create",
    "read",
    "update",
    "delete",
    "read-own",
    "update-own",
    "promote",
  ],
  teacher: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],
  notification: ["create", "read", "update", "delete", "read-own"],
  system: ["manage"],
} as const;

type PermissionStatement = typeof statement;

const ac = createAccessControl(statement);

const staff = ac.newRole({
  dashboard: ["read"],
  classroom: ["create", "read", "update", "delete"],
  faculty: ["create", "read", "update", "delete"],
  department: ["create", "read", "update", "delete"],
  academicLevel: ["create", "read", "update", "delete"],
  academicYear: ["create", "read", "update", "delete"],
  skill: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  sessionTime: ["create", "read", "update", "delete"],
  schedule: ["create", "read", "update", "delete"],
  student: ["create", "read", "update", "delete", "promote"],
  teacher: ["create", "read", "update", "delete"],
  attendance: ["read", "update", "delete"],
  notification: ["create", "read", "update", "delete"],
});

const manager = ac.newRole({
  dashboard: ["read"],
  building: ["create", "read", "update", "delete"],
  classroom: ["create", "read", "update", "delete"],
  faculty: ["create", "read", "update", "delete"],
  skill: ["create", "read", "update", "delete"],
  department: ["create", "read", "update", "delete"],
  academicLevel: ["create", "read", "update", "delete"],
  academicYear: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  sessionTime: ["create", "read", "update", "delete"],
  schedule: ["create", "read", "update", "delete"],
  student: ["create", "read", "update", "delete"],
  teacher: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],
  system: ["manage"],
});

const teacher = ac.newRole({
  dashboard: ["read"],
  academicYear: ["read"],
  faculty: ["read"],
  department: ["read"],
  academicLevel: ["read"],
  skill: ["read"],
  schedule: ["read"],
  attendance: ["read"],
  course: ["read"],
  sessionTime: ["read"],
  student: ["read"],
  notification: ["read", "create"],
});

const student = ac.newRole({
  dashboard: ["read"],
  academicYear: ["read"],
  classroom: ["read"],
  building: ["read"],
  teacher: ["read"],
  course: ["read"],
  faculty: ["read"],
  department: ["read"],
  sessionTime: ["read"],
  academicLevel: ["read"],
  skill: ["read"],
  student: ["read-own", "update-own"],
  schedule: ["read-own", "read"],
  attendance: ["read"],
  notification: ["read-own", "create"],
});

export { staff, teacher, student, ac, manager, type PermissionStatement };
