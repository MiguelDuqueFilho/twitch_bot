const handleChat = require('./messageTypes/handleChat');
const handleAction = require('./messageTypes/handleAction');

function onMessageTtv(channel, tags, message, self) {
  console.log(
    `onMessageTtv channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
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
      console.log(
        `Something else ? channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
      );
      break;
      return;
  }
}

module.exports = onMessageTtv;
