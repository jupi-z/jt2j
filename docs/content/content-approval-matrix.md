# JT2J content approval matrix

The technical checks below are repository guardrails. They do not substitute
for a human approval, a legal opinion, editorial acceptance, or business
acceptance. A record remains unpublished when a required human decision or
evidence is missing.

| Content or change                                                              | Technical gate                                                                         | Required human approval                                        | Evidence to retain                                         |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| Page, division, service, or FAQ copy                                           | Required FR/EN fields and sections complete; published-only reads                      | Editorial owner; translator for English; publisher for release | Version ID and review record                               |
| SEO title/description                                                          | Bilingual SEO fields complete when required                                            | Editorial/SEO owner                                            | Approved metadata record                                   |
| Legal identity, address, privacy, cookies, legal notice                        | Legal checklist/evidence required for publication                                      | Legal/privacy owner                                            | Signed or traceable legal approval and effective date      |
| Leadership, capability, certification, number, guarantee, or partnership claim | Claim category, reviewer, status, and evidence must be present                         | Responsible JT2J owner and legal/compliance where applicable   | Source/evidence and approver/date                          |
| Testimonial, client/reference, logo, or case study                             | Publication approval and source/rights metadata                                        | Client/reference owner; legal/brand owner where applicable     | Consent/licence/source record                              |
| Photo, illustration, logo, PDF, or other media                                 | Published media record, approved rights status, rights evidence, and required alt text | Brand/media-rights owner                                       | Licence/credit/source and approval record                  |
| Navigation, contact coordinates, social links                                  | Bilingual labels/URLs and publication checks                                           | Business owner; editorial owner                                | Accepted change record and public verification             |
| Contact form, routing, consent, or retention wording                           | Schema, consent, anti-abuse, and safe-response tests                                   | Business/privacy owner; technical owner for routing            | Provider/test-path and privacy approval                    |
| Lead status or assignment                                                      | Authenticated `sales`/`admin` access and controlled status fields                      | Sales owner                                                    | Assignment/status history; no PII in general release notes |
| Emergency correction or rollback                                               | Version/release and smoke checks                                                       | Publisher plus release owner; legal owner if claim/legal text  | Incident/release record and approval                       |

## Publication decision

The publisher may publish only when:

1. The technical checklist is complete: FR/EN translations, required SEO,
   legal evidence fields, and media-rights evidence.
2. The human approvals in this matrix are recorded.
3. The release checklist has the required production, backup, rollback, and
   business-acceptance evidence. No staging environment is part of this
   delivery model.

The repository currently verifies the first category in tests and admin hooks.
It does not assert that a person has approved the second or third category.
