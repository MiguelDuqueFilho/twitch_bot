const logger = require('../logger');
const { sendMessage, infoTwitch } = require('../webSocket/handleRequest');

function onConnectTtv(addr, port) {
  logger.info(`twitch.tv connected to ${addr}:${port}`);
  infoTwitch.statusConnect = true;
  const message = {
    type: 'message',
    data: 'initbot',
  };
  logger.debug('onConnectTtv send message ---------------- ');
  logger.debug(message);
  sendMessage(JSON.stringify(message));
}

function onDisconnectedHandler(reason) {
  logger.info(`twitch.tv disconnected, reason: ${reason}`);
  infoTwitch.statusConnect = false;
  const message = {
    type: 'message',
    data: 'termbot',
  };
  logger.debug('onDisconnectedHandler send message ---------------- ');
  logger.debug(message);
  sendMessage(JSON.stringify(message));
}

function onConnectingHandler(address, port) {
  `twitch.tv connecting address=${address}, port=${port}`;
  infoTwitch.statusConnect = true;
}

function onPingHandler(channel, username, self) {
  logger.debug(`ping...`);
}

function onPongHandler(channel, username, self) {
  logger.debug(`pong...`);
}

module.exports = {
  onConnectTtv,
  onDisconnectedHandler,
  onConnectingHandler,
  onPingHandler,
  onPongHandler,
};
