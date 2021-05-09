const client = require('../client');

function handleAction(channel, tags, message, self) {
  console.log(
    `This is an action message.. channel=${channel}, tags=${tags['display-name']}, messageType=${tags['message-type']}, message=${message}, self=${self} `
  );
  if (self) return;
  return;
}

module.exports = handleAction;
