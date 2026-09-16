CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`date` text NOT NULL,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_events_household_created` ON `events` (`household_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `households` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`master_hash` text NOT NULL,
	`cook_hash` text NOT NULL,
	`settings` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `households_code_unique` ON `households` (`code`);--> statement-breakpoint
CREATE TABLE `plans` (
	`household_id` text NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`recipe_id` text,
	`dry_side` text,
	`liquid` text,
	`confirmed` integer DEFAULT 0 NOT NULL,
	`started_at` text,
	`served_at` text,
	`served_by` text,
	`corrected` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`household_id`, `date`, `slot`),
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_plans_household_date` ON `plans` (`household_id`,`date`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`role` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_expiry` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `stock` (
	`household_id` text NOT NULL,
	`item` text NOT NULL,
	`available` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`household_id`, `item`),
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
