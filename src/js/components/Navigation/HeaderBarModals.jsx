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

const AdviserIntroModal = React.lazy(() => import(/* webpackChunkName: 'AdviserIntroModal' */ '../CompleteYourProfile/AdviserIntroModal'));
const AskFriendsModal = React.lazy(() => import(/* webpackChunkName: 'AskFriendsModal' */ '../Friends/AskFriendsModal'));
const ChooseOrOpposeIntroModal = React.lazy(() => import(/* webpackChunkName: 'ChooseOrOpposeIntroModal' */ '../Widgets/ItemActionBar/ChooseOrOpposeIntroModal'));
const FirstPositionIntroModal = React.lazy(() => import(/* webpackChunkName: 'FirstPositionIntroModal' */ '../CompleteYourProfile/FirstPositionIntroModal'));
const ImageUploadModal = React.lazy(() => import(/* webpackChunkName: 'ImageUploadModal' */ '../Settings/ImageUploadModal'));
const PersonalizedScoreIntroModal = React.lazy(() => import(/* webpackChunkName: 'PersonalizedScoreIntroModal' */ '../CompleteYourProfile/PersonalizedScoreIntroModal'));
const SelectBallotModal = React.lazy(() => import(/* webpackChunkName: 'SelectBallotModal' */ '../Ballot/SelectBallotModal'));
const ShareModal = React.lazy(() => import(/* webpackChunkName: 'ShareModal' */ '../Share/ShareModal'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));
const ValuesIntroModal = React.lazy(() => import(/* webpackChunkName: 'ValuesIntroModal' */ '../CompleteYourProfile/ValuesIntroModal'));


// Formerly: A function component, for all the various modals that come out of the HeaderBar
class HeaderBarModals extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showAdviserIntroModal: false,
      showChooseOrOpposeIntroModal: false,
      showFirstPositionIntroModal: false,
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
      showAdviserIntroModal: AppObservableStore.showAdviserIntroModal(),
      showAskFriendsModal: AppObservableStore.showAskFriendsModal(),
      showChooseOrOpposeIntroModal: AppObservableStore.showChooseOrOpposeIntroModal(),
      showFirstPositionIntroModal: AppObservableStore.showFirstPositionIntroModal(),
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

  closeAdviserIntroModal = () => {
    AppObservableStore.setShowAdviserIntroModal(false);
  }

  closeAskFriendsModal = () => {
    AppObservableStore.setShowAskFriendsModal(false);
  }

  closeChooseOrOpposeIntroModal = () => {
    AppObservableStore.setShowChooseOrOpposeIntroModal(false);
  }

  closeFirstPositionIntroModal = () => {
    AppObservableStore.setShowFirstPositionIntroModal(false);
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  closeImageUploadModal = () => {
    AppObservableStore.setShowImageUploadModal(false);
  }

  closeValuesIntroModal = () => {
    AppObservableStore.setShowValuesIntroModal(false);
  }

  closePersonalizedScoreIntroModal = () => {
    AppObservableStore.setShowPersonalizedScoreIntroModal(false);
  }

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
      showAdviserIntroModal, showAskFriendsModal, showChooseOrOpposeIntroModal,
      showFirstPositionIntroModal,
      showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalEditAddress,
      showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
    } = this.state;

    const ballotBaseUrl = ['ready'].includes(normalizedHrefPage()) ? '/ready' : '/ballot';

    // renderLog(`HeaderBarModals`);
    // console.log('HeaderBarModals showSignInModal:', showSignInModal);
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
            signInTitle="Sign In or Join"
            signInSubTitle=""
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
}

HeaderBarModals.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  dialogPaper: {
    minHeight: 282,
    margin: '0 8px',
  },
});

export default withStyles(styles)(HeaderBarModals);
