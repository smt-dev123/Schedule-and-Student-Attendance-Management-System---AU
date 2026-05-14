ALTER TABLE "students" ALTER COLUMN "educational_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."educational_status";--> statement-breakpoint
CREATE TYPE "public"."educational_status" AS ENUM('enrolled', 'suspended', 'graduated', 'dropped_out', 'transfered');--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "educational_status" SET DATA TYPE "public"."educational_status" USING "educational_status"::"public"."educational_status";