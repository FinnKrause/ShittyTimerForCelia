const WebSocket = require("ws");

const wws = new WebSocket.Server({ port: 6971 });

wws.addListener("connection", (ws) => {
  console.log("New Client connected!");

  ws.on("close", (closeEventArgs) => {
    console.log("Client disconnected!");
  });

  ws.on("message", console.log);
});
