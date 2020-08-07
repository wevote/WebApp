import TwitterSignIn from './components/Twitter/TwitterSignIn';
import { isIOS, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from './utils/cordovaUtils';

function localPrepareForCordovaKeyboard () {
  prepareForCordovaKeyboard('ballot');
}

function localRestoreStylesAfterCordovaKeyboard () {
  restoreStylesAfterCordovaKeyboard('ballot');
}

// for wevotetwitterscheme
export function initializationForCordova () { // eslint-disable-line
  console.log('Application initializationForCordova ------------');

  // Initialize incoming URL handler for oAuth
  window.handleOpenURL = (url) => {
    console.log('window.handleOpenURL ----------', url);
    TwitterSignIn.handleTwitterOpenURL(url);
  };

  // Cordova only, override "open" to use InAppBrowser to open any outside site
  const { cordova } = window;
  window.open = cordova.InAppBrowser.open;

  // Special keyboard handling for iOS
  if (isIOS()) {
    // Unfortunately this event only works on iOS, but fortunately it is most needed on iOS
    window.addEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.addEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}

export function removeCordovaSpecificListeners () {
  if (isIOS()) {
    window.removeEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.removeEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}
