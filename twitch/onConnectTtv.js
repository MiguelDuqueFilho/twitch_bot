const { sendMessage } = require('../webSocket/handleRequest');

const infoTwitch = {
  statusConnect: false,
};

function onConnectTtv(addr, port) {
  console.log(`twitch.tv connected to ${addr}:${port}`);
  infoTwitch.statusConnect = true;
  // const message = {
  //   type: 'message',
  //   data: 'initbot',
  // };
  // console.log(
  //   new Date() + 'onConnectTtv sendUTF  = ' + JSON.stringify(message)
  // );
  // sendMessage(JSON.stringify(message));
}

function onDisconnectedHandler(reason) {
  console.log(`twitch.tv disconnected, reason: ${reason}`);
  infoTwitch.statusConnect = false;
}

function onConnectingHandler(address, port) {
  `twitch.tv connecting address=${address}, port=${port}`;
}

function onPingHandler(channel, username, self) {
  console.log(`ping.. date=${new Date()}`);
}

function onPongHandler(channel, username, self) {
  console.log(`pong.. date=${new Date()}`);
}

module.exports = {
  infoTwitch,
  onConnectTtv,
  onDisconnectedHandler,
  onConnectingHandler,
  onPingHandler,
  onPongHandler,
};
