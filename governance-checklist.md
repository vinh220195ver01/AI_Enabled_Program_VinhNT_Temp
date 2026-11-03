# Governance checklist

Violations found by the governance guard (rules: AI-Enabled QA Governance register v0.1).
Tick a box when the owner has reviewed it. Only rule IDs and file names are recorded,
never the matched text.

- VIOLATION: sensitive data (secret, key, credential, card number) was used or stored.
  Escalate to Security/Privacy/Data Owner (AR-06).
- NEEDS REVIEW: restricted or unlisted tool, confidential/production data, or risky
  behavior. Not an automatic fail (AR-03, AR-05, AR-07); prohibited behavior (P-*) fails
  only with reliable evidence (AR-04).

- [ ] 2026-11-03 23:11 | input | D-4 | VIOLATION, escalate (AR-06) | Password, secret or key assigned a value
- [ ] 2026-11-03 23:11 | input | AC-08 | NEEDS REVIEW (AR-03/05/07) | Gemini for Workspace is Needs Review
- [ ] 2026-11-03 23:11 | input | D-5 | NEEDS REVIEW (AR-03/05/07) | Mentions production or real customer data
- [ ] 2026-11-03 23:13 | memory:leak.md | D-4 | VIOLATION, escalate (AR-06) | API key or access token | key:memory:leak.md:D-4:API key or access token
- [ ] 2026-11-03 23:13 | memory:leak.md | D-4 | VIOLATION, escalate (AR-06) | Password, secret or key assigned a value | key:memory:leak.md:D-4:Password, secret or key assigned a value
