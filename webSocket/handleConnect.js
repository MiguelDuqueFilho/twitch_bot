require('dotenv').config();

function webSocketCreateServer(request, response) {
  console.log(new Date() + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
}

function webSocketConnect() {
  console.log(
    `${new Date()} Server is listening on port ${process.env.WEBSOCKET_PORT}`
  );
}

module.exports = {
  webSocketCreateServer,
  webSocketConnect,
};
