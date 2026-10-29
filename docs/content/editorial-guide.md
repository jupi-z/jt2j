# JT2J editorial guide

## Editorial boundary

This guide explains how authorized staff should prepare content for the private
Payload admin panel. It does not approve any current JT2J copy, legal identity,
testimonial, partnership, capability, reference, or media right.

French is the default locale and English is a separately maintained translation.
The public site must never use an unreviewed fallback to make a page appear
complete.

## Who does what

- `editor`: drafts and revises institutional copy, services, divisions, FAQs,
  metadata, and navigation-related content.
- `translator`: maintains the FR/EN pair and flags terminology questions.
- `publisher`: checks the approval matrix, records evidence, and publishes.
- `admin`: manages users, roles, and emergency operational access.
- `sales`: manages contact leads; sales users do not edit or publish site copy.

## Draft-to-public workflow

1. Start from a draft; do not edit published content directly for an urgent fix
   without preserving the version history.
2. Fill required FR and EN fields, including title, lead, body sections, and
   required SEO title/description.
3. Check links, slugs, relationships, spelling, numbers, names, dates, and
   contact details in both locales.
4. Add claim evidence and identify the human approver for legal identity,
   leadership, references, partnerships, capabilities, or testimonials.
5. For each image/document, record alt text, credit, rights status, and rights
   evidence. Upload a new media record rather than replacing a media binary in
   place.
6. Request publisher review. A missing translation, required SEO field, legal
   approval, or media-rights evidence must block publication.
7. Publish only after the human decision is recorded. Verify the public FR and
   EN pages and keep the version identifier in the release record.

Changing approved text or claims requires re-review. Do not publish temporary
labels, internal notes, draft claims, placeholder media, or prototype-only
language.

## Bilingual writing rules

- Write the French source and English translation as equivalent, intentional
  content; do not translate by copying the source into both fields.
- Preserve approved names, legal names, product/service names, numbers, and
  contact details exactly unless the owner approves a change.
- Keep headings, calls to action, FAQs, metadata, image alt text, and navigation
  labels complete in both locales.
- Keep one stable canonical slug for route identity unless an SEO owner approves
  a migration. Test language switching from the current detail page.
- If a translation is missing or uncertain, leave the record in draft and flag
  it for the translator. Do not rely on runtime fallback.

## Claims and evidence

Treat leadership, legal identity, addresses, certifications, references,
partnerships, testimonials, numbers, capabilities, and guarantees as claims.
Attach the source or approval record and name the human reviewer. The technical
publication checklist can verify that evidence fields are present; it cannot
decide whether a claim is true, lawful, current, or commercially acceptable.

Use the [content approval matrix](./content-approval-matrix.md) to determine
the required reviewer before requesting publication.

## Media

Use only assets with approved publication rights. Complete bilingual alt text
where the asset is exposed to the public, record credit/licence/source, and
confirm the media record is published. Media binaries are immutable: upload a
new asset to replace one and update the content relationship through the normal
draft/approval flow.

Decorative artwork must remain decorative. Do not add meaningful information to
an image without an accessible text equivalent.

## Lead content

Treat names, email addresses, phone numbers, companies, messages, consent, and
internal notes as restricted business data. Do not copy lead contents into
public copy, commits, screenshots, or chat. Use the lead statuses and retry
states described in [handover.md](../operations/handover.md), and escalate
notification failures instead of silently resending.

## Editorial review checklist

- [ ] The FR and EN versions are complete and reviewed.
- [ ] The wording matches the approved JT2J identity and terminology.
- [ ] Claims have a named human approver and evidence.
- [ ] Links, slugs, relationships, dates, numbers, and contact details are
      checked in both locales.
- [ ] SEO title and description are complete in both locales.
- [ ] Media has alt text, credit/licence, and rights evidence.
- [ ] No private notes, placeholders, secrets, or unapproved references remain.
- [ ] A publisher recorded the decision before publication.
