// import { WSRes, OnlineClient, OfflineClient } from "./Interfaces";
import DeviceDetector from "device-detector-js";
import fetch from "node-fetch";
import { WebSocketServer } from "ws";

const deviceDetector = new DeviceDetector();
var wss = new WebSocketServer({ port: 6971 });

let currentClients = new Map(); //OnlineClient
let clientHistory; //OfflineClient[]

wss.broadcast = function (d) {
  wss.clients.forEach((client) => {
    const datathatcameback = reply("onlineClients", d, false, null);
    client.send(datathatcameback);
  });
};

wss.on("connection", (ws, req) => {
  const clientId = req.headers["sec-websocket-key"];
  const userAgent = req.headers["user-agent"];
  const startTime = new Date().getTime();

  let country;
  ws.send(
    reply(
      "Identification",
      { clientId: clientId },
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
  ws.send(reply("other", null, false, "You Are Connected"));
  wss.broadcast(Array.from(currentClients.values()));

  ws.on("message", (data, isBinary) => {
    if (isBinary) data = data.toString();
    data = JSON.parse(data);
    if (data.type === "Identification") {
      let old = currentClients.get(clientId);
      old.country = data.data.country;
      if (data.data.name != undefined) old.name = data.data.name;
      currentClients.set(data.data.clientId, old);

      logMessage(
        `Client "${userAgendString(
          deviceDetector.parse(userAgent)
        )}" location sucessfully updated to "${data.data.country}".`
      );
      wss.broadcast(Array.from(currentClients.values()));
    } else if (data.type === "Update") {
      let old = currentClients.get(clientId);
      old.name = data.data.name;
      currentClients.set(clientId, old);
      console.log("Updating name from " + clientId + " to " + data.data.name);
      wss.broadcast(Array.from(currentClients.values()));
    }
  });

  ws.on("close", () => {
    const duration = new Date().getTime() - startTime;
    currentClients.delete(clientId);
    wss.broadcast(Array.from(currentClients.values()));

    logMessage(
      `Client "${userAgendString(
        deviceDetector.parse(userAgent)
      )}" from "${country}" disconnected. Duration: ${duration / 1000}s`
    );
  });
});

function userAgendString(userAgend) {
  return `${userAgend.os.name}, ${userAgend.device.type}`;
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
