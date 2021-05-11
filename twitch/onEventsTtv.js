const logger = require('../logger');
const handleChat = require('./messageTypes/handleChat');
const handleAction = require('./messageTypes/handleAction');
const {
  sendMessage,
  twitchSrvUsers,
  infoTwitch,
} = require('../webSocket/handleRequest');

function onActionHandle(channel, userstate, message, self) {
  logger.debug(
    `This is a onAction channel=${channel}, userstate=${userstate}, message=${message}, self=${self} `
  );
  if (self) return;
}

function onAnongiftpaidupgradeHandle(channel, username, userstate) {
  logger.debug(
    `This is a onAnongiftpaidupgradeHandle channel=${channel}, username=${username}, userstate=${userstate} `
  );

  // Do your stuff.
}

function onBanHandle(channel, username, reason, userstate) {
  logger.debug(
    `This is a onBanHandle channel=${channel}, username=${username}, reason=${reason}, userstate==> `
  );
  logger.debug({ userstate });
}

function onCheerHandle(channel, userstate, message) {
  logger.debug(
    `This is a onCheerHandle channel=${channel}, userstate=${userstate}, message=${message} `
  );
}

function onMessagedeletedHandle(channel, username, deletedMessage, userstate) {
  logger.debug(
    `This is a onMessagedeletedHandle channel=${channel}, username=${username}, deletedMessage=${deletedMessage}, userstate=${userstate} `
  );
}

function onClearchatHandle(channel) {
  logger.debug(`This is a onClearchatHandle channel=${channel}`);
}

function onEmoteonlyHandle(channel, enabled) {
  logger.debug(
    `This is a onEmoteonlyHandle channel=${channel}, enabled=${enabled}`
  );
}

function onEmotesetsHandle(sets, obj) {
  logger.debug(`This is a onEmotesetsHandle sets=${sets}, ==> `);
  logger.debug(obj);
}

function onFollowersonlyHandle(channel, enabled, length) {
  logger.debug(
    `This is a onFollowersonlyHandle channel=${channel}, enabled=${enabled}, length=${length}`
  );
}

function onGiftpaidupgradeHandle(channel, username, sender, userstate) {
  logger.debug(
    `This is a onGiftpaidupgradeHandle channel=${channel}, username=${username}, sender=${sender}, userstate=${userstate}`
  );
}

function onResubHandle(channel, username, months, message, userstate, methods) {
  logger.debug(
    `This is a onResubHandle channel=${channel}, username=${username}, months=${months}, message=${message}, userstate=${userstate}, methods=${methods}`
  );
  let cumulativeMonths = ~~userstate['msg-param-cumulative-months'];

  logger.debug(`This is a onResubHandle cumulativeMonths=${cumulativeMonths}`);
}

function onRoomstateHandle(channel, state) {
  logger.debug(`This is a onRoomstateHandle channel=${channel}, state==>`);
  infoTwitch.roomState = { ...infoTwitch.roomState, ...state };
  const message = {
    type: 'roomstate',
    data: infoTwitch.roomState,
  };
  logger.debug('onRoomstateHandle send message ---------------- ');
  logger.debug(message);
  sendMessage(JSON.stringify(message));
}

function onHostingHandle(channel, target, viewers) {
  logger.debug(
    `This is a onHostingHandle channel=${channel}, target=${target}, viewers=${viewers}`
  );
}

function onHostedHandle(channel, target, viewers, autohost) {
  logger.debug(
    `This is a onHostedHandle channel=${channel}, target=${target}, viewers=${viewers}, autohost=${autohost}`
  );
}

function onRaidedHandle(channel, username, viewers) {
  logger.debug(
    `This is a onRaidedHandle channel=${channel}, username=${username}, viewers=${viewers}`
  );
}

function onPartHandle(channel, username, self) {
  logger.debug(
    `This is a onPartHandle channel=${channel}, username=${username}, self=${self}`
  );
  if (self) return;
}

function onR9kbetaHandle(channel, enabled) {
  logger.debug(
    `This is a onR9kbetaHandle channel=${channel}, enabled=${enabled}`
  );
}

