const webAppConfig = require('../config');
// import { default as webAppConfig } from '../config';

// react-native-router-flux state change logging
export function routingLog (text) {
  if (webAppConfig.LOG_ROUTING) {
    console.log('Application pathname on entry = ', text);
    if (text.length > 100) {
      console.log('Application pathname + 100  = ', text.substring(100));
    }
    if (text.length > 200) {
      console.log('Application pathname + 200  = ', text.substring(200));
    }
  }
}

//  Log renders (so we can eliminate unnecessary ones to improve performance)
export function renderLog (filePath, suffix) {
  if (webAppConfig.LOG_ONLY_FIRST_RENDER_EVENTS) {
    if (window.firstEvents === undefined) {
      window.firstEvents = {};
      window.firstEvents[filePath] = 1;
    } else if (filePath in window.firstEvents) {
      return;
    } else {
      window.firstEvents[filePath] = 1;
    }
  }

  if (webAppConfig.LOG_RENDER_EVENTS || webAppConfig.LOG_ONLY_FIRST_RENDER_EVENTS) {
    console.log(`render ==== ${filePath} ==== ${suffix || ''}`);
  }
}

//  Log http requests and cookie CHANGES
export function httpLog (text, res) {
  if (webAppConfig.LOG_HTTP_REQUESTS) {
    if (res) {
      console.log(text, res);
    } else {
      console.log(text);
    }
  }
}

//  Log oAuth steps
export function oAuthLog (text, res) {
  if (webAppConfig.LOG_SIGNIN_STEPS) {
    if (res) {
      console.log('>> oAuth >> ', text, res);
    } else {
      console.log('>> oAuth >> ', text);
    }
  }
}

//  Cordova offsets
export function cordovaOffsetLog (text, res) {
  if (webAppConfig.LOG_CORDOVA_OFFSETS) {
    if (res) {
      console.log('Cordova: ', text, res);
    } else {
      console.log('Cordova: ', text);
    }
  }
}
