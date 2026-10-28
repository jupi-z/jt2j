# 0001 — Preserve the prototype as reference

Status: accepted for the bootstrap.

The supplied `JT2J_Prestige_Prototype.html` is preserved byte-for-byte in
`docs/reference/`. The original root file remains untouched.

The prototype is a visual and content reference for later implementation work.
It is not production runtime code and must not be served from `public/`, imported
into the application, or treated as approved publication content. Next.js routes
and typed modules will implement the production application separately.
