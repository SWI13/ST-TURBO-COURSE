# SM ACADEMY — Website

Static site (Arabic, RTL) for SM ACADEMY's training courses in Batna, live at
https://smacademy.online/. Plain HTML, CSS and JavaScript: no build step, no dependencies.
Signup forms write directly into a Google Sheet.

## Pages

- `index.html` — home: hero, the three courses, about, why SM ACADEMY, upcoming sessions
- `courses.html` — all courses side by side (duration, level, certificate, place)
- `about.html` — the academy, its way of teaching, its location
- `turbo.html` — Turbo course page (also the landing page for Turbo ads)
- `electricity.html` — Scanner and car electricity course page (diagrams are inline SVG)
- `detailing.html` — Detailing course page (bright theme, with YR DETAILING)

## Assets

- `assets/data.js` — **the file to edit for everyday changes**: phone, WhatsApp number,
  the courses list, next session dates, Meta Pixel IDs and ad headlines
- `assets/app.css` — the whole design system: tokens, components, the three course themes
  (`data-theme="turbo" | "elec" | "detail"` on `<html>`), motion
- `assets/app.js` — behaviour: menu, scroll reveals, FAQ, course cards and session list
  (drawn from `data.js`), ad variants and tracking, the signup form
- `assets/img/` — photos (WebP) and `og/` share images
- `apps-script/Code.gs` — code pasted into Google Apps Script (the form's backend)

## Everyday changes

**Set or change the next session date.** In `assets/data.js`, on the course:

```js
session: { iso: '2026-11-21', day: '21', month: 'نوفمبر 2026', note: 'المقاعد محدودة' },
```

`iso` is what the site trusts: the day after it, every page stops showing the date and
goes back to "سجّل الآن ونتصل بك بموعد الدورة القادمة" by itself. Use `session: null`
when there is no date yet.

**Add a course.**

1. Copy an entry in the `courses` array of `assets/data.js`; give it a new `id`, `href`,
   texts, `specs` and a 4:5 image.
2. Duplicate the closest course page, set `<html data-course="the-new-id">`, and give the
   form's hidden `course` input its own value (that is the name written in the sheet).
3. Add the page to the header and footer links of each page, and to `sitemap.xml`.

The home page cards, the courses page and the sessions list pick the new course up from
the array.

## Running ads to a course page

Settings live on the course in `assets/data.js`:

- `metaPixelId`: paste the Meta Pixel ID to send PageView, and Lead once a signup is saved.
- `variants`: hero headlines that match each ad. Link the ad to `turbo.html?v=hotel`,
  `?v=cert` or `?v=beginner` (electricity: `?v=beginner`, `?v=diag`, `?v=ecu`); with no `v`
  the default headline shows.

Add `utm_source`, `utm_campaign` and `utm_content` to the ad link: they are written into the
"ملاحظات" column, so each signup shows which ad brought it. Visitors from an ad (utm or
fbclid) see a header without exit links.

## The signup form and the Google Sheet

Every course page posts to the same Apps Script web app (`formUrl` in `assets/data.js`);
each form sends its own `course` value. To connect a new sheet:

1. Create a spreadsheet at [sheets.google.com](https://sheets.google.com), then open
   **Extensions → Apps Script**.
2. Replace the placeholder code with the contents of `apps-script/Code.gs`.
3. **Deploy → New deployment**, type **Web app**, execute as **Me**, access **Anyone**.
4. Approve the authorization, copy the web app URL (it ends in `/exec`) and paste it as
   `formUrl` in `assets/data.js`.
5. Submit a form once to test: a new row should appear within a couple of seconds.

Every time the Apps Script code changes, create a **new deployment** (or "Manage
deployments → Edit → New version") for the change to reach the live URL.

## Running locally and publishing

Open `index.html` in a browser. To publish, push to `main`: Vercel deploys it.
