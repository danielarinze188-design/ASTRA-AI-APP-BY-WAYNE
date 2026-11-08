# Astra – AI business assistant (Gemini + Render)

Express server serving the app (`public/`) and the API (`api/`). Google or name/password login, document answers, memory, reminders, morning briefing and push notifications.

## Deploy on Render (about 10 minutes)
1. **Upstash (free database):** sign up at upstash.com → Create Database (Redis, free). On its page copy the **REST URL** and **REST Token**.
2. **GitHub:** upload this folder to a new GitHub repo (don't upload `astra-secrets.txt`).
3. **Render:** sign up at render.com → New → **Blueprint** → pick the repo. Render reads `render.yaml` and asks for the values below.
   - `GEMINI_API_KEY` – from aistudio.google.com/apikey
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` – from step 1
   - `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `CRON_SECRET` – from `astra-secrets.txt` (set the subject to `mailto:your@email`)
   - `GOOGLE_CLIENT_ID` – see below (leave blank to hide the Google button for now)
   - `AUTH_SECRET` is generated for you.
4. Click deploy. Your app is at `https://astra-xxxx.onrender.com`.

Optional variables (add later in Render → Environment): `GEMINI_MODEL`, `UPGRADE_URL`, `RAG_MIN_SCORE`, `EMBED_MODEL`.

## Google login
Google Cloud Console → APIs & Services → Credentials → OAuth client ID → Web application. Add your Render URL under **Authorized JavaScript origins**. Put the Client ID in `GOOGLE_CLIENT_ID` (Render → Environment) and save; Render redeploys.

## Keep it awake + reminders (important on the free plan)
Free Render services sleep after 15 minutes without visits (the next visit then takes ~50 seconds). Reminders and briefing pushes also need something to call the server every minute.
Create a free job at **cron-job.org**: URL `https://YOUR-APP.onrender.com/api/cron?key=YOUR_CRON_SECRET`, schedule every minute. This does both jobs at once.

## Android APK
Open pwabuilder.com, paste your Render URL, Package for Stores → Android. Turn on **notification delegation**, download, install the `.apk`. Keep the signing key.

## Features
- Business-assistant persona, onboarding, memory you can view and delete (Settings → Memory & data)
- Upload PDF/DOCX/TXT/MD/CSV/JSON/images; answers show source files; web answers show links
- Morning briefing, reminders, "how did it go?" follow-ups
- No ads

## Files
`server.js` (web server) · `public/` (app, service worker, icons) · `api/` (auth, chat, docs, memory, briefing, push, cron) · `render.yaml`
