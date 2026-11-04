# Governance checklist

Violations found by the governance guard (rules: AI-Enabled QA Governance register v0.1).
Tick a box when the owner has reviewed it. Only rule IDs and file names are recorded,
never the matched text.

- VIOLATION: sensitive data (secret, key, credential, card number) was used or stored.
  Escalate to Security/Privacy/Data Owner (AR-06).
- NEEDS REVIEW: restricted or unlisted tool, confidential/production data, or risky
  behavior. Not an automatic fail (AR-03, AR-05, AR-07); prohibited behavior (P-*) fails
  only with reliable evidence (AR-04).


| Done | When | Severity | Found in | Code | Issue | Action |
|---|---|---|---|---|---|---|
| [ ] | 2026-11-03 23:11 | VIOLATION | Prompt | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-03 23:11 | NEEDS REVIEW | Prompt | AC-08 | Gemini for Workspace is Needs Review | Check sheet AI Tools; an unapproved tool may only handle public or synthetic data (AR-03) |
| [ ] | 2026-11-03 23:11 | NEEDS REVIEW | Prompt | D-5 | Mentions production or real customer data | Check the data class, mask it or use synthetic data, get approval before using it with AI (sheet Data Policy) |
| [ ] | 2026-11-03 23:13 | VIOLATION | Agent memory (not in repo): leak.md | D-4 | API key or access token | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-03 23:13 | VIOLATION | Agent memory (not in repo): leak.md | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:27 | VIOLATION | Prompt | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) <!-- key:input:2026-11-04:D-4:Password, secret or key assigned a value --> |
| [ ] | 2026-11-04 10:27 | NEEDS REVIEW | Prompt | AC-08 | Gemini for Workspace is Needs Review | Check sheet AI Tools; an unapproved tool may only handle public or synthetic data (AR-03) <!-- key:input:2026-11-04:AC-08:Gemini for Workspace is Needs Review --> |
| [ ] | 2026-11-04 10:28 | VIOLATION | Agent memory (not in repo): leak.md | D-4 | API key or access token | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:28 | VIOLATION | Agent memory (not in repo): leak.md | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:28 | VIOLATION | File: exercises/ex05-upper/upper.sh | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:28 | NEEDS REVIEW | File: README.md | D-3 | Mentions confidential / secret / top-secret material | Check the data class, mask it or use synthetic data, get approval before using it with AI (sheet Data Policy) |
| [ ] | 2026-11-04 10:28 | NEEDS REVIEW | File: README.md | D-5 | Mentions production or real customer data | Check the data class, mask it or use synthetic data, get approval before using it with AI (sheet Data Policy) |
| [ ] | 2026-11-04 10:29 | NEEDS REVIEW | File: README.md | D-5 | Mentions production or real customer data | Check the data class, mask it or use synthetic data, get approval before using it with AI (sheet Data Policy) |
| [ ] | 2026-11-04 10:43 | VIOLATION | Agent memory (not in repo): leak.md | D-4 | API key or access token | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:43 | VIOLATION | Agent memory (not in repo): leak.md | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:43 | VIOLATION | File: exercises/ex06-reverse/reverse.sh | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 10:43 | VIOLATION | File: exercises/ex06-reverse/reverse.sh | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
| [ ] | 2026-11-04 11:23 | NEEDS REVIEW | Prompt | AR-03 | AI tool not in the approved list (check the register) | Check sheet AI Tools; an unapproved tool may only handle public or synthetic data (AR-03) <!-- key:input:2026-11-04:AR-03:AI tool not in the approved list (check the register) --> |
| [ ] | 2026-11-04 11:23 | VIOLATION | File: exercises/ex07-double/double.sh | D-4 | Password, secret or key assigned a value | Remove or mask the data at its source; escalate to Security/Privacy/Data Owner (AR-06) |
