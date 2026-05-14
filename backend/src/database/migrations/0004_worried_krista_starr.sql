ALTER TABLE "students" DROP CONSTRAINT "students_phone_unique";--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_email_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_phone_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_email_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dob" timestamp;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "dob";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "image";