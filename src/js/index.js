import React from "react";
import Router from "react-router";
import ReactDOM from "react-dom";
import { createHistory } from "history";
import routes from "./Root";

// polyfill
if (!Object.assign) Object.assign = React.__spread;

// wrapping for privacy
(function () {
    ReactDOM.render(
      <Router history={createHistory()}>
        { routes() }
      </Router>, document.getElementById("app")
    );
}());
