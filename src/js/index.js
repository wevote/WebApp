import React from "react";
import { render } from "react-dom";
import { browserHistory, Router, applyRouterMiddleware } from "react-router";
import { useScroll } from 'react-router-scroll';
import routes from "./Root";

// polyfill
if (!Object.assign) Object.assign = React.__spread;

render(<Router history={browserHistory} render={applyRouterMiddleware(useScroll(()=>true))}>
    { routes() }
  </Router>, document.getElementById("app"));