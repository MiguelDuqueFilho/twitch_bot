const logger = require('../logger');
const client = require('../twitch/client');

// I'm maintaining all active connections in this object
const webClients = {};

const infoTwitch = {
  statusConnect: false,
  roomState: {},
};

const twitchSrvUsers = (module.exports = {
  twitchUsers: {},
  merge: function (joinUsers) {
    twitchSrvUsers.twitchUsers = {
      ...twitchSrvUsers.twitchUsers,
      ...joinUsers,
    };
  },
  getContent: function (key) {
    return twitchSrvUsers.twitchUsers[key];
  },
  get: function () {
    return twitchSrvUsers.twitchUsers;
  },
  clear: function () {
    return (twitchSrvUsers.twitchUsers = {});
  },
});

function originIsAllowed(origin) {
  logger.debug(`origin ${origin}`);
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function sendMessage(json) {
  // We are sending the current data to all connected webClients
  Object.keys(webClients).map((client) => {
    webClients[client].sendUTF(json);
  });
}

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

async function handleRequest(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    logger.warn('Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  var userID = getUniqueID();

  logger.debug('Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = await request.accept(null, request.origin);

  webClients[userID] = connection;

  logger.debug(
    'webClients connected: ' +
      userID +
      ' in ' +
      Object.getOwnPropertyNames(webClients)
  );

  logger.debug('status twitch ' + infoTwitch.statusConnect);

  if (infoTwitch.statusConnect) {
    let message = {
      type: 'message',
      data: 'initbot',
    };
    logger.debug(message);
    sendMessage(JSON.stringify(message));
    if (twitchSrvUsers.twitchUsers.length !== 0) {
      message = {
        type: 'clients',
        data: twitchSrvUsers.get(),
      };
      logger.debug(message);
      sendMessage(JSON.stringify(message));
    }
    if (infoTwitch.roomState.length !== 0) {
      message = {
        type: 'roomstate',
        data: infoTwitch.roomState,
      };
      logger.debug(message);
      sendMessage(JSON.stringify(message));
    }
  }

  connection.on('message', function (message) {
    switch (message.type) {
      case 'utf8':
        handleUTF8(JSON.parse(message.utf8Data));
        break;
      case 'binary':
        handleBinary(message.data);
        break;
      default:
        logger.debug(
          `Something else ? channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
        );
        break;
    }
  });

  connection.on('close', function (connetion) {
    logger.debug('Client ' + userID + ' disconnected.');
    delete webClients[userID];
  });

  connection.on('error', function (error) {
    logger.debug(' Connection Error: ' + error.toString());
  });
}

function handleCmdSrv(type, data) {
  logger.debug(`Received Command type=${type} data=${data}`);
  if (type === 'command' && data === 'initbot') {
    client.connect().then(() => {
      const message = {
        type: 'message',
        data: 'initbot',
      };
      logger.debug('handleCmdSrv message ---------------- ');
      logger.debug(message);
      sendMessage(JSON.stringify(message));
    });
  }

  if (type === 'command' && data === 'termbot') {
    client.disconnect().then(() => {
      const message = {
        type: 'message',
        data: 'termbot',
      };
      logger.debug('handleCmdSrv send message ---------------- ');
      logger.debug(message);
      sendMessage(JSON.stringify(message));
    });
  }

  if (type === 'command' && data === 'clearclients') {
    twitchSrvUsers.clear();
    const message = {
      type: 'clients',
      data: twitchSrvUsers.get(),
    };
    logger.debug('send message clients ---------------- ');
    logger.debug(message);

    sendMessage(JSON.stringify(message));
  }

  if (type === 'command' && data === 'clearclients') {
    twitchSrvUsers.clear();
    const message = {
      type: 'clients',
      data: twitchSrvUsers.get(),
    };
    logger.debug('send message clients ---------------- ');
    logger.debug(message);

    sendMessage(JSON.stringify(message));
  }
}

function handleMessage(message, type, data) {
  logger.debug('Received  Message =  ---------------- ');
  logger.debug(message);
}

function handleCmdTtv(type, data) {
  client.is;
  const { cmd, cmddata } = data;
  logger.debug(`Received Command to Twitch via site type=${type} data=${data}`);
  logger.debug(`Command to Twitch cmd=${cmd} cmddata ==>`);
  logger.debug(cmddata);
  if (cmd === 'r9k') {
    if (cmddata.status) {
      client.r9kbeta(process.env.TWITCH_CHANNEL_NAME).then(() => {
        logger.debug('r9kbeta success ---------------- ');
      });
    } else {
      client.r9kbetaoff(process.env.TWITCH_CHANNEL_NAME).then(() => {
        logger.debug('r9kbetaoff success ---------------- ');
      });
    }
  }
  if (cmd === 'ban') {
    const reason = 'usu??rio fora das regras do canal';
    client
      .ban(process.env.TWITCH_CHANNEL_NAME, cmddata.username, reason)
      .then(() => {
        // const message = {
        //   type: 'message',
        //   data: 'initbot',
        // };
        logger.debug('ban success ---------------- ');
        // logger.debug(message);
        // sendMessage(JSON.stringify(message));
      });
  }
}

function handleUTF8(message) {
  const { type, data } = message;
  logger.debug('Received utf8 Message =  ---------------- ');
  logger.debug(message);

  switch (type) {
    case 'command':
      handleCmdSrv(type, data);
      break;
    case 'message':
      handleMessage(type, data);
      break;
    case 'cmdttv':
      handleCmdTtv(type, data);
      break;
    default:
      logger.error('Mensagem Invalida =  ---------------- ');
      logger.error(message);
      break;
      return;
  }
}

function handleBinary(message) {
  logger.debug(
    'Received Binary Message of ' + message.binaryData.length + ' bytes'
  );
}

module.exports = {
  infoTwitch,
  handleRequest,
  sendMessage,
  twitchSrvUsers,
};
