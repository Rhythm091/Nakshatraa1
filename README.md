# Mero Nakshatra — with backend

This folder is a complete, ready-to-run bundle: the frontend (`mero-nakshatra.html`)
plus a tiny backend (`server.js`) that keeps your NASA API key private.

## Run it

```bash
npm install
npm start
```

Then open:

```
http://localhost:5000/mero-nakshatra.html
```

That's it. Your NASA key in `.env` is only ever read by the server — it's never sent
to the browser or visible in the page source.

## What the server actually does

Only one thing: `GET /api/apod?date=YYYY-MM-DD` → adds your NASA key → forwards to
NASA's Astronomy Picture of the Day API → returns the result.

Every other panel (Wikipedia "On This Day," Open-Meteo weather, Frankfurter exchange
rates, REST Countries) calls a free, keyless public API directly from the browser,
exactly as before — there was never anything to hide for those.

## Files

| File | Purpose |
|---|---|
| `server.js` | The proxy + static file server |
| `.gitignore` | Already excludes `.env` and `node_modules/` |
| `package.json` | Dependencies: `express`, `cors`, `dotenv` |
| `mero-nakshatra.html` | The app itself |

## If you deploy this publicly

Set `NASA_API_KEY` as an environment variable on whatever host you use (Render,
Railway, Fly.io, a VPS, etc.) instead of shipping the `.env` file — most hosts have
a dashboard field for this. The code doesn't change either way.

## Standalone fallback

If you ever open `mero-nakshatra.html` directly as a file (no server running), the
Space Snapshot panel automatically falls back to NASA's public, keyless `DEMO_KEY`.
It'll work, just with a lower shared rate limit — no crash, no blank panel.
