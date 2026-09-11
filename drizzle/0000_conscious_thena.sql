CREATE TABLE `devices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer` text NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`device` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`amount` integer NOT NULL,
	`payment` text DEFAULT 'unpaid' NOT NULL,
	`status` text DEFAULT 'charging' NOT NULL,
	`created_at` text NOT NULL,
	`paid_at` text,
	`collected_at` text,
	CONSTRAINT "valid_amount" CHECK("devices"."amount" >= 0 AND "devices"."amount" <= 1000000000),
	CONSTRAINT "valid_payment" CHECK("devices"."payment" IN ('unpaid','cash','transfer')),
	CONSTRAINT "valid_status" CHECK("devices"."status" IN ('charging','ready','collected'))
);
--> statement-breakpoint
CREATE INDEX `idx_devices_created` ON `devices` (`created_at`);