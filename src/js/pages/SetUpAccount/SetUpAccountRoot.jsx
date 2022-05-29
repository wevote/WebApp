import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderBackToButton from '../../components/Navigation/HeaderBackToButton';
import { reassuranceText } from '../../components/SetUpAccount/reassuranceText';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  DesktopStaticNextButtonsOuterWrapper,
  MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile,
} from '../../components/Style/NextButtonStyles';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import Reassurance from '../Startup/Reassurance';

const logoColorOnWhite = '../../../img/global/svg-icons/we-vote-icon-square-color-dark.svg';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../../components/SetUpAccount/AddContactsFromGoogleButton'));
const SetUpAccountAddPhoto = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountAddPhoto' */ '../../components/SetUpAccount/SetUpAccountAddPhoto'));
const SetUpAccountEditName = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountEditName' */ '../../components/SetUpAccount/SetUpAccountEditName'));
const SetUpAccountFriendRequests = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountFriendRequests' */ '../../components/SetUpAccount/SetUpAccountFriendRequests'));
const SetUpAccountImportContacts = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountImportContacts' */ '../../components/SetUpAccount/SetUpAccountImportContacts'));
const SetUpAccountInviteContacts = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountInviteContacts' */ '../../components/SetUpAccount/SetUpAccountInviteContacts'));

const inDevelopmentMode = false;

function NextButton (props) {
  return (
    <Button
      color="primary"
      disabled={props.nextButtonDisabled}
      onClick={props.onClickNextButton}
      style={props.isMobile ? {
        boxShadow: 'none !important',
        textTransform: 'none',
        width: '100%',
      } : {
        boxShadow: 'none !important',
        textTransform: 'none',
        width: 250,
      }}
      variant="contained"
    >
      {props.nextButtonText}
    </Button>
  );
}
NextButton.propTypes = {
  isMobile: PropTypes.bool,
  nextButtonDisabled: PropTypes.bool,
  nextButtonText: PropTypes.string,
  onClickNextButton: PropTypes.func,
};

