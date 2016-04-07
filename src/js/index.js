import React from "react";
import { render } from "react-dom";
import { browserHistory, Router} from "react-router";
import routes from "./Root";

// polyfill
if (!Object.assign) Object.assign = React.__spread;

render((
  <Router history={browserHistory}>
    { routes() }
  </Router>
), document.getElementById("app"));
