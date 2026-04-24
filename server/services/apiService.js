const axios = require('axios');
const logger = require('../utils/logger');

const BASE_URL = process.env.BASE_URL || 'https://www.sankavollerei.com';
const TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT) || 10000;

// Axios instance with default config
const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
  },
});

/**
 * Generic fetch wrapper with error handling
 * @param {string} path - API path
 * @param {object} params - Query parameters
 * @returns {Promise<object>}
 */
const fetchData = async (path, params = {}) => {
  try {
    logger.info(`Fetching: ${BASE_URL}${path} | params: ${JSON.stringify(params)}`);

    const response = await httpClient.get(path, { params });

    logger.info(`Response [${response.status}]: ${path}`);

    // Upstream returns { status, data, ... } — extract .data so our wrapper
    // returns { status: true, data: <actual_payload> } without double-nesting
    const body = response.data;
    if (body && typeof body === 'object' && 'data' in body) {
      // If upstream signals an error via status field, throw it
      if (body.status && body.status !== 'success' && body.status !== true) {
        throw { status: 400, message: body.message || 'Upstream returned an error' };
      }
      return body.data;
    }
    return body;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logger.error(`Timeout on: ${path}`);
      throw { status: 504, message: 'Request timeout. The upstream API took too long to respond.' };
    }

    if (error.response) {
      logger.error(`Upstream error [${error.response.status}]: ${path}`);
      throw {
        status: error.response.status,
        message: `Upstream API returned status ${error.response.status}`,
        data: error.response.data || null,
      };
    }

    if (error.request) {
      logger.error(`No response received from upstream: ${path}`);
      throw { status: 503, message: 'Upstream API is unreachable or down.' };
    }

    logger.error(`Request setup error: ${error.message}`);
    throw { status: 500, message: error.message || 'Unexpected error occurred.' };
  }
};

// ─── Service Methods ──────────────────────────────────────────────────────────

const getHome = async () => {
  return fetchData('/anime/samehadaku/home');
};

const getRecent = async (page = 1) => {
  return fetchData('/anime/samehadaku/recent', { page });
};

const searchAnime = async (query, page = 1) => {
  return fetchData('/anime/samehadaku/search', { q: query, page });
};

const getOngoing = async (page = 1) => {
  return fetchData('/anime/samehadaku/ongoing', { page });
};

const getCompleted = async (page = 1, order = 'latest') => {
  return fetchData('/anime/samehadaku/completed', { page, order });
};

const getPopular = async (page = 1) => {
  return fetchData('/anime/samehadaku/popular', { page });
};

const getMovies = async (page = 1) => {
  return fetchData('/anime/samehadaku/movies', { page });
};

const getList = async () => {
  return fetchData('/anime/samehadaku/list');
};

const getSchedule = async () => {
  return fetchData('/anime/samehadaku/schedule');
};

const getGenres = async () => {
  return fetchData('/anime/samehadaku/genres');
};

const getGenreDetail = async (genre, page = 1) => {
  return fetchData(`/anime/samehadaku/genres/${genre}`, { page });
};

const getBatch = async (page = 1) => {
  return fetchData('/anime/samehadaku/batch', { page });
};

const getAnimeDetail = async (slug) => {
  return fetchData(`/anime/samehadaku/anime/${slug}`);
};

const getEpisodeDetail = async (slug) => {
  return fetchData(`/anime/samehadaku/episode/${slug}`);
};

const getBatchDetail = async (slug) => {
  return fetchData(`/anime/samehadaku/batch/${slug}`);
};

const getServer = async (serverId) => {
  return fetchData(`/anime/samehadaku/server/${serverId}`);
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

