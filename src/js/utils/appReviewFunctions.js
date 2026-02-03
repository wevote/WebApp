import { isCordova } from '../common/utils/isCordovaOrWebApp';
import AppObservableStore from '../common/stores/AppObservableStore';
import VoterActions from '../actions/VoterActions';
import webAppConfig from '../config';
import SupportStore from '../stores/SupportStore';
import VoterStore from '../stores/VoterStore';
import { validateEmail } from './regex-checks';


function checkForAppReview (source) {
  if (isCordova() && VoterStore.getVoterIsSignedIn()) {
    const { cordovaAppStartTime } = window;

    console.log('Cordova:   checkForNeedToReviewApp voter called');

    const msAppUptime = Date.now() - cordovaAppStartTime;
    if (msAppUptime > webAppConfig.REVIEW_DELAY_BEFORE_CHECK) {
      const voter = VoterStore.getVoter();
      console.log(`Cordova:   checkForNeedToReviewApp source ${source}, voter ${voter.we_vote_id}, app_review_state ${voter.app_review_state}, hasBeenAskedToReview: ${AppObservableStore.getAskedVoterToReviewApp()}`);
      if (voter?.app_review_state && voter.app_review_state === 'NONE') {
        const hasAsked = AppObservableStore.getAskedVoterToReviewApp();
        console.log(`Cordova:   checkForNeedToReviewApp voter hasAsked ${hasAsked}`);
        if (!hasAsked) {
          if (['POSITION', 'ITEM'].includes(source)) {
            // The support store voter_supports and voter_opposes, contains double entries for both candidate and politician, so divide by 2
            const supportOpposeCount = (SupportStore.getVoterSupportsListLength() + SupportStore.getVoterOpposesListLength()) / 2;
            if (webAppConfig.REVIEW_MIN_NUMBER_SUPPORT_OPPOSE > supportOpposeCount) {
              console.log(`Cordova:   checkForNeedToReviewApp checkForNeedToReviewApp ignored since the voter's ${supportOpposeCount} opinions is less than the required ${webAppConfig.REVIEW_MIN_NUMBER_SUPPORT_OPPOSE} opinions`);
              return false;
            }
          }
          console.log('Cordova:   checkForNeedToReviewApp: true, source: ', source);
          AppObservableStore.setNegativeFeedbackPage(source);
          return true;
        }
      }
    } else {
      console.log(`Cordova:  checkForNeedToReviewApp checkForNeedToReviewApp ignored for the first ${webAppConfig.REVIEW_DELAY_BEFORE_CHECK} ms`);
      return false;
    }
  }
  return false;
}

const platforms = ['iOS', 'Android'];
function handleNegativeAppReview (appReviewVersion, appReviewPlatform, appReviewBodyNegativeBypass, appReviewEmail) {
  if (!platforms.includes(appReviewPlatform)) {
    throw new Error(`handleNegativeAppReview received invalid appReviewPlatform ${appReviewPlatform}`);
  }
  if (appReviewVersion.length < 5 || appReviewVersion.split('.').length < 3) {
    throw new Error(`handleNegativeAppReview received invalid appReviewVersion ${appReviewVersion}`);
  }
  if (appReviewEmail.length > 0 && !validateEmail(appReviewEmail)) {
    throw new Error(`handleNegativeAppReview received invalid reviewEmail ${appReviewEmail}`);
  }
  AppObservableStore.setAskedVoterToReviewApp(true);   // So we only ask once peer session
  VoterActions.updateReviewedAppFields('Negative', appReviewVersion, appReviewPlatform,
    appReviewBodyNegativeBypass, appReviewEmail);
}

// eslint-disable-next-line no-unused-vars
function handlePositiveAppReview (appReviewVersion, appReviewPlatform) {
  if (!platforms.includes(appReviewPlatform)) {
    throw new Error(`handlePositiveAppReview received invalid appReviewPlatform ${appReviewPlatform}`);
  }
  if (appReviewVersion.length < 5 || appReviewVersion.split('.').length < 3) {
    throw new Error(`handlePositiveAppReview received invalid appReviewVersion ${appReviewVersion}`);
  }
  AppObservableStore.setAskedVoterToReviewApp(true);  // Only ask once per session (assuming they say no, or "later")
  VoterActions.updateReviewedAppFields('POSITIVE', appReviewVersion, appReviewPlatform, '');
}

export { checkForAppReview, handleNegativeAppReview, handlePositiveAppReview };