class SetUpAccountRoot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      addPhotoNextButtonDisabled: true,
      backToLinkPath: '',
      setUpAccountBackLinkPath: '',
      setUpAccountEntryPath: '',
      displayStep: 1, // editname
      editNameNextButtonDisabled: true,
      nextButtonClicked: false,
      voterContactEmailListCount: 0,
      // voterContactEmailGoogleCount: 0,
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
      setUpAccountBackLinkPath: AppObservableStore.getSetUpAccountBackLinkPath(),
      setUpAccountEntryPath: AppObservableStore.getSetUpAccountEntryPath(),
      displayStep,
      setUpPagePath,
    });
    VoterActions.voterContactListRetrieve();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
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
    const { voterContactEmailListCount } = this.state;
    // console.log('SetUpAccountRoot componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevSetUpPagePath !== setUpPagePath) {
      const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
      // console.log('SetUpAccountRoot componentDidUpdate setUpPagePath: ', setUpPagePath, ', displayStep:', displayStep);
      this.shouldNextButtonBeDisabled();
      this.setState({
        displayStep,
        setUpPagePath,
      }, () => this.setNextStepVariables());
    } else if ((setUpPagePath === 'importcontacts') && (voterContactEmailListCount > 0 && (voterContactEmailListCountPrevious !== voterContactEmailListCount))) {
      // console.log('Leaving importcontacts step');
      this.resetNextButtonClicked();
      historyPush('/setupaccount/invitecontacts');
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.resetNextButtonClicked();
    this.shouldNextButtonBeDisabled();
    const { setUpPagePath } = this.state;
    const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    // const voterContactEmailGoogleCount = VoterStore.getVoterContactEmailGoogleCount();
    // console.log('onVoterStoreChange voterContactEmailGoogleCount:', voterContactEmailGoogleCount, ', voterContactEmailListCount:', voterContactEmailListCount);
    this.setState({
      displayStep,
      // voterContactEmailGoogleCount,
      voterContactEmailListCount,
    }, () => this.setNextStepVariables());
  }

  convertSetUpPagePathToDisplayStep = (setUpPagePath) => {
    let displayStep;
    switch (setUpPagePath) {
      case 'addphoto':
        if (VoterStore.getVoterProfileUploadedImageUrlLarge()) {
          // This turns off the reassurance text
          displayStep = 3;
        } else {
          displayStep = 2;
        }
        break;
      default:
      case 'editname':
        displayStep = 1;
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
    const { nextStepPath } = this.state;
    historyPush(nextStepPath);
  }

  goToSkipForNow = () => {
    const { skipForNowPath } = this.state;
    historyPush(skipForNowPath);
  }

  resetNextButtonClicked = () => {
    this.setState({
      nextButtonClicked: false,
    });
  }

  setNextStepVariables = () => {
    const { displayStep, setUpAccountBackLinkPath, setUpAccountEntryPath, voterContactEmailListCount } = this.state;
    let backToLinkPath = '';
    let nextButtonText = '';
    let nextStepPath;
    let reassuranceTextOff;
    let skipForNowOff;
    let skipForNowPath;
    switch (displayStep) {
      default:
      case 1: // 'editname'
        backToLinkPath = setUpAccountBackLinkPath;
        nextButtonText = 'Next';
        nextStepPath = '/setupaccount/addphoto';
        reassuranceTextOff = false;
        skipForNowOff = false;
        skipForNowPath = '/setupaccount/addphoto';
        break;
      case 2: // 'addphoto'
      case 3:
        if (stringContains('addphoto', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/setupaccount/editname';
        }
        nextButtonText = (inDevelopmentMode) ? 'Find your friends' : 'View your ballot';
        reassuranceTextOff = false;
        if (inDevelopmentMode) {
          if (voterContactEmailListCount === 0) {
            nextStepPath = '/setupaccount/importcontacts';
            skipForNowOff = false;
            skipForNowPath = '/setupaccount/importcontacts';
          } else {
            nextStepPath = '/setupaccount/invitecontacts';
            skipForNowOff = false;
            skipForNowPath = '/setupaccount/invitecontacts';
          }
        } else {
          nextStepPath = '/ballot';
          skipForNowOff = true;
          skipForNowPath = '/ballot';
        }
        break;
      case 4: // importcontacts
        if (stringContains('importcontacts', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/setupaccount/addphoto';
        }
        if (voterContactEmailListCount > 0) {
          nextButtonText = 'Choose contacts to invite';
        } else {
          nextButtonText = 'Import contacts from Gmail';
        }
        reassuranceTextOff = true;
        if (voterContactEmailListCount > 0) {
          nextStepPath = '/setupaccount/invitecontacts';
          skipForNowOff = false;
          skipForNowPath = '/ballot';
        } else {
          // We will want to add a switch between friend requests and suggestions here
          nextStepPath = '/setupaccount/friendrequests';
          skipForNowOff = false;
          skipForNowPath = '/setupaccount/friendrequests';
        }
        break;
      case 5: // invitecontacts
        if (stringContains('invitecontacts', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else {
          backToLinkPath = '/setupaccount/importcontacts';
        }
        nextButtonText = 'Next';
        nextStepPath = '/setupaccount/friendrequests';
        reassuranceTextOff = false;
        skipForNowOff = false;
        skipForNowPath = '/ballot';
        break;
      case 6: // friendrequests
        if (stringContains('friendrequests', setUpAccountEntryPath)) {
          backToLinkPath = setUpAccountBackLinkPath;
        } else if (voterContactEmailListCount > 0) {
          backToLinkPath = '/setupaccount/invitecontacts';
        } else {
          backToLinkPath = '/setupaccount/importcontacts';
        }
        nextButtonText = 'View your ballot';
        nextStepPath = '/ballot';
        reassuranceTextOff = false;
        skipForNowOff = true;
        skipForNowPath = '/ballot';
        break;
    }
    this.setState({
      backToLinkPath,
      nextButtonText,
      nextStepPath,
      reassuranceTextOff,
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
      editNameNextButtonDisabled, nextButtonClicked, nextButtonText,
      reassuranceTextOff, setUpAccountBackLinkPath, skipForNowOff,
      voterContactEmailListCount,
    } = this.state;
    // console.log('SetUpAccountRoot displayState', displayStep);

    let backButtonOn;
    let desktopFixedButtonsOn;
    let desktopNextButtonHtml;
    let mobileNextButtonHtml;
    let nextButtonDisabled = true;
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
              functionToUseWhenProfileComplete={this.goToNextStep}
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 4: // importcontacts
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        nextButtonDisabled = false;
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
        nextButtonDisabled = false;
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
        nextButtonDisabled = false;
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
          <NextButton
            nextButtonDisabled={nextButtonDisabled}
            nextButtonText={nextButtonText}
            onClickNextButton={this.onClickNextButton}
          />
        );
        mobileNextButtonHtml = (
          <NextButton
            isMobile
            nextButtonDisabled={nextButtonDisabled}
            nextButtonText={nextButtonText}
            onClickNextButton={this.onClickNextButton}
          />
        );
        break;
      case 4: // importcontacts
        if (voterContactEmailListCount > 0) {
          desktopNextButtonHtml = (
            <NextButton
              nextButtonDisabled={nextButtonDisabled}
              nextButtonText={nextButtonText}
              onClickNextButton={this.onClickNextButton}
            />
          );
          mobileNextButtonHtml = (
            <NextButton
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
            <DesktopNextButtonsOuterWrapperUShowDesktopTablet breakValue={isCordovaWide() ? 1000 : 'sm'}>
              <DesktopNextButtonsInnerWrapper>
                {desktopButtonsHtml}
              </DesktopNextButtonsInnerWrapper>
            </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
          )}
          {!reassuranceTextOff && (
            <Reassurance displayState={displayStep} reassuranceText={reassuranceText} />
          )}
        </AccountSetUpRootWrapper>
        <MobileStaticNextButtonsOuterWrapperUShowMobile breakValue={isCordovaWide() ? 1000 : 'sm'}>
          <MobileStaticNextButtonsInnerWrapper>
            {mobileButtonsHtml}
          </MobileStaticNextButtonsInnerWrapper>
        </MobileStaticNextButtonsOuterWrapperUShowMobile>
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

const AccountSetUpRootWrapper = styled('div')`
  background-color: white;
  max-width: 600px;
  padding: 40px 20px 110% 20px;
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

export default withStyles(styles)(SetUpAccountRoot);
