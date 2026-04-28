CREATE TABLE "course_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_course_id" integer NOT NULL,
	"replacement_teacher_id" text,
	"replacement_classroom_id" integer,
	"date" date NOT NULL,
	"is_cancelled" boolean DEFAULT false,
	"note" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "majors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"faculty_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "majors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "student_code" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "course_overrides" ADD CONSTRAINT "course_overrides_original_course_id_courses_id_fk" FOREIGN KEY ("original_course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_overrides" ADD CONSTRAINT "course_overrides_replacement_teacher_id_teachers_id_fk" FOREIGN KEY ("replacement_teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_overrides" ADD CONSTRAINT "course_overrides_replacement_classroom_id_classrooms_classroom_id_fk" FOREIGN KEY ("replacement_classroom_id") REFERENCES "public"."classrooms"("classroom_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "majors" ADD CONSTRAINT "majors_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_student_code_unique" UNIQUE("student_code");