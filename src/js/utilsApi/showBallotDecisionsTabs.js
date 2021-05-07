import BallotStore from '../stores/BallotStore';  // eslint-disable-line import/no-cycle

export default function showBallotDecisionsTabs () {
  const isMobileScreenSize = window.innerWidth < 500;
  return (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) &&
    (BallotStore.ballotRemainingChoicesLength > 0) &&
    !isMobileScreenSize;
}
