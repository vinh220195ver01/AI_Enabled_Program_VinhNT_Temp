# Abstraction-level and boundary rules

Loaded by `SKILL.md` step 2 when a candidate spans more than one page or more than ~5 steps — the size where over-merging tends to hide.

## Signs an action is over-merged (spans too much)

- It crosses a navigation boundary that a different test would want to enter partway through (e.g. a merged `searchAndOpenProductAndAddToCart()` — a test that arrives at the product page via a direct link has no way to reuse only the "add to cart" part).
- Its name needs "and" to describe what it does (`loginAndNavigateToSettings`). An "and" in the name is almost always a sign of two actions, not one — split along the "and".
- It has more than ~5-7 steps. This isn't a hard limit, but past that range check whether it's really one intent or a workflow made of several — a workflow belongs in the test case's sequencing, not baked into one action.

## Signs an action is under-merged (spans too little)

- Two or three actions are always called together, in the same order, by every test that uses any of them, and none of them make sense called alone (e.g. `enterUsername()`, `enterPassword()`, `clickLoginButton()` as three separate actions that nothing ever calls independently). Merge these into one `login()` — the separation adds no real flexibility, only ceremony at every call site.
- The split exists only because the manual case happened to phrase two steps on separate lines, not because a second caller would ever need just one of them.

## The test

Ask: "Would any *currently plausible* second test case call part of this without the rest?" Plausible means grounded in the project's actual other flows, not a hypothetical. If yes → keep separate. If no, and everything is always called together → merge. This mirrors the project-wide principle of not designing for hypothetical future requirements — abstraction boundaries should track real reuse, not imagined reuse.
