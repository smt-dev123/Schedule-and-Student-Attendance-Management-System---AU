CREATE TYPE "public"."academic_level" AS ENUM('Associate', 'Bachelor', 'Master', 'PhD');--> statement-breakpoint
CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused');--> statement-breakpoint
CREATE TYPE "public"."day" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');--> statement-breakpoint
CREATE TYPE "public"."educational_status" AS ENUM('enrolled', 'graduated', 'dropped out', 'transferred');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."notification_priority" AS ENUM('low', 'normal', 'high');--> statement-breakpoint
CREATE TYPE "public"."study_shift" AS ENUM('morning', 'evening', 'night');--> statement-breakpoint
CREATE TABLE "academic_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" "academic_level" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "academic_levels_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"startDate" timestamp,
	"endDate" timestamp,
	"is_current" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar,
	"credits" integer,
	"description" varchar,
	"day" "day" NOT NULL,
	"teacher_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	"hours" numeric(4, 1) NOT NULL,
	"session" integer NOT NULL,
	"total_hours_left" numeric(4, 1) NOT NULL,
	"total_session_left" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"faculty_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "faculties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "faculties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"faculty_id" integer NOT NULL,
	"year" integer NOT NULL,
	"academic_level_id" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"generation" integer NOT NULL,
	"department_id" integer NOT NULL,
	"semester" integer NOT NULL,
	"semester_start" timestamp NOT NULL,
	"semester_end" timestamp NOT NULL,
	"study_shift" "study_shift" DEFAULT 'morning' NOT NULL,
	"classroom_id" integer NOT NULL,
	"session_time_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_times" (
	"id" serial PRIMARY KEY NOT NULL,
	"shift" "study_shift" NOT NULL,
	"first_session_start_time" varchar NOT NULL,
	"first_session_end_time" varchar NOT NULL,
	"second_session_start_time" varchar NOT NULL,
	"second_session_end_time" varchar NOT NULL,
	"description" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "session_times_shift_unique" UNIQUE("shift"),
	CONSTRAINT "unique_session_time" UNIQUE("shift","first_session_start_time","first_session_end_time","second_session_start_time","second_session_end_time")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"faculty_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "student_academic_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" varchar NOT NULL,
	"phone" varchar,
	"email" varchar NOT NULL,
	"faculty_id" integer,
	"department_id" integer,
	"academic_level_id" integer,
	"academic_year_id" integer,
	"skill_id" integer NOT NULL,
	"educational_status" "educational_status" NOT NULL,
	"gender" "gender" NOT NULL,
	"generation" integer NOT NULL,
	"semester" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"image" varchar,
	"year" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "students_phone_unique" UNIQUE("phone"),
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"gender" "gender" NOT NULL,
	"academic_level_id" integer NOT NULL,
	"faculty_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"image" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "teachers_phone_unique" UNIQUE("phone"),
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "attendance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"date" date NOT NULL,
	"status" "attendance_status" DEFAULT 'absent' NOT NULL,
	"session" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"notes" varchar(500),
	"recorded_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"faculty_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	"total_attendance" integer DEFAULT 0 NOT NULL,
	"present_attendance" integer DEFAULT 0 NOT NULL,
	"absent_attendance" integer DEFAULT 0 NOT NULL,
	"late_attendance" integer DEFAULT 0 NOT NULL,
	"excused_attendance" integer DEFAULT 0 NOT NULL,
	"present_percentage" real DEFAULT 0 NOT NULL,
	"absent_percentage" real DEFAULT 0 NOT NULL,
	"late_percentage" real DEFAULT 0 NOT NULL,
	"excused_percentage" real DEFAULT 0 NOT NULL,
	"withdraw_from_exam" boolean DEFAULT false NOT NULL,
	"make_up_class" boolean DEFAULT false NOT NULL,
	"total_course_sessions" integer DEFAULT 0 NOT NULL,
	"sessions_remaining" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL,
	CONSTRAINT "rate_limit_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buildings" (
	"building_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "buildings_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"classroom_id" serial PRIMARY KEY NOT NULL,
	"classroom_number" integer NOT NULL,
	"name" varchar NOT NULL,
	"floor" integer NOT NULL,
	"building_id" integer NOT NULL,
	"is_available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "translation" (
	"id" serial PRIMARY KEY NOT NULL,
	"namespace" text NOT NULL,
	"language" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"message" text NOT NULL,
	"faculty_id" integer NOT NULL,
	"target_department" integer,
	"target_generation" integer,
	"priority" varchar(20) DEFAULT 'normal',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_classroom_id_classrooms_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("classroom_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_session_time_id_session_times_id_fk" FOREIGN KEY ("session_time_id") REFERENCES "public"."session_times"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_academic_years" ADD CONSTRAINT "student_academic_years_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_academic_years" ADD CONSTRAINT "student_academic_years_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_recorded_by_teachers_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_building_id_buildings_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("building_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_course_teacher" ON "courses" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "idx_course_schedule" ON "courses" USING btree ("schedule_id");--> statement-breakpoint
CREATE INDEX "idx_course_day_schedule" ON "courses" USING btree ("day","schedule_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_schedule_day_classroom_time" ON "courses" USING btree ("schedule_id","day");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_faculty_department" ON "departments" USING btree ("faculty_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_schedule_identifier" ON "schedules" USING btree ("faculty_id","academic_level_id","generation","semester","year","department_id","study_shift");--> statement-breakpoint
CREATE INDEX "idx_schedule_faculty_generation" ON "schedules" USING btree ("faculty_id","generation");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_academic_year" ON "student_academic_years" USING btree ("student_id","academic_year_id");--> statement-breakpoint
CREATE INDEX "idx_student_schedule_filter" ON "students" USING btree ("faculty_id","academic_level_id","generation","semester");--> statement-breakpoint
CREATE INDEX "idx_teacher_faculty" ON "teachers" USING btree ("faculty_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_attendance_record" ON "attendance_records" USING btree ("course_id","student_id","date","session");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_attendance_summary" ON "attendance_summaries" USING btree ("student_id","course_id","academic_year_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "twoFactor_secret_idx" ON "two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactor_userId_idx" ON "two_factor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_building_classroom_number" ON "classrooms" USING btree ("building_id","classroom_number");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_building_classroom_name" ON "classrooms" USING btree ("building_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_namespace_language_key" ON "translation" USING btree ("namespace","language","key");