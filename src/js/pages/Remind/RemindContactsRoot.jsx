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
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import stringContains from '../../common/utils/stringContains';
import HeaderBackToButton from '../../components/Navigation/HeaderBackToButton';
import DeleteAllContactsButton from '../../components/SetUpAccount/DeleteAllContactsButton';
import SetUpAccountNextButton from '../../components/SetUpAccount/SetUpAccountNextButton';
import Reassurance from '../../components/SetUpAccount/Reassurance';
import { reassuranceTextRemindContacts } from '../../components/Remind/reassuranceTextRemindContacts';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  DesktopStaticNextButtonsOuterWrapper,
  MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile,
} from '../../components/Style/NextButtonStyles';
import {
  AccountSetUpRootWrapper,
  BackWrapper,
  BackToButtonSpacer,
  PageContentContainerAccountSetUp,
  StepHtmlWrapper,
  WeVoteLogo,
  WeVoteLogoWrapper,
} from '../../components/Style/SimpleProcessStyles';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../../components/SetUpAccount/AddContactsFromGoogleButton'));
const RemindAddContacts = React.lazy(() => import(/* webpackChunkName: 'RemindAddContacts' */ '../../components/Remind/RemindAddContacts'));
const RemindContactsImport = React.lazy(() => import(/* webpackChunkName: 'RemindContactsImport' */ '../../components/Remind/RemindContactsImport'));
const RemindContactsPreview = React.lazy(() => import(/* webpackChunkName: 'RemindContactsPreview' */ '../../components/Remind/RemindContactsPreview'));
const RemindDownloadApp = React.lazy(() => import(/* webpackChunkName: 'RemindDownloadApp' */ '../../components/Remind/RemindDownloadApp'));
const RemindEditMessage = React.lazy(() => import(/* webpackChunkName: 'RemindEditMessage' */ '../../components/Remind/RemindEditMessage'));
const RemindInviteContacts = React.lazy(() => import(/* webpackChunkName: 'RemindInviteContacts' */ '../../components/Remind/RemindInviteContacts'));
const SetUpAccountAddPhoto = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountAddPhoto' */ '../../components/SetUpAccount/SetUpAccountAddPhoto'));
const SetUpAccountEditName = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountEditName' */ '../../components/SetUpAccount/SetUpAccountEditName'));
const SetUpAccountFriendRequests = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountFriendRequests' */ '../../components/SetUpAccount/SetUpAccountFriendRequests'));
const ShowReminderTextToCopy = React.lazy(() => import(/* webpackChunkName: 'ShowReminderTextToCopy' */ '../../components/Remind/ShowReminderTextToCopy'));

const copyPageTurnedOn = false;
const logoColorOnWhite = '../../../img/global/svg-icons/we-vote-icon-square-color-dark.svg';


