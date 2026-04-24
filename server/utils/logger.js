/**
 * Simple logger utility
 */

const getTimestamp = () => new Date().toISOString();

const logger = {
  info: (message) => {
    console.log(`[INFO] [${getTimestamp()}] ${message}`);
  },

  warn: (message) => {
    console.warn(`[WARN] [${getTimestamp()}] ${message}`);
  },

  error: (message) => {
    console.error(`[ERROR] [${getTimestamp()}] ${message}`);
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] [${getTimestamp()}] ${message}`);
    }
  },
};

module.exports = logger;
