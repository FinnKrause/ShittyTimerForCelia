// import { WSRes, OnlineClient, OfflineClient } from "./Interfaces";
import DeviceDetector from "device-detector-js";
import fetch from "node-fetch";

const WS = require("ws");
const deviceDetector = new DeviceDetector();
var wss = new WS.Server({ port: 6971 });

let currentClients = new Map<string, any>(); //OnlineClient
let clientHistory: any[]; //OfflineClient[]

wss.broadcast = function (d: any) {
  wss.clients.forEach((client: any) => {
    const datathatcameback = reply("onlineClients", d, false, null);
    client.send(datathatcameback);
  });
};

wss.on("connection", (ws: any, req: any) => {
  const clientId = req.headers["sec-websocket-key"];
  const userAgent = req.headers["user-agent"];
  const startTime = new Date().getTime();

  let country: "France" | "Germany" | undefined;
  fetch(`http://ip-api.com/json/${ws._socket.remoteAddress}`)
    .then((res) => res.json())
    .then((data: any) => {
      if (!data) return;
      country = data["country"] === "France" ? "France" : "Germany";
    });

  logMessage(
    `Client "${userAgendString(
      deviceDetector.parse(userAgent)
    )}" from "${country}" connected.`
  );

  currentClients.set(clientId, {
    connectedSince: startTime,
    country: country,
    name: userAgendString(deviceDetector.parse(userAgent)),
  });
  ws.send(reply("other", null, false, "You Are Connected"));
  wss.broadcast(Array.from(currentClients.values()));

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

function userAgendString(userAgend: any): string {
  return `${userAgend.os.name}, ${userAgend.device.type}`;
}

function logMessage(message: string) {
  var today = new Date();
  var date =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log(`[${date}] ${message}`);
}

function reply(
  typeshit: any, //WSRes
  d: unknown | null,
  error: boolean,
  message: string | null
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
