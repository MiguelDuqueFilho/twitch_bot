const logger = require('../logger');
const { sendMessage } = require('../webSocket/handleRequest');

const infoTwitch = {
  statusConnect: false,
};

function onConnectTtv(addr, port) {
  logger.info(`twitch.tv connected to ${addr}:${port}`);
  infoTwitch.statusConnect = true;
  // const message = {
  //   type: 'message',
  //   data: 'initbot',
  // };
  // logger.debug(
  //   () + 'onConnectTtv sendUTF  = ' + JSON.stringify(message)
  // );
  // sendMessage(JSON.stringify(message));
}

function onDisconnectedHandler(reason) {
  logger.info(`twitch.tv disconnected, reason: ${reason}`);
  infoTwitch.statusConnect = false;
}

function onConnectingHandler(address, port) {
  `twitch.tv connecting address=${address}, port=${port}`;
}

function onPingHandler(channel, username, self) {
  logger.debug(`ping...`);
}

function onPongHandler(channel, username, self) {
  logger.debug(`pong...`);
}

module.exports = {
  infoTwitch,
  onConnectTtv,
  onDisconnectedHandler,
  onConnectingHandler,
  onPingHandler,
  onPongHandler,
};
