import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { normalizedHrefPage } from '../../utils/applicationUtils';
import AdviserIntroModal from '../CompleteYourProfile/AdviserIntroModal';

const FirstPositionIntroModal = React.lazy(() => import(/* webpackChunkName: 'FirstPositionIntroModal' */ '../CompleteYourProfile/FirstPositionIntroModal'));
const ImageUploadModal = React.lazy(() => import(/* webpackChunkName: 'ImageUploadModal' */ '../Settings/ImageUploadModal'));
const PersonalizedScoreIntroModal = React.lazy(() => import(/* webpackChunkName: 'PersonalizedScoreIntroModal' */ '../CompleteYourProfile/PersonalizedScoreIntroModal'));
const SelectBallotModal = React.lazy(() => import(/* webpackChunkName: 'SelectBallotModal' */ '../Ballot/SelectBallotModal'));
const ShareModal = React.lazy(() => import(/* webpackChunkName: 'ShareModal' */ '../Share/ShareModal'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../Widgets/SignInModal'));
const ValuesIntroModal = React.lazy(() => import(/* webpackChunkName: 'ValuesIntroModal' */ '../CompleteYourProfile/ValuesIntroModal'));

// A function component, for all the various modals that come out of the HeaderBar
export default function HeaderBarModals (props) {
  const { shows, closeSignInModal, toggleSelectBallotModal, closeShareModal, closeAdviserIntroModal,
    closeFirstPositionIntroModal, closePersonalizedScoreIntroModal, closeValuesIntroModal,
    closeImageUploadModal,
  } = props;

  const {
    showAdviserIntroModal, showFirstPositionIntroModal,
    showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
    showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections,
    showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
  } = shows;
  const ballotBaseUrl = ['ready'].includes(normalizedHrefPage()) ? '/ready' : '/ballot';
  const voter = VoterStore.getVoter();
  const voterIsSignedIn = voter && voter.is_signed_in;
  const shareModalStep = AppObservableStore.getShareModalStep();


  // renderLog(`HeaderBarModals`);

  if (showSignInModal) {
    return (
      <Suspense fallback={<></>}>
        <SignInModal
          show={showSignInModal}
          closeFunction={closeSignInModal}
        />
      </Suspense>
    );
  } else if (showSelectBallotModal) {
    return (
      <Suspense fallback={<></>}>
        <SelectBallotModal
          ballotBaseUrl={ballotBaseUrl}
          hideAddressEdit={showSelectBallotModalHideAddress}
          hideElections={showSelectBallotModalHideElections}
          show
          toggleFunction={toggleSelectBallotModal}
        />
      </Suspense>
    );
  } else if (showPaidAccountUpgradeModal) {
    return null;
    // TODO: Backport "@stripe/react-stripe-js" use from Campaigns
    //   <Suspense fallback={<></>}>
    //     <PaidAccountUpgradeModal
    //       initialPricingPlan={paidAccountUpgradeMode}
    //       show={showPaidAccountUpgradeModal}
    //       toggleFunction={this.closePaidAccountUpgradeModal}
    //     />
    //   </Suspense>
  } else if (showShareModal) {
    return (
      <Suspense fallback={<></>}>
        <ShareModal
          voterIsSignedIn={voterIsSignedIn}
          show={showShareModal}
          shareModalStep={shareModalStep}
          closeShareModal={closeShareModal}
        />
      </Suspense>
    );
  } else if (showAdviserIntroModal) {
    return (
      <Suspense fallback={<></>}>
        <AdviserIntroModal
          show={showAdviserIntroModal}
          toggleFunction={closeAdviserIntroModal}
        />
      </Suspense>
    );
  } else if (showFirstPositionIntroModal) {
    return (
      <Suspense fallback={<></>}>
        <FirstPositionIntroModal
          show={showFirstPositionIntroModal}
          toggleFunction={closeFirstPositionIntroModal}
        />
      </Suspense>
    );
  } else if (showPersonalizedScoreIntroModal) {
    return (
      <Suspense fallback={<></>}>
        <PersonalizedScoreIntroModal
          show={showPersonalizedScoreIntroModal}
          toggleFunction={closePersonalizedScoreIntroModal}
        />
      </Suspense>
    );
  } else if (showValuesIntroModal) {
    return (
      <Suspense fallback={<></>}>
        <ValuesIntroModal
          show={showValuesIntroModal}
          toggleFunction={closeValuesIntroModal}
        />
      </Suspense>
    );
  } else if (showImageUploadModal) {
    return (
      <Suspense fallback={<></>}>
        <ImageUploadModal
          show={showImageUploadModal}
          toggleFunction={closeImageUploadModal}
        />
      </Suspense>
    );
  }
  return null;
}
HeaderBarModals.propTypes = {
  shows: PropTypes.object,
  closeSignInModal: PropTypes.func,
  toggleSelectBallotModal: PropTypes.func,
  // closePaidAccountUpgradeModal: PropTypes.func,
  closeShareModal: PropTypes.func,
  closeAdviserIntroModal: PropTypes.func,
  closeFirstPositionIntroModal: PropTypes.func,
  closePersonalizedScoreIntroModal: PropTypes.func,
  closeValuesIntroModal: PropTypes.func,
  closeImageUploadModal: PropTypes.func,
};
