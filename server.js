// Mero Nakshatra — minimal backend
//
// What this does:
//   - Serves your mero-nakshatra.html file (and any other static files in this folder)
//   - Proxies calls to NASA's Astronomy Picture of the Day API, so your real NASA_API_KEY
//     stays on the server and is never visible in the page source, dev tools, or network tab.
//
// Everything else in the app (Wikipedia "On This Day", Open-Meteo weather, Frankfurter
// exchange rates, REST Countries) is a free, keyless public API and is called directly
// from the browser as before — no proxying needed for those.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(__dirname)); // serves mero-nakshatra.html, etc. from this same folder

// --- NASA APOD proxy ---
// Frontend calls:  GET /api/apod?date=YYYY-MM-DD
// This server adds the secret key and forwards to NASA.
app.get('/api/apod', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Missing required "date" query parameter (YYYY-MM-DD).' });
  }

  const key = process.env.NASA_API_KEY || 'DEMO_KEY';

  try {
    const nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(key)}&date=${encodeURIComponent(date)}`;
    const nasaRes = await fetch(nasaUrl);
    const data = await nasaRes.json();
    res.status(nasaRes.status).json(data);
  } catch (err) {
    console.error('NASA APOD proxy error:', err.message);
    res.status(502).json({ error: 'Could not reach NASA APOD API from the server.' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  const usingRealKey = !!process.env.NASA_API_KEY;
  console.log(`\nMero Nakshatra server running.`);
  console.log(`  → Open: http://localhost:${PORT}/mero-nakshatra.html`);
  console.log(`  → NASA key: ${usingRealKey ? 'using your personal key from .env' : 'no key set — falling back to public DEMO_KEY (lower rate limit)'}\n`);
});
