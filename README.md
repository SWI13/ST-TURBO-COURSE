# Turbo Academy — Landing Page

Static landing page (Arabic, RTL) for a turbo/car-mechanics course business, with a
signup form that writes directly into a Google Sheet.

## Files

- `index.html` — the page
- `assets/style.css`, `assets/script.js` — styling and form logic
- `apps-script/Code.gs` — code to paste into Google Apps Script (the backend)

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
