import { Dialog } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import apiCalming from '../../common/utils/apiCalming';
import { historyPush } from '../../common/utils/cordovaUtils';
import { normalizedHref, normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import BallotActions from '../../actions/BallotActions';
import VoterActions from '../../actions/VoterActions';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import SignInJoinText from '../SignIn/SignInJoinText';

const AddBallotItemModal = React.lazy(() => import(/* webpackChunkName: 'AddBallotItemModal' */ '../BallotItem/AddBallotItemModal'));
const AdviserIntroModal = React.lazy(() => import(/* webpackChunkName: 'AdviserIntroModal' */ '../CompleteYourProfile/AdviserIntroModal'));
const AskFriendsModal = React.lazy(() => import(/* webpackChunkName: 'AskFriendsModal' */ '../Friends/AskFriendsModal'));
const BallotChoicesAndSettingsModal = React.lazy(() => import(/* webpackChunkName: 'BallotChoicesAndSettingsModal' */ '../CompleteYourProfile/BallotChoicesAndSettingsModal'));
const ChooseOrOpposeIntroModal = React.lazy(() => import(/* webpackChunkName: 'ChooseOrOpposeIntroModal' */ '../Widgets/ItemActionBar/ChooseOrOpposeIntroModal'));
const ChooseOrOpposeSignInModal = React.lazy(() => import(/* webpackChunkName: 'ChooseOrOpposeSignInModal' */ '../Widgets/ItemActionBar/ChooseOrOpposeSignInModal'));
const CompleteYourProfileModalController = React.lazy(() => import(/* webpackChunkName: 'CompleteYourProfileModalController' */ '../../common/components/Settings/CompleteYourProfileModalController'));
const FirstPositionIntroModal = React.lazy(() => import(/* webpackChunkName: 'FirstPositionIntroModal' */ '../CompleteYourProfile/FirstPositionIntroModal'));
const ImageUploadModal = React.lazy(() => import(/* webpackChunkName: 'ImageUploadModal' */ '../Settings/ImageUploadModal'));
const MakePublicGateModal = React.lazy(() => import(/* webpackChunkName: 'MakePublicGateModal' */ '../Widgets/ItemActionBar/MakePublicGateModal'));
const PersonalizedScoreIntroModal = React.lazy(() => import(/* webpackChunkName: 'PersonalizedScoreIntroModal' */ '../CompleteYourProfile/PersonalizedScoreIntroModal'));
const SelectBallotModal = React.lazy(() => import(/* webpackChunkName: 'SelectBallotModal' */ '../Ballot/SelectBallotModal'));
const ShareModal = React.lazy(() => import(/* webpackChunkName: 'ShareModal' */ '../Share/ShareModal'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));
const ValuesIntroModal = React.lazy(() => import(/* webpackChunkName: 'ValuesIntroModal' */ '../CompleteYourProfile/ValuesIntroModal'));
const VerifyWithEmailModal = React.lazy(() => import(/* webpackChunkName: 'VerifyWithEmailModal' */ '../../common/components/Politician/UpdatePoliticianInformation/VerifyWithEmailModal'));
const VerifyOtherWaysModal = React.lazy(() => import(/* webpackChunkName: 'VerifyOtherWaysModal' */ '../../common/components/Politician/UpdatePoliticianInformation/VerifyOtherWaysModal'));
const VoterPositionEntryAndDisplay = React.lazy(() => import(/* webpackChunkName: 'VoterPositionEntryAndDisplay' */ '../PositionItem/VoterPositionEntryAndDisplay'));


// Formerly: A function component, for all the various modals that come out of the HeaderBar
class HeaderBarModals extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showAddBallotItemModal: false,
      showAdviserIntroModal: false,
      showChooseOrOpposeIntroModal: false,
      showChooseOrOpposeSignInModal: false,
      showBallotChoicesAndSettingsModal: false,
      showClaimProfileWithEmailModal: false,
      showClaimProfileWithOtherWaysModal: false,
      showEditPositionModal: false,
      showFirstPositionIntroModal: false,
      showMakePublicGateModal: false,
      showSelectBallotModal: false,
      showSelectBallotModalEditAddress: false,
      showShareModal: false,
      showSignInModal: false,
      showPaidAccountUpgradeModal: false,
      showPersonalizedScoreIntroModal: false,
      showValuesIntroModal: false,
      showImageUploadModal: false,
    };
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.closeSelectBallotModal = this.closeSelectBallotModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
  }

  componentDidMount () {
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onAppObservableStoreChange () {
    // console.log('------ HeaderBarModals, onAppObservableStoreChange');
    const paidAccountUpgradeMode = AppObservableStore.showPaidAccountUpgradeModal() || '';
    // console.log('HeaderBar paidAccountUpgradeMode:', paidAccountUpgradeMode);
    const showPaidAccountUpgradeModal = paidAccountUpgradeMode && paidAccountUpgradeMode !== '';
    // console.log('HeaderBar onAppObservableStoreChange showPaidAccountUpgradeModal:', showPaidAccountUpgradeModal);
    this.setState({
      // paidAccountUpgradeMode,
      showAddBallotItemModal: AppObservableStore.showAddBallotItemModal(),
      showAdviserIntroModal: AppObservableStore.showAdviserIntroModal(),
      showAskFriendsModal: AppObservableStore.showAskFriendsModal(),
      showBallotChoicesAndSettingsModal: AppObservableStore.showBallotChoicesAndSettingsModal(),
      showChooseOrOpposeIntroModal: AppObservableStore.showChooseOrOpposeIntroModal(),
      showChooseOrOpposeSignInModal: AppObservableStore.showChooseOrOpposeSignInModal(),
      showClaimProfileWithEmailModal: AppObservableStore.getShowClaimProfileWithEmailModal(),
      showClaimProfileWithOtherWaysModal: AppObservableStore.getShowClaimProfileWithOtherWaysModal(),
      showEditPositionModal: AppObservableStore.getShowEditPositionModal(),
      showFirstPositionIntroModal: AppObservableStore.showFirstPositionIntroModal(),
      showMakePublicGateModal: AppObservableStore.showMakePublicGateModal(),
      showPaidAccountUpgradeModal,
      showShareModal: AppObservableStore.showShareModal(),
      showPersonalizedScoreIntroModal: AppObservableStore.showPersonalizedScoreIntroModal(),
      showSelectBallotModal: AppObservableStore.showSelectBallotModal(),
      showSelectBallotModalEditAddress: AppObservableStore.showSelectBallotModalEditAddress(),
      showSignInModal: AppObservableStore.showSignInModal(),
      showValuesIntroModal: AppObservableStore.showValuesIntroModal(),
      showImageUploadModal: AppObservableStore.showImageUploadModal(),
    });
  }

  closeAddBallotItemModal = () => {
    AppObservableStore.setShowAddBallotItemModal(false);
  };

  closeAdviserIntroModal = () => {
    AppObservableStore.setShowAdviserIntroModal(false);
  };

  closeAskFriendsModal = () => {
    AppObservableStore.setShowAskFriendsModal(false);
  };

  closeBallotChoicesAndSettingsModal = () => {
    AppObservableStore.setShowBallotChoicesAndSettingsModal(false);
    // this.setState({ showBallotChoicesAndSettingsModal: false });
  };

  closeChooseOrOpposeIntroModal = () => {
    AppObservableStore.setShowChooseOrOpposeIntroModal(false);
  };

  closeChooseOrOpposeSignInModal = () => {
    AppObservableStore.setShowChooseOrOpposeSignInModal(false);
  };

  closeClaimProfileWithEmailModal = () => {
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
  };

  closeEditPositionModal = () => {
    AppObservableStore.setShowEditPositionModal(false);
    this.setState({ showEditPositionModal: false });
  };

  closeFirstPositionIntroModal = () => {
    AppObservableStore.setShowFirstPositionIntroModal(false);
  };

  closeImageUploadModal = () => {
    AppObservableStore.setShowImageUploadModal(false);
  };

  closeValuesIntroModal = () => {
    AppObservableStore.setShowValuesIntroModal(false);
  };

  closePersonalizedScoreIntroModal = () => {
    AppObservableStore.setShowPersonalizedScoreIntroModal(false);
  };

  closePaidAccountUpgradeModal () {
    AppObservableStore.setShowPaidAccountUpgradeModal(false);
  }

  closeShareModal () {
    AppObservableStore.setShowShareModal(false);
    // AppObservableStore.setWhatAndHowMuchToShare('');
    const pathname = normalizedHref();
    // console.log('HeaderBar closeShareModal pathname:', pathname);
    if (stringContains('/modal/share', pathname) && isWebApp()) {
      const pathnameWithoutModalShare = pathname.replace('/modal/share', '');  // Cordova
      // console.log('Navigation closeShareModal pathnameWithoutModalShare:', pathnameWithoutModalShare);
      historyPush(pathnameWithoutModalShare);
    }
  }

  closeSelectBallotModal () {
    const { showSelectBallotModal } = this.state;
    if (!showSelectBallotModal) {
      if (apiCalming('voterBallotListRetrieve', 10000)) {
        // Since this component gets loaded by many pages on first render, we want to delay this call
        // to allow most other requests to get in front of it in line
        const delayBallotRetrieve = 2000;
        this.timer = setTimeout(() => {
          BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
        }, delayBallotRetrieve);
      }
    }
    AppObservableStore.setShowSelectBallotModal(false);

    this.setState({
      showSelectBallotModal: false,
    });
  }

  closeSignInModal () {
    // console.log('HeaderBar closeSignInModal');
    AppObservableStore.setShowSignInModal(false);
    this.setState({ showSignInModal: false });
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    // console.log('HeaderBar toggleSignInModal showSignInModal:', showSignInModal);
    AppObservableStore.setShowSignInModal(!showSignInModal);
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  render () {
    renderLog('HeaderBarModals');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const {
      showAddBallotItemModal, showAdviserIntroModal, showAskFriendsModal, showBallotChoicesAndSettingsModal, showChooseOrOpposeIntroModal, showChooseOrOpposeSignInModal,
      showClaimProfileWithEmailModal, showClaimProfileWithOtherWaysModal, showEditPositionModal, showFirstPositionIntroModal,
      showMakePublicGateModal, showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalEditAddress,
      showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
    } = this.state;

    const ballotBaseUrl = ['ready'].includes(normalizedHrefPage()) ? '/ready' : '/ballot';

    // renderLog(`HeaderBarModals`);
    // console.log('HeaderBarModals showSignInModal:', showSignInModal);
    let addBallotItemModal = <></>;
    if (showAddBallotItemModal) {
      addBallotItemModal = (
        <Suspense fallback={<></>}>
          <AddBallotItemModal
            show={showAddBallotItemModal}
            toggleFunction={this.closeAddBallotItemModal}
          />
        </Suspense>
      );
    }
    let advisorIntroModalHtml = <></>;
    if (showAdviserIntroModal) {
      advisorIntroModalHtml = (
        <Suspense fallback={<></>}>
          <AdviserIntroModal
            show={showAdviserIntroModal}
            toggleFunction={this.closeAdviserIntroModal}
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
            toggleFunction={this.closeAskFriendsModal}
          />
        </Suspense>
      );
    }
    let ballotChoicesAndSettingsModal = <></>;
    if (showBallotChoicesAndSettingsModal) {
      ballotChoicesAndSettingsModal = (
        <Suspense fallback={<></>}>
          <BallotChoicesAndSettingsModal
            show={showBallotChoicesAndSettingsModal}
            toggleFunction={this.closeBallotChoicesAndSettingsModal}
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
            onClose={this.closeChooseOrOpposeIntroModal}
          >
            <ChooseOrOpposeIntroModal
              ballotItemType={ballotItemType}
              onClose={this.closeChooseOrOpposeIntroModal}
            />
          </Dialog>
        </Suspense>
      );
    }
    let chooseOrOpposeSignInModal = <></>;
    if (showChooseOrOpposeSignInModal) {
      const ballotItemType = 'CANDIDATE';
      chooseOrOpposeSignInModal = (
        <Suspense fallback={<></>}>
          <Dialog
            classes={{ paper: classes.dialogPaper }}
            open={showChooseOrOpposeSignInModal}
            onClose={this.closeChooseOrOpposeSignInModal}
          >
            <ChooseOrOpposeSignInModal
              ballotItemType={ballotItemType}
              onClose={this.closeChooseOrOpposeSignInModal}
            />
          </Dialog>
        </Suspense>
      );
    }
    let editPositionModal = <></>;
    if (showEditPositionModal) {
      editPositionModal = (
        <Suspense fallback={<></>}>
          <VoterPositionEntryAndDisplay
            politicianWeVoteId={AppObservableStore.getEditPositionModalPoliticianWeVoteId()}
            openEditModalOnLoad
            onModalClose={this.closeEditPositionModal}
          />
        </Suspense>
      );
    }
    let firstPositionIntroModal = <></>;
    if (showFirstPositionIntroModal) {
      firstPositionIntroModal = (
        <Suspense fallback={<></>}>
          <FirstPositionIntroModal
            show={showFirstPositionIntroModal}
            toggleFunction={this.closeFirstPositionIntroModal}
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
            toggleFunction={this.closeImageUploadModal}
          />
        </Suspense>
      );
    }
    let makePublicGateModal = <></>;
    if (showMakePublicGateModal) {
      // TODO: For analytics, it would be helpful to track the politician a person wants to make a public opinion about
      makePublicGateModal = (
        <Suspense fallback={<></>}>
          <MakePublicGateModal
            politicianWeVoteId=""
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
            toggleFunction={this.closePersonalizedScoreIntroModal}
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
            closeSelectBallotModal={this.closeSelectBallotModal}
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
            show={showShareModal}
            closeShareModal={this.closeShareModal}
          />
        </Suspense>
      );
    }
    let signInModalHtml = <></>;
    if (showSignInModal) {
      signInModalHtml = (
        <Suspense fallback={<></>}>
          <SignInModal
            signInTitle={<SignInJoinText />}
            signInSubTitle={<></>}
            toggleOnClose={this.closeSignInModal}
            uponSuccessfulSignIn={this.closeSignInModal}
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
            toggleFunction={this.closeValuesIntroModal}
          />
        </Suspense>
      );
    }
    let claimProfileWithEmailModal = <></>;
    if (showClaimProfileWithEmailModal) {
      claimProfileWithEmailModal = (
        <Suspense fallback={<></>}>
          <VerifyWithEmailModal
            closeVerifyWithEmailModal={this.closeClaimProfileWithEmailModal}
            politicianWeVoteId={AppObservableStore.getPoliticianWeVoteIdBeingViewed()}
          />
        </Suspense>
      );
    }
    let claimProfileWithOtherWaysModal = <></>;
    if (showClaimProfileWithOtherWaysModal) {
      let politicianName = PoliticianStore.getPoliticianName(AppObservableStore.getPoliticianWeVoteIdBeingViewed());
      if (politicianName === '') {
        politicianName = undefined;
      }
      claimProfileWithOtherWaysModal = (
        <Suspense fallback={<></>}>
          <VerifyOtherWaysModal
            politicianName={politicianName}
            politicianWeVoteId={AppObservableStore.getPoliticianWeVoteIdBeingViewed()}
          />
        </Suspense>
      );
    }
    const completeYourProfileModalController = (
      <Suspense fallback={<></>}>
        <CompleteYourProfileModalController />
      </Suspense>
    );
    return (
      <>
        {addBallotItemModal}
        {advisorIntroModalHtml}
        {askFriendsModal}
        {ballotChoicesAndSettingsModal}
        {chooseOrOpposeIntroModal}
        {chooseOrOpposeSignInModal}
        {claimProfileWithEmailModal}
        {claimProfileWithOtherWaysModal}
        {completeYourProfileModalController}
        {editPositionModal}
        {firstPositionIntroModal}
        {imageUploadModal}
        {makePublicGateModal}
        {paidAccountUpgradeModal}
        {personalizedScoreIntroModal}
        {selectBallotModal}
        {shareModalHtml}
        {signInModalHtml}
        {valuesIntroModalHtml}
      </>
    );
  }
}

HeaderBarModals.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  dialogPaper: {
    minHeight: 282,
    margin: '0 8px',
    borderRadius: 12,
  },
});

export default withStyles(styles)(HeaderBarModals);
