import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_leads_intent" AS ENUM('general', 'quote', 'partnership', 'other');
    ALTER TABLE "leads" ADD COLUMN "intent" "public"."enum_leads_intent" DEFAULT 'general' NOT NULL;
    ALTER TABLE "leads" ADD COLUMN "city" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads" DROP COLUMN "city";
    ALTER TABLE "leads" DROP COLUMN "intent";
    DROP TYPE "public"."enum_leads_intent";
  `);
}
