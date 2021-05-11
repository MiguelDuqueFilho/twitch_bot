const logger = require('../../logger');

function handleAction(channel, user, message, self) {
  logger.debug(
    `This is an action message.. channel=${channel}, user=${user['display-name']}, messageType=${user['message-type']}, message=${message}, self=${self} `
  );
  if (self) return;
  const isBot = user.username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
  if (isBot) return;
  return;
}

module.exports = handleAction;
