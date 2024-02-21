import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderBackToButton from '../../components/Navigation/HeaderBackToButton';
import SetUpAccountNextButton from '../../components/SetUpAccount/SetUpAccountNextButton';
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
import AppObservableStore from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';

const UnsubscribeSimpleTextForModifier = React.lazy(() => import(/* webpackChunkName: 'UnsubscribeSimpleTextForModifier' */ '../../components/Settings/UnsubscribeSimpleTextForModifier'));
const UnsubscribeThankYou = React.lazy(() => import(/* webpackChunkName: 'UnsubscribeThankYou' */ '../../components/Settings/UnsubscribeThankYou'));
const WhatIsWeVote = React.lazy(() => import(/* webpackChunkName: 'WhatIsWeVote' */ '../../components/FriendIntro/WhatIsWeVote'));

const logoColorOnWhite = '../../../img/global/svg-icons/we-vote-icon-square-color-dark.svg';


class UnsubscribeRoot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      backToLinkPath: '',
      displayStep: 1, // dailyfriendactivity, friendaccept, friendinvite, friendopinions, friendopinionsall, friendmessage, login, newsletter, OTHER SITE: friendcampaignsupport, campaigninitialresponse, campaignnews, campaignshare, campaignsupporter
      subscriptionSecretKey: '12345',
      nextButtonAsOutline: false,
      nextButtonClicked: false,
      nextButtonText: '',
      nextStepPath: '',
      unsubscribeBackLinkPath: '',
      unsubscribeEntryPath: '',
      unsubscribeModifier: '',
      showWhatIsWeVote: false,
      skipForNowOff: false,
      skipForNowPath: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('voterRetrieve', 2000)) {
      VoterActions.voterRetrieve(); // We need to make sure we have the latest voter settings
    }
    let params = {};
    let subscriptionSecretKey = '';
    let unsubscribeModifier = '';
    const { match } = this.props;
    if (match) {
      ({ params } = match);
      if (params) {
        ({
          subscription_secret_key: subscriptionSecretKey,
          unsubscribe_modifier: unsubscribeModifier,
        } = params);
      }
    }
    if (subscriptionSecretKey) {
      VoterActions.voterNotificationSettingsUpdateFromSecretKey(subscriptionSecretKey);
    }
    const displayStep = this.convertUnsubscribeModifierToDisplayStep(unsubscribeModifier);
    this.shouldNextButtonBeDisabled();
    this.setState({
      // unsubscribeBackLinkPath: AppObservableStore.getSetUpAccountBackLinkPath(),
      unsubscribeEntryPath: AppObservableStore.getSetUpAccountEntryPath(),
      displayStep,
      subscriptionSecretKey,
      unsubscribeModifier,
    }, () => this.setNextStepVariables());
  }

  componentDidUpdate (prevProps) {
    let prevParams = {};
    let previousSubscriptionSecretKey = '';
    let previousUnsubscribeModifier = '';
    const { match: prevMatch } = prevProps;
    if (prevMatch) {
      ({ params: prevParams } = prevMatch);
      if (prevParams) {
        ({
          subscription_secret_key: previousSubscriptionSecretKey,
          unsubscribe_modifier: previousUnsubscribeModifier,
        } = prevParams);
      }
    }
    let params = {};
    let subscriptionSecretKey = '';
    let unsubscribeModifier = '';
    const { instantUnsubscribe, match } = this.props;
    if (match) {
      ({ params } = match);
      if (params) {
        ({
          subscription_secret_key: subscriptionSecretKey,
          unsubscribe_modifier: unsubscribeModifier,
        } = params);
      }
    }
    // console.log('UnsubscribeRoot componentDidUpdate instantUnsubscribe:', instantUnsubscribe, ', unsubscribeModifier:', unsubscribeModifier);
    if ((previousUnsubscribeModifier !== unsubscribeModifier) || (previousSubscriptionSecretKey !== subscriptionSecretKey)) {
      const displayStep = this.convertUnsubscribeModifierToDisplayStep(unsubscribeModifier);
      // console.log('UnsubscribeRoot componentDidUpdate unsubscribeModifier: ', unsubscribeModifier, ', displayStep:', displayStep);
      // const notificationSettingConstant = VoterStore.getNotificationSettingConstantFromUnsubscribeModifier(unsubscribeModifier);
      // const notificationSettingIsOn = VoterStore.getNotificationSettingsFlagState(notificationSettingConstant);
      this.shouldNextButtonBeDisabled();
      this.setState({
        displayStep,
        subscriptionSecretKey,
        unsubscribeModifier,
      }, () => this.setNextStepVariables());
    } else if ((instantUnsubscribe) && (unsubscribeModifier !== 'thankyou')) {
      // console.log('instantUnsubscribe navigating to thankyou');
      const { nextButtonClicked } = this.state;
      if (!nextButtonClicked) {
        this.setState({
          nextButtonClicked: true,
        });
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.resetNextButtonClicked();
    this.shouldNextButtonBeDisabled();
    const { unsubscribeModifier } = this.state; // subscriptionSecretKey
    const notificationSettingConstant = VoterStore.getNotificationSettingConstantFromUnsubscribeModifier(unsubscribeModifier);

    const voterNotificationSettingsUpdateStatus = VoterStore.getVoterNotificationSettingsUpdateStatus();
    // console.log('onVoterStoreChange voterNotificationSettingsUpdateStatus:', voterNotificationSettingsUpdateStatus);
    const { emailFound, normalizedEmailAddress } = voterNotificationSettingsUpdateStatus; // apiResponseReceived, notificationSettingsFlags, voterFound
    let displayStep;
    let notificationSettingIsOn = false;
    if (emailFound) {
      displayStep = this.convertUnsubscribeModifierToDisplayStep(unsubscribeModifier);
      notificationSettingIsOn = VoterStore.getNotificationSettingsFlagStateFromSecretKey(notificationSettingConstant);
      this.setState({
        displayStep,
        normalizedEmailAddress,
        notificationSettingIsOn,
      }, () => this.setNextStepVariables());
    }
    // console.log('unsubscribeModifier:', unsubscribeModifier, ', notificationSettingIsOn:', notificationSettingIsOn);
  }

  convertUnsubscribeModifierToDisplayStep = (unsubscribeModifier) => {
    let displayStep;
    switch (unsubscribeModifier) {
      default:
      case 'dailyfriendactivity':
      case 'friendaccept':
      case 'friendinvite':
      case 'friendopinions':
      case 'friendopinionsall':
      case 'friendmessage':
      case 'login':
      case 'newsletter':
        displayStep = 1;
        break;
      case 'thankyou':
        displayStep = 2;
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
    // console.log('UnsubscribeRoot nextStepPath:', nextStepPath);
    if (nextStepPath) {
      historyPush(nextStepPath);
    }
  }

  goToSkipForNow = () => {
    const { skipForNowPath } = this.state;
    // console.log('UnsubscribeRoot goToSkipForNow skipForNowPath:', skipForNowPath);
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
      displayStep, subscriptionSecretKey, normalizedEmailAddress, notificationSettingIsOn,
      unsubscribeBackLinkPath, unsubscribeEntryPath, unsubscribeModifier,
    } = this.state;
    let backToLinkPath = '';
    const nextButtonAsOutline = false;
    let nextButtonText = '';
    let nextStepPath;
    let skipForNowOff;
    let skipForNowPath = '';
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    switch (displayStep) {
      default:
      case 1: // Multiple individual kinds of notifications options
        backToLinkPath = unsubscribeBackLinkPath;
        if (notificationSettingIsOn) {
          nextButtonText = `Unsubscribe ${normalizedEmailAddress}`;
        } else {
          nextButtonText = 'Next';
        }
        nextStepPath = `/unsubscribe/${subscriptionSecretKey}/thankyou`;
        skipForNowOff = false;
        skipForNowPath = '/ready';
        break;
      case 2: // 'thankyou'
        if (stringContains('thankyou', unsubscribeEntryPath)) {
          backToLinkPath = unsubscribeBackLinkPath;
        } else {
          backToLinkPath = `/unsubscribe/${subscriptionSecretKey}/${unsubscribeModifier}`;
        }
        if (voterIsSignedIn) {
          nextButtonText = 'See all notification settings';
          nextStepPath = '/settings/notifications';
        } else {
          nextButtonText = 'Get ready to vote';
          nextStepPath = '/ready';
        }
        skipForNowOff = false;
        skipForNowPath = '/ready';
        break;
      case 3: // emailFound === false
        if (voterIsSignedIn) {
          nextButtonText = 'See all notification settings';
          nextStepPath = '/settings/notifications';
        } else {
          nextButtonText = 'Get ready to vote';
          nextStepPath = '/ready';
        }
        skipForNowOff = false;
        skipForNowPath = '/ready';
        break;
    }
    this.setState({
      backToLinkPath,
      nextButtonAsOutline,
      nextButtonText,
      nextStepPath,
      skipForNowOff,
      skipForNowPath,
    });
  }

  shouldNextButtonBeDisabled = () => {
    // let voterEmailMissing = false;
    // let voterFirstNameMissing = false;
    // let voterPhotoMissing = false;
    // const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    // const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    // const voterEmailQueuedToSave = VoterStore.getVoterEmailQueuedToSave();
    // const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    // if (!voterIsSignedInWithEmail && !voterEmailQueuedToSave) {
    //   voterEmailMissing = true;
    // }
    // if (!voterFirstNameQueuedToSave && !VoterStore.getFirstName()) {
    //   voterFirstNameMissing = true;
    // }
    // if (!voterPhotoQueuedToSave && !VoterStore.getVoterProfileUploadedImageUrlLarge()) {
    //   voterPhotoMissing = true;
    // }
    // this.setState({
    //   addPhotoNextButtonDisabled: voterPhotoMissing,
    //   editNameNextButtonDisabled: voterEmailMissing || voterFirstNameMissing,
    // });
  }

  toggleWhatIsWeVote = () => {
    const { showWhatIsWeVote } = this.state;
    this.setState({
      showWhatIsWeVote: !showWhatIsWeVote,
    });
  }

  render () {
    renderLog('UnsubscribeRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      backToLinkPath, displayStep,
      nextButtonAsOutline, nextButtonClicked, nextButtonText,
      unsubscribeBackLinkPath, unsubscribeModifier,
      showWhatIsWeVote, skipForNowOff, subscriptionSecretKey,
    } = this.state;
    // console.log('UnsubscribeRoot displayState', displayStep);

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
      case 1: // Any of the notification settings
        backButtonOn = !!(unsubscribeBackLinkPath);
        desktopFixedButtonsOn = false;
        nextButtonDisabled = false;
        stepHtml = (
          <Suspense fallback={<></>}>
            <UnsubscribeSimpleTextForModifier
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
              subscriptionSecretKey={subscriptionSecretKey}
              unsubscribeModifier={unsubscribeModifier}
            />
          </Suspense>
        );
        break;
      case 2: // thankyou
        backButtonOn = true;
        desktopFixedButtonsOn = false;
        nextButtonDisabled = false;
        stepHtml = (
          <Suspense fallback={<></>}>
            <UnsubscribeThankYou
              goToNextStep={this.goToNextStep}
              nextButtonClicked={nextButtonClicked}
              // unsubscribeModifier={unsubscribeModifier}
            />
          </Suspense>
        );
        break;
    }

    switch (displayStep) {
      default:
      case 1: // friendaccept
      case 2: // thankyou
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

    if (showWhatIsWeVote) {
      return (
        <PageContentContainerAccountSetUp>
          <Helmet title="Unsubscribe - WeVote" />
          <Suspense fallback={<></>}>
            <WhatIsWeVote toggleWhatIsWeVote={this.toggleWhatIsWeVote} />
          </Suspense>
        </PageContentContainerAccountSetUp>
      );
    }

    return (
      <PageContentContainerAccountSetUp>
        <Helmet title="Unsubscribe - WeVote" />
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
          <WhatIsWeVoteLinkWrapper>
            <Button
              classes={{ root: classes.mobileSimpleLink }}
              color="primary"
              onClick={this.toggleWhatIsWeVote}
            >
              What is WeVote?
            </Button>
          </WhatIsWeVoteLinkWrapper>
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
UnsubscribeRoot.propTypes = {
  classes: PropTypes.object,
  instantUnsubscribe: PropTypes.bool,
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

const WhatIsWeVoteLinkWrapper = styled('div')`
  margin-top: 48px;
`;

export default withStyles(styles)(UnsubscribeRoot);
