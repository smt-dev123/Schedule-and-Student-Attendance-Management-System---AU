ALTER TABLE "students" ADD COLUMN "student_code" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "name_en" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "dob" timestamp;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "address" varchar;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_student_code_unique" UNIQUE("student_code");