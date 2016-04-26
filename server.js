/**
 * express server dependency
 */
const express = require("express");

/**
 * server function to start up the
 * express and run server for production and development.
 *
 * this server serves all the static assets for our site.
 *
 * @param  {Boolean} PROD - is this server running
 * for: production{true} or development{false OR undefined}
 *
 */
function server (PROD) {
  /**
   * server port to run on
   * @type {Number}
   * 3000 for Production server
   * 3003 for development server
   */
  const port = PROD ? 3000 : 3003;

  /**
   * application server construction
   */
  const app = express();

  /**
   *  mount local filesystem build root [./build] to host root [/] for serving all static assets
   *
   * i.e.
   *  		myserver.com/js/bundle.js
   *  will serve file:
   *    	./build/js/bundle.js
   *  from the local filesystem
   *
   */
  app.use("/", express.static("build", { redirect: true }));

  /**
   * Configure all requests to send file ./build/index.html to the client
   * even if it's not requested.
   *
   * We do this because react-router will handle all the routing.
   *
   * Therefore when the user requests myserver.com/some/path.html
   * we want to send index.html and have react router
   * figure out what to render for the user for path some/path.html
   *
   * We're currently figuring out how to reduce bundle.js size for the
   * application and speed up the network transfer.
   *
   */
  app.all("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));

  /**
   * Set application to start listening on {port} variable
   */
  app.listen(port, () => {
      console.log("INFO: " + "express server started", new Date());
      console.log("INFO: " + `Server is at http://${PROD ? "wevote.me" : "localhost"}:${port}`);
  });
}

module.exports = server;

