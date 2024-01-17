// import { WSRes, OnlineClient, OfflineClient } from "./Interfaces";
import DeviceDetector from "device-detector-js";
import fetch from "node-fetch";
import { WebSocketServer } from "ws";

const deviceDetector = new DeviceDetector();
var wss = new WebSocketServer({ port: 6971 });

let currentClients = new Map(); //OnlineClient
let clientHistory = new Map(); //OfflineClient[]

wss.broadcast = function (type, d) {
  wss.clients.forEach((client) => {
    const datathatcameback = reply(type, d, false, null);
    client.send(datathatcameback);
  });
};

wss.on("connection", (ws, req) => {
  const clientId = req.headers["sec-websocket-key"];
  const userAgent = req.headers["user-agent"];
  const startTime = new Date().getTime();

  const updateInterval = setInterval(() => {
    ws.send(reply("ping", null, false, "Alive?"));
  }, 30000);

  let country;
  let customName;
  ws.send(
    reply("offlineClients", Array.from(clientHistory.values()), false, null)
  );

  ws.send(
    reply(
      "Identification",
      { clientId },
      false,
      "Please identify yourself with IP-Adress and Country!"
    )
  );

  logMessage(
    `Client "${userAgendString(deviceDetector.parse(userAgent))}" connected.`
  );

  currentClients.set(clientId, {
    connectedSince: startTime,
    country: country,
    clientId,
    name: userAgendString(deviceDetector.parse(userAgent)),
  });
  broadcastOnlineClients();

  ws.on("message", (data, isBinary) => {
    if (isBinary) data = data.toString();
    data = JSON.parse(data);
    if (data.type === "Identification") {
      let old = { ...currentClients.get(clientId) };
      old.country = data.data.country;
      country = data.data.country;
      if (data.data.name) {
        old.name = data.data.name;
        customName = data.data.name;
      }
      currentClients.set(clientId, old);

      if (clientHistory.has(data.data.country))
        clientHistory.delete(data.data.country);
      broadcastOfflineClients();

      logMessage(
        `Client "${old.name}" location sucessfully updated to "${data.data.country}".`
      );
      broadcastOnlineClients();
    } else if (data.type === "Update") {
      let old = currentClients.get(clientId);
      old.name = data.data.name;
      customName = data.data.name;
      currentClients.set(clientId, old);
      console.log("Updating name from " + clientId + " to " + data.data.name);
      broadcastOnlineClients();
    }
  });

  ws.on("close", () => {
    const duration = new Date().getTime() - startTime;
    const _offlineClient = { ...currentClients.get(clientId) };
    currentClients.delete(clientId);
    broadcastOnlineClients();
    clearInterval(updateInterval);
    if (duration < 3000) return;

    _offlineClient["connectedLast"] = new Date().getTime();
    _offlineClient["duration"] = duration;
    delete _offlineClient.connectedSince;

    clientHistory.set(_offlineClient.country, _offlineClient);
    broadcastOfflineClients();

    logMessage(
      `Client "${customName}" from "${country}" disconnected. Duration: ${
        duration / 1000
      }s`
    );
  });
});

function userAgendString(userAgend) {
  return `${userAgend.os.name}, ${userAgend.device.type}`;
}

function broadcastOnlineClients() {
  wss.broadcast("onlineClients", Array.from(currentClients.values()));
}

function broadcastOfflineClients() {
  wss.broadcast("offlineClients", Array.from(clientHistory.values()) || null);
}

function logMessage(message) {
  var today = new Date();
  var date =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log(`[${date}] ${message}`);
}

function reply(
  typeshit, //WSRes
  d,
  error,
  message
) {
  const res = JSON.stringify({
    type: typeshit,
    data: d,
    error,
    message,
  });
  // console.log(`Message response: ${res}`);
  return res;
}
