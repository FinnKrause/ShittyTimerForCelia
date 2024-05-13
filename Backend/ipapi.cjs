const express = require("express");
const app = express();
const axios = require("axios");
const { readFileSync, writeFileSync } = require("fs");

var localStorageOfTimeToCountDown = initialLocalSet();

app.use(express.static("public"));
app.use((_, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Headers", "*");
  next();
});
app.use(express.json());

app.get("/", (req, res) => {
  const ips = req.headers["x-real-ip"]
    ? req.headers["x-real-ip"].split(",")[0]
    : "undefined";
  console.log(ips);
  axios.get("http://ip-api.com/json/" + ips).then((response) => {
    res.json(response.data);
  });
});

app.get("/getDateToCountdown", (req, res) => {
  res.json({
    date: localStorageOfTimeToCountDown,
  });
});

app.get("/getDaysLeft", async (req, res) => {
  const timeleft = localStorageOfTimeToCountDown - new Date().getTime();

  let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  const hour = Math.floor(
    (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  if (hour > 12) days++;
  console.log(days);

  res.json({
    date: days,
  });
});

app.post("/setNewDateToCountdown", (req, res) => {
  let newDate = req.body.date;
  if (!newDate || !typeof newDate === "number") {
    res.json({ error: "No valid date specified" });
    return;
  }
  localStorageOfTimeToCountDown = newDate;
  writeLocalVarToStorage(newDate);
  console.log("Date updated to: " + new Date(newDate).toString());
  res.json({ error: false, message: "Date updated!", data: { date: newDate } });
});

app.listen(6972, console.log("IP-API Running on port 6972"));

function initialLocalSet() {
  try {
    readData = readFileSync("./additionalData.json", "utf-8");
    readDataJSON = JSON.parse(readData);
    if (typeof readDataJSON["date"] === "number") return readDataJSON["date"];
    else return 440;
  } catch (e) {
    console.log(
      "Error when reading JSON file with date to count down to: " +
        JSON.stringify(e)
    );
  }
}

function writeLocalVarToStorage(number) {
  try {
    writeFileSync(
      "./additionalData.json",
      JSON.stringify({ date: localStorageOfTimeToCountDown }, null, 2)
    );
  } catch (e) {
    console.log("Error when saving new Date to disk: " + JSON.stringify(e));
  }
}
