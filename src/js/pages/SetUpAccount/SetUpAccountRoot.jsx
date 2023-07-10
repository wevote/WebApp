import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
// import daysUntil from '../../common/utils/daysUntil';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import stringContains from '../../common/utils/stringContains';
import HeaderBackToButton from '../../components/Navigation/HeaderBackToButton';
import DeleteAllContactsButton from '../../components/SetUpAccount/DeleteAllContactsButton';
import Reassurance from '../../components/SetUpAccount/Reassurance';
import { reassuranceText } from '../../components/SetUpAccount/reassuranceText';
import SetUpAccountNextButton from '../../components/SetUpAccount/SetUpAccountNextButton';
import { DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet, DesktopStaticNextButtonsOuterWrapper, MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile } from '../../components/Style/NextButtonStyles';
import { AccountSetUpRootWrapper, BackToButtonSpacer, BackWrapper, PageContentContainerAccountSetUp, StepHtmlWrapper, WeVoteLogo, WeVoteLogoWrapper } from '../../components/Style/SimpleProcessStyles';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../../components/SetUpAccount/AddContactsFromGoogleButton'));
const SetUpAccountAddPhoto = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountAddPhoto' */ '../../components/SetUpAccount/SetUpAccountAddPhoto'));
const SetUpAccountEditName = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountEditName' */ '../../components/SetUpAccount/SetUpAccountEditName'));
const SetUpAccountFriendRequests = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountFriendRequests' */ '../../components/SetUpAccount/SetUpAccountFriendRequests'));
const SetUpAccountImportContacts = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountImportContacts' */ '../../components/SetUpAccount/SetUpAccountImportContacts'));
const SetUpAccountInviteContacts = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountInviteContacts' */ '../../components/SetUpAccount/SetUpAccountInviteContacts'));

const logoColorOnWhite = '../../../img/global/svg-icons/we-vote-icon-square-color-dark.svg';


