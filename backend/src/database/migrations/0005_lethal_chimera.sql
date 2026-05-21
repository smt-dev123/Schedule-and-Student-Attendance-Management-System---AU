ALTER TABLE "students" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "dob" timestamp;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "dob" timestamp;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "image" text;--> statement-breakpoint
UPDATE "students" s SET "phone" = u."phone", "address" = u."address", "gender" = u."gender", "dob" = u."dob", "image" = u."image" FROM "user" u WHERE s."user_id" = u."id";--> statement-breakpoint
UPDATE "teachers" t SET "phone" = u."phone", "address" = u."address", "gender" = u."gender", "dob" = u."dob", "image" = u."image" FROM "user" u WHERE t."user_id" = u."id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "dob";