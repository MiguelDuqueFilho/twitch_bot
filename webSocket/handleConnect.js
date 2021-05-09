require('dotenv').config();
const logger = require('../logger');

function webSocketCreateServer(request, response) {
  logger.debug('Received request for ' + request.url);
  response.writeHead(404);
  response.end();
}

function webSocketConnect() {
  logger.debug(`Server is listening on port ${process.env.WEBSOCKET_PORT}`);
}

module.exports = {
  webSocketCreateServer,
  webSocketConnect,
};
