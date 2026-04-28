CREATE TABLE "schedule_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_course_id" integer NOT NULL,
	"date" date NOT NULL,
	"replacement_teacher_id" integer,
	"replacement_classroom_id" integer,
	"is_cancelled" boolean DEFAULT false,
	"note" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "schedule_overrides" ADD CONSTRAINT "schedule_overrides_original_course_id_courses_id_fk" FOREIGN KEY ("original_course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_overrides" ADD CONSTRAINT "schedule_overrides_replacement_teacher_id_teachers_id_fk" FOREIGN KEY ("replacement_teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_overrides" ADD CONSTRAINT "schedule_overrides_replacement_classroom_id_classrooms_classroom_id_fk" FOREIGN KEY ("replacement_classroom_id") REFERENCES "public"."classrooms"("classroom_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_schedule_override" ON "schedule_overrides" USING btree ("original_course_id","date");