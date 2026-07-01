# Mero Nakshatra — Netlify deploy

This version is set up specifically for Netlify: a static `index.html` plus one
serverless function that keeps your NASA API key private.

## Deploy steps

1. **Set your NASA key in Netlify — not in a file.**
   In the Netlify dashboard: **Site settings → Environment variables → Add a variable**
   - Key: `NASA_API_KEY`
   - Value: your real key
   Do this *before* your first deploy so the function picks it up on build.

2. **Deploy this folder.**
   - Drag-and-drop this whole folder into Netlify's "Deploys" tab, **or**
   - Push it to a GitHub repo and connect that repo in Netlify (recommended long-term,
     since it lets you redeploy just by pushing).
   Netlify will read `netlify.toml` automatically — no build settings to configure.

3. **Open your site's root URL** (the one Netlify gives you, or your custom domain).
   `index.html` is served automatically there — that's what fixes the "Page not found."

## Why the previous attempt 404'd

Two separate things:
- The file was named `mero-nakshatra.html`, not `index.html`, so Netlify had nothing
  to serve at the root path. Fixed here — this folder's app file is `index.html`.
- Netlify only serves static files; it can't run a persistent Node/Express server
  like the earlier `server.js`. This folder replaces that with a Netlify **Function**
  (`netlify/functions/apod.js`), which is the equivalent for this kind of hosting.

## How the key stays private

The frontend calls `/api/apod?date=YYYY-MM-DD`. `netlify.toml` redirects that path to
the function, which reads `NASA_API_KEY` from Netlify's environment (server-side only)
and forwards the request to NASA. The key is never sent to the browser or visible in
your deployed site's source.

## If you don't set the environment variable

The function falls back to NASA's public `DEMO_KEY` automatically — the site still
works, just with a lower shared rate limit. Nothing breaks either way.

## Testing locally before deploying (optional)

If you have the Netlify CLI (`npm install -g netlify-cli`):

```bash
cp .env.example .env
# edit .env, put your real key in
netlify dev
```

This runs the function locally so you can test before pushing live.