function onSlowmodeHandle(channel, enabled, length) {
  logger.debug(
    `This is a onSlowmodeHandle channel=${channel}, enabled=${enabled}, length=${length}`
  );
}

function onSubscribersHandle(channel, enabled) {
  logger.debug(
    `This is a onSubscribersHandle channel=${channel}, enabled=${enabled}`
  );
}

function onVipsHandle(channel, vips) {
  logger.debug(`This is a onVipsHandle channel=${channel}, vips=${vips}`);
}

function onWhisperHandle(from, userstate, message, self) {
  logger.debug(
    `This is a onWhisperHandle from=${from}, userstate=${userstate}, message=${message}, self=${self}`
  );
  if (self) return;
}

function onUnhostHandle(channel, viewers) {
  logger.debug(
    `This is a onUnhostHandle channel=${channel}, viewers=${viewers}`
  );
}

function onUnmodHandle(channel, username) {
  logger.debug(
    `This is a onUnmodHandle channel=${channel}, username=${username}`
  );
}

function onSubgiftHandle(
  channel,
  username,
  streakMonths,
  recipient,
  methods,
  userstate
) {
  logger.debug(
    `This is a onSubgiftHandle channel=${channel}, username=${username}, streakMonths=${streakMonths}, recipient=${recipient}, methods=${methods}, userstate=${userstate}`
  );
}

function onJoinHandle(channel, username, self) {
  logger.debug(
    `This is a Join.. channel=${channel}, username=${username}, self=${self} `
  );
  // if (self) return;

  const isBot = username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
  if (isBot) return;

  let joinUser = {
    [username]: {
      'badge-info': null,
      badges: null,
      'client-nonce': '',
      color: null,
      'display-name': username,
      emotes: null,
      flags: null,
      id: '',
      mod: false,
      'room-id': '',
      subscriber: false,
      'tmi-sent-ts': '',
      turbo: false,
      'user-id': '',
      'user-type': null,
      'emotes-raw': null,
      'badge-info-raw': null,
      'badges-raw': null,
      username: username,
      'message-type': 'join',
    },
  };
  joinUser[username] = {
    ...joinUser[username],
    ...twitchSrvUsers.getContent(username),
  };
  logger.debug(`Join username ----------------------`);
  logger.debug(joinUser[username]);

  twitchSrvUsers.merge(joinUser);
  const msgClients = { type: 'clients', data: twitchSrvUsers.get() };
  sendMessage(JSON.stringify(msgClients));
}

function onSubscriptionHandle(channel, username, method, message, userstate) {
  logger.debug(
    `This is a subscription.. channel=${channel}, username=${username}, method=${method}, message=${message}, userstate=${userstate} `
  );
}

function onTimeoutHandle(channel, username, reason, duration, userstate) {
  logger.debug(
    `This is a timeout.. channel=${channel}, username=${username}, reason=${reason}, duration=${duration}, userstate=${userstate['target-user-id']} `
  );
}

function onNoticeHandle(channel, msgid, message) {
  logger.debug(
    `This is a onNoticeHandle channel=${channel}, msgid=${msgid}, message=${message} `
  );
}

function onModHandle(channel, username) {
  logger.debug(
    `This is a onModHandle channel=${channel}, username=${username} `
  );
}

function onModsHandle(channel, mods) {
  logger.debug(`This is a onModsHandle channel=${channel}, mods=${mods} `);
}

function onMessageHandle(channel, tags, message, self) {
  logger.debug(
    `onMessageHandle channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
  );
  //  Handle different message types..
  switch (tags['message-type']) {
    case 'action':
      handleAction(channel, tags, message, self);
      break;
    case 'chat':
      handleChat(channel, tags, message, self);
      break;
    default:
      logger.debug(
        `Something else ? channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
      );
      break;
      return;
  }
}

module.exports = {
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
  onRaidedHandle,
  onPartHandle,
  onR9kbetaHandle,
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
  onMessageHandle, // event the received message
};
