import { browserHistory, hashHistory } from "react-router";
const webAppConfig = require("../config");

// see https://github.com/ReactTraining/react-router/blob/v3/docs/guides/Histories.md
export function historyPush(route) {
  if (webAppConfig.IS_CORDOVA) {
    hashHistory.push(route);
  } else {
    browserHistory.push(route);
  }
}

export function cordovaDot(path) {
  if (webAppConfig.IS_CORDOVA) {
    return "." + path;
  } else {
    return path;
  }
}

