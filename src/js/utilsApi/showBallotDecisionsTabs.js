import BallotStore from '../stores/BallotStore'; // eslint-disable-line import/no-cycle

export default function showBallotDecisionsTabs () {
  // Dale 2026-07-18 I would like showBallotDecisionsTabs to not be based on mobile vs. desktop, but only based on if ballot choices have been made.
  // WV-679 is the ticket where the UX team is reworking the design for in all screen sizes.
  return (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) &&
    (BallotStore.ballotRemainingChoicesLength > 0);
}
