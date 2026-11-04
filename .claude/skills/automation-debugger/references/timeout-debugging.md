# Timeout debugging

Loaded by `SKILL.md` step 3 for a failure classified as a timeout. Read this before touching any timeout value — raising a timeout is treating the symptom, not the cause, and just makes the eventual real failure slower to surface.

## Find the actual blocking condition

1. **What was Playwright actually waiting for?** The error names the action (click, fill) or assertion and the locator — that tells you the *what*, not the *why*. Check the trace viewer's network tab and console for the same time window: was a request pending, failed, or never fired?
2. **Did the condition ever become true, just too late?** Re-run with a generously long timeout once, only as a diagnostic (not as the fix) — if it then passes, the app is just slow under current conditions (cold cache, unseeded data, a genuinely slow endpoint), and the real fix is addressing that slowness or waiting on a more specific, earlier signal, not permanently raising the timeout.
3. **Did the condition never become true at all?** Then this isn't really a timeout — it's a locator or application-defect issue wearing a timeout's error message. Reclassify per `common-failures.md`.
4. **Is the wait anchored to the right signal?** A wait for "element visible" after a navigation can fire before the page's async data has actually loaded, if the element renders in a loading state first. Anchor on the *final* state signal (the data-bearing element, not a skeleton/placeholder), not just presence.

## Common non-obvious causes

- A fixture or fake/mocked network response that doesn't match the real API's timing or shape in this specific run configuration (e.g. CI hitting a real staging API while local dev uses a mock).
- An animation or transition delaying an element's `visible` state past when it's `attached` — waiting on `attached` instead of `visible` sometimes proceeds before the element is actually interactable.
- A background request (analytics, websocket handshake) that Playwright's default network-idle wait considers relevant but that the test doesn't actually need — switching to waiting on a specific selector/response instead of network-idle removes coupling to unrelated traffic.

## The fix

The correct fix is almost always "wait on a more specific, correctly-anchored condition," not "wait longer." Only increase a timeout value when the diagnostic in step 2 shows the app is reliably just slower than the current threshold for a known, accepted reason — and note that reason in the change, since a bare timeout increase with no explanation is a Vague Warning waiting to happen to the next debugger.
