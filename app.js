require('dotenv').config();

const express = require('express');
const path    = require('path');
const apiRoutes = require('./server/routes/apiRoutes');
const logger    = require('./server/utils/logger');

const app  = express();
const PORT = process.env.PORT || 3000;

const IS_NETLIFY = process.env.NETLIFY === 'true';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

// API routes — selalu aktif di local maupun Netlify
app.use('/api', apiRoutes);

// ── Page routes & static — hanya dipakai saat local ─────────
if (!IS_NETLIFY) {
  const fs  = require('fs');
  const PUB = path.join(process.cwd(), 'public');

  app.use(express.static(PUB));

  const send = (file) => (req, res) => res.sendFile(path.join(PUB, file));

  app.get('/',             send('index.html'));
  app.get('/recent',       send('recent.html'));
  app.get('/search',       send('search.html'));
  app.get('/ongoing',      send('ongoing.html'));
  app.get('/completed',    send('completed.html'));
  app.get('/popular',      send('popular.html'));
  app.get('/movies',       send('movies.html'));
  app.get('/schedule',     send('schedule.html'));
  app.get('/genres',       send('genres.html'));
  app.get('/genres/:slug', send('genre.html'));
  app.get('/genre',        send('genre.html'));
  app.get('/batch',        send('batch.html'));
  app.get('/batch/:slug',  send('batch-detail.html'));
  app.get('/anime',        send('anime.html'));
  app.get('/anime/:slug',  send('anime.html'));
  app.get('/episode',      send('episode.html'));
  app.get('/episode/:slug', send('episode.html'));
  app.get('/daftar-anime', send('list.html'));
  app.get('/list',         send('list.html'));

  app.get('/login',    send('login.html'));
  app.get('/register', send('register.html'));
  app.get('/profile',  send('profile.html'));
  app.get('/profile/history',             send('profile/history.html'));
  app.get('/profile/favorites',           send('profile/favorites.html'));
  app.get('/profile/settings',            send('profile/settings.html'));
  app.get('/profile/change-password',     send('profile/change-password.html'));

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ status: false, message: `Endpoint '${req.originalUrl}' not found` });
    }
    res.status(404).sendFile(path.join(PUB, '404.html'));
  });
}

// ── 404 untuk API (berlaku di semua env) ─────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ status: false, message: `Endpoint '${req.originalUrl}' not found` });
  }
  next();
});

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
});

// Lokal saja
if (!IS_NETLIFY) {
  app.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
