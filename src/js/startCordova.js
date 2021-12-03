import VoterActions from './actions/VoterActions';
import TwitterSignIn from './components/Twitter/TwitterSignIn';
import webAppConfig from './config';
import VoterStore from './stores/VoterStore';
import { getCordovaScreenHeight, getProcessorArchitecture, isCordova, isIOS, isIOSAppOnMac, isIPad, isSimulator, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from './utils/cordovaUtils';
import Cookies from './common/utils/js-cookie/Cookies';
import { httpLog } from './common/utils/logging';

function localPrepareForCordovaKeyboard () {
  prepareForCordovaKeyboard('ballot');
}

function localRestoreStylesAfterCordovaKeyboard () {
  restoreStylesAfterCordovaKeyboard('ballot');
}

function startMessaging (voterDeviceId) {
  const { cordova: { plugins: { firebase: { messaging } } } } = window;
  // https://github.com/chemerisuk/cordova-plugin-firebase-messaging
  // For iOS, this can't be tested in a simulator.  Works fine in simulator on Android.
  messaging.getToken().then((token) => {
    console.log('Cordova: Firebase FCM - registration token first 50: ', token.substring(0, 50));
    const clip = token.length > 50 ? token.length - 50 : 0;
    console.log('Cordova: Firebase FCM - registration token last    : ', token.substring(clip));
    VoterActions.deviceStoreFirebaseCloudMessagingToken(token, voterDeviceId);
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

  // getInstanceId seems to have dissapeared, 10/22/21
  // messaging.getInstanceId().then((instanceId) => {
  //   console.log('Cordova: Firebase FCM - Got instanceId: ', instanceId);
  // });
}

export function initializationForCordova (startReact) {
  console.log('Cordova:  startCordova.jsx  initializationForCordova');
  console.log('Cordova:  Startup sequence 1: Wait for deviceready event');
  document.addEventListener('deviceready', (id) => {
    window.isDeviceReady = true;
    console.log('Cordova:  window.isDeviceReady', window.isDeviceReady, 'Event: ', id.type);
    console.log(`Cordova:  Running cordova-${window.cordova.platformId}@${window.cordova.version}`);
    const { plugins: { screensize } } = window;
    console.log('Cordova:  Startup sequence 2: Wait for pbakondy screensize');
    screensize.get((result) => {
      console.log('Cordova:  screensize.get: ', result);
      // dumpObjProps('window.device', window.device);
      window.pbakondyScreenSize = result;
      if (isIPad()) {
        document.querySelector('body').style.height = getCordovaScreenHeight();
        console.log('Cordova: Initial "body" height for iPad = ', result.height / result.scale);
      }
      const { $ } = window;
      console.log('Cordova:  Startup sequence 3: Wait for an initial voterRetrieve');
      const cookie = Cookies.get('voter_device_id');
      const idPathComponent = (cookie && cookie.length > 10) ? `/?voter_device_id=${cookie}` : '';
      const initialAjaxUrl = `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}voterRetrieve${idPathComponent}`;
      httpLog(`AJAX URL (Initial): ${initialAjaxUrl}`);
      $.ajax({
        url: initialAjaxUrl,
        context: document.body,
        timeout: 10000,
      }).done((resp) => {
        const { voter_device_id: voterDeviceId } = resp;
        if (voterDeviceId) {
          console.log('Cordova:   voterRetrieve returned voter_device_id', voterDeviceId);
          VoterStore.setVoterDeviceIdCookie(voterDeviceId);
          window.voterDeviceId = voterDeviceId;
          // --

          // Initialize incoming URL handler for oAuth and wevotetwitterscheme
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
            startMessaging(voterDeviceId);
          }
          const { splashscreen } = navigator;
          if (splashscreen) splashscreen.hide();
          startReact();
        } else {
          console.error('Cordova:   voterRetrieve did not return a voter_device_id');
        }
      });
    }, (result) => {
      console.log('Cordova: pbakondy/cordova-plugin-screensize FAILURE result: ', result);
    });
  }, false);
}

export function removeCordovaSpecificListeners () {
  if (isIOS()) {
    window.removeEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.removeEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}
