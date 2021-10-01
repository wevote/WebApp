import VoterActions from './actions/VoterActions';
import TwitterSignIn from './components/Twitter/TwitterSignIn';
import { getProcessorArchitecture,
  isCordova, isIOS, isIOSAppOnMac, isSimulator,
  prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from './utils/cordovaUtils';

function localPrepareForCordovaKeyboard () {
  prepareForCordovaKeyboard('ballot');
}

function localRestoreStylesAfterCordovaKeyboard () {
  restoreStylesAfterCordovaKeyboard('ballot');
}

// for wevotetwitterscheme
export function initCordovaAfterPluginsAreAvailable () { // eslint-disable-line
  console.log('Cordova:  App.jsx startCordova.jsx initializationForCordova');

  // Initialize incoming URL handler for oAuth
  window.handleOpenURL = (url) => {
    console.log('Cordova: window.handleOpenURL ', url);
    TwitterSignIn.handleTwitterOpenURL(url);
  };

  getProcessorArchitecture();

  // Cordova only, override "open" to use InAppBrowser to open any outside site
  // const { cordova: { InAppBrowser, plugins: { firebase: { messaging } } } } = window;
  const { cordova: { InAppBrowser } } = window;
  if (InAppBrowser) {
    window.open = InAppBrowser.open;
  } else {
    console.warn('Cordova: Warning: InAppBrowser for Cordova is not installed!');
  }


  try {
    const { cordova: { getAppVersion: getVersionNumber } } = window;
    getVersionNumber().then((version) => {
      window.weVoteAppVersion = version;
      return true;
    });
  } catch (err) {
    console.log('Cordova: ERROR unable to determine version number');
  }

  // if (isIOSAppOnMac()) {
  //   dumpScreenAndDeviceFields();
  // }

  // Special keyboard handling for iOS
  if (isIOS() && !isIOSAppOnMac) {
    // Unfortunately this event only works on iOS, but fortunately it is most needed on iOS
    window.addEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.addEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }

  if (isCordova() && !isIOSAppOnMac() && !isSimulator()) {
    const { cordova: { plugins: { firebase: { messaging } } } } = window;
    // https://github.com/chemerisuk/cordova-plugin-firebase-messaging
    // For iOS, this can't be tested in a simulator.  Works fine in simulator on Android.
    messaging.getToken().then((token) => {
      console.log('Cordova: Firebase FCM - registration token first 75: ', token.substring(0, 75));
      console.log('Cordova: Firebase FCM - registration token last    : ', token.substring(75));
      VoterActions.deviceStoreFirebaseCloudMessagingToken(token);
    });

    messaging.onMessage((payload) => {
      console.log('Cordova: Firebase FCM - New foreground FCM message: ', payload);
      if (isIOS()) {
        const { aps: { alert } } = payload;
        console.log('Cordova: Firebase FCM - New foreground FCM decomposed alert message:', alert);
        navigator.notification.alert(alert,
          () => console.log('Cordova: WeVote FCM Message navigator.notification.alert dismissed'),
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
      console.log('Cordova: Firebase FCM - New background FCM message: ', payload);
    });

    messaging.requestPermission().then(() => {
      console.log('Cordova: Firebase FCM - Push messaging is allowed');
    });

    messaging.getInstanceId().then((instanceId) => {
      console.log('Cordova: Firebase FCM - Got instanceId: ', instanceId);
    });
  }
}

export function initializationForCordova (setInitialized) {
  console.log('Cordova: startCordova.jsx  initializationForCordova');
  console.log('Cordova: Waiting for window.cordova.plugins', window.cordova.plugins);
  const waitForPlugins = setInterval(() => {
    if (window.cordova.plugins) {
      initCordovaAfterPluginsAreAvailable();
      clearInterval(waitForPlugins);
      // eslint-disable-next-line no-param-reassign
      setInitialized();
      navigator.splashscreen.hide();
      console.log('Cordova:  Found window.cordova.plugins', window.cordova.plugins);
    } else {
      console.log('Cordova:  waiting another 10 ms');
    }
  }, 10);
}


export function removeCordovaSpecificListeners () {
  if (isIOS()) {
    window.removeEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.removeEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}
