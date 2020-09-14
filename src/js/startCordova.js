import TwitterSignIn from './components/Twitter/TwitterSignIn';
import {
  isIOS,
  prepareForCordovaKeyboard,
  restoreStylesAfterCordovaKeyboard,
} from './utils/cordovaUtils';
import VoterActions from './actions/VoterActions';

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
  const { cordova: { InAppBrowser, plugins: { firebase: { messaging } } } } = window;
  window.open = InAppBrowser.open;

  // Special keyboard handling for iOS
  if (isIOS()) {
    // Unfortunately this event only works on iOS, but fortunately it is most needed on iOS
    window.addEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.addEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);

    // https://github.com/chemerisuk/cordova-plugin-firebase-messaging
    // For iOS, this can't be tested in a simulator.  Works fine in simulator on Android.
    messaging.getToken().then((token) => {
      console.log('Firebase FCM - Firebase Cloud Messaging registration token: ', token);
      VoterActions.deviceStoreFirebaseCloudMessagingToken(token);
    });

    messaging.onMessage((payload) => {
      console.log('Firebase FCM - New foreground FCM message: ', payload);
      if (isIOS()) {
        const { aps: { alert } } = payload;
        console.log('Firebase FCM - New foreground FCM decomposed alert message:', alert);
        navigator.notification.alert(alert,
          () => console.log('WeVote FCM Message navigator.notification.alert dismissed'),
          'We Vote');

        // Save until Android badge count is working, or we gave up on it
        // for (const [key, value] of Object.entries(payload)) {
        //   console.log(`'Firebase FCM - FCM element ${key}: ${value}`);
        //   console.log('key = \'' + key + '\'');
        //   if (key === 'aps') {
        //     console.log('key === aps');
        //     for (const [key2, value2] of Object.entries(value)) {
        //       console.log(`'Firebase FCM - FCM aps element ${key2}: ${value2}`);
        //     }
        //   }
        // }
      }
    });

    messaging.onBackgroundMessage((payload) => {
      console.log('Firebase FCM - New background FCM message: ', payload);
    });

    messaging.requestPermission().then(() => {
      console.log('Firebase FCM - Push messaging is allowed');
    });

    messaging.getInstanceId().then((instanceId) => {
      console.log('Firebase FCM - Got instanceId: ', instanceId);
    });
  }
}

export function removeCordovaSpecificListeners () {
  if (isIOS()) {
    window.removeEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.removeEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}
