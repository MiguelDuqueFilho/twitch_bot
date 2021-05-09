require('dotenv').config();
const tmi = require('tmi.js');

const opts = {
  options: { debug: true, messagesLogLevel: 'info' },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  connection: {
    cluster: 'aws',
    reconnect: true,
    secure: true,
  },
  channels: [process.env.TWITCH_CHANNEL_NAME],
};

const client = new tmi.client(opts);

module.exports = client;
