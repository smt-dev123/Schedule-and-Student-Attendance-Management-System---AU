ALTER TABLE "user" ADD COLUMN "name_en" text;--> statement-breakpoint
UPDATE "user" u SET "name_en" = s."name_en" FROM "students" s WHERE u."id" = s."user_id";--> statement-breakpoint
UPDATE "user" u SET "name_en" = COALESCE(u."name_en", t."name_en") FROM "teachers" t WHERE u."id" = t."user_id";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "name_en";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "name_en";