import { browserHistory, hashHistory } from "react-router";

export function isWebApp () {
  return window.cordova === undefined;
}

export function isCordova () {
  return window.cordova !== undefined;
}

// see https://github.com/ReactTraining/react-router/blob/v3/docs/guides/Histories.md
export function historyPush (route) {
  if (isCordova()) {
    hashHistory.push(route);
  } else {
    browserHistory.push(route);
  }
}

export function cordovaDot (path) {
  if (isCordova()) {
    return "." + path;
  } else {
    return path;
  }
}

