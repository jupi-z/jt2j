import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'publisher', 'translator', 'sales');
  CREATE TYPE "public"."enum_pages_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_pages_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_pages_key" AS ENUM('HOME', 'COMPANY', 'EXPERTISE', 'SERVICES', 'APPROACH', 'CONTACT', 'FAQ');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__pages_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__pages_v_version_key" AS ENUM('HOME', 'COMPANY', 'EXPERTISE', 'SERVICES', 'APPROACH', 'CONTACT', 'FAQ');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_divisions_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_divisions_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_divisions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__divisions_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__divisions_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__divisions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__divisions_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_services_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_services_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__services_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_faqs_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_faqs_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__faqs_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_media_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_media_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_media_rights_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_media_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__media_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__media_v_version_rights_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__media_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_leads_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'assigned', 'in-progress', 'closed', 'spam');
  CREATE TYPE "public"."enum_legal_documents_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_legal_documents_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_legal_documents_kind" AS ENUM('legal-notice', 'privacy-policy', 'cookie-policy');
  CREATE TYPE "public"."enum_legal_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_documents_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__legal_documents_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__legal_documents_v_version_kind" AS ENUM('legal-notice', 'privacy-policy', 'cookie-policy');
  CREATE TYPE "public"."enum__legal_documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_documents_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_site_settings_supported_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_site_settings_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_site_settings_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_site_settings_default_locale" AS ENUM('fr');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_supported_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum__site_settings_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__site_settings_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__site_settings_v_version_default_locale" AS ENUM('fr');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_navigation_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum_navigation_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_claims_category" AS ENUM('institutional', 'capability', 'contact', 'leadership', 'reference', 'legal');
  CREATE TYPE "public"."enum__navigation_v_version_claims_status" AS ENUM('pending', 'approved');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_published_locale" AS ENUM('fr', 'en');
  CREATE TABLE "users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" "enum_users_role" DEFAULT 'editor' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "reset_password_requested_at" timestamp(3) with time zone,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "pages_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "pages_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "pages_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_pages_claims_category",
    "source" varchar,
    "status" "enum_pages_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "pages_values" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "pages_values_locales" (
    "value" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" "enum_pages_key",
    "slug" varchar,
    "order" numeric DEFAULT 1,
    "hero_media_id" integer,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "pages_locales" (
    "title" varchar,
    "lead" varchar,
    "meta_title" varchar,
    "meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_pages_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_pages_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__pages_v_version_claims_category",
    "source" varchar,
    "status" "enum__pages_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_values" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_values_locales" (
    "value" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_key" "enum__pages_v_version_key",
    "version_slug" varchar,
    "version_order" numeric DEFAULT 1,
    "version_hero_media_id" integer,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__pages_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_pages_v_locales" (
    "version_title" varchar,
    "version_lead" varchar,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "divisions_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "divisions_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "divisions_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_divisions_claims_category",
    "source" varchar,
    "status" "enum_divisions_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "divisions" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "order" numeric DEFAULT 1,
    "hero_media_id" integer,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "code" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_divisions_status" DEFAULT 'draft'
  );

  CREATE TABLE "divisions_locales" (
    "title" varchar,
    "lead" varchar,
    "meta_title" varchar,
    "meta_description" varchar,
    "heading" varchar,
    "summary" varchar,
    "cta" varchar,
    "bottom_title" varchar,
    "bottom_body" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_divisions_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_divisions_v_version_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_divisions_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__divisions_v_version_claims_category",
    "source" varchar,
    "status" "enum__divisions_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_divisions_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_order" numeric DEFAULT 1,
    "version_hero_media_id" integer,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version_code" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__divisions_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__divisions_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_divisions_v_locales" (
    "version_title" varchar,
    "version_lead" varchar,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "version_heading" varchar,
    "version_summary" varchar,
    "version_cta" varchar,
    "version_bottom_title" varchar,
    "version_bottom_body" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "services_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "services_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "services_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_services_claims_category",
    "source" varchar,
    "status" "enum_services_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "services" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "order" numeric DEFAULT 1,
    "hero_media_id" integer,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "division_id" integer,
    "catalogue" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_services_status" DEFAULT 'draft'
  );

  CREATE TABLE "services_locales" (
    "title" varchar,
    "lead" varchar,
    "meta_title" varchar,
    "meta_description" varchar,
    "heading" varchar,
    "summary" varchar,
    "eyebrow" varchar,
    "cta" varchar,
    "editorial_notes" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_services_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_services_v_version_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_services_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__services_v_version_claims_category",
    "source" varchar,
    "status" "enum__services_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_services_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_order" numeric DEFAULT 1,
    "version_hero_media_id" integer,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version_division_id" integer,
    "version_catalogue" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__services_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__services_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_services_v_locales" (
    "version_title" varchar,
    "version_lead" varchar,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "version_heading" varchar,
    "version_summary" varchar,
    "version_eyebrow" varchar,
    "version_cta" varchar,
    "version_editorial_notes" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "faqs_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_faqs_claims_category",
    "source" varchar,
    "status" "enum_faqs_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "faqs" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "order" numeric DEFAULT 1,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_faqs_status" DEFAULT 'draft'
  );

  CREATE TABLE "faqs_locales" (
    "title" varchar,
    "lead" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_faqs_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__faqs_v_version_claims_category",
    "source" varchar,
    "status" "enum__faqs_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_faqs_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_order" numeric DEFAULT 1,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__faqs_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_faqs_v_locales" (
    "version_title" varchar,
    "version_lead" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "media_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_media_claims_category",
    "source" varchar,
    "status" "enum_media_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "media" (
    "id" serial PRIMARY KEY NOT NULL,
    "credit" varchar,
    "source" varchar,
    "rights_status" "enum_media_rights_status" DEFAULT 'pending',
    "rights_evidence" varchar,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "prefix" varchar DEFAULT '',
    "_objectkey" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_media_status" DEFAULT 'draft',
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric
  );

  CREATE TABLE "media_locales" (
    "alt" varchar,
    "caption" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_media_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__media_v_version_claims_category",
    "source" varchar,
    "status" "enum__media_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_media_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_credit" varchar,
    "version_source" varchar,
    "version_rights_status" "enum__media_v_version_rights_status" DEFAULT 'pending',
    "version_rights_evidence" varchar,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version_prefix" varchar DEFAULT '',
    "version__objectkey" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__media_v_version_status" DEFAULT 'draft',
    "version_url" varchar,
    "version_thumbnail_u_r_l" varchar,
    "version_filename" varchar,
    "version_mime_type" varchar,
    "version_filesize" numeric,
    "version_width" numeric,
    "version_height" numeric,
    "version_focal_x" numeric,
    "version_focal_y" numeric,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__media_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_media_v_locales" (
    "version_alt" varchar,
    "version_caption" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "leads" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "phone" varchar,
    "company" varchar,
    "message" varchar NOT NULL,
    "source_page" varchar NOT NULL,
    "locale" "enum_leads_locale" NOT NULL,
    "division_id" integer,
    "service_id" integer,
    "status" "enum_leads_status" DEFAULT 'new' NOT NULL,
    "assignee_id" integer,
    "internal_notes" varchar,
    "consent_accepted" boolean DEFAULT false NOT NULL,
    "consent_policy_version" varchar NOT NULL,
    "consent_recorded_at" timestamp(3) with time zone NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "legal_documents_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "legal_documents_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "legal_documents_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_legal_documents_claims_category",
    "source" varchar,
    "status" "enum_legal_documents_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "legal_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "order" numeric DEFAULT 1,
    "hero_media_id" integer,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "kind" "enum_legal_documents_kind",
    "effective_date" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_legal_documents_status" DEFAULT 'draft'
  );

  CREATE TABLE "legal_documents_locales" (
    "title" varchar,
    "lead" varchar,
    "meta_title" varchar,
    "meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_legal_documents_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_legal_documents_v_version_sections_locales" (
    "title" varchar,
    "body" varchar,
    "link" varchar,
    "eyebrow" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_legal_documents_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__legal_documents_v_version_claims_category",
    "source" varchar,
    "status" "enum__legal_documents_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_legal_documents_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_order" numeric DEFAULT 1,
    "version_hero_media_id" integer,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version_kind" "enum__legal_documents_v_version_kind",
    "version_effective_date" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__legal_documents_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__legal_documents_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_legal_documents_v_locales" (
    "version_title" varchar,
    "version_lead" varchar,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "pages_id" integer,
    "divisions_id" integer,
    "services_id" integer,
    "faqs_id" integer,
    "media_id" integer,
    "leads_id" integer,
    "legal_documents_id" integer
  );

  CREATE TABLE "payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );

  CREATE TABLE "payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "site_settings_supported_locales" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum_site_settings_supported_locales",
    "id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "site_settings_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "url" varchar
  );

  CREATE TABLE "site_settings_social_links_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "site_settings_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_site_settings_claims_category",
    "source" varchar,
    "status" "enum_site_settings_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "default_locale" "enum_site_settings_default_locale" DEFAULT 'fr',
    "email" varchar,
    "phone" varchar,
    "social_handle" varchar,
    "features_leadership" boolean DEFAULT false,
    "features_references" boolean DEFAULT false,
    "features_legal" boolean DEFAULT false,
    "features_privacy" boolean DEFAULT false,
    "features_cookies" boolean DEFAULT false,
    "features_contact_form" boolean DEFAULT false,
    "logo_id" integer,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "_status" "enum_site_settings_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "site_settings_locales" (
    "name" varchar,
    "tagline" varchar,
    "description" varchar,
    "default_s_e_o_title" varchar,
    "default_s_e_o_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_site_settings_v_version_supported_locales" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum__site_settings_v_version_supported_locales",
    "id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "_site_settings_v_version_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "url" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_social_links_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_site_settings_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__site_settings_v_version_claims_category",
    "source" varchar,
    "status" "enum__site_settings_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_default_locale" "enum__site_settings_v_version_default_locale" DEFAULT 'fr',
    "version_email" varchar,
    "version_phone" varchar,
    "version_social_handle" varchar,
    "version_features_leadership" boolean DEFAULT false,
    "version_features_references" boolean DEFAULT false,
    "version_features_legal" boolean DEFAULT false,
    "version_features_privacy" boolean DEFAULT false,
    "version_features_cookies" boolean DEFAULT false,
    "version_features_contact_form" boolean DEFAULT false,
    "version_logo_id" integer,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__site_settings_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_site_settings_v_locales" (
    "version_name" varchar,
    "version_tagline" varchar,
    "version_description" varchar,
    "version_default_s_e_o_title" varchar,
    "version_default_s_e_o_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "navigation_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "path" varchar
  );

  CREATE TABLE "navigation_items_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE "navigation_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "category" "enum_navigation_claims_category",
    "source" varchar,
    "status" "enum_navigation_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar
  );

  CREATE TABLE "navigation" (
    "id" serial PRIMARY KEY NOT NULL,
    "publication_approved" boolean DEFAULT false,
    "translation_issues" jsonb,
    "_status" "enum_navigation_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_navigation_v_version_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "path" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_navigation_v_version_items_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_navigation_v_version_claims" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "category" "enum__navigation_v_version_claims_category",
    "source" varchar,
    "status" "enum__navigation_v_version_claims_status" DEFAULT 'pending',
    "approved_by" varchar,
    "evidence" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_navigation_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_publication_approved" boolean DEFAULT false,
    "version_translation_issues" jsonb,
    "version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__navigation_v_published_locale",
    "latest" boolean
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_locales" ADD CONSTRAINT "pages_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_claims" ADD CONSTRAINT "pages_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_values" ADD CONSTRAINT "pages_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_values_locales" ADD CONSTRAINT "pages_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_locales" ADD CONSTRAINT "_pages_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_claims" ADD CONSTRAINT "_pages_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_values" ADD CONSTRAINT "_pages_v_version_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_values_locales" ADD CONSTRAINT "_pages_v_version_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "divisions_sections" ADD CONSTRAINT "divisions_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "divisions_sections_locales" ADD CONSTRAINT "divisions_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."divisions_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "divisions_claims" ADD CONSTRAINT "divisions_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "divisions" ADD CONSTRAINT "divisions_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "divisions_locales" ADD CONSTRAINT "divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_divisions_v_version_sections" ADD CONSTRAINT "_divisions_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_divisions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_divisions_v_version_sections_locales" ADD CONSTRAINT "_divisions_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_divisions_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_divisions_v_version_claims" ADD CONSTRAINT "_divisions_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_divisions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_divisions_v" ADD CONSTRAINT "_divisions_v_parent_id_divisions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."divisions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_divisions_v" ADD CONSTRAINT "_divisions_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_divisions_v_locales" ADD CONSTRAINT "_divisions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_divisions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sections" ADD CONSTRAINT "services_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sections_locales" ADD CONSTRAINT "services_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_claims" ADD CONSTRAINT "services_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_sections" ADD CONSTRAINT "_services_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_sections_locales" ADD CONSTRAINT "_services_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_claims" ADD CONSTRAINT "_services_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_division_id_divisions_id_fk" FOREIGN KEY ("version_division_id") REFERENCES "public"."divisions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_claims" ADD CONSTRAINT "faqs_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_claims" ADD CONSTRAINT "_faqs_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v_locales" ADD CONSTRAINT "_faqs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_claims" ADD CONSTRAINT "media_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_version_claims" ADD CONSTRAINT "_media_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_locales" ADD CONSTRAINT "_media_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_documents_sections" ADD CONSTRAINT "legal_documents_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_documents_sections_locales" ADD CONSTRAINT "legal_documents_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_documents_claims" ADD CONSTRAINT "legal_documents_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_documents" ADD CONSTRAINT "legal_documents_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_documents_locales" ADD CONSTRAINT "legal_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_documents_v_version_sections" ADD CONSTRAINT "_legal_documents_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_documents_v_version_sections_locales" ADD CONSTRAINT "_legal_documents_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_documents_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_documents_v_version_claims" ADD CONSTRAINT "_legal_documents_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_documents_v" ADD CONSTRAINT "_legal_documents_v_parent_id_legal_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_documents_v" ADD CONSTRAINT "_legal_documents_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_documents_v_locales" ADD CONSTRAINT "_legal_documents_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_divisions_fk" FOREIGN KEY ("divisions_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_documents_fk" FOREIGN KEY ("legal_documents_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_supported_locales" ADD CONSTRAINT "site_settings_supported_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links_locales" ADD CONSTRAINT "site_settings_social_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_claims" ADD CONSTRAINT "site_settings_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_supported_locales" ADD CONSTRAINT "_site_settings_v_version_supported_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_links" ADD CONSTRAINT "_site_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_links_locales" ADD CONSTRAINT "_site_settings_v_version_social_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_claims" ADD CONSTRAINT "_site_settings_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items_locales" ADD CONSTRAINT "navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_claims" ADD CONSTRAINT "navigation_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items" ADD CONSTRAINT "_navigation_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items_locales" ADD CONSTRAINT "_navigation_v_version_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_claims" ADD CONSTRAINT "_navigation_v_version_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_sections_locales_locale_parent_id_unique" ON "pages_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_sections_locales_parent_id_idx" ON "pages_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_claims_order_idx" ON "pages_claims" USING btree ("_order");
  CREATE INDEX "pages_claims_parent_id_idx" ON "pages_claims" USING btree ("_parent_id");
  CREATE INDEX "pages_values_order_idx" ON "pages_values" USING btree ("_order");
  CREATE INDEX "pages_values_parent_id_idx" ON "pages_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_values_locales_locale_parent_id_unique" ON "pages_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_values_locales_parent_id_idx" ON "pages_values_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_key_idx" ON "pages" USING btree ("key");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_order_idx" ON "_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_parent_id_idx" ON "_pages_v_version_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_sections_locales_locale_parent_id_unique" ON "_pages_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_sections_locales_parent_id_idx" ON "_pages_v_version_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_claims_order_idx" ON "_pages_v_version_claims" USING btree ("_order");
  CREATE INDEX "_pages_v_version_claims_parent_id_idx" ON "_pages_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_values_order_idx" ON "_pages_v_version_values" USING btree ("_order");
  CREATE INDEX "_pages_v_version_values_parent_id_idx" ON "_pages_v_version_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_values_locales_locale_parent_id_unique" ON "_pages_v_version_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_values_locales_parent_id_idx" ON "_pages_v_version_values_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_key_idx" ON "_pages_v" USING btree ("version_key");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "divisions_sections_order_idx" ON "divisions_sections" USING btree ("_order");
  CREATE INDEX "divisions_sections_parent_id_idx" ON "divisions_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "divisions_sections_locales_locale_parent_id_unique" ON "divisions_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "divisions_sections_locales_parent_id_idx" ON "divisions_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "divisions_claims_order_idx" ON "divisions_claims" USING btree ("_order");
  CREATE INDEX "divisions_claims_parent_id_idx" ON "divisions_claims" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "divisions_slug_idx" ON "divisions" USING btree ("slug");
  CREATE INDEX "divisions_hero_media_idx" ON "divisions" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "divisions_code_idx" ON "divisions" USING btree ("code");
  CREATE INDEX "divisions_updated_at_idx" ON "divisions" USING btree ("updated_at");
  CREATE INDEX "divisions_created_at_idx" ON "divisions" USING btree ("created_at");
  CREATE INDEX "divisions__status_idx" ON "divisions" USING btree ("_status");
  CREATE UNIQUE INDEX "divisions_locales_locale_parent_id_unique" ON "divisions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "divisions_locales_parent_id_idx" ON "divisions_locales" USING btree ("_parent_id");
  CREATE INDEX "_divisions_v_version_sections_order_idx" ON "_divisions_v_version_sections" USING btree ("_order");
  CREATE INDEX "_divisions_v_version_sections_parent_id_idx" ON "_divisions_v_version_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_divisions_v_version_sections_locales_locale_parent_id_uniqu" ON "_divisions_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_divisions_v_version_sections_locales_parent_id_idx" ON "_divisions_v_version_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "_divisions_v_version_claims_order_idx" ON "_divisions_v_version_claims" USING btree ("_order");
  CREATE INDEX "_divisions_v_version_claims_parent_id_idx" ON "_divisions_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_divisions_v_parent_idx" ON "_divisions_v" USING btree ("parent_id");
  CREATE INDEX "_divisions_v_version_version_slug_idx" ON "_divisions_v" USING btree ("version_slug");
  CREATE INDEX "_divisions_v_version_version_hero_media_idx" ON "_divisions_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_divisions_v_version_version_code_idx" ON "_divisions_v" USING btree ("version_code");
  CREATE INDEX "_divisions_v_version_version_updated_at_idx" ON "_divisions_v" USING btree ("version_updated_at");
  CREATE INDEX "_divisions_v_version_version_created_at_idx" ON "_divisions_v" USING btree ("version_created_at");
  CREATE INDEX "_divisions_v_version_version__status_idx" ON "_divisions_v" USING btree ("version__status");
  CREATE INDEX "_divisions_v_created_at_idx" ON "_divisions_v" USING btree ("created_at");
  CREATE INDEX "_divisions_v_updated_at_idx" ON "_divisions_v" USING btree ("updated_at");
  CREATE INDEX "_divisions_v_snapshot_idx" ON "_divisions_v" USING btree ("snapshot");
  CREATE INDEX "_divisions_v_published_locale_idx" ON "_divisions_v" USING btree ("published_locale");
  CREATE INDEX "_divisions_v_latest_idx" ON "_divisions_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_divisions_v_locales_locale_parent_id_unique" ON "_divisions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_divisions_v_locales_parent_id_idx" ON "_divisions_v_locales" USING btree ("_parent_id");
  CREATE INDEX "services_sections_order_idx" ON "services_sections" USING btree ("_order");
  CREATE INDEX "services_sections_parent_id_idx" ON "services_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_sections_locales_locale_parent_id_unique" ON "services_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_sections_locales_parent_id_idx" ON "services_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "services_claims_order_idx" ON "services_claims" USING btree ("_order");
  CREATE INDEX "services_claims_parent_id_idx" ON "services_claims" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_media_idx" ON "services" USING btree ("hero_media_id");
  CREATE INDEX "services_division_idx" ON "services" USING btree ("division_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_locales_parent_id_idx" ON "services_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_sections_order_idx" ON "_services_v_version_sections" USING btree ("_order");
  CREATE INDEX "_services_v_version_sections_parent_id_idx" ON "_services_v_version_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_sections_locales_locale_parent_id_unique" ON "_services_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_sections_locales_parent_id_idx" ON "_services_v_version_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_claims_order_idx" ON "_services_v_version_claims" USING btree ("_order");
  CREATE INDEX "_services_v_version_claims_parent_id_idx" ON "_services_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_hero_media_idx" ON "_services_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_services_v_version_version_division_idx" ON "_services_v" USING btree ("version_division_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_locales_parent_id_idx" ON "_services_v_locales" USING btree ("_parent_id");
  CREATE INDEX "faqs_claims_order_idx" ON "faqs_claims" USING btree ("_order");
  CREATE INDEX "faqs_claims_parent_id_idx" ON "faqs_claims" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "faqs_slug_idx" ON "faqs" USING btree ("slug");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_locales_parent_id_idx" ON "faqs_locales" USING btree ("_parent_id");
  CREATE INDEX "_faqs_v_version_claims_order_idx" ON "_faqs_v_version_claims" USING btree ("_order");
  CREATE INDEX "_faqs_v_version_claims_parent_id_idx" ON "_faqs_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_slug_idx" ON "_faqs_v" USING btree ("version_slug");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_snapshot_idx" ON "_faqs_v" USING btree ("snapshot");
  CREATE INDEX "_faqs_v_published_locale_idx" ON "_faqs_v" USING btree ("published_locale");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_faqs_v_locales_locale_parent_id_unique" ON "_faqs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faqs_v_locales_parent_id_idx" ON "_faqs_v_locales" USING btree ("_parent_id");
  CREATE INDEX "media_claims_order_idx" ON "media_claims" USING btree ("_order");
  CREATE INDEX "media_claims_parent_id_idx" ON "media_claims" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE INDEX "media__status_idx" ON "media" USING btree ("_status");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "_media_v_version_claims_order_idx" ON "_media_v_version_claims" USING btree ("_order");
  CREATE INDEX "_media_v_version_claims_parent_id_idx" ON "_media_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version__status_idx" ON "_media_v" USING btree ("version__status");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_snapshot_idx" ON "_media_v" USING btree ("snapshot");
  CREATE INDEX "_media_v_published_locale_idx" ON "_media_v" USING btree ("published_locale");
  CREATE INDEX "_media_v_latest_idx" ON "_media_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_media_v_locales_locale_parent_id_unique" ON "_media_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_media_v_locales_parent_id_idx" ON "_media_v_locales" USING btree ("_parent_id");
  CREATE INDEX "leads_division_idx" ON "leads" USING btree ("division_id");
  CREATE INDEX "leads_service_idx" ON "leads" USING btree ("service_id");
  CREATE INDEX "leads_assignee_idx" ON "leads" USING btree ("assignee_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "legal_documents_sections_order_idx" ON "legal_documents_sections" USING btree ("_order");
  CREATE INDEX "legal_documents_sections_parent_id_idx" ON "legal_documents_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_documents_sections_locales_locale_parent_id_unique" ON "legal_documents_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "legal_documents_sections_locales_parent_id_idx" ON "legal_documents_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "legal_documents_claims_order_idx" ON "legal_documents_claims" USING btree ("_order");
  CREATE INDEX "legal_documents_claims_parent_id_idx" ON "legal_documents_claims" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_documents_slug_idx" ON "legal_documents" USING btree ("slug");
  CREATE INDEX "legal_documents_hero_media_idx" ON "legal_documents" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "legal_documents_kind_idx" ON "legal_documents" USING btree ("kind");
  CREATE INDEX "legal_documents_updated_at_idx" ON "legal_documents" USING btree ("updated_at");
  CREATE INDEX "legal_documents_created_at_idx" ON "legal_documents" USING btree ("created_at");
  CREATE INDEX "legal_documents__status_idx" ON "legal_documents" USING btree ("_status");
  CREATE UNIQUE INDEX "legal_documents_locales_locale_parent_id_unique" ON "legal_documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "legal_documents_locales_parent_id_idx" ON "legal_documents_locales" USING btree ("_parent_id");
  CREATE INDEX "_legal_documents_v_version_sections_order_idx" ON "_legal_documents_v_version_sections" USING btree ("_order");
  CREATE INDEX "_legal_documents_v_version_sections_parent_id_idx" ON "_legal_documents_v_version_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_legal_documents_v_version_sections_locales_locale_parent_id" ON "_legal_documents_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_legal_documents_v_version_sections_locales_parent_id_idx" ON "_legal_documents_v_version_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "_legal_documents_v_version_claims_order_idx" ON "_legal_documents_v_version_claims" USING btree ("_order");
  CREATE INDEX "_legal_documents_v_version_claims_parent_id_idx" ON "_legal_documents_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_legal_documents_v_parent_idx" ON "_legal_documents_v" USING btree ("parent_id");
  CREATE INDEX "_legal_documents_v_version_version_slug_idx" ON "_legal_documents_v" USING btree ("version_slug");
  CREATE INDEX "_legal_documents_v_version_version_hero_media_idx" ON "_legal_documents_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_legal_documents_v_version_version_kind_idx" ON "_legal_documents_v" USING btree ("version_kind");
  CREATE INDEX "_legal_documents_v_version_version_updated_at_idx" ON "_legal_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_documents_v_version_version_created_at_idx" ON "_legal_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_documents_v_version_version__status_idx" ON "_legal_documents_v" USING btree ("version__status");
  CREATE INDEX "_legal_documents_v_created_at_idx" ON "_legal_documents_v" USING btree ("created_at");
  CREATE INDEX "_legal_documents_v_updated_at_idx" ON "_legal_documents_v" USING btree ("updated_at");
  CREATE INDEX "_legal_documents_v_snapshot_idx" ON "_legal_documents_v" USING btree ("snapshot");
  CREATE INDEX "_legal_documents_v_published_locale_idx" ON "_legal_documents_v" USING btree ("published_locale");
  CREATE INDEX "_legal_documents_v_latest_idx" ON "_legal_documents_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_legal_documents_v_locales_locale_parent_id_unique" ON "_legal_documents_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_legal_documents_v_locales_parent_id_idx" ON "_legal_documents_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_divisions_id_idx" ON "payload_locked_documents_rels" USING btree ("divisions_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_legal_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_documents_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_supported_locales_order_idx" ON "site_settings_supported_locales" USING btree ("order");
  CREATE INDEX "site_settings_supported_locales_parent_idx" ON "site_settings_supported_locales" USING btree ("parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_social_links_locales_locale_parent_id_unique" ON "site_settings_social_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_links_locales_parent_id_idx" ON "site_settings_social_links_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_claims_order_idx" ON "site_settings_claims" USING btree ("_order");
  CREATE INDEX "site_settings_claims_parent_id_idx" ON "site_settings_claims" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_supported_locales_order_idx" ON "_site_settings_v_version_supported_locales" USING btree ("order");
  CREATE INDEX "_site_settings_v_version_supported_locales_parent_idx" ON "_site_settings_v_version_supported_locales" USING btree ("parent_id");
  CREATE INDEX "_site_settings_v_version_social_links_order_idx" ON "_site_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_links_parent_id_idx" ON "_site_settings_v_version_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_settings_v_version_social_links_locales_locale_parent_" ON "_site_settings_v_version_social_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_social_links_locales_parent_id_idx" ON "_site_settings_v_version_social_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_claims_order_idx" ON "_site_settings_v_version_claims" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_claims_parent_id_idx" ON "_site_settings_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_locales_parent_id_idx" ON "_site_settings_v_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_items_locales_locale_parent_id_unique" ON "navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_items_locales_parent_id_idx" ON "navigation_items_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_claims_order_idx" ON "navigation_claims" USING btree ("_order");
  CREATE INDEX "navigation_claims_parent_id_idx" ON "navigation_claims" USING btree ("_parent_id");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE INDEX "_navigation_v_version_items_order_idx" ON "_navigation_v_version_items" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_items_parent_id_idx" ON "_navigation_v_version_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_items_locales_locale_parent_id_unique" ON "_navigation_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_items_locales_parent_id_idx" ON "_navigation_v_version_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_claims_order_idx" ON "_navigation_v_version_claims" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_claims_parent_id_idx" ON "_navigation_v_version_claims" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_snapshot_idx" ON "_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_navigation_v_published_locale_idx" ON "_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "pages_sections_locales" CASCADE;
  DROP TABLE "pages_claims" CASCADE;
  DROP TABLE "pages_values" CASCADE;
  DROP TABLE "pages_values_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_sections" CASCADE;
  DROP TABLE "_pages_v_version_sections_locales" CASCADE;
  DROP TABLE "_pages_v_version_claims" CASCADE;
  DROP TABLE "_pages_v_version_values" CASCADE;
  DROP TABLE "_pages_v_version_values_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "divisions_sections" CASCADE;
  DROP TABLE "divisions_sections_locales" CASCADE;
  DROP TABLE "divisions_claims" CASCADE;
  DROP TABLE "divisions" CASCADE;
  DROP TABLE "divisions_locales" CASCADE;
  DROP TABLE "_divisions_v_version_sections" CASCADE;
  DROP TABLE "_divisions_v_version_sections_locales" CASCADE;
  DROP TABLE "_divisions_v_version_claims" CASCADE;
  DROP TABLE "_divisions_v" CASCADE;
  DROP TABLE "_divisions_v_locales" CASCADE;
  DROP TABLE "services_sections" CASCADE;
  DROP TABLE "services_sections_locales" CASCADE;
  DROP TABLE "services_claims" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "_services_v_version_sections" CASCADE;
  DROP TABLE "_services_v_version_sections_locales" CASCADE;
  DROP TABLE "_services_v_version_claims" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "faqs_claims" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "_faqs_v_version_claims" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "_faqs_v_locales" CASCADE;
  DROP TABLE "media_claims" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "_media_v_version_claims" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_locales" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "legal_documents_sections" CASCADE;
  DROP TABLE "legal_documents_sections_locales" CASCADE;
  DROP TABLE "legal_documents_claims" CASCADE;
  DROP TABLE "legal_documents" CASCADE;
  DROP TABLE "legal_documents_locales" CASCADE;
  DROP TABLE "_legal_documents_v_version_sections" CASCADE;
  DROP TABLE "_legal_documents_v_version_sections_locales" CASCADE;
  DROP TABLE "_legal_documents_v_version_claims" CASCADE;
  DROP TABLE "_legal_documents_v" CASCADE;
  DROP TABLE "_legal_documents_v_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_supported_locales" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_social_links_locales" CASCADE;
  DROP TABLE "site_settings_claims" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_supported_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_social_links" CASCADE;
  DROP TABLE "_site_settings_v_version_social_links_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_claims" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation_items_locales" CASCADE;
  DROP TABLE "navigation_claims" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "_navigation_v_version_items" CASCADE;
  DROP TABLE "_navigation_v_version_items_locales" CASCADE;
  DROP TABLE "_navigation_v_version_claims" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_claims_category";
  DROP TYPE "public"."enum_pages_claims_status";
  DROP TYPE "public"."enum_pages_key";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_claims_category";
  DROP TYPE "public"."enum__pages_v_version_claims_status";
  DROP TYPE "public"."enum__pages_v_version_key";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_divisions_claims_category";
  DROP TYPE "public"."enum_divisions_claims_status";
  DROP TYPE "public"."enum_divisions_status";
  DROP TYPE "public"."enum__divisions_v_version_claims_category";
  DROP TYPE "public"."enum__divisions_v_version_claims_status";
  DROP TYPE "public"."enum__divisions_v_version_status";
  DROP TYPE "public"."enum__divisions_v_published_locale";
  DROP TYPE "public"."enum_services_claims_category";
  DROP TYPE "public"."enum_services_claims_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_claims_category";
  DROP TYPE "public"."enum__services_v_version_claims_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_faqs_claims_category";
  DROP TYPE "public"."enum_faqs_claims_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_claims_category";
  DROP TYPE "public"."enum__faqs_v_version_claims_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum__faqs_v_published_locale";
  DROP TYPE "public"."enum_media_claims_category";
  DROP TYPE "public"."enum_media_claims_status";
  DROP TYPE "public"."enum_media_rights_status";
  DROP TYPE "public"."enum_media_status";
  DROP TYPE "public"."enum__media_v_version_claims_category";
  DROP TYPE "public"."enum__media_v_version_claims_status";
  DROP TYPE "public"."enum__media_v_version_rights_status";
  DROP TYPE "public"."enum__media_v_version_status";
  DROP TYPE "public"."enum__media_v_published_locale";
  DROP TYPE "public"."enum_leads_locale";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_legal_documents_claims_category";
  DROP TYPE "public"."enum_legal_documents_claims_status";
  DROP TYPE "public"."enum_legal_documents_kind";
  DROP TYPE "public"."enum_legal_documents_status";
  DROP TYPE "public"."enum__legal_documents_v_version_claims_category";
  DROP TYPE "public"."enum__legal_documents_v_version_claims_status";
  DROP TYPE "public"."enum__legal_documents_v_version_kind";
  DROP TYPE "public"."enum__legal_documents_v_version_status";
  DROP TYPE "public"."enum__legal_documents_v_published_locale";
  DROP TYPE "public"."enum_site_settings_supported_locales";
  DROP TYPE "public"."enum_site_settings_claims_category";
  DROP TYPE "public"."enum_site_settings_claims_status";
  DROP TYPE "public"."enum_site_settings_default_locale";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_supported_locales";
  DROP TYPE "public"."enum__site_settings_v_version_claims_category";
  DROP TYPE "public"."enum__site_settings_v_version_claims_status";
  DROP TYPE "public"."enum__site_settings_v_version_default_locale";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";
  DROP TYPE "public"."enum_navigation_claims_category";
  DROP TYPE "public"."enum_navigation_claims_status";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_claims_category";
  DROP TYPE "public"."enum__navigation_v_version_claims_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum__navigation_v_published_locale";`);
}
