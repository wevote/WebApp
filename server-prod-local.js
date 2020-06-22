/* eslint-disable */
// start the express server
// Note this will not redirect from http to https, or vice versa.
// Note run 'npm run prod' first to build the production bundle
// Note: this does not use webpack, it just starts the bundle in the express server based on the settings in /src/js/config

const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const path = require("path");
const webAppConfig = require("./src/js/config");
const port = 3000;
const opts = { redirect: true };
const hostname = webAppConfig.WE_VOTE_HOSTNAME ;
const secureCertificateInstalled = webAppConfig.SECURE_CERTIFICATE_INSTALLED || false;
console.log(`INFO: secureCertificateInstalled loaded from /src/js/config returned:  ${secureCertificateInstalled}`);

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

