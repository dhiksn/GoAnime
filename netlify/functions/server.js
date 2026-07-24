const serverless = require('serverless-http');
const app = require('../../app');

// serverless-http wraps the Express app.
// The basePath option strips the Netlify function prefix
// (/.netlify/functions/server) so Express sees clean paths like /api/...
module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions/server',
});