class RemindContactsRoot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      addPhotoNextButtonDisabled: true,
      addPhotoStepVisited: false,
      backButtonOn: false,
      backToLinkPath: '',
      desktopFixedButtonsOn: false,
      desktopInlineButtonsOnInMobile: false,
      displayStep: 111, // message   1, // importcontacts
      editNameNextButtonDisabled: true,
      editNameStepVisited: false,
      electionDataExistsForUpcomingElection: false,
      friendConnectionActionAvailable: false,
      mobileFixedButtonsOff: false,
      nextButtonClicked: false,
      nextButtonDisabled: false,
      setUpAccountBackLinkPath: '',
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
    // console.log('componentDidMount setUpPagePath:', setUpPagePath, ', displayStep:', displayStep);
    this.shouldNextButtonBeDisabled();
    this.setState({
      setUpAccountBackLinkPath: AppObservableStore.getSetUpAccountBackLinkPath(),
      setUpAccountEntryPath: AppObservableStore.getSetUpAccountEntryPath(),
      displayStep,
      setUpPagePath,
    });
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFriendStoreChange();
    this.onVoterStoreChange();
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
    // console.log('RemindContactsRoot componentDidUpdate setUpPagePath:', setUpPagePath);
    if (prevSetUpPagePath !== setUpPagePath) {
      // console.log('RemindContactsRoot componentDidUpdate setUpPagePath: ', setUpPagePath, ', displayStep:', displayStep);
      this.shouldNextButtonBeDisabled();
      this.setState({
        displayStep,
        setUpPagePath,
      }, () => this.setNextStepVariables());
    } else if ((setUpPagePath === '' || setUpPagePath === 'importcontacts') && (voterContactEmailListCount > 0 && (voterContactEmailListCountPrevious !== voterContactEmailListCount))) {
      // console.log('Leaving importcontacts step');
      this.resetNextButtonClicked();
      historyPush('/remind/preview');
      // if (VoterStore.getVoterIsSignedIn() === true) {
      //   historyPush('/remind/invitecontacts');
      // } else {
      //   historyPush('/remind/signin');
      // }
    } else if (voterIsSignedIn && ((setUpPagePath === 'preview') || (displayStep === 2))) {
      // console.log('On preview step and need to advance to editname');
      this.resetNextButtonClicked();
      if (!voterFirstName) {
        historyPush('/remind/editname');
      } else if (!voterPhotoUrlLarge) {
        historyPush('/remind/addphoto');
      } else if (voterContactEmailListCount > 0) {
        historyPush('/remind/invitecontacts');
      } else if (friendConnectionActionAvailable) {
        historyPush('/remind/friendrequests');
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
    // console.log('onVoterStoreChange setUpPagePath:', setUpPagePath, ', displayStep:', displayStep);
    let revisedState = {
      // voterContactEmailGoogleCount,
      voterContactEmailListCount,
      voterFirstName,
      // voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
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
      case 'message':
        displayStep = 111;
        break;
      case 'testsend':
        displayStep = 112;
        break;
      case 'importcontacts':
        displayStep = 1;
        break;
      case 'preview':
        displayStep = 2;
        break;
      case 'addcontacts':
        displayStep = 10;
        break;
      case 'downloadapp':
        displayStep = 11;
        break;
      case 'copy':
        displayStep = 12;
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
    // console.log('RemindContactsRoot goToNextStep nextStepPath:', nextStepPath);
    if (nextStepPath) {
      historyPush(nextStepPath);
    }
  }

  goToSkipForNow = () => {
    const { skipForNowPath } = this.state;
    // console.log('RemindContactsRoot goToSkipForNow skipForNowPath:', skipForNowPath);
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
      setUpAccountBackLinkPath, setUpAccountEntryPath,
      voterContactEmailListCount, voterPhotoUrlLarge, // voterFirstName
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
    // console.log('setNextStepVariables displayStep:', displayStep);
    switch (displayStep) {
      default:
      case 111: // message
        backToLinkPath = setUpAccountBackLinkPath || '/friends';
        backButtonOn = !!(setUpAccountBackLinkPath);
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        reassuranceTextOff = false;
        showDeleteAllContactsOption = false;
        skipForNowOff = false;
        // if (!voterFirstName) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/editname';
        //   skipForNowOff = false;
        //   skipForNowPath = '/remind/editname';
        // } else if (!voterPhotoUrlLarge) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/addphoto';
        //   skipForNowOff = false;
        //   skipForNowPath = '/remind/addphoto';
        // } else
        nextButtonText = 'Choose friends to remind'; // 'Send my friends reminders to vote';
        nextStepPath = '/remind/addcontacts';
        skipForNowPath = '/remind/addcontacts';
        break;
      case 112: // testsend
        backToLinkPath = '/remind/message';
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        reassuranceTextOff = false;
        showDeleteAllContactsOption = false;
        skipForNowOff = false;
        // if (!voterFirstName) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/editname';
        //   skipForNowOff = false;
        //   skipForNowPath = '/remind/editname';
        // } else if (!voterPhotoUrlLarge) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/addphoto';
        //   skipForNowOff = false;
        //   skipForNowPath = '/remind/addphoto';
        // } else
        if (voterContactEmailListCount > 0) {
          nextButtonText = 'Next';
          nextStepPath = '/remind/invitecontacts';
          skipForNowOff = true;
        } else {
          nextButtonText = 'Next';
          if (isWebApp()) {
            nextStepPath = '/remind/downloadapp';
            // If no contacts, skip should take you to downloadapp
            skipForNowPath = '/remind/downloadapp';
          } else if (copyPageTurnedOn) {
            nextStepPath = '/remind/copy';
            skipForNowPath = '/remind/copy';
          } else {
            nextStepPath = '/friends';
            skipForNowPath = '/friends';
          }
        }
        break;
      case 1: // importcontacts
        if (stringContains('importcontacts', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/remind/message';
        }
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        reassuranceTextOff = false;
        showDeleteAllContactsOption = false;
        skipForNowOff = false;
        // if (!voterFirstName) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/editname';
        //   skipForNowOff = false;
        //   skipForNowPath = '/remind/editname';
        // } else if (!voterPhotoUrlLarge) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/addphoto';
        //   skipForNowOff = false;
        //   skipForNowPath = '/remind/addphoto';
        // } else
        if (voterContactEmailListCount > 0) {
          nextButtonText = 'Remind your friends';
          nextStepPath = '/remind/invitecontacts';
          skipForNowOff = true;
        // } else if (friendConnectionActionAvailable) {
        //   nextButtonText = 'Next';
        //   nextStepPath = '/remind/friendrequests';
        //   skipForNowPath = '/remind/friendrequests';
        } else {
          nextButtonText = 'Next';
          if (isWebApp()) {
            nextStepPath = '/remind/downloadapp';
            // If no contacts, skip should take you to downloadapp
            skipForNowPath = '/remind/downloadapp';
          } else if (copyPageTurnedOn) {
            nextStepPath = '/remind/copy';
            skipForNowPath = '/remind/copy';
          } else {
            nextStepPath = '/friends';
            skipForNowPath = '/friends';
          }
        }
        break;
      case 2: // preview
        backButtonOn = true;
        backToLinkPath = '/remind/importcontacts';
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        nextButtonDisabled = false;
        nextButtonText = 'Next';
        reassuranceTextOff = false;
        skipForNowOff = false;
        if (voterContactEmailListCount > 0) {
          nextButtonText = 'Next, send reminders to contacts';
          nextStepPath = '/remind/invitecontacts';
        } else if (isWebApp()) {
          nextStepPath = '/remind/downloadapp';
        } else if (copyPageTurnedOn) {
          nextStepPath = '/remind/copy';
        } else if (electionDataExistsForUpcomingElection) {
          nextStepPath = '/ballot';
        } else {
          nextStepPath = '/ready';
        }
        if (voterContactEmailListCount === 0) {
          skipForNowOff = true;
        } else if (isWebApp()) {
          skipForNowPath = '/remind/downloadapp';
        } else if (copyPageTurnedOn) {
          skipForNowPath = '/remind/copy';
        } else if (electionDataExistsForUpcomingElection) {
          skipForNowPath = '/ballot';
        } else {
          skipForNowPath = '/ready';
        }
        break;
      case 10: // addcontacts
        backToLinkPath = '/remind/importcontacts';
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        reassuranceTextOff = false;
        showDeleteAllContactsOption = false;
        skipForNowOff = true;
        break;
      case 11: // downloadapp
        backButtonOn = true;
        backToLinkPath = '/remind/importcontacts';
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        nextButtonDisabled = false;
        nextButtonText = 'Next';
        reassuranceTextOff = false;
        showDeleteAllContactsOption = false;
        skipForNowOff = false;
        if (voterContactEmailListCount > 0) {
          nextStepPath = '/remind/invitecontacts';
        } else if (copyPageTurnedOn) {
          nextStepPath = '/remind/copy';
        } else {
          nextButtonText = 'Return to friends';
          nextStepPath = '/friends';
        }
        if (copyPageTurnedOn) {
          skipForNowPath = '/remind/copy';
        } else {
          skipForNowPath = '/ready';
        }
        break;
      case 12: // copy
        backButtonOn = true;
        if (isWebApp()) {
          backToLinkPath = '/remind/downloadapp';
        } else {
          backToLinkPath = '/remind/importcontacts';
        }
        desktopFixedButtonsOn = false;
        desktopInlineButtonsOnInMobile = true;
        mobileFixedButtonsOff = true;
        nextButtonDisabled = false;
        nextButtonText = 'Return to ballot';
        nextStepPath = '/ballot';
        reassuranceTextOff = false;
        skipForNowOff = false;
        skipForNowPath = '/ready';
        break;
      case 3: // 'editname'
        backButtonOn = true;
        if (!voterIsSignedIn) {
          backToLinkPath = '/remind/importcontacts';
        } else {
          backToLinkPath = '/remind/importcontacts';
        }
        desktopFixedButtonsOn = false;
        nextButtonDisabled = editNameNextButtonDisabled;
        nextButtonText = 'Save';
        reassuranceTextOff = false;
        skipForNowOff = false;
        if (!voterPhotoUrlLarge) {
          nextStepPath = '/remind/addphoto';
          skipForNowPath = '/remind/addphoto';
        } else if (voterContactEmailListCount > 0) {
          nextStepPath = '/remind/invitecontacts';
          skipForNowPath = '/remind/invitecontacts';
        } else if (isWebApp()) {
          nextStepPath = '/remind/downloadapp';
          skipForNowPath = '/remind/downloadapp';
        } else if (friendConnectionActionAvailable) {
          nextStepPath = '/remind/friendrequests';
          skipForNowPath = '/remind/friendrequests';
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
          backToLinkPath = '/remind/importcontacts';
        } else if (editNameStepVisited) {
          backToLinkPath = '/remind/editname';
        } else {
          backToLinkPath = '/remind/importcontacts';
        }
        reassuranceTextOff = false;
        skipForNowOff = false;
        // if (!voterIsSignedIn) {
        //   nextButtonText = 'Save photo';
        //   nextStepPath = '/remind/downloadapp';
        //   skipForNowPath = '/remind/downloadapp';
        if (!voterPhotoUrlLarge) {
          nextButtonText = 'Save photo';
          if (voterContactEmailListCount > 0) {
            nextStepPath = '/remind/invitecontacts';
            skipForNowPath = '/remind/invitecontacts';
          } else if (isWebApp()) {
            nextStepPath = '/remind/downloadapp'; // Next button is disabled, but we include this anyways
            skipForNowPath = '/remind/downloadapp';
          } else if (friendConnectionActionAvailable) {
            nextStepPath = '/remind/friendrequests'; // Next button is disabled, but we include this anyways
            skipForNowPath = '/remind/friendrequests';
          } else if (electionDataExistsForUpcomingElection) {
            skipForNowPath = '/ballot';
          } else {
            skipForNowPath = '/ready';
          }
        } else if (voterContactEmailListCount > 0) {
          nextButtonText = 'Next';
          nextStepPath = '/remind/invitecontacts';
          skipForNowPath = '/remind/invitecontacts';
        } else if (friendConnectionActionAvailable) {
          nextButtonText = 'Next';
          nextStepPath = '/remind/friendrequests';
          skipForNowPath = '/remind/friendrequests';
        } else if (electionDataExistsForUpcomingElection) {
          nextButtonText = 'View your ballot';
          nextStepPath = '/ballot';
        } else {
          nextButtonText = 'Get ready to vote';
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        addPhotoStepVisited = true;
        break;
      case 6: // invitecontacts
        backButtonOn = true;
        desktopFixedButtonsOn = true;
        if (!voterIsSignedIn) {
          backToLinkPath = '/remind/downloadapp';
        } else if (addPhotoStepVisited) {
          backToLinkPath = '/remind/addphoto';
        } else if (editNameStepVisited) {
          backToLinkPath = '/remind/editname';
        } else {
          backToLinkPath = '/remind/importcontacts';
        }
        reassuranceTextOff = true;
        skipForNowOff = false;
        if (friendConnectionActionAvailable) {
          nextButtonText = 'Next';
          nextStepPath = '/remind/friendrequests';
          skipForNowPath = '/remind/friendrequests';
        } else {
          nextButtonText = 'Next';
          nextStepPath = '/ready';
          skipForNowPath = '/ready';
        }
        break;
      case 7: // friendrequests -> remind friends
        backButtonOn = true;
        desktopFixedButtonsOn = true;
        if (!voterIsSignedIn) {
          backToLinkPath = '/remind/importcontacts';
        } else if (voterContactEmailListCount > 0) {
          backToLinkPath = '/remind/invitecontacts';
        } else if (addPhotoStepVisited) {
          backToLinkPath = '/remind/addphoto';
        } else if (editNameStepVisited) {
          backToLinkPath = '/remind/editname';
        } else {
          backToLinkPath = '/remind/importcontacts';
        }
        nextButtonText = 'Get ready to vote';
        nextStepPath = '/ready';
        skipForNowPath = '/ready';
        reassuranceTextOff = true;
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
    // const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
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

  goToAddContactsManually = () => {
    historyPush('/remind/addcontacts');
  }

  goToImportContacts = () => {
    historyPush('/remind/importcontacts');
  }

  render () {
    renderLog('RemindContactsRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      backButtonOn, backToLinkPath,
      desktopFixedButtonsOn, desktopInlineButtonsOnInMobile, displayStep,
      mobileFixedButtonsOff,
      nextButtonAsOutline, nextButtonClicked, nextButtonDisabled, nextButtonText,
      reassuranceTextOff, showDeleteAllContactsOption, skipForNowOff,
      voterContactEmailListCount,
    } = this.state;
    // console.log('RemindContactsRoot displayStep:', displayStep);

    let desktopNextButtonHtml;
    let mobileNextButtonHtml;
    let stepHtml;
    let desktopInlineButtonsOnBreakValue;
    if (desktopInlineButtonsOnInMobile) {
      desktopInlineButtonsOnBreakValue = 1;
    } else {
      desktopInlineButtonsOnBreakValue = isCordovaWide() ? 1000 : 'sm';
    }
    switch (displayStep) {
      default:
      case 111: // message
        stepHtml = (
          <Suspense fallback={<></>}>
            <RemindEditMessage
              displayStep={displayStep}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 112: // testsend
        stepHtml = (
          <Suspense fallback={<></>}>
            <RemindEditMessage
              displayStep={displayStep}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 1: // importcontacts
        stepHtml = (
          <Suspense fallback={<></>}>
            <RemindContactsImport
              displayStep={displayStep}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 2: // preview
        stepHtml = (
          <Suspense fallback={<></>}>
            <RemindContactsPreview
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 10: // addcontacts
        stepHtml = (
          <Suspense fallback={<></>}>
            <RemindAddContacts
              displayStep={displayStep}
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 11: // downloadapp
        stepHtml = (
          <Suspense fallback={<></>}>
            <RemindDownloadApp
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 12: // copy
        stepHtml = (
          <Suspense fallback={<></>}>
            <ShowReminderTextToCopy
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
              remindMode
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
            <RemindInviteContacts
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
      case 111: // message
        desktopNextButtonHtml = (
          <>
            <SetUpAccountNextButton
              nextButtonAsOutline={nextButtonAsOutline}
              nextButtonDisabled={nextButtonDisabled}
              nextButtonText={nextButtonText}
              onClickNextButton={this.onClickNextButton}
            />
            <DesktopNextButtonsOuterWrapperUShowDesktopTablet breakValue={desktopInlineButtonsOnBreakValue}>
              <DesktopNextButtonsInnerWrapper>
                <Button
                  classes={{ root: classes.addContactsManuallyLink }}
                  onClick={this.goToImportContacts}
                >
                  Or import contacts from Gmail
                </Button>
              </DesktopNextButtonsInnerWrapper>
            </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
          </>
        );
        mobileNextButtonHtml = desktopNextButtonHtml;
        break;
      case 112: // testsend
      case 2: // preview
      case 11: // downloadapp
      case 12: // copy
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
      case 1: // importcontacts
        if (voterContactEmailListCount > 0) {
          desktopNextButtonHtml = (
            <>
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
            <>
              <Suspense fallback={<></>}>
                <AddContactsFromGoogleButton darkButton />
              </Suspense>
              <DesktopNextButtonsOuterWrapperUShowDesktopTablet breakValue={desktopInlineButtonsOnBreakValue}>
                <DesktopNextButtonsInnerWrapper>
                  <Button
                    classes={{ root: classes.addContactsManuallyLink }}
                    onClick={this.goToAddContactsManually}
                  >
                    Or add contacts manually
                  </Button>
                </DesktopNextButtonsInnerWrapper>
              </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
            </>
          );
          mobileNextButtonHtml = desktopNextButtonHtml;
        }
        break;
      case 10: // addcontacts
        desktopNextButtonHtml = (
          <></>
        );
        mobileNextButtonHtml = (
          <></>
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
            <Reassurance displayState={displayStep} reassuranceText={reassuranceTextRemindContacts} />
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
RemindContactsRoot.propTypes = {
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

export default withStyles(styles)(RemindContactsRoot);
