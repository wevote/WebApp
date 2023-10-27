import VoterActions from './actions/VoterActions';
import { getCordovaScreenHeight, isIOS, isIOSAppOnMac, isIPad, isSimulator, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from './common/utils/cordovaUtils';
import { isCordova } from './common/utils/isCordovaOrWebApp';
import Cookies from './common/utils/js-cookie/Cookies';
import { httpLog } from './common/utils/logging';
import TwitterSignIn from './components/Twitter/TwitterSignIn';
import webAppConfig from './config';
import VoterStore from './stores/VoterStore';

// import { dumpObjProps } from './utils/appleSiliconUtils';

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

function postLockInitialization (voterDeviceId, startReact) {
  console.log('Cordova:   postLockInitialization');

  // Special keyboard handling for iOS
  if (isIOS() && !isIOSAppOnMac) {
    // Unfortunately this event only works on iOS, but fortunately it is most needed on iOS
    window.addEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.addEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }

  const pigCanFly = false;   // August 24, 2023, disable Cordova firebase messaging for now
  if (pigCanFly && isCordova() && !isIOSAppOnMac() && !isSimulator()) {
    console.log('Cordova:   startMessaging(voterDeviceId)');
    startMessaging(voterDeviceId);
  }
  const { splashscreen } = navigator;
  if (splashscreen) splashscreen.hide();

  if (isCordova()) {
    webAppConfig.ENABLE_PAY_TO_PROMOTE = false;
  }
  console.log('Cordova:   startReact()');
  startReact();
}

export function initializationForCordova (startReact) {
  console.log('Cordova:   startCordova.jsx  initializationForCordova');
  console.log('Cordova:   Startup sequence 1: Wait for deviceready event');
  document.addEventListener('deviceready', (id) => {
    window.isDeviceReady = true;
    console.log('Cordova:   window.isDeviceReady', window.isDeviceReady, 'Event: ', id.type);
    console.log(`Cordova:   Running cordova-${window.cordova.platformId}@${window.cordova.version}`);
    // const { plugins: { screensize } } = window;
    console.log('Cordova:   Startup sequence 2: Wait for pbakondy screensize');
    // screensize.get((result) => {
    //   console.log('Cordova:   screensize.get: ', JSON.stringify(result));
    //   // dumpObjProps('window.device', window.device);
    //   window.pbakondyScreenSize = result;
    if (isIPad()) {
      document.querySelector('body').style.height = getCordovaScreenHeight();
      console.log('Cordova: Initial "body" height for iPad = calcualation disabled '); // , result.height / result.scale);
    }
    const { $ } = window;
    console.log('Cordova:   Startup sequence 3: Wait for an initial voterRetrieve');
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

        // getProcessorArchitecture();

        // Cordova only, override "open" to use InAppBrowser to open any outside site
        // const { cordova: { InAppBrowser, plugins: { firebase: { messaging } } } } = window;
        const { cordova: { InAppBrowser } } = window;
        if (InAppBrowser) {
          console.log('Cordova:   InAppBrowser.open');
          window.open = InAppBrowser.open;
        } else {
          console.warn('Cordova: Warning: InAppBrowser for Cordova is not installed!');
        }

        try {
          console.log('getVersionNumber() cordova', window.cordova);
          console.log('getVersionNumber() cordova.getAppVersion', window.cordova.getAppVersion);

          // Prevent the app from rotating to Landscape -- mostly to simplify layout permutations
          try {
            const { screen: { orientation: { lock } } } = window;
            console.log('Cordova:   screen lock 1st try');
            lock('portrait').then(() => {
              postLockInitialization(voterDeviceId, startReact);
            });
          } catch (errLock) {
            try {
              // Aug 2023: The lock() API does show up, after a second or two, but adding a setTimout causes the app to hang
              console.log('Cordova:   screen lock 2nd try ', errLock);
              const { screen: { orientation: { lock } } } = window;
              lock('portrait').then(() => {
                postLockInitialization(voterDeviceId, startReact);
              });
            } catch (errLockFinal) {
              // Aug 2023:  Often works the second time, if not wait for https://github.com/apache/cordova-plugin-screen-orientation/pull/116 to be resolved for iOS 1.4
              console.log('Cordova:   screen lock FAILED the 2nd try, giving up: ', errLock);
              postLockInitialization(voterDeviceId, startReact);
            }
          }
          // });
        } catch (err) {
          console.log('Cordova: ERROR ', err);
        }
      }
    });

    // 9/28/23 TODO HACK TO AVOID PKUGIN THAT MIGHT NOT BE LOADING
    if (isIOS() && window.Keyboard) {
      window.Keyboard.disableScroll(false);  // Aug 2022, need to set the initial state
    }
    // });
  });
}

export function removeCordovaSpecificListeners () {
  if (isIOS()) {
    window.removeEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.removeEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}
