CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(160),
	"topic" varchar(100),
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
