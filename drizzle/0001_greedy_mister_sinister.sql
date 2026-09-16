CREATE TABLE `service_records` (
	`household_id` text NOT NULL,
	`date` text NOT NULL,
	`service_id` text NOT NULL,
	`kind` text NOT NULL,
	`served_at` text NOT NULL,
	`served_by` text NOT NULL,
	`corrected` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`household_id`, `date`, `service_id`),
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_service_records_household_date` ON `service_records` (`household_id`,`date`);