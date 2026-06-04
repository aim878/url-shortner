require('dotenv').config();

const express = require('express');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// In-memory store (replace with DB for production)
const urlStore = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── API: Shorten URL ────────────────────────────────────────────────────────
app.post('/api/shorten', (req, res) => {
  const { url, customAlias } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Validate and sanitize custom alias
  if (customAlias) {
    const trimmed = customAlias.trim();

    if (trimmed.length === 0) {
      return res.status(400).json({ error: 'Alias cannot be empty' });
    }
    if (trimmed.length > 30) {
      return res.status(400).json({ error: 'Alias too long (max 30 characters)' });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return res.status(400).json({ error: 'Alias can only contain letters, numbers, - and _' });
    }
  }

  const shortId = customAlias?.trim() || nanoid(6);

  // Check alias collision
  if (customAlias && urlStore.has(shortId)) {
    return res.status(409).json({ error: 'Custom alias already taken' });
  }

  urlStore.set(shortId, {
    originalUrl: url,
    shortId,
    clicks: 0,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({
    shortUrl: `${BASE_URL}/${shortId}`,
    shortId,
    originalUrl: url,
  });
});

// ─── API: Get All URLs ───────────────────────────────────────────────────────
app.get('/api/urls', (req, res) => {
  const urls = Array.from(urlStore.values()).reverse();
  res.json(urls);
});

// ─── API: Get Stats for a Short URL ─────────────────────────────────────────
app.get('/api/stats/:shortId', (req, res) => {
  const entry = urlStore.get(req.params.shortId);
  if (!entry) return res.status(404).json({ error: 'Short URL not found' });
  res.json(entry);
});

// ─── API: Delete a Short URL ─────────────────────────────────────────────────
app.delete('/api/urls/:shortId', (req, res) => {
  const { shortId } = req.params;
  if (!urlStore.has(shortId)) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  urlStore.delete(shortId);
  res.json({ message: 'Deleted successfully' });
});

// ─── Redirect ────────────────────────────────────────────────────────────────
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;

  // Guard: never intercept API-like paths
  if (shortId.startsWith('api')) {
    return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
  }

  const entry = urlStore.get(shortId);
  if (!entry) return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));

  entry.clicks++;
  res.redirect(301, entry.originalUrl);
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ URL Shortener running at ${BASE_URL}`);
});
