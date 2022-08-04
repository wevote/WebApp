import { Dialog } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';

const AdviserIntroModal = React.lazy(() => import(/* webpackChunkName: 'AdviserIntroModal' */ '../CompleteYourProfile/AdviserIntroModal'));
const AskFriendsModal = React.lazy(() => import(/* webpackChunkName: 'AskFriendsModal' */ '../Friends/AskFriendsModal'));
const ChooseOrOpposeIntroModal = React.lazy(() => import(/* webpackChunkName: 'ChooseOrOpposeIntroModal' */ '../Widgets/ItemActionBar/ChooseOrOpposeIntroModal'));
const FirstPositionIntroModal = React.lazy(() => import(/* webpackChunkName: 'FirstPositionIntroModal' */ '../CompleteYourProfile/FirstPositionIntroModal'));
const ImageUploadModal = React.lazy(() => import(/* webpackChunkName: 'ImageUploadModal' */ '../Settings/ImageUploadModal'));
const PersonalizedScoreIntroModal = React.lazy(() => import(/* webpackChunkName: 'PersonalizedScoreIntroModal' */ '../CompleteYourProfile/PersonalizedScoreIntroModal'));
const SelectBallotModal = React.lazy(() => import(/* webpackChunkName: 'SelectBallotModal' */ '../Ballot/SelectBallotModal'));
const ShareModal = React.lazy(() => import(/* webpackChunkName: 'ShareModal' */ '../Share/ShareModal'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../SignIn/SignInModal'));
const ValuesIntroModal = React.lazy(() => import(/* webpackChunkName: 'ValuesIntroModal' */ '../CompleteYourProfile/ValuesIntroModal'));

// A function component, for all the various modals that come out of the HeaderBar
function HeaderBarModals (props) {
  const {
    classes, closeAdviserIntroModal, closeAskFriendsModal, closeChooseOrOpposeIntroModal,
    closeFirstPositionIntroModal, closeImageUploadModal,
    closePersonalizedScoreIntroModal, closeShareModal, closeSignInModal,
    closeValuesIntroModal, shows, closeSelectBallotModal,
  } = props;

  const {
    showAdviserIntroModal, showAskFriendsModal, showChooseOrOpposeIntroModal,
    showFirstPositionIntroModal,
    showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
    showSelectBallotModal, showSelectBallotModalEditAddress,
    showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
  } = shows;
  const ballotBaseUrl = ['ready'].includes(normalizedHrefPage()) ? '/ready' : '/ballot';
  const voter = VoterStore.getVoter();
  const voterIsSignedIn = voter && voter.is_signed_in;
  const shareModalStep = AppObservableStore.getShareModalStep();

  // renderLog(`HeaderBarModals`);
  // console.log('HeaderBarModals showSignInModal:', showSignInModal);
  let advisorIntroModalHtml = <></>;
  if (showAdviserIntroModal) {
    advisorIntroModalHtml = (
      <Suspense fallback={<></>}>
        <AdviserIntroModal
          show={showAdviserIntroModal}
          toggleFunction={closeAdviserIntroModal}
        />
      </Suspense>
    );
  }
  let askFriendsModal = <></>;
  if (showAskFriendsModal) {
    askFriendsModal = (
      <Suspense fallback={<></>}>
        <AskFriendsModal
          show={showAskFriendsModal}
          toggleFunction={closeAskFriendsModal}
        />
      </Suspense>
    );
  }
  let chooseOrOpposeIntroModal = <></>;
  if (showChooseOrOpposeIntroModal) {
    const ballotItemType = 'CANDIDATE';
    chooseOrOpposeIntroModal = (
      <Suspense fallback={<></>}>
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={showChooseOrOpposeIntroModal}
          onClose={closeChooseOrOpposeIntroModal}
        >
          <ChooseOrOpposeIntroModal
            ballotItemType={ballotItemType}
            onClose={closeChooseOrOpposeIntroModal}
          />
        </Dialog>
      </Suspense>
    );
  }
  let firstPositionIntroModal = <></>;
  if (showFirstPositionIntroModal) {
    firstPositionIntroModal = (
      <Suspense fallback={<></>}>
        <FirstPositionIntroModal
          show={showFirstPositionIntroModal}
          toggleFunction={closeFirstPositionIntroModal}
        />
      </Suspense>
    );
  }
  let imageUploadModal = <></>;
  if (showImageUploadModal) {
    imageUploadModal = (
      <Suspense fallback={<></>}>
        <ImageUploadModal
          show={showImageUploadModal}
          toggleFunction={closeImageUploadModal}
        />
      </Suspense>
    );
  }
  let paidAccountUpgradeModal = <></>;
  if (showPaidAccountUpgradeModal) {
    paidAccountUpgradeModal = <></>;
    // TODO: Backport "@stripe/react-stripe-js" use from Campaigns
    //   <Suspense fallback={<></>}>
    //     <PaidAccountUpgradeModal
    //       initialPricingPlan={paidAccountUpgradeMode}
    //       show={showPaidAccountUpgradeModal}
    //       toggleFunction={this.closePaidAccountUpgradeModal}
    //     />
    //   </Suspense>
  }
  let personalizedScoreIntroModal = <></>;
  if (showPersonalizedScoreIntroModal) {
    personalizedScoreIntroModal = (
      <Suspense fallback={<></>}>
        <PersonalizedScoreIntroModal
          show={showPersonalizedScoreIntroModal}
          toggleFunction={closePersonalizedScoreIntroModal}
        />
      </Suspense>
    );
  }
  let selectBallotModal = <></>;
  if (showSelectBallotModal) {
    selectBallotModal = (
      <Suspense fallback={<></>}>
        <SelectBallotModal
          ballotBaseUrl={ballotBaseUrl}
          closeSelectBallotModal={closeSelectBallotModal}
          showEditAddress={showSelectBallotModalEditAddress}
          show
        />
      </Suspense>
    );
  }
  let shareModalHtml = <></>;
  if (showShareModal) {
    shareModalHtml = (
      <Suspense fallback={<></>}>
        <ShareModal
          voterIsSignedIn={voterIsSignedIn}
          show={showShareModal}
          shareModalStep={shareModalStep}
          closeShareModal={closeShareModal}
        />
      </Suspense>
    );
  }
  let signInModalHtml = <></>;
  if (showSignInModal) {
    signInModalHtml = (
      <Suspense fallback={<></>}>
        <SignInModal
          signInTitle="Sign In Or Sign Up"
          signInSubTitle=""
          toggleOnClose={closeSignInModal}
          uponSuccessfulSignIn={closeSignInModal}
        />
      </Suspense>
    );
  }
  let valuesIntroModalHtml = <></>;
  if (showValuesIntroModal) {
    valuesIntroModalHtml = (
      <Suspense fallback={<></>}>
        <ValuesIntroModal
          show={showValuesIntroModal}
          toggleFunction={closeValuesIntroModal}
        />
      </Suspense>
    );
  }
  return (
    <>
      {advisorIntroModalHtml}
      {askFriendsModal}
      {chooseOrOpposeIntroModal}
      {firstPositionIntroModal}
      {imageUploadModal}
      {paidAccountUpgradeModal}
      {personalizedScoreIntroModal}
      {selectBallotModal}
      {shareModalHtml}
      {signInModalHtml}
      {valuesIntroModalHtml}
    </>
  );
}

HeaderBarModals.propTypes = {
  classes: PropTypes.object,
  // closePaidAccountUpgradeModal: PropTypes.func,
  closeShareModal: PropTypes.func,
  closeAdviserIntroModal: PropTypes.func,
  closeAskFriendsModal: PropTypes.func,
  closeChooseOrOpposeIntroModal: PropTypes.func,
  closeFirstPositionIntroModal: PropTypes.func,
  closePersonalizedScoreIntroModal: PropTypes.func,
  closeSelectBallotModal: PropTypes.func,
  closeSignInModal: PropTypes.func,
  closeValuesIntroModal: PropTypes.func,
  closeImageUploadModal: PropTypes.func,
  shows: PropTypes.object,
};

const styles = () => ({
  dialogPaper: {
    minHeight: 282,
    margin: '0 8px',
  },
});

export default withStyles(styles)(HeaderBarModals);
