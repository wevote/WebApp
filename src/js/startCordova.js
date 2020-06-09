import {
  isIOS,
  prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard,
} from './utils/cordovaUtils';
import TwitterSignIn from './components/Twitter/TwitterSignIn';

function localPrepareForCordovaKeyboard () {
  prepareForCordovaKeyboard('ballot');
}

function localRestoreStylesAfterCordovaKeyboard () {
  restoreStylesAfterCordovaKeyboard('ballot');
}

export function initializationForCordova () { // eslint-disable-line
  console.log('Application initializationForCordova ------------');

  // Initialize incoming URL handler for oAuth
  window.handleOpenURL = (url) => {
    TwitterSignIn.handleTwitterOpenURL(url);
  };

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