class SetUpAccountRoot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      addPhotoNextButtonDisabled: true,
      backToLinkPath: '',
      displayStep: 1, // editname
      editNameNextButtonDisabled: true,
      // electionDataExistsForUpcomingElection: false,
      friendConnectionActionAvailable: false,
      nextButtonAsOutline: false,
      nextButtonClicked: false,
      nextButtonText: '',
      nextStepPath: '',
      reassuranceTextOff: true,
      setUpAccountBackLinkPath: '',
      setUpAccountEntryPath: '',
      setUpPagePath: '',
      showDeleteAllContactsOption: false,
      showHowItWorksModal: false,
      skipForNowOff: false,
      skipForNowPath: '',
      voterContactEmailAugmentWithWeVoteDataComplete: false,
      voterContactEmailListCount: 0,
      voterPhotoUrlLarge: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    let params = {};
    let setUpPagePath = '';
    const { match } = this.props;
    if (match) {
      ({ params } = match);
      if (params) {
        ({ set_up_page: setUpPagePath } = params);
      }
    }
    const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
    this.shouldNextButtonBeDisabled();
    this.setState({
      displayStep,
      setUpPagePath,
    });
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
    }
    if (apiCalming('voterBallotItemsRetrieve', 10000)) {
      BallotActions.voterBallotItemsRetrieve();
    }
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
  }

  componentDidUpdate (prevProps) {
    let prevParams = {};
    let prevSetUpPagePath = '';
    const { match: prevMatch } = prevProps;
    if (prevMatch) {
      ({ params: prevParams } = prevMatch);
      if (prevParams) {
        ({ set_up_page: prevSetUpPagePath } = prevParams);
      }
    }
    let params = {};
    let setUpPagePath = '';
    const { match } = this.props;
    if (match) {
      ({ params } = match);
      if (params) {
        ({ set_up_page: setUpPagePath } = params);
      }
    }
    // const { voterContactEmailListCount: voterContactEmailListCountPrevious } = prevState;
    const { voterContactEmailListCount, voterContactEmailAugmentWithWeVoteDataComplete } = this.state;
    // console.log('SetUpAccountRoot componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    // console.log('voterContactEmailAugmentWithWeVoteDataComplete:', voterContactEmailAugmentWithWeVoteDataComplete);
    if (prevSetUpPagePath !== setUpPagePath) {
      const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
      // console.log('SetUpAccountRoot componentDidUpdate setUpPagePath: ', setUpPagePath, ', displayStep:', displayStep);
      this.shouldNextButtonBeDisabled();
      this.setState({
        displayStep,
        setUpPagePath,
      }, () => this.setNextStepVariables());
    } else if ((setUpPagePath === 'importcontacts') && ((voterContactEmailListCount > 0) && (voterContactEmailAugmentWithWeVoteDataComplete))) {
      // console.log('Leaving importcontacts step');
      this.resetNextButtonClicked();
      historyPush('/setupaccount/invitecontacts');
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.setState({
      setUpAccountBackLinkPath: AppObservableStore.getSetUpAccountBackLinkPath(),
      setUpAccountEntryPath: AppObservableStore.getSetUpAccountEntryPath(),
    });
  }

  onBallotStoreChange () {
    // const nextElectionDayText = BallotStore.currentBallotElectionDate;
    // // console.log('nextElectionDayText:', nextElectionDayText);
    // if (nextElectionDayText) {
    //   const daysUntilNextElection = daysUntil(nextElectionDayText);
    //   if (daysUntilNextElection >= 0) {
    //     this.setState({
    //       electionDataExistsForUpcomingElection: true,
    //     });
    //   } else {
    //     // Election was yesterday or earlier
    //     this.setState({
    //       electionDataExistsForUpcomingElection: false,
    //     });
    //   }
    // }
  }

  onFriendStoreChange () {
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const suggestedFriendList = FriendStore.suggestedFriendList();
    const friendInvitationsSentToMeLength = (friendInvitationsSentToMe) ? friendInvitationsSentToMe.length : 0;
    const suggestedFriendListLength = (suggestedFriendList) ? suggestedFriendList.length : 0;
    const friendConnectionActionAvailable = !!((friendInvitationsSentToMeLength > 0) || (suggestedFriendListLength > 0));
    this.setState({
      friendConnectionActionAvailable,
    });
  }

  onVoterStoreChange () {
    this.resetNextButtonClicked();
    this.shouldNextButtonBeDisabled();
    const { setUpPagePath } = this.state;
    const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    // const voterContactEmailGoogleCount = VoterStore.getVoterContactEmailGoogleCount();
    // console.log('onVoterStoreChange voterContactEmailGoogleCount:', voterContactEmailGoogleCount, ', voterContactEmailListCount:', voterContactEmailListCount);
    let revisedState = {
      voterContactEmailAugmentWithWeVoteDataComplete: VoterStore.getVoterContactEmailAugmentWithWeVoteDataComplete(),
      voterContactEmailListCount,
      voterPhotoUrlLarge,
    };
    if (setUpPagePath) {
      revisedState = {
        ...revisedState,
        displayStep,
      };
    }
    this.setState(revisedState, () => this.setNextStepVariables());
  }

  convertSetUpPagePathToDisplayStep = (setUpPagePath) => {
    let displayStep;
    switch (setUpPagePath) {
      default:
      case 'editname':
        displayStep = 1;
        break;
      case 'addphoto':
        if (VoterStore.getVoterProfileUploadedImageUrlLarge()) {
          // This turns off the reassurance text
          displayStep = 3;
        } else {
          displayStep = 2;
        }
        break;
      case 'importcontacts':
        displayStep = 4;
        break;
      case 'invitecontacts':
        displayStep = 5;
        break;
      case 'friendrequests':
        displayStep = 6;
        break;
    }
    return displayStep;
  }

  onClickNextButton = () => {
    this.setState({
      nextButtonClicked: true,
    });
  }

  goToNextStep = () => {
    this.resetNextButtonClicked();
    const { nextStepPath, showHowItWorksModal } = this.state;
    // console.log('SetUpAccountRoot goToNextStep nextStepPath:', nextStepPath);
    if (showHowItWorksModal) {
      AppObservableStore.setShowHowItWorksModal(true);
    }
    if (nextStepPath) {
      historyPush(nextStepPath);
    }
  }

  goToSkipForNow = () => {
    const { skipForNowPath } = this.state;
    // console.log('SetUpAccountRoot goToSkipForNow skipForNowPath:', skipForNowPath);
    if (skipForNowPath) {
      historyPush(skipForNowPath);
    }
  }

  resetNextButtonClicked = () => {
    this.setState({
      nextButtonClicked: false,
    });
  }

  setNextStepVariables = () => {
    const {
      displayStep,
      friendConnectionActionAvailable,
      setUpAccountBackLinkPath, setUpAccountEntryPath,
      voterContactEmailListCount, voterPhotoUrlLarge,
    } = this.state;
    let backToLinkPath = '';
    const nextButtonAsOutline = false;
    let nextButtonText = '';
    let nextStepPath;
    let reassuranceTextOff;
    let showDeleteAllContactsOption = false;
    let showHowItWorksModal = false;
    let skipForNowOff;
    let skipForNowPath = '';
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    switch (displayStep) {
      default:
      case 1: // 'editname'
        backToLinkPath = setUpAccountBackLinkPath;
        nextButtonText = 'Save';
        reassuranceTextOff = false;
        skipForNowOff = false;
        if (!voterIsSignedIn) {
          // Bump person to findfriends process if not signed in
          nextStepPath = '/findfriends/importcontacts';
          skipForNowOff = false;
          skipForNowPath = '/findfriends/importcontacts';
        } else if (!voterPhotoUrlLarge) {
          nextStepPath = '/setupaccount/addphoto';
          skipForNowOff = false;
          skipForNowPath = '/setupaccount/addphoto';
        } else if (voterContactEmailListCount > 0) {
          nextStepPath = '/setupaccount/invitecontacts';
          skipForNowOff = false;
          // if (electionDataExistsForUpcomingElection) {
          //   skipForNowPath = '/ballot';
          // } else {
          //   skipForNowPath = '/ready';
          // }
          skipForNowPath = '/ready';
        } else {
          nextStepPath = '/setupaccount/importcontacts';
          skipForNowOff = false;
          // if (electionDataExistsForUpcomingElection) {
          //   skipForNowPath = '/ballot';
          // } else {
          //   skipForNowPath = '/ready';
          // }
          skipForNowPath = '/ready';
        }
        break;
      case 2: // 'addphoto'
      case 3:
        if (stringContains('addphoto', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/setupaccount/editname';
        }
        reassuranceTextOff = false;
        if (!voterPhotoUrlLarge) {
          nextButtonText = 'Save photo';
          skipForNowOff = false;
          skipForNowPath = '/setupaccount/importcontacts';
        } else if (!voterIsSignedIn) {
          // Bump person to findfriends process if not signed in
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/importcontacts';
          skipForNowOff = false;
          skipForNowPath = '/findfriends/importcontacts';
        } else if (voterContactEmailListCount > 0) {
          nextButtonText = 'Find your friends';
          nextStepPath = '/setupaccount/invitecontacts';
          skipForNowOff = false;
          if (friendConnectionActionAvailable) {
            skipForNowPath = '/setupaccount/friendrequests';
          // } else if (electionDataExistsForUpcomingElection) {
          //   skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else {
          nextButtonText = 'Find your friends';
          nextStepPath = '/setupaccount/importcontacts';
          skipForNowOff = false;
          if (friendConnectionActionAvailable) {
            skipForNowPath = '/setupaccount/friendrequests';
          // } else if (electionDataExistsForUpcomingElection) {
          //   skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        }
        break;
      case 4: // importcontacts
        if (stringContains('importcontacts', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/setupaccount/addphoto';
        }
        reassuranceTextOff = false;
        showDeleteAllContactsOption = true;
        skipForNowOff = false;
        if (!voterIsSignedIn) {
          // Bump person to findfriends process if not signed in
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/signin';
          skipForNowOff = false;
          skipForNowPath = '/findfriends/signin';
        } else if (voterContactEmailListCount > 0) {
          nextButtonText = 'Choose contacts to add as friends';
          nextStepPath = '/setupaccount/invitecontacts';
          if (friendConnectionActionAvailable) {
            skipForNowPath = '/setupaccount/friendrequests';
          // } else if (electionDataExistsForUpcomingElection) {
          //   skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else {
          nextButtonText = 'Import contacts from Gmail';
          skipForNowOff = false;
          if (friendConnectionActionAvailable) {
            nextStepPath = '/setupaccount/friendrequests';
            skipForNowPath = '/setupaccount/friendrequests';
          // } else if (electionDataExistsForUpcomingElection) {
          //   nextStepPath = '/ballot';
          //   skipForNowPath = '/ballot';
          } else {
            nextStepPath = '/ready';
            skipForNowPath = '/ready';
          }
        }
        break;
      case 5: // invitecontacts
        if (stringContains('invitecontacts', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/setupaccount/importcontacts';
        }
        reassuranceTextOff = true;
        skipForNowOff = false;
        if (friendConnectionActionAvailable) {
          nextButtonText = 'Next';
          nextStepPath = '/setupaccount/friendrequests';
          skipForNowPath = '/setupaccount/friendrequests';
        // } else if (electionDataExistsForUpcomingElection) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/ballot';
        //   skipForNowPath = '/ballot';
        } else {
          nextButtonText = 'How It Works';
          showHowItWorksModal = true;
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        break;
      case 6: // friendrequests
        if (stringContains('friendrequests', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else if (voterContactEmailListCount > 0) {
          backToLinkPath = '/setupaccount/invitecontacts';
        } else {
          backToLinkPath = '/setupaccount/importcontacts';
        }
        // if (electionDataExistsForUpcomingElection) {
        //   nextButtonText = 'View your ballot';
        //   nextStepPath = '/ballot';
        // } else {
        //   nextButtonText = 'Get ready to vote';
        //   nextStepPath = '/ready';
        // }
        nextButtonText = 'How it works';
        showHowItWorksModal = true;
        nextStepPath = '/ready';
        skipForNowPath = '/ready';
        reassuranceTextOff = true;
        break;
    }
    this.setState({
      backToLinkPath,
      nextButtonAsOutline,
      nextButtonText,
      nextStepPath,
      reassuranceTextOff,
      showDeleteAllContactsOption,
      showHowItWorksModal,
      skipForNowOff,
      skipForNowPath,
    });
  }

  shouldNextButtonBeDisabled = () => {
    let voterEmailMissing = false;
    let voterFirstNameMissing = false;
    let voterPhotoMissing = false;
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterEmailQueuedToSave = VoterStore.getVoterEmailQueuedToSave();
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    if (!voterIsSignedInWithEmail && !voterEmailQueuedToSave) {
      voterEmailMissing = true;
    }
    if (!voterFirstNameQueuedToSave && !VoterStore.getFirstName()) {
      voterFirstNameMissing = true;
    }
    if (!voterPhotoQueuedToSave && !VoterStore.getVoterProfileUploadedImageUrlLarge()) {
      voterPhotoMissing = true;
    }
    this.setState({
      addPhotoNextButtonDisabled: voterPhotoMissing,
      editNameNextButtonDisabled: voterEmailMissing || voterFirstNameMissing,
    });
  }

  render () {
    renderLog('SetUpAccountRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      addPhotoNextButtonDisabled, backToLinkPath, displayStep,
      editNameNextButtonDisabled, nextButtonAsOutline, nextButtonClicked, nextButtonText,
      reassuranceTextOff, setUpAccountBackLinkPath, showDeleteAllContactsOption, skipForNowOff,
      voterContactEmailListCount,
    } = this.state;
    // console.log('SetUpAccountRoot displayState', displayStep);

    let backButtonOn;
    let desktopInlineButtonsOnInMobile;
    let desktopFixedButtonsOn;
    let desktopNextButtonHtml;
    let mobileFixedButtonsOff;
    let mobileNextButtonHtml;
    let nextButtonDisabled = false;
    let stepHtml;
    switch (displayStep) {
      default:
      case 1: // editname
        backButtonOn = !!(setUpAccountBackLinkPath);
        desktopFixedButtonsOn = false;
        nextButtonDisabled = editNameNextButtonDisabled;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountEditName
              goToNextStep={this.goToNextStep}
              functionToUseWhenProfileComplete={this.goToNextStep}
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 2: // addphoto
      case 3:
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        nextButtonDisabled = addPhotoNextButtonDisabled;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountAddPhoto
              goToNextStep={this.goToNextStep}
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 4: // importcontacts
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountImportContacts
              displayStep={displayStep}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 5: // invitecontacts
        backButtonOn = true;
        desktopFixedButtonsOn = true;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountInviteContacts
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 6: // friendrequests
        backButtonOn = true;
        desktopFixedButtonsOn = true;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountFriendRequests
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
    }

    switch (displayStep) {
      default:
      case 1: // editname
      case 2: // addphoto
      case 3:
      case 5: // invitecontacts
      case 6: // friendrequests
        desktopNextButtonHtml = (
          <SetUpAccountNextButton
            nextButtonAsOutline={nextButtonAsOutline}
            nextButtonDisabled={nextButtonDisabled}
            nextButtonText={nextButtonText}
            onClickNextButton={this.onClickNextButton}
          />
        );
        mobileNextButtonHtml = (
          <SetUpAccountNextButton
            isMobile
            nextButtonAsOutline={nextButtonAsOutline}
            nextButtonDisabled={nextButtonDisabled}
            nextButtonText={nextButtonText}
            onClickNextButton={this.onClickNextButton}
          />
        );
        break;
      case 4: // importcontacts
        if (voterContactEmailListCount > 0) {
          desktopNextButtonHtml = (
            <SetUpAccountNextButton
              nextButtonText={nextButtonText}
              onClickNextButton={this.onClickNextButton}
            />
          );
          mobileNextButtonHtml = (
            <SetUpAccountNextButton
              isMobile
              nextButtonDisabled={nextButtonDisabled}
              nextButtonText={nextButtonText}
              onClickNextButton={this.onClickNextButton}
            />
          );
        } else {
          desktopNextButtonHtml = (
            <Suspense fallback={<></>}>
              <AddContactsFromGoogleButton darkButton />
            </Suspense>
          );
          mobileNextButtonHtml = (
            <Suspense fallback={<></>}>
              <AddContactsFromGoogleButton darkButton />
            </Suspense>
          );
        }
        break;
    }

    const desktopButtonsHtml = (
      <>
        {desktopNextButtonHtml}
        {!skipForNowOff && (
          <Button
            classes={{ root: classes.desktopSimpleLink }}
            onClick={this.goToSkipForNow}
          >
            Skip for now
          </Button>
        )}
      </>
    );

    const mobileButtonsHtml = (
      <>
        {mobileNextButtonHtml}
        {!skipForNowOff && (
          <Button
            classes={{ root: classes.mobileSimpleLink }}
            onClick={this.goToSkipForNow}
          >
            Skip for now
          </Button>
        )}
      </>
    );

    let desktopInlineButtonsOnBreakValue;
    if (desktopInlineButtonsOnInMobile) {
      desktopInlineButtonsOnBreakValue = 1;
    } else {
      desktopInlineButtonsOnBreakValue = isCordovaWide() ? 1000 : 'sm';
    }
    return (
      <PageContentContainerAccountSetUp>
        <Helmet title="Set Up Account - We Vote" />
        <AccountSetUpRootWrapper>
          <WeVoteLogoWrapper>
            <WeVoteLogo
              src={normalizedImagePath(logoColorOnWhite)}
              height="48"
              width="48"
            />
          </WeVoteLogoWrapper>
          <BackWrapper>
            {backButtonOn ? (
              <HeaderBackToButton
                backToLink={backToLinkPath}
                id="accountSetUpBackTo"
                leftAligned
              />
            ) : (
              <BackToButtonSpacer />
            )}
          </BackWrapper>
          <StepHtmlWrapper>
            {stepHtml}
          </StepHtmlWrapper>
          {!desktopFixedButtonsOn && (
            <DesktopNextButtonsOuterWrapperUShowDesktopTablet breakValue={desktopInlineButtonsOnBreakValue}>
              <DesktopNextButtonsInnerWrapper>
                {desktopButtonsHtml}
              </DesktopNextButtonsInnerWrapper>
            </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
          )}
          {!reassuranceTextOff && (
            <Reassurance displayState={displayStep} reassuranceText={reassuranceText} />
          )}
          {showDeleteAllContactsOption && (
            <>
              {(voterContactEmailListCount > 0) ? (
                <DeleteAllContactsWrapper>
                  <DeleteAllContactsButton textSizeSmall />
                </DeleteAllContactsWrapper>
              ) : (
                <DeleteAllContactsAtAnyTimeWrapper>
                  You can delete contact information at any time.
                </DeleteAllContactsAtAnyTimeWrapper>
              )}
            </>
          )}
        </AccountSetUpRootWrapper>
        {!mobileFixedButtonsOff && (
          <MobileStaticNextButtonsOuterWrapperUShowMobile breakValue={isCordovaWide() ? 1000 : 'sm'}>
            <MobileStaticNextButtonsInnerWrapper>
              {mobileButtonsHtml}
            </MobileStaticNextButtonsInnerWrapper>
          </MobileStaticNextButtonsOuterWrapperUShowMobile>
        )}
        {desktopFixedButtonsOn && (
          <DesktopStaticNextButtonsOuterWrapper breakValue={isCordovaWide() ? 1000 : 'sm'}>
            <DesktopNextButtonsInnerWrapper>
              {desktopButtonsHtml}
            </DesktopNextButtonsInnerWrapper>
          </DesktopStaticNextButtonsOuterWrapper>
        )}
      </PageContentContainerAccountSetUp>
    );
  }
}
SetUpAccountRoot.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  desktopSimpleLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  mobileSimpleLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

const DeleteAllContactsAtAnyTimeWrapper = styled('div')`
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 0;
`;

const DeleteAllContactsWrapper = styled('div')`
  margin-top: 0;
`;

export default withStyles(styles)(SetUpAccountRoot);
