# Worked example: exploring a site for UAT context

This walks through recon on a small marketing site with a contact form, to show what gets recorded
and what doesn't. Adapt the depth to the actual site — a large app needs scoping (see SKILL.md
step 1), not blanket exploration of every page.

## 1. Open and look at the homepage

```bash
playwright-cli open https://example.com
playwright-cli snapshot
```

From the snapshot, note the primary navigation once — header/footer links — since it's shared
across pages and doesn't need re-deriving per page:

```
- Home: /
- Products: /products
- Contact: /contact
```

This goes straight into `index.md`'s page table, not into a separate "navigation" file — a full
site's nav is small enough to live as one line per page in the table itself.

## 2. Visit a page in scope, e.g. Contact

```bash
playwright-cli goto https://example.com/contact
playwright-cli snapshot
```

Say the snapshot shows a form with a name field, email field, message textarea, and a submit
button, refs `e3`–`e6`. Get durable locators before writing anything down:

```bash
playwright-cli generate-locator e3 --raw
# → getByLabel('Name')
playwright-cli generate-locator e4 --raw
# → getByLabel('Email')
playwright-cli generate-locator e6 --raw
# → getByRole('button', { name: 'Send message' })
```

Then build and verify an XPath for each (kept as a Playwright fallback), e.g.
`//input[@name='email']` for the email field and `//button[normalize-space()='Send message']` for
the submit button. Record both locators side by side in the page file.

Try submitting with an invalid email to see validation behavior, since that's exactly what a test
will need to assert on:

```bash
playwright-cli fill e4 "not-an-email"
playwright-cli click e6
playwright-cli snapshot
```

If the snapshot now shows a "Please enter a valid email" message near the field, that's a Notable
state worth recording in `pages/contact.md` — it's the kind of thing a test author would otherwise
have to rediscover by trial and error.

## 3. What not to bother recording

- Don't screenshot the contact page just to show what it looks like — the locators and validation
  behavior are what matters for automation, and a screenshot goes stale the moment the CSS changes.
- Don't dump the full accessibility snapshot into the page file. Pull out only the elements and
  forms relevant to interaction; a full snapshot is a wall of text that's expensive to re-read later
  and duplicates what `playwright-cli snapshot` can regenerate on demand anyway.
- Don't re-derive the same primary nav on every single page file — it belongs once, in `index.md`.

## 4. Write the files

- `uat-context/example-com/index.md` — site summary + table linking `pages/home.md`,
  `pages/products.md`, `pages/contact.md`.
- `uat-context/example-com/pages/contact.md` — form fields with Playwright locators and XPath, the
  email-validation notable state.
- No flow file needed here unless "submit a contact request" is itself a multi-page journey worth
  naming — a single-page form usually doesn't need one.
