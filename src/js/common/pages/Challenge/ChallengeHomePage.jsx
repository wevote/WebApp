import { keyframes } from '@emotion/react';
import { PersonSearch } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ChallengeInviteFriendsTopNavigation from '../../components/Navigation/ChallengeInviteFriendsTopNavigation';
import DesignTokenColors from '../../components/Style/DesignTokenColors';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import webAppConfig from '../../../config';
import BallotActions from '../../../actions/BallotActions';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import VoterStore from '../../../stores/VoterStore';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import {
  CampaignDescriptionDesktop, CampaignDescriptionDesktopWrapper, CampaignDescriptionWrapper,
  CampaignSubSectionSeeAll, CampaignSubSectionTitle, CampaignSubSectionTitleWrapper,
  CommentsListWrapper, DetailsSectionDesktopTablet, DetailsSectionMobile, SupportButtonFooterWrapperAboveFooterButtons, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import { ChallengeDescription } from '../../components/Style/ChallengeCardStyles';
import { EditIndicator, IndicatorButtonWrapper, IndicatorRow } from '../../components/Style/CampaignIndicatorStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import LinkToAdminTools from '../../components/Widgets/LinkToAdminTools';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import apiCalming from '../../utils/apiCalming';
import { getChallengeValuesFromIdentifiers, retrieveChallengeFromIdentifiersIfNeeded } from '../../utils/challengeUtils';
import historyPush from '../../utils/historyPush';
import { isCordova, isWebApp } from '../../utils/isCordovaOrWebApp';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import { cordovaOffsetLog, renderLog } from '../../utils/logging';
import returnFirstXWords from '../../utils/returnFirstXWords';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';
import standardBoxShadow from '../../components/Style/standardBoxShadow';
import { cordovaBallotFilterTopMargin } from '../../../utils/cordovaOffsets';
import { headroomWrapperOffset } from '../../../utils/cordovaCalculatedOffsets';
import { getPageKey } from '../../../utils/cordovaPageUtils';
import ChallengeAbout from '../../components/Challenge/ChallengeAbout';
import ChallengeParticipantListRoot from '../../components/ChallengeParticipantListRoot/ChallengeParticipantListRoot';
import ChallengeInviteeListRoot from '../../components/ChallengeInviteeListRoot/ChallengeInviteeListRoot';
import ThanksForViewingChallenge from '../../components/Challenge/ThanksForViewingChallenge';
import ShareStore from '../../stores/ShareStore';
import ChallengeHeaderSimple from '../../components/Navigation/ChallengeHeaderSimple';

const ChallengeCardForList = React.lazy(() => import(/* webpackChunkName: 'ChallengeCardForList' */ '../../components/ChallengeListRoot/ChallengeCardForList'));
// const ChallengeCommentsList = React.lazy(() => import(/* webpackChunkName: 'ChallengeCommentsList' */ '../../components/Challenge/ChallengeCommentsList'));
const ChallengeRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/Challenge/ChallengeRetrieveController'));
// const ChallengeNewsItemList = React.lazy(() => import(/* webpackChunkName: 'ChallengeNewsItemList' */ '../../components/Challenge/ChallengeNewsItemList'));
// const ChallengeShareChunk = React.lazy(() => import(/* webpackChunkName: 'ChallengeShareChunk' */ '../../components/Challenge/ChallengeShareChunk'));
const JoinChallengeButton = React.lazy(() => import(/* webpackChunkName: 'JoinChallengeButton' */ '../../components/Challenge/JoinChallengeButton'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../components/Widgets/ReadMore'));

const futureFeaturesDisabled = true;
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

function marginTopOffset (scrolledDown) {
  // if (isIOSAppOnMac()) {
  //   return '44px';
  // } else if (isIPad()) {
  //   return '12px';
  // } else if (isIOS()) {
  //   return '85px';
  // } else if (isWebApp() && isMobileScreenSize()) {
  //   if (scrolledDown) {
  //     return '54px';
  //   } else {
  //     return '64px';
  //   }
  if (isWebApp()) {
    if (scrolledDown) {
      return '-6px';
    } else {
      return '39px';
    }
  } else if (isCordova()) {
    // Calculated approach Nov 2022
    const offset = `${headroomWrapperOffset(true)}px`;
    cordovaOffsetLog(`ChallengeHomePage HeadroomWrapper offset: ${offset}, page: ${getPageKey()}`);
    return offset;
    // end calculated approach
  }
  return 0;
}


class ChallengeHomePage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      // inPrivateLabelMode: false,
      loadSlow: false,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      challengeDataFound: false,
      challengeDataNotFound: false,
      challengeDescription: '',
      challengePhotoLargeUrl: '',
      challengeSEOFriendlyPath: '',
      challengeSEOFriendlyPathForDisplay: '', // Value for challenge already received
      challengeTitle: '',
      challengeWeVoteId: '',
      challengeWeVoteIdForDisplay: '', // Value for challenge already received
      sharingStepCompleted: false,
      step2Completed: false,
      thanksForViewingChallengeOn: false,
      voterCanEditThisChallenge: false,
    };
    // this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('ChallengeHomePage componentDidMount');
    const { match: { params } } = this.props;
    const {
      challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl,
      challengeWeVoteId,
      shared_item_code: sharedItemCodeIncoming,
    } = params;
    // console.log('ChallengeHomePage componentDidMount tabSelected: ', tabSelected);
    // console.log('componentDidMount challengeSEOFriendlyPathFromUrl: ', challengeSEOFriendlyPathFromUrl, ', challengeWeVoteId: ', challengeWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.challengeParticipantStoreListener = ChallengeParticipantStore.addListener(this.onChallengeParticipantStoreChange.bind(this));
    this.onChallengeStoreChange();
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let challengeSEOFriendlyPathFromObject;
    let triggerSEOPathRedirect = false;
    if (challengeSEOFriendlyPathFromUrl) {
      const challenge = ChallengeStore.getChallengeBySEOFriendlyPath(challengeSEOFriendlyPathFromUrl);
      challengeSEOFriendlyPathFromObject = challenge.seo_friendly_path;
      triggerSEOPathRedirect = challengeSEOFriendlyPathFromObject && (challengeSEOFriendlyPathFromUrl !== challengeSEOFriendlyPathFromObject);
      // console.log('componentDidMount challengeSEOFriendlyPathFromObject: ', challengeSEOFriendlyPathFromObject);
      // Only change challenge if the we_vote_id is different
      if (challenge && challenge.challenge_we_vote_id) {
        this.setState({
          challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl,
          challengeSEOFriendlyPathForDisplay: challengeSEOFriendlyPathFromUrl,
          challengeWeVoteId: challenge.challenge_we_vote_id,
        }, () => this.onFirstRetrievalOfChallengeWeVoteId());
      } else {
        this.setState({
          challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl,
          challengeSEOFriendlyPathForDisplay: challengeSEOFriendlyPathFromUrl,
        });
      }
    } else if (challengeWeVoteId) {
      this.setState({
        challengeWeVoteId,
        challengeWeVoteIdForDisplay: challengeWeVoteId,
      }, () => this.onFirstRetrievalOfChallengeWeVoteId());
    }
    // Take the "calculated" identifiers and retrieve if missing
    retrieveChallengeFromIdentifiersIfNeeded(challengeSEOFriendlyPathFromUrl, challengeWeVoteId);

    this.ballotRetrieveTimer = setTimeout(() => {
      // voterBallotItemsRetrieve is takes significant resources, so let's delay it for a few seconds
      if (apiCalming('voterBallotItemsRetrieve', 600000)) {
        BallotActions.voterBallotItemsRetrieve(0, '', '');
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

    // If we came in through a sharedItem link and then redirected to this page, fetch the shared item details
    const sharedItem = ShareStore.getSharedItemByCode(sharedItemCodeIncoming);
    // console.log('sharedItem:', sharedItem);
    if (sharedItem && sharedItem.shared_by_display_name) {
      const {
        shared_by_display_name: sharedByDisplayName,
        // shared_by_first_name: sharedByFirstName,
      } = sharedItem;
      this.setState({
        sharedByDisplayName,
        thanksForViewingChallengeOn: true,
      });
    }

    // console.log('componentDidMount triggerSEOPathRedirect: ', triggerSEOPathRedirect, ', challengeSEOFriendlyPathFromObject: ', challengeSEOFriendlyPathFromObject);
    if (triggerSEOPathRedirect && challengeSEOFriendlyPathFromObject) {
      historyPush(`/${challengeSEOFriendlyPathFromObject}/+/`, true);
    }
    // this.analyticsTimer = setTimeout(() => {
    //   AnalyticsActions.saveActionPoliticianPageVisit(challengeSEOFriendlyPathFromUrl, challengeWeVoteId);
    // }, 3000);
    window.scrollTo(0, 0);
    // window.addEventListener('scroll', this.onScroll);
  }

  componentDidUpdate (prevProps) {
    // console.log('ChallengeHomePage componentDidUpdate');
    const { match: { params: prevParams } } = prevProps;
    const { challengeSEOFriendlyPath: prevChallengeSEOFriendlyPath, challengeWeVoteId: prevChallengeWeVoteId, tabSelected: tabSelectedPrevious } = prevParams;
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl, challengeWeVoteId, tabSelected } = params;
    let challengeSEOFriendlyPath = '';
    let triggerFreshRetrieve = false;
    let triggerSEOPathRedirect = false;
    const challenge = ChallengeStore.getChallengeBySEOFriendlyPath(challengeSEOFriendlyPathFromUrl);
    const challengeSEOFriendlyPathFromObject = challenge.seo_friendly_path;
    // console.log('componentDidUpdate challengeSEOFriendlyPathFromUrl: ', challengeSEOFriendlyPathFromUrl, ', challengeSEOFriendlyPathFromObject: ', challengeSEOFriendlyPathFromObject, ', prevChallengeSEOFriendlyPath:', prevChallengeSEOFriendlyPath);
    // console.log('challengeWeVoteId: ', challengeWeVoteId, ', prevChallengeWeVoteId: ', prevChallengeWeVoteId);
    if (challengeSEOFriendlyPathFromUrl && (challengeSEOFriendlyPathFromUrl !== prevChallengeSEOFriendlyPath)) {
      // console.log('challengeSEOFriendlyPathFromUrl CHANGE 1');
      // console.log('componentDidUpdate prevChallengeSEOFriendlyPath: ', prevChallengeSEOFriendlyPath);
      const challengeWeVoteIdFromUrl = ChallengeStore.getChallengeWeVoteIdFromChallengeSEOFriendlyPath(challengeSEOFriendlyPathFromUrl);
      const challengeWeVoteIdFromPreviousUrl = ChallengeStore.getChallengeWeVoteIdFromChallengeSEOFriendlyPath(prevChallengeSEOFriendlyPath);
      const isSameChallenge = challengeWeVoteIdFromPreviousUrl && (challengeWeVoteIdFromUrl === challengeWeVoteIdFromPreviousUrl);
      // Only change challenge if the we_vote_id is different
      if (isSameChallenge) {
        // console.log('isSamePolitician');
        // Don't change the challenge if the we_vote_id is the same as the previous
        // but specify that we want to triggerSEOPathRedirect
        challengeSEOFriendlyPath = challenge.seo_friendly_path;
        triggerSEOPathRedirect = true;
      } else {
        // console.log('NOT isSamePolitician');
        if (challenge && challenge.challenge_we_vote_id) {
          this.setState({
            challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl,
            challengeSEOFriendlyPathForDisplay: challengeSEOFriendlyPathFromUrl,
            challengeWeVoteId: challenge.challenge_we_vote_id,
            challengeWeVoteIdForDisplay: challenge.challenge_we_vote_id,
          });  // , () => this.onFirstRetrievalOfChallengeWeVoteId());
        } else {
          this.setState({
            challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl,
            challengeSEOFriendlyPathForDisplay: challengeSEOFriendlyPathFromUrl,
          });  // , () => this.onFirstRetrievalOfChallengeWeVoteId());
        }
        triggerFreshRetrieve = true;
        triggerSEOPathRedirect = true;
      }
    } else if (challengeSEOFriendlyPathFromObject && (challengeSEOFriendlyPathFromUrl !== challengeSEOFriendlyPathFromObject)) {
      // console.log('challengeSEOFriendlyPathFromObject CHANGE');
      challengeSEOFriendlyPath = challengeSEOFriendlyPathFromObject;
      triggerFreshRetrieve = true;
      triggerSEOPathRedirect = true;
    } else if (challengeSEOFriendlyPathFromUrl !== prevChallengeSEOFriendlyPath) {
      // console.log('challengeSEOFriendlyPathFromUrl CHANGE 2');
      triggerFreshRetrieve = true;
      triggerSEOPathRedirect = true;
    } else if (challengeWeVoteId && (challengeWeVoteId !== prevChallengeWeVoteId)) {
      // console.log('POLITICIAN CHANGE componentDidUpdate prevChallengeWeVoteId: ', prevChallengeWeVoteId);
      if (challenge && challenge.challenge_we_vote_id) {
        this.setState({
          challengeSEOFriendlyPath: challenge.seo_friendly_path,
          challengeSEOFriendlyPathForDisplay: challenge.seo_friendly_path,
          challengeWeVoteId,
          challengeWeVoteIdForDisplay: challengeWeVoteId,
        }); // , () => this.onFirstRetrievalOfChallengeWeVoteId());
      } else {
        this.setState({
          challengeWeVoteId,
          challengeWeVoteIdForDisplay: challengeWeVoteId,
        }); // , () => this.onFirstRetrievalOfChallengeWeVoteId());
      }
      triggerFreshRetrieve = true;
      triggerSEOPathRedirect = true;
    } else if (tabSelected && tabSelected !== tabSelectedPrevious) {
      // Trigger a re-render
      // console.log('componentDidUpdate tabSelected CHANGE');
      this.setState({});
    }
    // console.log('componentDidUpdate triggerSEOPathRedirect: ', triggerSEOPathRedirect, ', challengeSEOFriendlyPath: ', challengeSEOFriendlyPath);
    if (triggerSEOPathRedirect && challengeSEOFriendlyPath) {
      // Direct to the updated SEO path
      historyPush(`/${challengeSEOFriendlyPath}/+/`, true);
      this.clearChallengeValues();
      this.onChallengeStoreChange();
    }
    if (triggerFreshRetrieve) {
      // Take the "calculated" identifiers and retrieve if missing
      retrieveChallengeFromIdentifiersIfNeeded(challengeSEOFriendlyPathFromUrl, challengeWeVoteId);
    }
    if (triggerFreshRetrieve || triggerSEOPathRedirect) {
      // Take the "calculated" identifiers and retrieve if missing
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    if (this.ballotRetrieveTimer) {
      clearTimeout(this.ballotRetrieveTimer);
      this.ballotRetrieveTimer = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.appStateSubscription.unsubscribe();
    this.challengeParticipantStoreListener.remove();
    this.challengeStoreListener.remove();
    // window.removeEventListener('scroll', this.onScroll);
  }

  onFirstRetrievalOfChallengeWeVoteId () {
    this.onChallengeParticipantStoreChange();
    this.onChallengeStoreChange();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode && webAppConfig.ENABLE_PAY_TO_PROMOTE;
    this.setState({
      chosenWebsiteName,
      // inPrivateLabelMode,
      payToPromoteStepTurnedOn,
      scrolledDown: AppObservableStore.getScrolledDown(),
    });
  }

  onChallengeParticipantStoreChange () {
    const { challengeWeVoteId } = this.state;
    const step2Completed = ChallengeParticipantStore.voterSupporterEndorsementExists(challengeWeVoteId);
    const payToPromoteStepCompleted = ChallengeParticipantStore.voterChipInExists(challengeWeVoteId);
    const sharingStepCompleted = false;
    // console.log('onChallengeParticipantStoreChange step2Completed: ', step2Completed, ', sharingStepCompleted: ', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      sharingStepCompleted,
      step2Completed,
      payToPromoteStepCompleted,
    });
  }

  onChallengeStoreChange () {
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('onChallengeStoreChange challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengeDescription,
      challengePhotoLargeUrl,
      challengePhotoMediumUrl,
      challengeSEOFriendlyPath,
      challengeTitle,
      challengeWeVoteId,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
      weVoteHostedProfileImageUrlLarge,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    // console.log('onChallengeStoreChange AFTER getChallengeValuesFromIdentifiers challengeWeVoteId: ', challengeWeVoteId);
    let pathToUseWhenProfileComplete;
    if (challengeSEOFriendlyPath) {
      this.setState({
        challengeSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/${challengeSEOFriendlyPath}/+/why-do-you-support`;
    } else if (challengeWeVoteId) {
      pathToUseWhenProfileComplete = `/+/${challengeWeVoteId}/why-do-you-support`;
    }
    if (challengeWeVoteId) {
      const voterCanEditThisChallenge = ChallengeStore.getVoterCanEditThisChallenge(challengeWeVoteId);
      const voterIsChallengeParticipant = ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId);
      this.setState({
        challengeWeVoteId,
        challengeWeVoteIdForDisplay: challengeWeVoteId,
        voterCanEditThisChallenge,
        voterIsChallengeParticipant,
      });
    }
    const challengeDescriptionLimited = returnFirstXWords(challengeDescription, 200);
    this.setState({
      challengeDescription,
      challengeDescriptionLimited,
      challengePhotoLargeUrl,
      challengePhotoMediumUrl,
      challengeTitle,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
      pathToUseWhenProfileComplete,
      weVoteHostedProfileImageUrlLarge,
    });
  }

  // onScroll () {
  //   const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
  //   // console.log('showMoreItemsElement: ', showMoreItemsElement);
  //   if (showMoreItemsElement) {
  //   }
  // }

  onVoterStoreChange () {
    this.setState({
      voterWeVoteId: VoterStore.getVoterWeVoteId(),
    }, () => this.onChallengeStoreChange());
  }

  clearChallengeValues = () => {
    // When we transition from one challenge to another challenge, there
    // can be a delay in getting the new challenge's values. We want to clear
    // out the values currently being displayed, while waiting for new values
    // to arrive.
    this.setState({
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      // isSupportersCountMinimumExceeded: false,
      challengeWeVoteId: '',
      challengeDataFound: false,
      challengeDataNotFound: false,
      challengeDescription: '',
      challengeDescriptionLimited: '',
      challengePhotoLargeUrl: '',
      challengeTitle: '',
      challengeWeVoteIdForDisplay: '', // We don't clear challengeWeVoteId because we may need it to load next challenge
      challengeSEOFriendlyPathForDisplay: '', // We don't clear challengeSEOFriendlyPath because we may need it to load next challenge
    });
  }

  getChallengeBasePath = () => {
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    let challengeBasePath;
    if (challengeSEOFriendlyPath) {
      challengeBasePath = `/${challengeSEOFriendlyPath}/+/`;
    } else {
      challengeBasePath = `/+/${challengeWeVoteId}/`;
    }

    return challengeBasePath;
  }

  functionToUseToKeepHelping = () => {
    const { finalElectionDateInPast, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log('functionToUseToKeepHelping sharingStepCompleted:', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted, ', step2Completed:', step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, finalElectionDateInPast);
    historyPush(`${this.getChallengeBasePath()}${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete = () => {
    const { challengeWeVoteId } = this.state;
    if (challengeWeVoteId) {
      // const challengeBasePath = this.getChallengeBasePath();
      // console.log('ChallengeHomePage functionToUseWhenProfileComplete challengeBasePath (IGNORED):', challengeBasePath);
      saveCampaignSupportAndGoToNextPage(challengeWeVoteId);  // challengeBasePath
    } else {
      console.log('ChallengeHomePage functionToUseWhenProfileComplete challengeWeVoteId not found');
    }
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  onChallengeCampaignEditClick = () => {
    historyPush(`${this.getChallengeBasePath()}edit`);
    return null;
  }

  onChallengeCampaignShareClick = () => {
    historyPush(`${this.getChallengeBasePath()}share-challenge`);
    return null;
  }

  render () {
    renderLog('ChallengeHomePage');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromUrl, tabSelected } = params;
    const {
      chosenWebsiteName,
      challengeWeVoteId, loadSlow,
      challengeDataFound, challengeDataNotFound,
      challengeDescription, challengeDescriptionLimited, challengePhotoLargeUrl,
      challengeSEOFriendlyPath, challengeSEOFriendlyPathForDisplay,
      challengeTitle, challengeWeVoteIdForDisplay,
      scrolledDown, sharedByDisplayName, thanksForViewingChallengeOn,
      voterCanEditThisChallenge, voterIsChallengeParticipant, voterWeVoteId,
    } = this.state;
    // console.log('ChallengeHomePage render challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeSEOFriendlyPathForDisplay: ', challengeSEOFriendlyPathForDisplay);
    const challengeAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}challenge/${challengeWeVoteId}/summary`;
    // const candidateWeVoteId = CandidateStore.getCandidateWeVoteIdRunningFromChallengeWeVoteId(challengeWeVoteId);

    if (challengeDataNotFound) {
      return (
        <PageContentContainer>
          <Helmet>
            <title>Democracy Challenge Not Found - WeVote</title>
            <meta name="robots" content="noindex" data-react-helmet="true" />
          </Helmet>
          <PageWrapper>
            <MissingChallengeMessageContainer>
              <MissingChallengeText>Democracy Challenge not found.</MissingChallengeText>
              <Button
                classes={{ root: classes.buttonRoot }}
                color="primary"
                variant="contained"
                onClick={() => historyPush('/challenges')}
              >
                <PersonSearch classes={{ root: classes.buttonIconRoot }} location={window.location} />
                See other challenges
              </Button>
            </MissingChallengeMessageContainer>
          </PageWrapper>
        </PageContentContainer>
      );
    }

    let htmlTitle = `${chosenWebsiteName}`;
    if (challengeTitle) {
      htmlTitle = `${challengeTitle} - ${chosenWebsiteName}`;
    }
    let tabSelectedChosen = 'about';
    if (tabSelected === 'friends' || tabSelected === 'leaderboard') {
      tabSelectedChosen = tabSelected;
    }
    return (
      <PageContentContainer>
        {thanksForViewingChallengeOn && (
          <ThanksForViewingChallenge
             sharedByDisplayName={sharedByDisplayName}
          />
        )}
        <Suspense fallback={<span>&nbsp;</span>}>
          <ChallengeRetrieveController
            challengeSEOFriendlyPath={challengeSEOFriendlyPath}
            challengeWeVoteId={challengeWeVoteId}
            retrieveAsOwnerIfVoterSignedIn
          />
        </Suspense>
        <Helmet>
          <title>{htmlTitle}</title>
          {challengeSEOFriendlyPathFromUrl ? (
            <link rel="canonical" href={`https://wevote.us/${challengeSEOFriendlyPathFromUrl}/+/`} />
          ) : (
            <>
              {challengeSEOFriendlyPathForDisplay && (
                <link rel="canonical" href={`https://wevote.us/${challengeSEOFriendlyPathForDisplay}/+/`} />
              )}
            </>
          )}
          <meta name="description" content={challengeDescriptionLimited} />
        </Helmet>
        <PageWrapper>
          <DetailsSectionMobile className="u-show-mobile">
            <MobileHeaderOuterContainer id="challengeHeaderContainer" scrolledDown={scrolledDown}>
              <MobileHeaderInnerContainer>
                <MobileHeaderContentContainer>
                  <ChallengeHeaderSimple
                    challengeBasePath={this.getChallengeBasePath()}
                    challengePhotoLargeUrl={challengePhotoLargeUrl}
                    challengeTitle={challengeTitle}
                    challengeWeVoteId={challengeWeVoteIdForDisplay}
                    // goToChallengeHome={this.goToChallengeHome}
                    hideCloseIcon
                  />
                </MobileHeaderContentContainer>
              </MobileHeaderInnerContainer>
            </MobileHeaderOuterContainer>
            <ChallengeCardForList
              challengeWeVoteId={challengeWeVoteIdForDisplay}
              titleLinkOff
              useVerticalCard
              voterWeVoteId={voterWeVoteId}
            />
            <ChallengeInviteFriendsTopNavigation
              challengeSEOFriendlyPath={challengeSEOFriendlyPathForDisplay}
              challengeWeVoteId={challengeWeVoteIdForDisplay}
              tabSelected={tabSelectedChosen}
            />
            {tabSelectedChosen === 'friends' ? (
              <FriendsSectionWrapper>
                <ChallengeInviteeListRoot challengeWeVoteId={challengeWeVoteIdForDisplay} />
              </FriendsSectionWrapper>
            ) : (
              <>
                {tabSelectedChosen === 'leaderboard' ? (
                  <LeaderboardSectionWrapper>
                    <ChallengeParticipantListRoot
                      challengeWeVoteId={challengeWeVoteIdForDisplay}
                      uniqueExternalId="mobile"
                    />
                  </LeaderboardSectionWrapper>
                ) : (
                  <AboutSectionWrapper>
                    <CampaignDescriptionWrapper hideCardMargins>
                      <ChallengeAbout challengeWeVoteId={challengeWeVoteIdForDisplay} />
                      {challengeDescription && (
                        <DelayedLoad waitBeforeShow={250}>
                          <ChallengeDescription>
                            {challengeDescription}
                            {/* <Suspense fallback={<></>}> */}
                            {/*  <ReadMore numberOfLines={20} textToDisplay={challengeDescription} /> */}
                            {/* </Suspense> */}
                          </ChallengeDescription>
                        </DelayedLoad>
                      )}
                      {!!(voterCanEditThisChallenge || voterIsChallengeParticipant) && (
                        <IndicatorRow>
                          {voterCanEditThisChallenge && (
                            <IndicatorButtonWrapper>
                              <EditIndicator onClick={this.onChallengeCampaignEditClick}>
                                Edit Challenge
                              </EditIndicator>
                            </IndicatorButtonWrapper>
                          )}
                          {/*
                          {voterIsChallengeParticipant && (
                            <IndicatorButtonWrapper>
                              <EditIndicator onClick={this.onChallengeCampaignShareClick}>
                                Share Challenge
                              </EditIndicator>
                            </IndicatorButtonWrapper>
                          )}
                          */}
                        </IndicatorRow>
                      )}
                    </CampaignDescriptionWrapper>
                  </AboutSectionWrapper>
                )}
              </>
            )}
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <ColumnsWrapper>
              <ColumnOneThird>
                <ChallengeCardForList
                  challengeWeVoteId={challengeWeVoteIdForDisplay}
                  titleLinkOff
                  useVerticalCard
                  voterWeVoteId={voterWeVoteId}
                />
                <ChallengeAbout challengeWeVoteId={challengeWeVoteIdForDisplay} />
                <JoinChallengeButtonWrapper>
                  <Suspense fallback={<></>}>
                    <JoinChallengeButton
                      challengeSEOFriendlyPath={challengeSEOFriendlyPathForDisplay}
                      challengeWeVoteId={challengeWeVoteIdForDisplay}
                    />
                  </Suspense>
                </JoinChallengeButtonWrapper>
                {challengeDescription && (
                  <DelayedLoad waitBeforeShow={250}>
                    <ChallengeDescription>
                      {challengeDescription}
                      {/* <Suspense fallback={<></>}> */}
                      {/*  <ReadMore numberOfLines={20} textToDisplay={challengeDescription} /> */}
                      {/* </Suspense> */}
                    </ChallengeDescription>
                  </DelayedLoad>
                )}
                <CampaignDescriptionDesktopWrapper>
                  {challengeDataFound && (
                    <DelayedLoad waitBeforeShow={250}>
                      <CampaignDescriptionDesktop>
                        {challengeDescription ? (
                          <Suspense fallback={<></>}>
                            <ReadMore numberOfLines={6} textToDisplay={challengeDescription} />
                          </Suspense>
                        ) : (
                          <NoInformationProvided>No description has been provided for this candidate.</NoInformationProvided>
                        )}
                      </CampaignDescriptionDesktop>
                    </DelayedLoad>
                  )}
                  {/* {finalElectionDateInPast && ( */}
                  {/*  <IndicatorRow> */}
                  {/*    <IndicatorButtonWrapper> */}
                  {/*      <ElectionInPast> */}
                  {/*        Election in Past */}
                  {/*      </ElectionInPast> */}
                  {/*    </IndicatorButtonWrapper> */}
                  {/*  </IndicatorRow> */}
                  {/* )} */}
                  {voterCanEditThisChallenge && (
                    <IndicatorRow>
                      <IndicatorButtonWrapper>
                        <EditIndicator onClick={this.onChallengeCampaignEditClick}>
                          Edit This Challenge
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    </IndicatorRow>
                  )}
                </CampaignDescriptionDesktopWrapper>
                {/* Show links to this challenge in the admin tools */}
                <LinkToAdminTools
                  adminToolsUrl={challengeAdminEditUrl}
                  linkId="editCampaign"
                  linkTextNode={<span>jump to Admin tools</span>}
                />
              </ColumnOneThird>
              <ColumnTwoThirds>
                <ChallengeInviteFriendsTopNavigation
                  challengeSEOFriendlyPath={challengeSEOFriendlyPathForDisplay}
                  challengeWeVoteId={challengeWeVoteIdForDisplay}
                  hideAboutTab
                />
                {tabSelectedChosen === 'friends' ? (
                  <FriendsSectionWrapper>
                    <ChallengeInviteeListRoot challengeWeVoteId={challengeWeVoteIdForDisplay} />
                  </FriendsSectionWrapper>
                ) : (
                  <LeaderboardSectionWrapper>
                    <ChallengeParticipantListRoot
                      challengeWeVoteId={challengeWeVoteIdForDisplay}
                      uniqueExternalId="desktop"
                    />
                  </LeaderboardSectionWrapper>
                )}
                {/* {commentListTeaserHtml} */}
                {(!futureFeaturesDisabled && nextReleaseFeaturesEnabled) && (
                  <CommentsListWrapper>
                    <DelayedLoad waitBeforeShow={loadSlow ? 500 : 0}>
                      <Suspense fallback={<span>&nbsp;</span>}>
                        <CampaignSubSectionTitleWrapper>
                          <CampaignSubSectionTitle>
                            Updates
                          </CampaignSubSectionTitle>
                          {!!(this.getChallengeBasePath()) && (
                            <CampaignSubSectionSeeAll>
                              <Link to={`${this.getChallengeBasePath()}updates`} className="u-link-color">
                                See all
                              </Link>
                            </CampaignSubSectionSeeAll>
                          )}
                        </CampaignSubSectionTitleWrapper>
                        {/* <CampaignNewsItemList */}
                        {/*  politicianWeVoteId={challengeWeVoteIdForDisplay} */}
                        {/*  challengeSEOFriendlyPath={challengeSEOFriendlyPathForDisplay} */}
                        {/*  showAddNewsItemIfNeeded */}
                        {/*  startingNumberOfCommentsToDisplay={1} */}
                        {/* /> */}
                      </Suspense>
                    </DelayedLoad>
                  </CommentsListWrapper>
                )}
              </ColumnTwoThirds>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapperAboveFooterButtons className="u-show-mobile">
          <SupportButtonPanel>
            <CenteredDiv>
              <Suspense fallback={<span>&nbsp;</span>}>
                <JoinChallengeButton
                  challengeSEOFriendlyPath={challengeSEOFriendlyPathForDisplay}
                  challengeWeVoteId={challengeWeVoteIdForDisplay}
                />
              </Suspense>
            </CenteredDiv>
          </SupportButtonPanel>
        </SupportButtonFooterWrapperAboveFooterButtons>
        <CompleteYourProfileModalController
          politicianWeVoteId={challengeWeVoteId}
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportPolitician
        />
      </PageContentContainer>
    );
  }
}
ChallengeHomePage.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = (theme) => ({
  buttonIconRoot: {
    marginRight: 8,
  },
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AboutSectionWrapper = styled('div')`
`;

const CenteredDiv = styled('div')`
  display: flex;
  justify-content: center;
`;

const ColumnOneThird = styled('div')`
  flex: 1;
  flex-direction: column;
  flex-basis: 40%;
`;

const ColumnsWrapper = styled('div')`
  display: flex;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ColumnTwoThirds = styled('div')`
  flex: 2;
  flex-direction: column;
  flex-basis: 60%;
  margin: 0 0 0 25px;
`;

const FriendsSectionWrapper = styled('div')`
`;

const LeaderboardSectionWrapper = styled('div')`
`;

const MissingChallengeMessageContainer = styled('div')`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const MissingChallengeText = styled('p')(({ theme }) => (`
  font-size: 24px;
  text-align: center;
  margin: 1em 2em 3em;
  ${theme.breakpoints.down('md')} {
    margin: 1em;
  }
`));

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const MobileHeaderContentContainer = styled('div')(({ theme }) => (`
  // padding: 15px 15px 0 15px;
  margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
  position: relative;
  max-width: 960px;
  width: 100%;
  z-index: 0;
  ${theme.breakpoints.down('sm')} {
    min-height: 10px;
    //margin: 0 10px;
  }
`));

const MobileHeaderOuterContainer = styled('div', {
  shouldForwardProp: (prop) => !['scrolledDown'].includes(prop),
})(({ scrolledDown }) => (`
  animation: ${slideDown} 300ms ease-in;  // Not currently working -- needs debugging
  // transition: visibility 1s linear;  // Not currently working -- needs debugging
  margin-top: ${marginTopOffset(scrolledDown)};
  width: 100%;
  background-color: #fff;
  ${scrolledDown ? 'border-bottom: 1px solid #aaa' : ''};
  ${scrolledDown ? `box_shadow: ${standardBoxShadow('wide')}` : ''};
  ${scrolledDown ? 'display: block' : 'display: none'};
  overflow: hidden;
  position: fixed;
  z-index: 1;
  right: 0;
`));

const MobileHeaderInnerContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const NoInformationProvided = styled('div')`
  color: 1px solid ${DesignTokenColors.neutralUI100};
  font-size: 12px;
`;

const JoinChallengeButtonWrapper = styled('div')`
  display: flex;
  height: 50px;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
`;

export default withStyles(styles)(ChallengeHomePage);
