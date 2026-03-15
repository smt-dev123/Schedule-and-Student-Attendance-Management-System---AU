// Seeder for all tables
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  user, session, account, verification, twoFactor, rateLimit,
} from './database/schemas/authentication';
import {
  faculties, departments, sessionTimes, academicLevels, schedules, teachers, students, courses,
} from './database/schemas/academic';
import { translations } from './database/schemas/translation';
import { notifications } from './database/schemas/notification';
import { attendanceRecords } from './database/schemas/attendance';
import { buildings, classrooms } from './database/schemas/infrastructure';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

async function seed() {
  // User
  await db.insert(user).values({
    id: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    emailVerified: true,
    role: 'admin',
  });

  // Faculties
  await db.insert(faculties).values({ name: 'Engineering' });

  // Departments
  await db.insert(departments).values({ name: 'Computer Science', facultyId: 1 });

  // Academic Levels
  await db.insert(academicLevels).values({ level: 'Bachelor' });

  // Session Times
  await db.insert(sessionTimes).values({
    shift: 'morning',
    firstSessionStartTime: '08:00',
    firstSessionEndTime: '09:30',
    secondSessionStartTime: '09:45',
    secondSessionEndTime: '11:15',
    isActive: true,
  });

  // Schedules
  await db.insert(schedules).values({
    facultyId: 1,
    year: 2026,
    academicLevelId: 1,
    generation: 1,
    departmentId: 1,
    semester: 1,
    semesterStart: new Date('2026-01-01'),
    semesterEnd: new Date('2026-06-01'),
    studyShift: 'morning',
  });

  // Buildings
  await db.insert(buildings).values({ name: 'Main Building', isActive: true });

  // Classrooms
  await db.insert(classrooms).values({ number: 101, name: 'Room 101', buildingId: 1, isAvailable: true });

  // Teachers
  await db.insert(teachers).values({ name: 'John Doe', email: 'john@example.com', facultyId: 1 });

  // Students
  await db.insert(students).values({ name: 'Jane Smith', email: 'jane@example.com', facultyId: 1, departmentId: 1, academicLevelId: 1 });

  // Courses
  await db.insert(courses).values({ name: 'Math 101', code: 'M101', day: 'monday', teacherId: 1, scheduleId: 1, buildingId: 1, classroomNumber: 101, sessionTimeId: 1 });

  // Attendance Records
  await db.insert(attendanceRecords).values({ courseId: 1, studentId: 1, date: new Date('2026-03-05'), status: 'present', session: 1 });

  // Notifications
  await db.insert(notifications).values({ title: 'Welcome', message: 'Welcome to the system!', facultyId: 1 });

  // Translations
  await db.insert(translations).values({ namespace: 'common', language: 'en', key: 'welcome', value: 'Welcome' });

  // Authentication tables (session, account, verification, twoFactor, rateLimit)
  await db.insert(session).values({ id: 'sess1', expiresAt: new Date('2026-12-31'), token: 'token1', userId: 'admin' });
  await db.insert(account).values({ id: 'acc1', accountId: 'accid1', providerId: 'local', userId: 'admin' });
  await db.insert(verification).values({ id: 'ver1', identifier: 'email', value: 'code', expiresAt: new Date('2026-12-31') });
  await db.insert(twoFactor).values({ id: 'tf1', secret: 'secret', backupCodes: 'codes', userId: 'admin' });
  await db.insert(rateLimit).values({ id: 'rl1', key: 'admin', count: 1, lastRequest: Date.now() });
}

seed()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
