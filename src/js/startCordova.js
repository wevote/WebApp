import VoterActions from './actions/VoterActions';
import AppObservableStore from './common/stores/AppObservableStore';
import { getCordovaScreenHeight, isIOS, isIOSAppOnMac, isIPad, isSimulator, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from './common/utils/cordovaUtils';
import initializejQuery from './common/utils/initializejQuery';
import { isAndroid, isCordova } from './common/utils/isCordovaOrWebApp';
import Cookies from './common/utils/js-cookie/Cookies';
import { httpLog } from './common/utils/logging';
import TwitterSignIn from './components/Twitter/TwitterSignIn';
import webAppConfig from './config';
import VoterStore from './stores/VoterStore';
import { handlePositiveAppReview } from './utils/appReviewFunctions';
import insertCloudWatchLoggingFork from './utils/cloudWatchLogging';


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
      navigator.notification.alert(
        alert,
        () => console.log('Cordova: WeVote FCM Message navigator.notification.alert dismissed'),
        'WeVote',
      );

      // Save until Android badge count is working, or we give up on it
      // for (const [key, value] of Object.entries(payload)) {
      //   console.log(`'Firebase FCM - FCM element ${key}: ${value}`);
      //   console.log('key = \'' + key + '\'');
      //   if (key === 'aps') {
      //     console.log('key === aps');
      //     for (const [key2, value2] of Object.entries(value)) {
      //       console.log(`Firebase FCM - FCM aps element ${key2}: ${value2}`);
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

  // getInstanceId seems to have disappeared, 10/22/21
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

function initializeCordovaPluginAppRate () {
  const { AppRate: { setPreferences }, SafariViewController, open } = window;
  console.log('Cordova:   Initializing cordova-plugin-apprate');
  window.cordovaAppStartTime = Date.now();

  setPreferences({
    displayAppName: 'WeVote Ballot Guide',
    storeAppURL: {
      ios: '1347335726',
      android: 'market://details?id=org.wevote.cordova',
    },
    reviewType: {
      ios: 'AppStoreReview',
      android: 'InAppBrowser',
    },
    usesUntilPrompt: webAppConfig.REVIEW_USES_UNTIL_PROMPT,
    promptAgainForEachNewVersion: false,
    openUrl: (url) => {
      let safariAvailable = false;

      if (SafariViewController) {
        SafariViewController.isAvailable((available) => {
          safariAvailable = available;
        });
      }

      if (!safariAvailable) {
        open(url, '_blank', 'location=yes');
      } else {
        SafariViewController.show(
          {
            url,
            barColor: '#0000ff',          // on iOS 10+ you can change the background color as well
            controlTintColor: '#00ffff',  // on iOS 10+ you can override the default tintColor
            tintColor: '#00ffff',         // should be set to same value as controlTintColor and will be a fallback on older ios
          },
          // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
          (result) => {
            console.log(`Cordova:   CordovaPluginAppRate opened, loaded, or closed ${result.event}`);
          },
          (err) => {
            console.log(`Cordova:   CordovaPluginAppRate Error: ${err}`);
          },
        );
      }
    },
    customLocale: {
      title: 'Would you mind rating %@?',
      message: 'It won’t take more than a minute and helps to promote our app. Thanks for your support!',
      cancelButtonLabel: 'Not Now',
      laterButtonLabel: 'Maybe Later',
      rateButtonLabel: 'Rate It Now',
      yesButtonLabel: 'Yes!',
      noButtonLabel: 'No',
      appRatePromptTitle: 'Enjoying %@? \nYour feedback helps us grow!',
      feedbackPromptTitle: 'Would you consider giving us some feedback?',   // on why you don't like the app
    },
    callbacks: {
      handleNegativeFeedback: () => {
        const page = AppObservableStore.getNegativeFeedbackPage();
        AppObservableStore.setShowNegativeFeedbackModal(page);
        console.log(`Cordova:   handleNegativeFeedback callback entry, AppObservableStore.setShowNegativeFeedbackModal(${page})`);
      },
      onRateDialogShow: (callback) => {
        console.log('Cordova:   CordovaPluginAppRate onRateDialogShow callback');
        callback(1); // cause immediate click on 'Rate Now' button
      },
      onButtonClicked: (buttonIndex) => {
        console.log(`Cordova:   CordovaPluginAppRate onButtonClicked -> ${buttonIndex}`);
        if (buttonIndex === 3) {
          // buttonIndex === 3, means "cordova-plugin-apprate" has invoked AppRate.navigateToAppStore()
          const appReviewVersion = 'window.weVoteAppVersion';       // modified by buildSrcCordova.js
          const appReviewPlatform = isIOS() ? 'iOS' : 'Android';
          console.log(`Cordova:   AppRate.navigateToAppStore() has been called, saving update with handlePositiveAppReview(${appReviewVersion}, ${appReviewPlatform})`);
          handlePositiveAppReview(appReviewVersion, appReviewPlatform);
        }
      },
    },
  });

  // setTimeout(() => {
  //   promptForRating();
  // }, 5000); // DELAY_BEFORE_PROMPTING_FOR_RATING);
}

export function initializationForCordova (startReact) {
  insertCloudWatchLoggingFork();
  console.log('Cordova:   startCordova.jsx  initializationForCordova');
  console.log('Cordova:   Startup sequence 1: Wait for deviceready event');
  document.addEventListener('deviceready', (id) => {
    window.isDeviceReady = true;
    console.log(`Cordova:   window.isDeviceReady: ${window?.isDeviceReady}, Event: ${id?.type}`);
    console.log(`Cordova:   Running cordova-${window?.cordova?.platformId}@${window?.cordova?.version}`);
    console.log('Cordova:   Startup sequence 2: Wait for pbakondy screensize');
    if (isIPad()) {
      document.querySelector('body').style.height = getCordovaScreenHeight();
      console.log('Cordova:   Initial "body" height for iPad = calculation disabled '); // , result.height / result.scale);
    }
    if (isAndroid()) {
      // July 2025, Android "backbutton" is not handled since pushHistory is only keeping the previous location, so pressing "backbutton" twice would be a mess
      // Also it was originally noted as a bug in the How it Works dialog, which would be a special case that would not use pushHistory
      document.addEventListener('backbutton', () => {}, false);
    }
    initializejQuery(() => {
      const { $ } = window;
      console.log('Cordova:   Startup sequence 3: Wait for an initial voterRetrieve, found jQuery $.fn.jquery = ', $.fn.jquery);
    });

    window.AndroidNotch.hasCutout((cutout) => {
      console.log(`Cordova:   Android Cutout: ${cutout}`);
      window.androidNotchCutout  = cutout;
    });

    window.AndroidNotch.getInsetTop((insetSize) => {
      const offset = Math.trunc(insetSize);
      console.log(`Cordova:   Android Top Inset: ${offset}`);
      window.androidNotchInset  = offset || 0;
    });

    const cookie = Cookies.get('voter_device_id');
    const idPathComponent = (cookie && cookie.length > 10) ? `/?voter_device_id=${cookie}` : '';
    const initialAjaxUrl = `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}voterRetrieve${idPathComponent}`;
    httpLog(`AJAX URL (Initial): ${initialAjaxUrl}`);
    const { $ } = window;
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
          // console.log('getVersionNumber() cordova', window.cordova);
          // console.log('getVersionNumber() cordova.getAppVersion', window.cordova.getAppVersion);

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
              console.log(`Cordova:   screen lock FAILED the 2nd try, giving up: ${errLock}`);
              postLockInitialization(voterDeviceId, startReact);
            }
          }
        } catch (err) {
          console.log('Cordova: ERROR ', err);
        }
      }
    });

    initializeCordovaPluginAppRate();

    // 9/28/23 TODO HACK TO AVOID PLUGIN THAT MIGHT NOT BE LOADING
    if (isIOS() && window.Keyboard) {
      window.Keyboard.disableScroll(false);  // Aug 2022, need to set the initial state
    }
  });
}

export function removeCordovaSpecificListeners () {
  if (isIOS()) {
    window.removeEventListener('keyboardWillShow', localPrepareForCordovaKeyboard);
    window.removeEventListener('keyboardDidHide', localRestoreStylesAfterCordovaKeyboard);
  }
}
