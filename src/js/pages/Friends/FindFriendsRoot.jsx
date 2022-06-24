import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import daysUntil from '../../common/utils/daysUntil';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderBackToButton from '../../components/Navigation/HeaderBackToButton';
import DeleteAllContactsButton from '../../components/SetUpAccount/DeleteAllContactsButton';
import SetUpAccountNextButton from '../../components/SetUpAccount/SetUpAccountNextButton';
import { reassuranceTextFindFriends } from '../../components/SetUpAccount/reassuranceTextFindFriends';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  DesktopStaticNextButtonsOuterWrapper,
  MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile,
} from '../../components/Style/NextButtonStyles';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import Reassurance from '../Startup/Reassurance';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../../components/SetUpAccount/AddContactsFromGoogleButton'));
const SetUpAccountAddPhoto = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountAddPhoto' */ '../../components/SetUpAccount/SetUpAccountAddPhoto'));
const SetUpAccountEditName = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountEditName' */ '../../components/SetUpAccount/SetUpAccountEditName'));
const SetUpAccountFriendRequests = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountFriendRequests' */ '../../components/SetUpAccount/SetUpAccountFriendRequests'));
const SetUpAccountImportContacts = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountImportContacts' */ '../../components/SetUpAccount/SetUpAccountImportContacts'));
const SetUpAccountInviteContacts = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountInviteContacts' */ '../../components/SetUpAccount/SetUpAccountInviteContacts'));
const SetUpAccountInviteContactsSignIn = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountInviteContactsSignIn' */ '../../components/SetUpAccount/SetUpAccountInviteContactsSignIn'));

const logoColorOnWhite = '../../../img/global/svg-icons/we-vote-icon-square-color-dark.svg';


