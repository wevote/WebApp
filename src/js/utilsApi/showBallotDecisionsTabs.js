import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import BallotStore from '../stores/BallotStore';  // eslint-disable-line import/no-cycle

export default function showBallotDecisionsTabs () {
  // src/js/common/utils/isMobileScreenSize.js should be used to avoid problems, 500 is an imperfect criteria
  const isMobileScreenSizeForShowBallotDecisionsTabs = window.innerWidth < 500;
  return (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) &&
    (BallotStore.ballotRemainingChoicesLength > 0) &&
    !isMobileScreenSizeForShowBallotDecisionsTabs &&
    isWebApp();  // November 2025:  Disabled for Cordova until the feature is finished and released to production
}
