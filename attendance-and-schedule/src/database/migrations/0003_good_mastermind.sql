ALTER TABLE "teachers" ADD COLUMN "teacher_code" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_teacher_code_unique" UNIQUE("teacher_code");