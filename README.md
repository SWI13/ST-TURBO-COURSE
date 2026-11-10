# SM Courses — Landing Pages

Static site (Arabic, RTL) for SM's training courses, with signup forms that write
directly into a Google Sheet. `index.html` is a course-selection hub; each course
has its own full landing page.

## Files

- `index.html` — course hub: renders course cards from `assets/courses.js`
- `turbo.html` — Turbo (mechanics) course page
- `assets/site.css` / `assets/site.js` — design system and header/hero motion shared by `index.html` and `turbo.html`
- `electricity.html` — Scanner and car electricity course page (سكانار وكهرباء السيارات);
  its diagrams are inline SVG, and its ad settings live in `assets/elec.js`
- `detailing.html` — Detailing course page (neon theme)
- `assets/style.css` — shared design tokens and components (buttons, cards, forms,
  accordion, course cards) used by every page
- `assets/detailing.css` — Detailing-only theme: overrides the shared color tokens
  and adds glass/glow effects, loaded in addition to `style.css`
- `assets/courses.js` — the `COURSES` array driving the hub's course cards; add a
  course here (plus its own `<course>.html` page) to list a new one
- `assets/ads.js` — Turbo ad landing settings (date, Meta Pixel, headline variants)
- `assets/script.js` — shared behavior (nav, reveal-on-scroll, counters, FAQ/
  accordion, signup form) used by all pages
- `apps-script/Code.gs` — code to paste into Google Apps Script (the backend) —
  shared by every course's signup form; each form sends its own `course` value
  into the same sheet

## Adding a new course

1. Duplicate `turbo.html` or `detailing.html` as a starting point for the new
   course page, and give its signup form's hidden `course` input a distinct value.
2. Add an entry to the `COURSES` array in `assets/courses.js` (name, description,
   `href` to the new page, meta labels, and a 4:5 image with its srcset and alt text).
3. No other changes are needed — the hub's card grid is rendered from that array.

## Running ads to the Turbo page

Settings live at the top of `assets/ads.js`:

- `nextSession`: the next session date, shown everywhere the page says "الدورة القادمة".
- `metaPixelId`: paste the Meta Pixel ID to send PageView, and Lead once a signup is saved.
- `variants`: hero headlines that match each ad. Link the ad to `turbo.html?v=hotel`,
  `?v=cert` or `?v=beginner`; with no `v` the default headline shows.

Add `utm_source`, `utm_campaign` and `utm_content` to the ad link: they are written into the
"ملاحظات" column, so each signup shows which ad brought it. Visitors from an ad (utm or fbclid)
see a header without exit links.

## One-time setup: connect the form to a Google Sheet (~5 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
   Name it e.g. "Turbo Academy — Signups".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete any placeholder code in the editor, then paste the contents of
   `apps-script/Code.gs` from this project.
4. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Description: anything, e.g. "Turbo form handler".
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy**.
5. Google will ask you to authorize the script (it's your own script accessing
   your own sheet) — approve it.
6. Copy the **Web app URL** it gives you (ends in `/exec`).
7. Open `assets/script.js` in this project and replace:
   ```js
   const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   with your copied URL.
8. Open `index.html` in a browser and submit the form once to test. A new row
   should appear in the Google Sheet within a couple of seconds.

**Note:** every time you change the Apps Script code, you must create a
**new deployment** (or use "Manage deployments → Edit → New version") for the
change to take effect on the live URL.

## Running locally

Just open `index.html` in a browser — no build step or server required.
To publish it, host the folder anywhere that serves static files (GitHub Pages,
Netlify, a plain web host, etc.).
