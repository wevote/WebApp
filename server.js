// start the express server
const express = require("express");
const app = express();

module.exports = function (PROD) {
  const port = PROD ? 3000 : 3003;
  const opts = { redirect: true };
  const hostname = PROD ? "wevote.me" : "localhost";

  app.use("/", express.static("build", opts));
  app.all("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));
  app.listen(port, () => {
      console.log("INFO: " + "express server started", new Date());
      console.log("INFO: " + `Server is at http://${hostname}:${port}`);
  });
};
