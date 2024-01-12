const WebSocket = require("ws");

const wws = new WebSocket.Server({ port: 6971 });

wws.addListener("connection", (ws) => {});
