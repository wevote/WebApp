/* eslint-disable */

// start the express server

// invoke:
//    node serverWevotedeveloper.js

const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const path = require("path");
const webAppConfig = require("./src/js/config");

const port = 3000;
const opts = { redirect: true };
const hostname = "wevotedeveloper.com";

app.use("/", express.static("build", opts));
app.all("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));

const certOptions = {
  key: fs.readFileSync(path.resolve(__dirname + "/src/cert/wevotedeveloper.com_key.txt")),
  cert: fs.readFileSync(path.resolve(__dirname + "/src/cert/wevotedeveloper.com.crt")),
};

const server = https.createServer(certOptions, app).listen(port, function () {
  console.log("INFO: https server started", new Date());
  console.log(`INFO: Server is at https://${hostname}:${port}`);
});
