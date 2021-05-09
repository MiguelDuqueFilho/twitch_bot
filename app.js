require('dotenv').config();
const logger = require('./logger');
const terminate = require('./terminate');

const { handleRequest } = require('./webSocket/handleRequest');
const {
  webSocketCreateServer,
  webSocketConnect,
} = require('./webSocket/handleConnect');

const {
  onConnectTtv,
  onDisconnectedHandler,
  onConnectingHandler,
  onPingHandler,
  onPongHandler,
} = require('./twitch/onConnectTtv');

const {
  onActionHandle,
  onAnongiftpaidupgradeHandle,
  onBanHandle,
  onCheerHandle,
  onMessagedeletedHandle,
  onClearchatHandle,
  onEmoteonlyHandle,
  onEmotesetsHandle,
  onFollowersonlyHandle,
  onGiftpaidupgradeHandle,
  onResubHandle,
  onRoomstateHandle,
  onHostingHandle,
  onHostedHandle,
  onPartHandle,
  onR9kbetaHandle,
  onRaidedHandle,
  onSlowmodeHandle,
  onSubscribersHandle,
  onVipsHandle,
  onWhisperHandle,
  onUnhostHandle,
  onUnmodHandle,
  onSubgiftHandle,
  onJoinHandle,

  onSubscriptionHandle,
  onTimeoutHandle,
  onModHandle,
  onModsHandle,
  onNoticeHandle,
  onMessageHandle,
} = require('./twitch/onEventsTtv');

const webSocketsServerPort = process.env.WEBSOCKET_PORT;
const webSocketServer = require('websocket').server;
const http = require('http');

const client = require('./twitch/client');

// event about connection
client.on('connected', onConnectTtv);
client.on('connecting', onConnectingHandler);
client.on('disconnected', onDisconnectedHandler);
client.on('ping', onPingHandler);
client.on('pong', onPongHandler);

// event about handel events
client.on('action', onActionHandle);
client.on('anongiftpaidupgrade', onAnongiftpaidupgradeHandle);
client.on('ban', onBanHandle);
client.on('cheer', onCheerHandle);
client.on('messagedeleted', onMessagedeletedHandle);
client.on('mod', onModHandle);
client.on('mods', onModsHandle);
client.on('clearchat', onClearchatHandle);
client.on('emoteonly', onEmoteonlyHandle);
client.on('emotesets', onEmotesetsHandle);
client.on('followersonly', onFollowersonlyHandle);
client.on('giftpaidupgrade', onGiftpaidupgradeHandle);
client.on('subgift', onSubgiftHandle);
client.on('resub', onResubHandle);
client.on('roomstate', onRoomstateHandle);
client.on('hosting', onHostingHandle);
client.on('hosted', onHostedHandle);
client.on('raided', onRaidedHandle);
client.on('part', onPartHandle);
client.on('r9kbeta', onR9kbetaHandle);
client.on('slowmode', onSlowmodeHandle);
client.on('subscribers', onSubscribersHandle);
client.on('vips', onVipsHandle);
client.on('whisper', onWhisperHandle);
client.on('unhost', onUnhostHandle);
client.on('unmod', onUnmodHandle);
client.on('join', onJoinHandle);
client.on('subscription', onSubscriptionHandle);
client.on('timeout', onTimeoutHandle);

client.on('notice', onNoticeHandle);
client.on('message', onMessageHandle);

const server = http.createServer(webSocketCreateServer);
server.listen(webSocketsServerPort, webSocketConnect);

const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

wsServer.on('request', handleRequest);

process.on('SIGINT', function () {
  logger.info('Control-C received.');
  logger.info('Server is shutting down.');
  process.exit();
});

process.on('exit', (code) => {
  logger.info(`Server close connections.`);
  terminate(server);
  logger.info(`Server is exited with code: ${code}`);
});
