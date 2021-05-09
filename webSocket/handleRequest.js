const client = require('../twitch/client');

// I'm maintaining all active connections in this object
const webClients = {};

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
  console.log(`${new Date()} origin ${origin}`);
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

function handleRequest(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + ' Connection from origin ' + request.origin + ' rejected.'
    );
    return;
  }
  var userID = getUniqueID();

  console.log(
    new Date() +
      ' Recieved a new connection from origin ' +
      request.origin +
      '.'
  );
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);

  webClients[userID] = connection;

  console.log(
    new Date() +
      ' webClients connected: ' +
      userID +
      ' in ' +
      Object.getOwnPropertyNames(webClients)
  );

  connection.on('message', function (message) {
    switch (message.type) {
      case 'utf8':
        handleUTF8(JSON.parse(message.utf8Data));
        break;
      case 'binary':
        handleBinary(message.data);
        break;
      default:
        console.log(
          `Something else ? channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
        );
        break;
    }
  });

  connection.on('close', function (connetion) {
    console.log(new Date() + ' Client ' + userID + ' disconnected.');
    delete webClients[userID];
  });

  connection.on('error', function (error) {
    console.log(new Date() + ' Connection Error: ' + error.toString());
  });
}

function handleCommand(type, data) {
  console.log(`${new Date()} Received Command type=${type} data=${data}`);
  if (type === 'command' && data === 'initbot') {
    client.connect().then(() => {
      const message = {
        type: 'message',
        data: 'initbot',
      };
      console.log(
        new Date() + 'handleCommand sendUTF  = ' + JSON.stringify(message)
      );
      sendMessage(JSON.stringify(message));
    });
  }

  if (type === 'command' && data === 'termbot') {
    client.disconnect().then(() => {
      const message = {
        type: 'message',
        data: 'termbot',
      };
      console.log(
        new Date() + 'handleCommand sendUTF  = ' + JSON.stringify(message)
      );
      sendMessage(JSON.stringify(message));
    });
  }

  if (type === 'command' && data === 'clearclients') {
    twitchSrvUsers.clear();
    const message = {
      type: 'clients',
      data: twitchSrvUsers.get(),
    };
    console.log(
      new Date() + 'handleCommand sendUTF  = ' + JSON.stringify(message)
    );
    sendMessage(JSON.stringify(message));
  }
}

function handleMessage(message, type, data) {
  console.log(new Date() + ' Received  Message = ' + message);
}

function handleUTF8(message) {
  const { type, data } = message;
  console.log(
    new Date() + ' Received utf8 Message : ' + JSON.stringify(message)
  );

  switch (type) {
    case 'command':
      handleCommand(type, data);
      break;
    case 'message':
      handleMessage(type, data);
      break;
    default:
      console.log(
        `${new Date()} Mensagem Invalida ${JSON.stringify(mensagem)} `
      );
      break;
      return;
  }
}

function handleBinary(message) {
  console.log(
    new Date() +
      ' Received Binary Message of ' +
      message.binaryData.length +
      ' bytes'
  );
}

module.exports = { handleRequest, sendMessage, twitchSrvUsers };
