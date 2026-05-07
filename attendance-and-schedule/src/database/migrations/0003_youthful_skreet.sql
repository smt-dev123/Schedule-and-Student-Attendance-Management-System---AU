DROP INDEX "unique_student_academic_year";--> statement-breakpoint
ALTER TABLE "student_academic_years" ADD COLUMN "semester" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_academic_years" ADD COLUMN "year" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_enrollment" ON "student_academic_years" USING btree ("student_id","academic_year_id","semester","year");