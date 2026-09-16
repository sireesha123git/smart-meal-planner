# Family Table

Shared, Telugu-first meal planning for a household master and cook. One codebase powers the website and Android app.

## What works

- Master creates a household, gets a six-digit invite code, chooses each meal, filters groceries for today/tomorrow/week, replans a week and reviews service history.
- Cook joins with the household code and Cook PIN, sees the next task with time, recipients, ingredients and prep, receives local reminders, reviews tomorrow's prep, records service, undoes mistakes and reports problems.
- Menus avoid same-week repeats, preserve started/served meals, include a dry vegetable and Rasam/Kattu at lunch, and calculate groceries from confirmed meals.
- Every recipe includes two trusted YouTube source searches (Hebbars Kitchen and HomeCookingShow).
- Telugu, English and Hindi UI; local cached plan; Android local reminders; synchronized data across separate phones.

## Local development

```bash
npm install
npm run build
npm test
npm start
```

Open `http://localhost:4180`. Data is stored in `data/family-table.sqlite`.

## Deployment

The production site runs as a Cloudflare Worker with D1 through OpenAI Sites. Build the Android app with the same HTTPS origin in `APP_API_URL`. Set `APK_URL` to the published APK so the Master settings page displays the download QR code.

The APK must be signed with a private release keystore. The keystore and passwords must never be committed.
