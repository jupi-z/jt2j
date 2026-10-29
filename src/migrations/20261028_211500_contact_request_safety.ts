import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_leads_notification_status" AS ENUM('pending', 'sent', 'retry_pending');
    CREATE TABLE "lead_rate_limits" (
      "key" varchar PRIMARY KEY NOT NULL,
      "window_started_at" timestamp(3) with time zone NOT NULL,
      "request_count" integer DEFAULT 0 NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE "leads" ADD COLUMN "idempotency_key" varchar;
    UPDATE "leads"
      SET "idempotency_key" = md5(coalesce("email", '') || '|' || coalesce("message", '') || '|' || "id"::text)
      WHERE "idempotency_key" IS NULL;
    ALTER TABLE "leads" ADD COLUMN "notification_status" "public"."enum_leads_notification_status" DEFAULT 'pending' NOT NULL;
    ALTER TABLE "leads" ADD COLUMN "notification_attempts" numeric DEFAULT 0 NOT NULL;
    ALTER TABLE "leads" ADD COLUMN "notification_next_attempt_at" timestamp(3) with time zone;
    ALTER TABLE "leads" ADD COLUMN "notification_last_error" varchar;
    ALTER TABLE "leads" ADD COLUMN "notification_alert_required" boolean DEFAULT false NOT NULL;
    CREATE UNIQUE INDEX "leads_idempotency_key_idx" ON "leads" USING btree ("idempotency_key");
    CREATE INDEX "lead_rate_limits_updated_at_idx" ON "lead_rate_limits" USING btree ("updated_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "leads_idempotency_key_idx";
    ALTER TABLE "leads" DROP COLUMN "idempotency_key";
    ALTER TABLE "leads" DROP COLUMN "notification_status";
    ALTER TABLE "leads" DROP COLUMN "notification_attempts";
    ALTER TABLE "leads" DROP COLUMN "notification_next_attempt_at";
    ALTER TABLE "leads" DROP COLUMN "notification_last_error";
    ALTER TABLE "leads" DROP COLUMN "notification_alert_required";
    DROP INDEX "lead_rate_limits_updated_at_idx";
    DROP TABLE "lead_rate_limits";
    DROP TYPE "public"."enum_leads_notification_status";
  `);
}
