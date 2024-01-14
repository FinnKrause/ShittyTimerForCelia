const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.static("public"));
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  next();
});

app.get("/", (req, res) => {
  const ips = req.headers["x-real-ip"]
    ? req.headers["x-real-ip"].split(",")[0]
    : "undefined";
  console.log(ips);
  axios.get("http://ip-api.com/json/" + ips).then((response) => {
    res.json(response.data);
  });
});

app.listen(6972, console.log("IP-API Running on port 6972"));
