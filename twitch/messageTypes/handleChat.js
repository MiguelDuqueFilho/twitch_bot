require('dotenv').config();
const logger = require('../../logger');
const client = require('../client');
const commands = require('./commands');
const {
  sendMessage,
  twitchSrvUsers,
} = require('../../webSocket/handleRequest');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/); // !command my-args
const prefix = '!';

async function handleChat(channel, user, message, self) {
  logger.debug(
    `This is a chat message.. channel=${channel}, user=${user['display-name']}, messageType=${user['message-type']}, message=${message}, self=${self} `
  );

  if (self) return;
  const isBot = user.username.toLowerCase() === process.env.TWITCH_BOT_USERNAME;
  if (isBot) return;

  logger.debug(`handleChat -----------`);
  logger.debug({ user });

  const [raw, command, args] = message.match(regexpCommand) || [
    null,
    null,
    null,
  ];

  const { response } = commands[command] || {};

  if (typeof response === 'function') {
    response(channel, user, message, args, self);
  } else {
    if (typeof response === 'string') {
      await client.say(channel, response);
    }
  }

  let joinUser = { [user.username]: { ...user, message } };

  joinUser = {
    [user.username]: {
      ...twitchSrvUsers.getContent([user.username]),
      ...joinUser[user.username],
    },
  };

  twitchSrvUsers.merge(joinUser);
  const msgClients = { type: 'clients', data: twitchSrvUsers.get() };
  sendMessage(JSON.stringify(msgClients));

  return;
}

module.exports = handleChat;
