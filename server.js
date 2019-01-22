/* eslint-disable */
// start the express server
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const path = require("path");
const webAppConfig = require("./src/js/config");

module.exports = function (PROD) {
  const port = 3000; // PROD ? 3000 : 3003;
  const opts = { redirect: true };
  const hostname = PROD ? webAppConfig.WE_VOTE_HOSTNAME : "localhost";
  const secureCertificateInstalled = webAppConfig.SECURE_CERTIFICATE_INSTALLED || false;

  app.use("/", express.static("build", opts));
  app.all("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));
  if (secureCertificateInstalled) {
    const certOptions = {
      key: fs.readFileSync(path.resolve(__dirname + "/src/cert/server.key")),
      cert: fs.readFileSync(path.resolve(__dirname + "/src/cert/server.crt")),
    };

    const server = https.createServer(certOptions, app).listen(port, function () {
      console.log("INFO: https server started", new Date());
      console.log(`INFO: Server is at https://${hostname}:${port}`);
    });
  } else {
    app.listen(port, () => {
      console.log("INFO: express server started", new Date());
      console.log(`INFO: Server is at http://${hostname}:${port}`);
    });
  }
};
