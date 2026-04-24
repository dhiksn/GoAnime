require('dotenv').config();

const express = require('express');
const apiRoutes = require('./server/routes/apiRoutes');
const logger = require('./server/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, images)
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Clean URL routes — tanpa .html
const pages = [
  'recent', 'search', 'ongoing', 'completed', 'popular',
  'movies', 'schedule', 'genres', 'genre', 'batch',
  'anime', 'episode'
];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(`${page}.html`, { root: 'public' });
  });
});

// batch-detail clean URL
app.get('/batch-detail', (req, res) => {
  res.sendFile('batch-detail.html', { root: 'public' });
});

// daftar-anime alias untuk list
app.get('/daftar-anime', (req, res) => {
  res.sendFile('list.html', { root: 'public' });
});

// Clean URL untuk genre detail: /genres/:slug
app.get('/genres/:slug', (req, res) => {
  res.sendFile('genre.html', { root: 'public' });
});

// genres clean URL
app.get('/genres', (req, res) => {
  res.sendFile('genres.html', { root: 'public' });
});

// 404 handler — serve custom 404 page
app.use((req, res) => {
  // Kalau request ke /api, return JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      status: false,
      message: `API endpoint '${req.originalUrl}' not found`,
    });
  }
  // Selain itu, serve 404.html
  res.status(404).sendFile('404.html', { root: 'public' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    status: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// Jalankan server hanya di lokal (bukan di Vercel/serverless)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

