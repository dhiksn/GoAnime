const apiService = require('../services/apiService');
const logger = require('../utils/logger');

/**
 * Sends a standardized success response
 */
const sendSuccess = (res, data, message = 'Success') => {
  res.json({
    status: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response
 */
const sendError = (res, error) => {
  const statusCode = error.status || 500;
  const message = error.message || 'An unexpected error occurred';

  logger.error(`Controller error [${statusCode}]: ${message}`);

  res.status(statusCode).json({
    status: false,
    message,
    data: error.data || null,
  });
};

/**
 * Validates that a slug/id is a non-empty string
 */
const isValidSlug = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Parses and validates a page number
 * Returns the page number or 1 as default
 */
const parsePage = (value) => {
  const page = parseInt(value);
  return isNaN(page) || page < 1 ? 1 : page;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

const getHome = async (req, res) => {
  try {
    const data = await apiService.getHome();
    sendSuccess(res, data, 'Home data fetched successfully');
  } catch (error) {
    sendError(res, error);
  }
};

const getRecent = async (req, res) => {
  try {
    const page = parsePage(req.query.page);
    const data = await apiService.getRecent(page);
    sendSuccess(res, data, `Recent anime - page ${page}`);
  } catch (error) {
    sendError(res, error);
  }
};

const searchAnime = async (req, res) => {
  try {
    const { q, page } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        status: false,
        message: "Query parameter 'q' is required and cannot be empty",
        data: null,
      });
    }

    const parsedPage = parsePage(page);
    const data = await apiService.searchAnime(q.trim(), parsedPage);
    sendSuccess(res, data, `Search results for '${q}' - page ${parsedPage}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getOngoing = async (req, res) => {
  try {
    const page = parsePage(req.query.page);
    const data = await apiService.getOngoing(page);
    sendSuccess(res, data, `Ongoing anime - page ${page}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getCompleted = async (req, res) => {
  try {
    const page = parsePage(req.query.page);
    const validOrders = ['latest', 'oldest', 'title', 'rating'];
    const order = validOrders.includes(req.query.order) ? req.query.order : 'latest';

    const data = await apiService.getCompleted(page, order);
    sendSuccess(res, data, `Completed anime - page ${page}, order: ${order}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getPopular = async (req, res) => {
  try {
    const page = parsePage(req.query.page);
    const data = await apiService.getPopular(page);
    sendSuccess(res, data, `Popular anime - page ${page}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getMovies = async (req, res) => {
  try {
    const page = parsePage(req.query.page);
    const data = await apiService.getMovies(page);
    sendSuccess(res, data, `Movies - page ${page}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getList = async (req, res) => {
  try {
    const data = await apiService.getList();
    sendSuccess(res, data, 'Anime list fetched successfully');
  } catch (error) {
    sendError(res, error);
  }
};

const getSchedule = async (req, res) => {
  try {
    const data = await apiService.getSchedule();
    sendSuccess(res, data, 'Schedule fetched successfully');
  } catch (error) {
    sendError(res, error);
  }
};

const getGenres = async (req, res) => {
  try {
    const data = await apiService.getGenres();
    sendSuccess(res, data, 'Genres fetched successfully');
  } catch (error) {
    sendError(res, error);
  }
};

const getGenreDetail = async (req, res) => {
  try {
    const { genre } = req.params;

    if (!isValidSlug(genre)) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'genre' is required and must be a valid string",
        data: null,
      });
    }

    const page = parsePage(req.query.page);
    const data = await apiService.getGenreDetail(genre.trim(), page);
    sendSuccess(res, data, `Genre '${genre}' - page ${page}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getBatch = async (req, res) => {
  try {
    const page = parsePage(req.query.page);
    const data = await apiService.getBatch(page);
    sendSuccess(res, data, `Batch list - page ${page}`);
  } catch (error) {
    sendError(res, error);
  }
};

const getAnimeDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!isValidSlug(slug)) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'slug' is required and must be a valid string",
        data: null,
      });
    }

    const data = await apiService.getAnimeDetail(slug.trim());
    sendSuccess(res, data, `Anime detail for '${slug}'`);
  } catch (error) {
    sendError(res, error);
  }
};

const getEpisodeDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!isValidSlug(slug)) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'slug' is required and must be a valid string",
        data: null,
      });
    }

    const data = await apiService.getEpisodeDetail(slug.trim());
    sendSuccess(res, data, `Episode detail for '${slug}'`);
  } catch (error) {
    sendError(res, error);
  }
};

const getBatchDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!isValidSlug(slug)) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'slug' is required and must be a valid string",
        data: null,
      });
    }

    const data = await apiService.getBatchDetail(slug.trim());
    sendSuccess(res, data, `Batch detail for '${slug}'`);
  } catch (error) {
    sendError(res, error);
  }
};

const getServer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidSlug(id)) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'id' is required and must be a valid string",
        data: null,
      });
    }

    const data = await apiService.getServer(id.trim());
    sendSuccess(res, data, `Server data for id '${id}'`);
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  getHome,
  getRecent,
  searchAnime,
  getOngoing,
  getCompleted,
  getPopular,
  getMovies,
  getList,
  getSchedule,
  getGenres,
  getGenreDetail,
  getBatch,
  getAnimeDetail,
  getEpisodeDetail,
  getBatchDetail,
  getServer,
};

