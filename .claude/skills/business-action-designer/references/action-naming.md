# Business Action naming and parameter rules

Loaded by `SKILL.md` step 5 for every approved candidate.

## Naming

- Verb + object, present tense, camelCase: `login`, `searchProduct`, `openProductDetail`, `verifyProductPrice`. Not `doLogin`, not `LoginAction`, not `login_user`.
- Name the *business* intent, not the UI mechanism: `applyDiscountCode`, not `typeInCouponFieldAndClickApply`.
- Verification-style actions get a `verify`/`assert`-prefixed name and return a boolean or throw — do not silently mix them into an action that also performs a state change (see the NEVER on self-asserting actions in `SKILL.md`).
- Avoid encoding the test case ID or a UI screen name that's likely to change (`checkoutPageStep2`) — name it after what it accomplishes (`confirmShippingAddress`).

## Parameters

- Every value that could plausibly differ between calls is a parameter — do not hardcode a value "because that's what the current test needs" if a second caller would need a different one.
- Prefer a small number of required parameters plus an options object for optional variations, over many boolean flags (`login(username, password, { rememberMe: true })`, not `login(username, password, true, false, false)`) — boolean flags at call sites are unreadable without checking the signature.
- Do not add a parameter for something that never varies in practice yet (e.g. a hardcoded environment URL) — that is speculative generality; add it when a second real use case needs it (per the project's "no design for hypothetical future requirements" default).

## Return values

- Return nothing (`void`) when the action's only job is to cause a state change the caller doesn't need to inspect.
- Return a value only when a caller will plausibly assert on it or chain from it — a locator, a count, an extracted string. Do not return an entire page object "just in case"; that re-exposes every internal detail the action exists to hide.
