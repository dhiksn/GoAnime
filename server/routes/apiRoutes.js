const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiController');
const auth = require('../controllers/authController');
const user = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware');

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/register', auth.register);
router.post('/auth/login',    auth.login);
router.post('/auth/logout',   auth.logout);
router.get('/auth/me',        auth.me);

// ─── User — Watch History (butuh login) ──────────────────────────────────────
router.get   ('/user/history',         requireAuth, user.getHistory);
router.get   ('/user/history/:slug',   requireAuth, user.getHistoryBySlug);
router.post  ('/user/history',         requireAuth, user.upsertHistory);
router.delete('/user/history',         requireAuth, user.clearHistory);
router.delete('/user/history/:slug',   requireAuth, user.deleteHistory);

// ─── User — Favorites (butuh login) ──────────────────────────────────────────
router.get   ('/user/favorites',             requireAuth, user.getFavorites);
router.post  ('/user/favorites',             requireAuth, user.addFavorite);
router.delete('/user/favorites',             requireAuth, user.clearFavorites);
router.delete('/user/favorites/:slug',       requireAuth, user.deleteFavorite);
router.get   ('/user/favorites/check/:slug', requireAuth, user.checkFavorite);

// ─── List & Browse ────────────────────────────────────────────────────────────

// GET /api/home
router.get('/home', controller.getHome);

// GET /api/recent?page=
router.get('/recent', controller.getRecent);

// GET /api/search?q=&page=
router.get('/search', controller.searchAnime);

// GET /api/ongoing?page=
router.get('/ongoing', controller.getOngoing);

// GET /api/completed?page=&order=
router.get('/completed', controller.getCompleted);

// GET /api/popular?page=
router.get('/popular', controller.getPopular);

// GET /api/movies?page=
router.get('/movies', controller.getMovies);

// GET /api/list
router.get('/list', controller.getList);

// GET /api/schedule
router.get('/schedule', controller.getSchedule);

// ─── Genres ───────────────────────────────────────────────────────────────────

// GET /api/genres
router.get('/genres', controller.getGenres);

// GET /api/genre/:genre?page=
router.get('/genre/:genre', controller.getGenreDetail);

// ─── Batch ────────────────────────────────────────────────────────────────────

// GET /api/batch?page=  (must be before /batch/:slug)
router.get('/batch', controller.getBatch);

// GET /api/batch/:slug
router.get('/batch/:slug', controller.getBatchDetail);

// ─── Detail Pages ─────────────────────────────────────────────────────────────

// GET /api/anime/:slug
router.get('/anime/:slug', controller.getAnimeDetail);

// GET /api/episode/:slug
router.get('/episode/:slug', controller.getEpisodeDetail);

// GET /api/server/:id
router.get('/server/:id', controller.getServer);

module.exports = router;
