const { sendMessage, twitchSrvUsers } = require('../webSocket/handleRequest');

function onJoinHandle(channel, username, self) {
  console.log(
    `This is a Join.. channel=${channel}, username=${username}, self=${self} `
  );
  // if (self) return;

  const isBot = username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
  if (isBot) return;

  let joinUser = {
    [username]: {
      username,
      'display-name': username,
      badges: {},
      color: '#FFFFFF',
      emotes: {},
      mod: false,
      'room-id': '',
      subscriber: false,
      turbo: false,
      'user-id': '',
      'user-type': '',
      'emotes-raw': '',
      'badges-raw': '',
      'message-type': '',
    },
  };
  console.log(`antes merge conteudo ${JSON.stringify(joinUser[username])}`);
  joinUser[username] = {
    ...joinUser[username],
    ...twitchSrvUsers.getContent(username),
  };
  console.log(`apos merge conteudo ${JSON.stringify(joinUser[username])}`);

  twitchSrvUsers.merge(joinUser);
  const msgClients = { type: 'clients', data: twitchSrvUsers.get() };
  sendMessage(JSON.stringify(msgClients));
}

function onPartHandle(channel, username, self) {
  console.log(
    `This is a part.. channel=${channel}, username=${username}, self=${self} `
  );
}

function onSubscriptionHandle(channel, username, method, message, userstate) {
  console.log(
    `This is a subscription.. channel=${channel}, username=${username}, method=${method}, message=${message}, userstate=${userstate} `
  );
}

function onTimeoutHandle(channel, username, reason, duration, userstate) {
  console.log(
    `This is a timeout.. channel=${channel}, username=${username}, reason=${reason}, duration=${duration}, userstate=${userstate['target-user-id']} `
  );
}

module.exports = {
  onJoinHandle,
  onPartHandle,
  onSubscriptionHandle,
  onTimeoutHandle,
};
