import { createAccessControl } from "better-auth/plugins/access";

const statement = {
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
} as const;

type PermissionStatement = typeof statement;

const ac = createAccessControl(statement);

const staff = ac.newRole({
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
  classroom: ["create", "read", "update", "delete"],
  faculty: ["create", "read", "update", "delete"],
  department: ["create", "read", "update", "delete"],
  academicLevel: ["create", "read", "update", "delete"],
  academicYear: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  sessionTime: ["create", "read", "update", "delete"],
  schedule: ["create", "read", "update", "delete"],
  student: ["create", "read", "update", "delete"],
  teacher: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],
});

const teacher = ac.newRole({
  attendance: ["create", "read"],
  schedule: ["read"],
});

const student = ac.newRole({
  attendance: ["read"],
  schedule: ["read-own"],
  student: ["read-own", "update-own"],
  notification: ["read-own"],
});

export { staff, teacher, student, ac, manager, type PermissionStatement };
