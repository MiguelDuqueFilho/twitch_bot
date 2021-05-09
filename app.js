require('dotenv').config();

const { handleRequest } = require('./webSocket/handleRequest');
const {
  webSocketCreateServer,
  webSocketConnect,
} = require('./webSocket/handleConnect');

const onMessageTtv = require('./twitch/onMessageTtv');
const {
  infoTwitch,
  onConnectTtv,
  onDisconnectedHandler,
  onConnectingHandler,
  onPingHandler,
  onPongHandler,
} = require('./twitch/onConnectTtv');

const {
  onJoinHandle,
  onPartHandle,
  onSubscriptionHandle,
  onTimeoutHandle,
} = require('./twitch/onEventsTtv');

const webSocketsServerPort = process.env.WEBSOCKET_PORT;
const webSocketServer = require('websocket').server;
const http = require('http');

const client = require('./twitch/client');
client.on('message', onMessageTtv);
client.on('connected', onConnectTtv);
client.on('connecting', onConnectingHandler);
client.on('disconnected', onDisconnectedHandler);
client.on('ping', onPingHandler);
client.on('pong', onPongHandler);

client.on('join', onJoinHandle);
client.on('part', onPartHandle);
client.on('subscription', onSubscriptionHandle);
client.on('timeout', onTimeoutHandle);

const server = http.createServer(webSocketCreateServer);
server.listen(webSocketsServerPort, webSocketConnect);

const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

wsServer.on('request', handleRequest);
