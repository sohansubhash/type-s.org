CREATE TABLE `hhkb_models` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`layout` text NOT NULL,
	`release_date` integer,
	`manufacturer_id` integer NOT NULL,
	`model_number` text NOT NULL,
	`model_name` text NOT NULL,
	`case_color` text NOT NULL,
	`keycap_color` text NOT NULL,
	`legends` text NOT NULL,
	`generation` text NOT NULL,
	`type_s` integer NOT NULL,
	`notes` text,
	`pcb_id` integer NOT NULL,
	`controller_id` integer NOT NULL,
	`dome_id` integer,
	`slider_id` integer,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pcb_id`) REFERENCES `pcbs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`controller_id`) REFERENCES `controllers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`dome_id`) REFERENCES `domes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slider_id`) REFERENCES `sliders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hhkb_models_model_number_unique` ON `hhkb_models` (`model_number`);--> statement-breakpoint
CREATE TABLE `manufacturers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`country` text,
	`established` text
);
--> statement-breakpoint
CREATE TABLE `pcbs` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	`supports_bluetooth` integer NOT NULL,
	`layout` text NOT NULL,
	`connector_type` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `controllers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	`supports_bluetooth` integer NOT NULL,
	`firmware` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plates` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	`material` text NOT NULL,
	`integrated` integer NOT NULL,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `domes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	`weight` text NOT NULL,
	`type` text NOT NULL,
	`material` text NOT NULL,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sliders` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	`type` text NOT NULL,
	`silenced` integer NOT NULL,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `springs` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rings` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `housings` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sb_stabs` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wires` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` integer NOT NULL,
	`url` text,
	`release_date` integer,
	`notes` text,
	`color` text NOT NULL,
	`material` text NOT NULL,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
