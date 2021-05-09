const client = require('../client');

const quitbot = async (channel, user, message, args, self) => {
  const isNotChannel =
    user.username.toLowerCase() !== process.env.TWITCH_CHANNEL_NAME;
  if (isNotChannel) {
    await client.say(channel, `Command not allowed`);
    return;
  }
  try {
    await client.say(
      channel,
      `${process.env.TWITCH_BOT_USERNAME} Exiting application`
    );
    await client.disconnect();
  } catch (error) {
    console.error(`quitbot error=${error}`);
  }
};

const command0 = 'dados de string';

const command1 = async (channel, user, message, args, self) => {
  await client.say(channel, 'dados de string');
};

const command2 = async (channel, user, message, args, self) => {
  await client.say(channel, `User ${user.username} was just command2.`);
};

const command3 = (channel, user, message, args, self) => {
  client
    .clear(channel)
    .then((data) => {
      console.log(`!command3 -> data : ${data}`);
    })
    .catch((err) => {
      console.log(`!command3 -> Error : ${err}`);
    });
};

// const ping = (client, message, args, user, channel, self) => {
const ping = (channel, user, message, args, self) => {
  console.log(
    `This is a ping.. channel=${channel}, user=${user}, date=${message}, self=${self} `
  );
  client.ping().then(function (data) {
    let ping = Math.floor(Math.round(data * 1000));
    client.say(channel, `@${user.username}, your ping is ${ping} `);
  });
};

const commands = {
  quitbot: {
    response: quitbot,
  },
  command0: {
    response: command0,
  },
  command1: {
    response: command1,
  },
  command2: {
    response: command2,
  },
  command3: {
    response: command3,
  },
  ping: {
    response: ping,
  },
};

module.exports = commands;