class FindFriendsRoot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      addPhotoNextButtonDisabled: true,
      addPhotoStepVisited: false,
      backButtonOn: false,
      backToLinkPath: '',
      desktopFixedButtonsOn: false,
      desktopInlineButtonsOnInMobile: false,
      displayStep: 1, // importcontacts
      editNameNextButtonDisabled: true,
      editNameStepVisited: false,
      electionDataExistsForUpcomingElection: false,
      friendConnectionActionAvailable: false,
      mobileFixedButtonsOff: false,
      nextButtonClicked: false,
      nextButtonDisabled: false,
      voterContactEmailListCount: 0,
      voterFirstName: '',
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
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    VoterActions.voterContactListRetrieve();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('voterBallotItemsRetrieve', 10000)) {
      BallotActions.voterBallotItemsRetrieve();
    }
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.getAllFriendLists();
    }
  }

  componentDidUpdate (prevProps, prevState) {
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
    const { voterContactEmailListCount: voterContactEmailListCountPrevious } = prevState;
    const { electionDataExistsForUpcomingElection, friendConnectionActionAvailable, voterContactEmailListCount, voterFirstName, voterPhotoUrlLarge } = this.state;
    const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    // console.log('FindFriendsRoot componentDidUpdate setUpPagePath:', setUpPagePath);
    if (prevSetUpPagePath !== setUpPagePath) {
      // console.log('FindFriendsRoot componentDidUpdate setUpPagePath: ', setUpPagePath, ', displayStep:', displayStep);
      this.shouldNextButtonBeDisabled();
      this.setState({
        displayStep,
        setUpPagePath,
      }, () => this.setNextStepVariables());
    } else if ((setUpPagePath === 'importcontacts') && (voterContactEmailListCount > 0 && (voterContactEmailListCountPrevious !== voterContactEmailListCount))) {
      // console.log('Leaving importcontacts step');
      this.resetNextButtonClicked();
      if (VoterStore.getVoterIsSignedIn() === true) {
        historyPush('/findfriends/invitecontacts');
      } else {
        historyPush('/findfriends/signin');
      }
    } else if (voterIsSignedIn && ((setUpPagePath === 'signin') || (displayStep === 2))) {
      // console.log('On signin step and need to advance to editname');
      this.resetNextButtonClicked();
      if (!voterFirstName) {
        historyPush('/findfriends/editname');
      } else if (!voterPhotoUrlLarge) {
        historyPush('/findfriends/addphoto');
      } else if (voterContactEmailListCount > 0) {
        historyPush('/findfriends/invitecontacts');
      } else if (friendConnectionActionAvailable) {
        historyPush('/findfriends/friendrequests');
      } else if (electionDataExistsForUpcomingElection) {
        historyPush('/ballot');
      } else {
        historyPush('/ready');
      }
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    const nextElectionDayText = BallotStore.currentBallotElectionDate;
    // console.log('nextElectionDayText:', nextElectionDayText);
    if (nextElectionDayText) {
      const daysUntilNextElection = daysUntil(nextElectionDayText);
      if (daysUntilNextElection >= 0) {
        this.setState({
          electionDataExistsForUpcomingElection: true,
        });
      } else {
        // Election was yesterday or earlier
        this.setState({
          electionDataExistsForUpcomingElection: false,
        });
      }
    }
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
    const voterFirstName = VoterStore.getFirstName();
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    // const voterContactEmailGoogleCount = VoterStore.getVoterContactEmailGoogleCount();
    // console.log('onVoterStoreChange voterContactEmailGoogleCount:', voterContactEmailGoogleCount, ', voterContactEmailListCount:', voterContactEmailListCount);
    this.setState({
      displayStep,
      // voterContactEmailGoogleCount,
      voterContactEmailListCount,
      voterFirstName,
      // voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voterPhotoUrlLarge,
    }, () => this.setNextStepVariables());
  }

  convertSetUpPagePathToDisplayStep = (setUpPagePath) => {
    let displayStep;
    switch (setUpPagePath) {
      default:
      case 'importcontacts':
        displayStep = 1;
        break;
      case 'signin':
        displayStep = 2;
        break;
      case 'editname':
        displayStep = 3;
        break;
      case 'addphoto':
        if (VoterStore.getVoterProfileUploadedImageUrlLarge()) {
          // This turns off the reassurance text
          displayStep = 5;
        } else {
          displayStep = 4;
        }
        break;
      case 'invitecontacts':
        displayStep = 6;
        break;
      case 'friendrequests':
        displayStep = 7;
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
    const { nextStepPath } = this.state;
    // console.log('FindFriendsRoot goToNextStep nextStepPath:', nextStepPath);
    if (nextStepPath) {
      historyPush(nextStepPath);
    }
  }

  goToSkipForNow = () => {
    const { skipForNowPath } = this.state;
    // console.log('FindFriendsRoot goToSkipForNow skipForNowPath:', skipForNowPath);
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
      addPhotoNextButtonDisabled, displayStep, editNameNextButtonDisabled,
      electionDataExistsForUpcomingElection, friendConnectionActionAvailable,
      signInNextButtonDisabled,
      voterContactEmailListCount, voterFirstName, voterPhotoUrlLarge,
    } = this.state;
    let { addPhotoStepVisited, editNameStepVisited } = this.state;
    let backButtonOn;
    let desktopFixedButtonsOn = true;
    let desktopInlineButtonsOnInMobile = false;
    let backToLinkPath = '';
    let mobileFixedButtonsOff = false;
    const nextButtonAsOutline = false;
    let nextButtonDisabled = false;
    let nextButtonText = '';
    let nextStepPath;
    let reassuranceTextOff;
    let showDeleteAllContactsOption = false;
    let skipForNowOff;
    let skipForNowPath = '';
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    switch (displayStep) {
      default:
      case 1: // importcontacts
        backToLinkPath = '';
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        reassuranceTextOff = false;
        showDeleteAllContactsOption = true;
        if (!voterIsSignedIn) {
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/signin';
          skipForNowOff = false;
          skipForNowPath = '/findfriends/signin';
        } else if (!voterFirstName) {
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/editname';
          skipForNowOff = false;
          skipForNowPath = '/findfriends/editname';
        } else if (!voterPhotoUrlLarge) {
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/addphoto';
          skipForNowOff = false;
          skipForNowPath = '/findfriends/addphoto';
        } else if (voterContactEmailListCount > 0) {
          nextButtonText = 'Choose contacts to add as friends';
          nextStepPath = '/findfriends/invitecontacts';
          skipForNowOff = false;
          if (friendConnectionActionAvailable) {
            skipForNowPath = '/findfriends/friendrequests';
          } else if (electionDataExistsForUpcomingElection) {
            skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else if (friendConnectionActionAvailable) {
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/friendrequests';
          skipForNowPath = '/findfriends/friendrequests';
        } else if (electionDataExistsForUpcomingElection) {
          nextButtonText = 'Next';
          nextStepPath = '/ballot';
          skipForNowPath = '/ballot';
        } else {
          nextButtonText = 'Next';
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        break;
      case 2: // signin
        backButtonOn = true;
        backToLinkPath = '/findfriends/importcontacts';
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        nextButtonDisabled = signInNextButtonDisabled;
        nextButtonText = 'Next';
        reassuranceTextOff = false;
        skipForNowOff = false;
        if (voterContactEmailListCount > 0) {
          nextStepPath = '/findfriends/invitecontacts';
          if (electionDataExistsForUpcomingElection) {
            skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else if (electionDataExistsForUpcomingElection) {
          nextButtonText = 'Next';
          nextStepPath = '/ballot';
          skipForNowPath = '/ballot';
        } else {
          nextButtonText = 'Next';
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        break;
      case 3: // 'editname'
        backButtonOn = true;
        if (!voterIsSignedIn) {
          backToLinkPath = '/findfriends/signin';
        } else {
          backToLinkPath = '/findfriends/importcontacts';
        }
        desktopFixedButtonsOn = false;
        nextButtonDisabled = editNameNextButtonDisabled;
        nextButtonText = 'Save';
        reassuranceTextOff = false;
        skipForNowOff = false;
        if (!voterIsSignedIn) {
          nextStepPath = '/findfriends/signin';
          skipForNowPath = '/findfriends/signin';
        } else if (!voterPhotoUrlLarge) {
          nextStepPath = '/findfriends/addphoto';
          skipForNowPath = '/findfriends/addphoto';
        } else if (voterContactEmailListCount > 0) {
          nextStepPath = '/findfriends/invitecontacts';
          skipForNowPath = '/findfriends/invitecontacts';
        } else if (friendConnectionActionAvailable) {
          nextStepPath = '/findfriends/friendrequests';
          skipForNowPath = '/findfriends/friendrequests';
        } else if (electionDataExistsForUpcomingElection) {
          nextStepPath = '/ballot';
          skipForNowPath = '/ballot';
        } else {
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        editNameStepVisited = true;
        break;
      case 4: // 'addphoto'
      case 5:
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        nextButtonDisabled = addPhotoNextButtonDisabled;
        if (!voterIsSignedIn) {
          backToLinkPath = '/findfriends/signin';
        } else if (editNameStepVisited) {
          backToLinkPath = '/findfriends/editname';
        } else {
          backToLinkPath = '/findfriends/importcontacts';
        }
        reassuranceTextOff = false;
        skipForNowOff = false;
        if (!voterIsSignedIn) {
          nextButtonText = 'Save your photo';
          nextStepPath = '/findfriends/signin';
          skipForNowPath = '/findfriends/signin';
        } else if (!voterPhotoUrlLarge) {
          nextButtonText = 'Save your photo';
          if (voterContactEmailListCount > 0) {
            skipForNowPath = '/findfriends/invitecontacts';
          } else if (friendConnectionActionAvailable) {
            skipForNowPath = '/findfriends/friendrequests';
          } else if (electionDataExistsForUpcomingElection) {
            skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else if (voterContactEmailListCount > 0) {
          nextButtonText = 'Find your friends';
          nextStepPath = '/findfriends/invitecontacts';
          if (friendConnectionActionAvailable) {
            skipForNowPath = '/findfriends/friendrequests';
          } else if (electionDataExistsForUpcomingElection) {
            skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else if (friendConnectionActionAvailable) {
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/friendrequests';
          skipForNowPath = '/findfriends/friendrequests';
        } else if (electionDataExistsForUpcomingElection) {
          nextButtonText = 'View your ballot';
          nextStepPath = '/ballot';
          skipForNowOff = true;
        } else {
          nextButtonText = 'Get ready to vote';
          nextStepPath = '/ready';
          skipForNowOff = true;
        }
        addPhotoStepVisited = true;
        break;
      case 6: // invitecontacts
        backButtonOn = true;
        desktopFixedButtonsOn = true;
        if (!voterIsSignedIn) {
          backToLinkPath = '/findfriends/signin';
        } else if (addPhotoStepVisited) {
          backToLinkPath = '/findfriends/addphoto';
        } else if (editNameStepVisited) {
          backToLinkPath = '/findfriends/editname';
        } else {
          backToLinkPath = '/findfriends/importcontacts';
        }
        reassuranceTextOff = true;
        skipForNowOff = false;
        if (friendConnectionActionAvailable) {
          nextButtonText = 'Next';
          nextStepPath = '/findfriends/friendrequests';
          skipForNowPath = '/findfriends/friendrequests';
        } else if (electionDataExistsForUpcomingElection) {
          nextButtonText = 'Next';
          nextStepPath = '/ballot';
          skipForNowPath = '/ballot';
        } else {
          nextButtonText = 'Next';
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        break;
      case 7: // friendrequests
        backButtonOn = true;
        desktopFixedButtonsOn = true;
        if (!voterIsSignedIn) {
          backToLinkPath = '/findfriends/signin';
        } else if (voterContactEmailListCount > 0) {
          backToLinkPath = '/findfriends/invitecontacts';
        } else if (addPhotoStepVisited) {
          backToLinkPath = '/findfriends/addphoto';
        } else if (editNameStepVisited) {
          backToLinkPath = '/findfriends/editname';
        } else {
          backToLinkPath = '/findfriends/importcontacts';
        }
        if (electionDataExistsForUpcomingElection) {
          nextButtonText = 'View your ballot';
          nextStepPath = '/ballot';
        } else {
          nextButtonText = 'Get ready to vote';
          nextStepPath = '/ready';
        }
        reassuranceTextOff = true;
        skipForNowOff = true;
        break;
    }
    this.setState({
      addPhotoStepVisited,
      backButtonOn,
      backToLinkPath,
      desktopFixedButtonsOn,
      desktopInlineButtonsOnInMobile,
      editNameStepVisited,
      mobileFixedButtonsOff,
      nextButtonAsOutline,
      nextButtonDisabled,
      nextButtonText,
      nextStepPath,
      reassuranceTextOff,
      showDeleteAllContactsOption,
      skipForNowOff,
      skipForNowPath,
    });
  }

  shouldNextButtonBeDisabled = () => {
    let voterEmailMissing = false;
    let voterFirstNameMissing = false;
    let voterPhotoMissing = false;
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
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
      signInNextButtonDisabled: !voterIsSignedIn,
    });
  }

  render () {
    renderLog('FindFriendsRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      backButtonOn, backToLinkPath,
      desktopFixedButtonsOn, desktopInlineButtonsOnInMobile, displayStep,
      mobileFixedButtonsOff,
      nextButtonAsOutline, nextButtonClicked, nextButtonDisabled, nextButtonText,
      reassuranceTextOff, showDeleteAllContactsOption, skipForNowOff,
      voterContactEmailListCount,
    } = this.state;
    // console.log('FindFriendsRoot displayState', displayStep);

    let desktopNextButtonHtml;
    let mobileNextButtonHtml;
    let stepHtml;
    switch (displayStep) {
      default:
      case 1: // importcontacts
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
      case 2: // signin
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountInviteContactsSignIn
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 3: // editname
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountEditName
              // functionToUseWhenProfileComplete={this.editNameNextStepPossible}
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 4: // addphoto
      case 5:
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountAddPhoto
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 6: // invitecontacts
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountInviteContacts
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 7: // friendrequests
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
      case 1: // importcontacts
        if (voterContactEmailListCount > 0) {
          desktopNextButtonHtml = (
            <>
              {/*
              <Suspense fallback={<></>}>
                <AddContactsFromGoogleButton darkButton labelText="Import contacts from another Gmail account:" />
              </Suspense>
              */}
              <SetUpAccountNextButton
                nextButtonText={nextButtonText}
                onClickNextButton={this.onClickNextButton}
              />
            </>
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
              <AddContactsFromGoogleButton darkButton mobileMode />
            </Suspense>
          );
        }
        break;
      case 2: // signin
      case 3: // invitecontacts
      case 4: // editname
      case 5: // addphoto
      case 6:
      case 7: // friendrequests
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
        <Helmet title="Find Your Friends - We Vote" />
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
            <Reassurance displayState={displayStep} reassuranceText={reassuranceTextFindFriends} />
          )}
          {showDeleteAllContactsOption && (
            <>
              {(voterContactEmailListCount > 0) ? (
                <DeleteAllContactsWrapper>
                  <DeleteAllContactsButton />
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
FindFriendsRoot.propTypes = {
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

const AccountSetUpRootWrapper = styled('div')`
  background-color: white;
  max-width: 700px;
  padding: 40px 30px 110% 30px;
  width: 100%;
`;

const BackWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-bottom: 4px;
`;

const BackToButtonSpacer = styled('div')`
  margin-bottom: 36px;
`;

const DeleteAllContactsAtAnyTimeWrapper = styled('div')`
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 0;
`;

const DeleteAllContactsWrapper = styled('div')`
  margin-top: 0;
`;

export const PageContentContainerAccountSetUp = styled('div')`
  background-color: white;
  display: flex;
  justify-content: center;
`;

const StepHtmlWrapper = styled('div')`
`;

const WeVoteLogo = styled('img')`
`;

const WeVoteLogoWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 35px;
`;

export default withStyles(styles)(FindFriendsRoot);
