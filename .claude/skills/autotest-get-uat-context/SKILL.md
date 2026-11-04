---
name: autotest-get-uat-context
description: Explore a live web application under test (AUT) with playwright-cli and write what you learn — pages, navigation, forms, key elements, flows, auth — into a small Markdown knowledge base for future test-writing sessions to read instead of re-exploring from scratch. Use this whenever the user asks to "get UAT context", "explore this app/site for testing", "document the application under test", "build test context", "understand this page for automation", or asks you to start writing Playwright tests against a real site you haven't recorded context for yet. Also use it proactively before writing new Playwright tests against a site if no `uat-context/<site-slug>/` folder exists yet for it.
---

# Get UAT Context

Recon before test authoring. Instead of re-discovering a site's structure, forms, and locators
every time someone wants a new Playwright test, explore it once with `playwright-cli`, write down
what you found, and let future sessions start from the notes instead of the live page.

The output is a small folder of Markdown files, not a report to show the user — it's meant to be
read back into context cheaply later, so structure matters as much as content. See
[Progressive disclosure](#progressive-disclosure-the-knowledge-base-layout) below before writing
anything.

## When to use this

- The user explicitly asks for UAT/test context, site exploration, or AUT documentation.
- You're about to write Playwright tests against a site and no `uat-context/<site-slug>/` folder
  exists yet for it in the current project — run this first, then write the tests from the notes.
- A `uat-context/<site-slug>/` folder already exists but is stale relative to the live site — treat
  it as an update pass (see [Updating existing context](#updating-existing-context)), not a rewrite.

## Workflow

### 1. Confirm scope

If the user gave a URL and nothing else, that's enough to start with the homepage — you don't need
to interrogate them further. But if the site is large or the ask is vague ("get me context on our
app"), ask which pages or flows matter most (e.g. login, checkout, search, admin panel) rather than
guessing at exhaustive coverage. Recon is expensive in browser round-trips; scope it to what the
user actually plans to test.

### 2. Explore with playwright-cli

Use the `playwright-cli` skill for all browser interaction — this skill doesn't duplicate its
commands, it directs how to use them for recon specifically. Typical sequence:

```bash
playwright-cli open <base-url>
playwright-cli snapshot
```

For each page/flow in scope:
- `playwright-cli goto <url>` and `snapshot` to see structure.
- `playwright-cli find "<label or text>"` to locate specific elements in a large page without
  pulling the whole snapshot.
- Note every form: what fields it has, which are required, any visible validation text.
- Note primary navigation (header/footer/sidebar links) once on the homepage — don't re-derive it
  on every subsequent page.
- `playwright-cli console` and `playwright-cli requests` are worth a quick check on key pages if
  something looks off (errors, unexpected network calls) — not needed on every page as a matter of
  routine.

Don't take screenshots or record video as part of this — the knowledge base is about structure and
locators, not visuals. Only grab a screenshot if a page is genuinely hard to describe in words
(e.g. a canvas-based widget with no accessible structure).

### 3. Capture durable locators (Playwright + XPath fallback)

Snapshot refs like `e15` are only valid until the next snapshot or navigation — writing them into a
knowledge file that's read back days later is useless. For every element worth recording, capture
**two** durable locators:

1. **Playwright locator** — kept as a semantic reference:

```bash
playwright-cli generate-locator e15 --raw
```

2. **XPath** — a fallback for Playwright (`page.locator('xpath=...')`) when no semantic locator is
   stable. `generate-locator` does not
   produce XPath, so build it yourself from the element's attributes (inspect them with
   `playwright-cli eval` on the ref, or check the snapshot; see the `playwright-cli` skill for exact
   syntax). Prefer, in order: `@id`, `@data-testid` / `@data-cy`, `@name`, `@aria-label`, exact or
   `normalize-space()` text, then a short relative path anchored on one of those. Never record
   absolute paths like `/html/body/div[3]/...`.

Verify each XPath matches exactly one element before writing it down, e.g.:

```bash
playwright-cli eval "document.evaluate('//button[@id=\"login\"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength"
```

If an element only has a brittle locator (deep CSS path, positional XPath), say so in the file —
that flags an element the site doesn't expose stable hooks for.

### 4. Write the knowledge base

Create it under `uat-context/<site-slug>/` in the *current project*, not inside this skill's
directory — it's project data, not skill code. Derive `<site-slug>` from the domain (e.g.
`actp1.csc.edu.vn` → `actp1-csc-edu-vn`, or a shorter human name if the user gave one).

#### Progressive disclosure: the knowledge base layout

The whole point of this structure is that `index.md` stays cheap to read, and detail only gets
pulled into context when a page or flow is actually relevant — the same pattern `playwright-cli`'s
own SKILL.md uses for its `references/` files. Don't collapse this into one flat file; a single
growing document defeats the purpose and makes every future read expensive.

```
uat-context/<site-slug>/
├── index.md              # short overview + table of contents — read this first, always
├── pages/
│   └── <page-slug>.md    # one file per distinct page
└── flows/
    └── <flow-name>.md    # one file per multi-step journey (login, checkout, ...)
```

- **`index.md`** — site name, base URL, what the app is/does, auth requirements (does testing
  require a login? test credentials location — never the credentials themselves), and a linked list
  of every page and flow file with a one-line description each. Keep it short enough that reading
  it costs almost nothing; it exists to route the reader to the right detail file, not to contain
  the details itself. Use [assets/index-template.md](assets/index-template.md) as the starting
  structure.
- **`pages/<page-slug>.md`** — one page's worth of detail: URL, purpose, key interactive elements
  with durable Playwright locators and XPath, forms with their fields and validation rules, and notable states (empty,
  loading, error) if you observed them. Use
  [assets/page-template.md](assets/page-template.md).
- **`flows/<flow-name>.md`** — the sequence of steps across pages for a journey like "log in" or
  "complete checkout". Reference the relevant page files by link instead of re-describing their
  elements. Use [assets/flow-template.md](assets/flow-template.md).

See [references/exploration-guide.md](references/exploration-guide.md) for a full worked example
session (commands run, what got written down, what didn't) if you want a concrete model to follow.

### 5. Updating existing context

If `uat-context/<site-slug>/` already exists, this is a refresh, not a rewrite:
- Read `index.md` first to see what's already documented.
- Re-visit existing pages/flows only far enough to confirm locators and structure still hold —
  don't re-explore in full detail. Update just the parts that changed, and add a short note (with
  today's date) on anything that moved or broke.
- Add new page/flow files for anything genuinely new in scope; append their links to `index.md`.
- If a documented element or locator no longer exists on the live page, mark it as stale in the page
  file rather than silently deleting the history — future test runs may be failing because of
  exactly that change.

## Use during automation (per new screen)

`automation-script-generator` invokes this skill whenever a case touches a screen that has no `pages/<slug>.md` yet: explore that screen's live UI first, write the page file, then build the page object from the recorded locators. Do not hand-guess locators.

**Drift rule:** whenever you explore a new screen as part of implementing a test case, you pass through
already-documented screens on the way. If any of them has changed on the live site, fix the `pages/*.md`
file *and* the corresponding page object locators in the same pass, then re-run the specs that use that
page object.

## After this

Once the knowledge base exists, the natural next step is usually writing or updating Playwright
tests (page objects built from the recorded Playwright locators, XPath only as fallback) and flows. Point the test-authoring work at the relevant
`pages/*.md` and `flows/*.md` files instead of re-opening the browser to rediscover the same
structure, unless something in those files is flagged stale.
