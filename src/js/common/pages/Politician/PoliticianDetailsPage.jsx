import { Launch, PersonSearch } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import TwitterAccountStats from '../../../components/Widgets/TwitterAccountStats';
import webAppConfig from '../../../config';
import CandidateStore from '../../../stores/CandidateStore';
import RepresentativeStore from '../../../stores/RepresentativeStore';
import CampaignChipInLink from '../../components/Campaign/CampaignChipInLink';
import CampaignOwnersList from '../../components/CampaignSupport/CampaignOwnersList';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import { CampaignDescription, CampaignDescriptionDesktop, CampaignDescriptionDesktopWrapper, CampaignDescriptionWrapper, CampaignImageDesktopWrapper, CampaignImageMobileWrapper, CampaignImagePlaceholder, CampaignImagePlaceholderText, CampaignOwnersDesktopWrapper, CampaignSubSectionSeeAll, CampaignSubSectionTitle, CampaignSubSectionTitleWrapper, CampaignTitleAndScoreBar, CommentsListWrapper, DetailsSectionDesktopTablet, DetailsSectionMobile, OtherElectionsWrapper, SupportButtonFooterWrapperAboveFooterButtons, SupportButtonPanel } from '../../components/Style/CampaignDetailsStyles';
import { EditIndicator, ElectionInPast, IndicatorButtonWrapper, IndicatorRow } from '../../components/Style/CampaignIndicatorStyles';
import { CandidateCampaignListDesktop, CandidateCampaignListMobile, CandidateCampaignWrapper, OfficeHeldNameDesktop, OfficeHeldNameMobile, PoliticianImageDesktop, PoliticianImageDesktopPlaceholder, PoliticianImageMobile, PoliticianImageMobilePlaceholder, PoliticianNameDesktop, PoliticianNameMobile, PoliticianNameOuterWrapperDesktop } from '../../components/Style/PoliticianDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import LinkToAdminTools from '../../components/Widgets/LinkToAdminTools';
import OfficeHeldNameText from '../../components/Widgets/OfficeHeldNameText';
import SearchOnGoogle from '../../components/Widgets/SearchOnGoogle';
import ViewOnBallotpedia from '../../components/Widgets/ViewOnBallotpedia';
import ViewOnWikipedia from '../../components/Widgets/ViewOnWikipedia';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import OfficeHeldStore from '../../stores/OfficeHeldStore';
import PoliticianStore from '../../stores/PoliticianStore';
import { convertStateCodeToStateText } from '../../utils/addressFunctions';
import { getYearFromUltimateElectionDate } from '../../utils/dateFormat';
import historyPush from '../../utils/historyPush';
import { isWebApp } from '../../utils/isCordovaOrWebApp';
import { displayNoneIfSmallerThanDesktop } from '../../utils/isMobileScreenSize';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import { renderLog } from '../../utils/logging';
import { getPoliticianValuesFromIdentifiers, retrievePoliticianFromIdentifiersIfNeeded } from '../../utils/politicianUtils';
import returnFirstXWords from '../../utils/returnFirstXWords';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';

const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
const CampaignDetailsActionSideBox = React.lazy(() => import(/* webpackChunkName: 'CampaignDetailsActionSideBox' */ '../../components/CampaignSupport/CampaignDetailsActionSideBox'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
const CampaignShareChunk = React.lazy(() => import(/* webpackChunkName: 'CampaignShareChunk' */ '../../components/Campaign/CampaignShareChunk'));
const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../components/Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../components/Widgets/OpenExternalWebSite'));
const PoliticianEndorsementsList = React.lazy(() => import(/* webpackChunkName: 'PoliticianEndorsementsList' */ '../../components/Politician/PoliticianEndorsementsList'));
const PoliticianRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianRetrieveController' */ '../../components/Politician/PoliticianRetrieveController'));
const PoliticianPositionRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianPositionRetrieveController' */ '../../components/Position/PoliticianPositionRetrieveController'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));
const UpdatePoliticianInformation = React.lazy(() => import(/* webpackChunkName: 'UpdatePoliticianInformation' */ '../../components/Politician/UpdatePoliticianInformation'));

const futureFeaturesDisabled = true;
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


class PoliticianDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotpediaPoliticianUrl: '',
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      // inPrivateLabelMode: false,
      loadSlow: false,
      officeHeldList: [],
      opponentCandidateList: [],
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      politicalParty: '',
      politicianDataNotFound: false,
      politicianImageUrlLarge: '',
      politicianSEOFriendlyPath: '',
      politicianSEOFriendlyPathForDisplay: '', // Value for politician already received
      politicianName: '',
      politicianWeVoteId: '',
      politicianWeVoteIdForDisplay: '', // Value for politician already received
      sharingStepCompleted: false,
      stateText: '',
      step2Completed: false,
      supporterEndorsementsWithText: [],
      voterCanEditThisPolitician: false,
      wikipediaUrl: '',
      // youtubeUrl: '',
    };
  }

  componentDidMount () {
    // console.log('PoliticianDetailsPage componentDidMount');
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl, politicianWeVoteId } = params;
    // console.log('componentDidMount politicianSEOFriendlyPathFromUrl: ', politicianSEOFriendlyPathFromUrl, ', politicianWeVoteId: ', politicianWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.officeHeldStoreListener = OfficeHeldStore.addListener(this.onOfficeHeldStoreChange.bind(this));
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.onRepresentativeStoreChange();
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    let politicianSEOFriendlyPathFromObject;
    let triggerSEOPathRedirect = false;
    if (politicianSEOFriendlyPathFromUrl) {
      const politician = PoliticianStore.getPoliticianBySEOFriendlyPath(politicianSEOFriendlyPathFromUrl);
      politicianSEOFriendlyPathFromObject = politician.seo_friendly_path;
      triggerSEOPathRedirect = politicianSEOFriendlyPathFromObject && (politicianSEOFriendlyPathFromUrl !== politicianSEOFriendlyPathFromObject);
      // console.log('componentDidMount politicianSEOFriendlyPathFromObject: ', politicianSEOFriendlyPathFromObject);
      // Only change politician if the we_vote_id is different
      if (politician && politician.politician_we_vote_id) {
        this.setState({
          linkedCampaignXWeVoteId: politician.linked_campaignx_we_vote_id,
          politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl,
          politicianSEOFriendlyPathForDisplay: politicianSEOFriendlyPathFromUrl,
          politicianWeVoteId: politician.politician_we_vote_id,
          politicianWeVoteIdForDisplay: politician.politician_we_vote_id,
        }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
      } else {
        this.setState({
          politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl,
          politicianSEOFriendlyPathForDisplay: politicianSEOFriendlyPathFromUrl,
        });
      }
    } else if (politicianWeVoteId) {
      this.setState({
        politicianWeVoteId,
        politicianWeVoteIdForDisplay: politicianWeVoteId,
      }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
    }
    // Take the "calculated" identifiers and retrieve if missing
    retrievePoliticianFromIdentifiersIfNeeded(politicianSEOFriendlyPathFromUrl, politicianWeVoteId);
    // console.log('componentDidMount triggerSEOPathRedirect: ', triggerSEOPathRedirect, ', politicianSEOFriendlyPathFromObject: ', politicianSEOFriendlyPathFromObject);
    if (triggerSEOPathRedirect && politicianSEOFriendlyPathFromObject) {
      historyPush(`/${politicianSEOFriendlyPathFromObject}/-/`, true);
    }
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    // console.log('PoliticianDetailsPage componentDidMount');
    const { match: { params: prevParams } } = prevProps;
    const { politicianSEOFriendlyPath: prevPoliticianSEOFriendlyPath, politicianWeVoteId: prevPoliticianWeVoteId } = prevParams;
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl, politicianWeVoteId } = params;
    let politicianSEOFriendlyPath = '';
    let triggerFreshRetrieve = false;
    let triggerSEOPathRedirect = false;
    const politician = PoliticianStore.getPoliticianBySEOFriendlyPath(politicianSEOFriendlyPathFromUrl);
    const politicianSEOFriendlyPathFromObject = politician.seo_friendly_path;
    // console.log('componentDidUpdate politicianSEOFriendlyPathFromUrl: ', politicianSEOFriendlyPathFromUrl, ', politicianSEOFriendlyPathFromObject: ', politicianSEOFriendlyPathFromObject);
    if (politicianSEOFriendlyPathFromObject && (politicianSEOFriendlyPathFromUrl !== politicianSEOFriendlyPathFromObject)) {
      politicianSEOFriendlyPath = politicianSEOFriendlyPathFromObject;
      triggerSEOPathRedirect = true;
    } else if (politicianSEOFriendlyPathFromUrl && politicianSEOFriendlyPathFromUrl !== prevPoliticianSEOFriendlyPath) {
      // console.log('componentDidUpdate prevPoliticianSEOFriendlyPath: ', prevPoliticianSEOFriendlyPath);
      const politicianWeVoteIdFromUrl = PoliticianStore.getPoliticianWeVoteIdFromPoliticianSEOFriendlyPath(politicianSEOFriendlyPathFromUrl);
      const politicianWeVoteIdFromPreviousUrl = PoliticianStore.getPoliticianWeVoteIdFromPoliticianSEOFriendlyPath(prevPoliticianSEOFriendlyPath);
      const isSamePolitician = politicianWeVoteIdFromPreviousUrl && (politicianWeVoteIdFromUrl !== politicianWeVoteIdFromPreviousUrl);
      // Only change politician if the we_vote_id is different
      if (isSamePolitician) {
        // Don't change the politician if the we_vote_id is the same as the previous
        // but specify that we want to triggerSEOPathRedirect
        politicianSEOFriendlyPath = politician.seo_friendly_path;
        triggerSEOPathRedirect = true;
      } else {
        this.clearPoliticianValues();
        if (politician && politician.politician_we_vote_id) {
          this.setState({
            linkedCampaignXWeVoteId: politician.linked_campaignx_we_vote_id,
            politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl,
            politicianSEOFriendlyPathForDisplay: politicianSEOFriendlyPathFromUrl,
            politicianWeVoteId: politician.politician_we_vote_id,
            politicianWeVoteIdForDisplay: politician.politician_we_vote_id,
          }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
        } else {
          this.setState({
            politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl,
            politicianSEOFriendlyPathForDisplay: politicianSEOFriendlyPathFromUrl,
          }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
        }
        triggerFreshRetrieve = true;
      }
    } else if (politicianWeVoteId && politicianWeVoteId !== prevPoliticianWeVoteId) {
      // console.log('componentDidUpdate prevPoliticianWeVoteId: ', prevPoliticianWeVoteId);
      this.clearPoliticianValues();
      if (politician && politician.politician_we_vote_id) {
        this.setState({
          linkedCampaignXWeVoteId: politician.linked_campaignx_we_vote_id,
          politicianSEOFriendlyPath: politician.seo_friendly_path,
          politicianSEOFriendlyPathForDisplay: politician.seo_friendly_path,
          politicianWeVoteId,
          politicianWeVoteIdForDisplay: politicianWeVoteId,
        }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
      } else {
        this.setState({
          politicianWeVoteId,
          politicianWeVoteIdForDisplay: politicianWeVoteId,
        }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
      }
      triggerFreshRetrieve = true;
    }
    // console.log('componentDidUpdate triggerSEOPathRedirect: ', triggerSEOPathRedirect, ', politicianSEOFriendlyPath: ', politicianSEOFriendlyPath);
    if (triggerSEOPathRedirect && politicianSEOFriendlyPath) {
      // Direct to the updated SEO path
      historyPush(`/${politicianSEOFriendlyPath}/-/`, true);
    }
    if (triggerFreshRetrieve) {
      // Take the "calculated" identifiers and retrieve if missing
      retrievePoliticianFromIdentifiersIfNeeded(politicianSEOFriendlyPathFromUrl, politicianWeVoteId);
    }
    if (triggerFreshRetrieve || triggerSEOPathRedirect) {
      // Take the "calculated" identifiers and retrieve if missing
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.appStateSubscription.unsubscribe();
    this.campaignSupporterStoreListener.remove();
    this.candidateStoreListener.remove();
    this.officeHeldStoreListener.remove();
    this.politicianStoreListener.remove();
    this.representativeStoreListener.remove();
  }

  onfirstRetrievalOfPoliticianWeVoteId () {
    this.onCampaignSupporterStoreChange();
    this.onCandidateStoreChange();
    this.onOfficeHeldStoreChange();
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
    });
  }

  onCampaignSupporterStoreChange () {
    const { linkedCampaignXWeVoteId } = this.state;
    const supporterEndorsementsWithText = CampaignSupporterStore.getLatestCampaignXSupportersWithTextList(linkedCampaignXWeVoteId);
    const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(linkedCampaignXWeVoteId);
    const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(linkedCampaignXWeVoteId);
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange step2Completed: ', step2Completed, ', sharingStepCompleted: ', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      supporterEndorsementsWithText,
      sharingStepCompleted,
      step2Completed,
      payToPromoteStepCompleted,
    });
  }

  onCandidateStoreChange () {
    const { politicianWeVoteId } = this.state;
    if (politicianWeVoteId) {
      const allCachedPositionsForThisPolitician = CandidateStore.getAllCachedPositionsByPoliticianWeVoteId(politicianWeVoteId);
      this.setState({
        allCachedPositionsForThisPolitician,
      });
    }
  }

  onOfficeHeldStoreChange () {
    const { politicianWeVoteId } = this.state;
    const officeHeldList = OfficeHeldStore.getOfficeHeldListByPoliticianWeVoteId(politicianWeVoteId);
    const officeHeldListFiltered = [];
    const districtNameAlreadySeenList = [];
    const officeHeldNamesNotAllowedList = ['legislatorLowerBody'];
    let districtNameAlreadySeen = false;
    let officeHeldNameAllowed;
    let officeHeldNameForSearch = '';
    for (let i = 0; i < officeHeldList.length; i += 1) {
      const officeHeld = officeHeldList[i];
      officeHeldNameAllowed = true;
      if (officeHeld) {
        if (officeHeld.district_name && districtNameAlreadySeenList.includes(officeHeld.district_name)) {
          districtNameAlreadySeen = true;
        }
        if (officeHeld.office_held_name && officeHeldNamesNotAllowedList.includes(officeHeld.office_held_name)) {
          officeHeldNameAllowed = false;
        }
        if (!districtNameAlreadySeen && officeHeldNameAllowed) {
          districtNameAlreadySeenList.push(officeHeld.district_name);
          officeHeldListFiltered.push(officeHeld);
          if (!officeHeldNameForSearch) officeHeldNameForSearch = officeHeld.office_held_name;
        }
      }
    }
    this.setState({
      officeHeldList: officeHeldListFiltered,
      officeHeldNameForSearch,
    });
  }

  onPoliticianStoreChange () {
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl, politicianWeVoteId: politicianWeVoteIdFromParams } = params;
    // console.log('onPoliticianStoreChange politicianSEOFriendlyPathFromUrl: ', politicianSEOFriendlyPathFromUrl, ', politicianWeVoteIdFromParams: ', politicianWeVoteIdFromParams);
    const {
      ballotpediaPoliticianUrl,
      candidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      linkedCampaignXWeVoteId,
      opponentCandidateList,
      politicalParty,
      politicianDescription,
      politicianImageUrlLarge,
      // politicianSEOFriendlyPath,
      politicianName,
      politicianUrl,
      politicianWeVoteId,
      profileImageBackgroundColor,
      stateCode,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      // youtubeUrl,
    } = getPoliticianValuesFromIdentifiers(politicianSEOFriendlyPathFromUrl, politicianWeVoteIdFromParams);
    if (politicianWeVoteId) {
      const voterCanEditThisPolitician = PoliticianStore.getVoterCanEditThisPolitician(politicianWeVoteId);
      const voterSupportsThisPolitician = PoliticianStore.getVoterSupportsThisPolitician(politicianWeVoteId);
      this.setState({
        politicianName,
        politicianWeVoteId,
        politicianWeVoteIdForDisplay: politicianWeVoteId,
        voterCanEditThisPolitician,
        voterSupportsThisPolitician,
      }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
    }
    const politicianDescriptionLimited = returnFirstXWords(politicianDescription, 200);
    const filteredCandidateCampaignList = candidateCampaignList.sort(this.orderCandidatesByUltimateDate);
    const filteredOpponentCandidateList = opponentCandidateList.sort(this.orderByTwitterFollowers);
    let stateText = '';
    if (stateCode) {
      stateText = convertStateCodeToStateText(stateCode);
    }
    let politicianDataNotFound = false;
    if (politicianSEOFriendlyPathFromUrl) {
      politicianDataNotFound = PoliticianStore.isPoliticianDataNotFoundForSEOFriendlyPath(politicianSEOFriendlyPathFromUrl);
    }
    this.setState({
      ballotpediaPoliticianUrl,
      candidateCampaignList: filteredCandidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      linkedCampaignXWeVoteId,
      opponentCandidateList: filteredOpponentCandidateList,
      politicalParty,
      politicianDataNotFound,
      politicianDescription,
      politicianDescriptionLimited,
      politicianImageUrlLarge,
      politicianName,
      politicianUrl,
      profileImageBackgroundColor,
      stateText,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      // youtubeUrl,
    });
  }

  onRepresentativeStoreChange () {
    //
  }

  getCandidateCampaignListTitle () {
    // thisYearElectionExists, nextYearElectionExists, priorYearElectionExists
    return 'Elections with Candidate';
  }

  clearPoliticianValues = () => {
    // When we transition from one politician to another politician, there
    // can be a delay in getting the new politician's values. We want to clear
    // out the values currently being displayed, while waiting for new values
    // to arrive.
    this.setState({
      ballotpediaPoliticianUrl: '',
      candidateCampaignList: [],
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      linkedCampaignXWeVoteId: '',
      opponentCandidateList: [],
      politicalParty: '',
      politicianDataNotFound: false,
      politicianDescription: '',
      politicianDescriptionLimited: '',
      politicianImageUrlLarge: '',
      politicianName: '',
      politicianUrl: '',
      politicianWeVoteIdForDisplay: '', // We don't clear politicianWeVoteId because we may need it to load next politician
      politicianSEOFriendlyPathForDisplay: '', // We don't clear politicianSEOFriendlyPath because we may need it to load next politician
      profileImageBackgroundColor: '',
      stateText: '',
      twitterFollowersCount: 0,
      twitterHandle: '',
      twitterHandle2: '',
      wikipediaUrl: '',
      // youtubeUrl: '',
    });
  }

  orderByTwitterFollowers = (firstEntry, secondEntry) => secondEntry.twitter_followers_count - firstEntry.twitter_followers_count;

  orderCandidatesByUltimateDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  getCampaignXBasePath = () => {
    const { linkedCampaignXWeVoteId } = this.state;
    // let campaignXBasePath;
    // if (politicianSEOFriendlyPath) {
    //   campaignXBasePath = `/c/${politicianSEOFriendlyPath}/`;
    // } else {
    //   campaignXBasePath = `/id/${campaignXWeVoteId}/`;
    // }
    // return campaignXBasePath;
    return `/id/${linkedCampaignXWeVoteId}/`;
  }

  // getPoliticianBasePath = () => {
  //   const { politicianSEOFriendlyPath, politicianWeVoteId } = this.state;
  //   let politicianBasePath;
  //   if (politicianSEOFriendlyPath) {
  //     politicianBasePath = `/${politicianSEOFriendlyPath}/-/`;
  //   } else {
  //     politicianBasePath = `/${politicianWeVoteId}/p/`;
  //   }
  //
  //   return politicianBasePath;
  // }

  functionToUseToKeepHelping = () => {
    const { finalElectionDateInPast, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log('functionToUseToKeepHelping sharingStepCompleted:', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted, ', step2Completed:', step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, finalElectionDateInPast);
    historyPush(`${this.getCampaignXBasePath()}${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete = () => {
    const { linkedCampaignXWeVoteId } = this.state;
    if (linkedCampaignXWeVoteId) {
      const campaignXBaseBath = this.getCampaignXBasePath();
      saveCampaignSupportAndGoToNextPage(linkedCampaignXWeVoteId, campaignXBaseBath);
    } else {
      console.log('PoliticianDetailsPage functionToUseWhenProfileComplete linkedCampaignXWeVoteId not found');
    }
  }

  onPoliticianCampaignEditClick = () => {
    historyPush(`${this.getCampaignXBasePath()}edit`);
    return null;
  }

  onPoliticianCampaignShareClick = () => {
    historyPush(`${this.getCampaignXBasePath()}share-politician`);
    return null;
  }

  render () {
    renderLog('PoliticianDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl } = params;
    // console.log('componentDidMount politicianSEOFriendlyPathFromUrl: ', politicianSEOFriendlyPathFromUrl);
    const {
      allCachedPositionsForThisPolitician, ballotpediaPoliticianUrl, candidateCampaignList, chosenWebsiteName,
      supporterEndorsementsWithText, finalElectionDateInPast, linkedCampaignXWeVoteId, loadSlow,
      officeHeldList, officeHeldNameForSearch, opponentCandidateList,
      politicalParty, politicianDataNotFound,
      politicianDescription, politicianDescriptionLimited, politicianImageUrlLarge,
      politicianSEOFriendlyPath, politicianSEOFriendlyPathForDisplay,
      politicianName, politicianUrl,
      politicianWeVoteId, politicianWeVoteIdForDisplay, profileImageBackgroundColor,
      stateText, twitterHandle, twitterHandle2, twitterFollowersCount,
      voterCanEditThisPolitician, voterSupportsThisPolitician,
      wikipediaUrl, // youtubeUrl,
    } = this.state;
    const campaignAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}campaign/${linkedCampaignXWeVoteId}/summary`;

    if (politicianDataNotFound) {
      return (
        <PageContentContainer>
          <Helmet>
            <title>Candidate Not Found - WeVote</title>
            <meta name="robots" content="noindex" data-react-helmet="true" />
          </Helmet>
          <PageWrapper>
            <MissingPoliticianMessageContainer>
              <MissingPoliticianText>Candidate not found.</MissingPoliticianText>
              <Button
                classes={{ root: classes.buttonRoot }}
                color="primary"
                variant="contained"
                onClick={() => historyPush('/cs')}
              >
                <PersonSearch classes={{ root: classes.buttonIconRoot }} location={window.location} />
                See other candidates
              </Button>
            </MissingPoliticianMessageContainer>
          </PageWrapper>
        </PageContentContainer>
      );
    }

    // console.log('render isSupportersCountMinimumExceeded: ', isSupportersCountMinimumExceeded);
    let htmlTitle = `${chosenWebsiteName}`;
    if (politicianName) {
      htmlTitle = `${politicianName} - ${chosenWebsiteName}`;
    }

    const politicianLinks = (
      <PoliticianLinksWrapper>
        {!!(twitterHandle && twitterFollowersCount) && (
          <TwitterWrapper>
            <TwitterAccountStats
              includeLinkToTwitter
              twitterFollowersCount={twitterFollowersCount}
              twitterHandle={twitterHandle}
            />
          </TwitterWrapper>
        )}
        {!!(twitterHandle2) && (
          <TwitterWrapper>
            <TwitterAccountStats
              includeLinkToTwitter
              // twitterFollowersCount={twitterFollowersCount}
              twitterHandle={twitterHandle2}
            />
          </TwitterWrapper>
        )}
        {(politicianUrl) && (
          <ExternalWebSiteWrapper>
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="candidateDesktop"
                url={politicianUrl}
                target="_blank"
                className="u-gray-mid"
                body={(
                  <div>
                    website
                    <Launch
                      style={{
                        height: 14,
                        marginLeft: 2,
                        marginTop: '-3px',
                        width: 14,
                      }}
                    />
                  </div>
                )}
              />
            </Suspense>
          </ExternalWebSiteWrapper>
        )}
      </PoliticianLinksWrapper>
    );
    const politicianButtons = (
      <PoliticianLinksWrapper>
        {ballotpediaPoliticianUrl && (
          <ViewOnBallotpedia externalLinkUrl={ballotpediaPoliticianUrl} />
        )}
        {wikipediaUrl && (
          <ViewOnWikipedia externalLinkUrl={wikipediaUrl} />
        )}
        {politicianName && (
          <SearchOnGoogle googleQuery={`${politicianName} ${stateText} ${officeHeldNameForSearch}`} />
        )}
      </PoliticianLinksWrapper>
    );
    let opponentCandidatesHtml = '';
    const opponentsSubtitle = 'Candidates Running for Same Office';
    let priorCandidateCampaignsHtml = '';
    const currentYear = 2023;
    let nextYearElectionExists = false;
    let priorYearElectionExists = false;
    let thisYearElectionExists = false;
    if (candidateCampaignList && candidateCampaignList.length > 0) {
      let contestOfficeName;
      let districtName;
      let year;
      const yearsAndNamesAlreadySeen = [];
      const candidateCampaignListFiltered = candidateCampaignList.filter((candidateCampaign) => {
        contestOfficeName = candidateCampaign.contest_office_name || '';
        if (!contestOfficeName) {
          if (candidateCampaign.contest_office_list && candidateCampaign.contest_office_list[0]) {
            contestOfficeName = candidateCampaign.contest_office_list[0].contest_office_name || '';
          }
        }
        year = getYearFromUltimateElectionDate(candidateCampaign.candidate_ultimate_election_date);
        const candidateCampaignYearAndName = `${year}-${contestOfficeName}`;
        // console.log('candidateCampaignYearAndName: ', candidateCampaignYearAndName);
        if (yearsAndNamesAlreadySeen.indexOf(candidateCampaignYearAndName) === -1) {
          yearsAndNamesAlreadySeen.push(candidateCampaignYearAndName);
          if (year === currentYear) {
            thisYearElectionExists = true;
          } else if (year > currentYear) {
            nextYearElectionExists = true;
          } else {
            priorYearElectionExists = true;
          }
          return candidateCampaign;
        } else {
          return null;
        }
      });
      // console.log('candidateCampaignListFiltered: ', candidateCampaignListFiltered);
      priorCandidateCampaignsHtml = candidateCampaignListFiltered.map((candidateCampaign) => {
        const key = `candidateCampaign-${candidateCampaign.we_vote_id}`;
        contestOfficeName = candidateCampaign.contest_office_name || '';
        if (!contestOfficeName) {
          if (candidateCampaign.contest_office_list && candidateCampaign.contest_office_list[0]) {
            contestOfficeName = candidateCampaign.contest_office_list[0].contest_office_name || '';
          }
        }
        if (candidateCampaign.contest_office_list && candidateCampaign.contest_office_list[0]) {
          districtName = candidateCampaign.contest_office_list[0].district_name || '';
        }
        const showOfficeName = !!(contestOfficeName);
        const stateName = convertStateCodeToStateText(candidateCampaign.state_code);
        year = getYearFromUltimateElectionDate(candidateCampaign.candidate_ultimate_election_date);
        return (
          <CandidateCampaignWrapper key={key}>
            <OfficeNameText
              districtName={districtName}
              officeName={contestOfficeName}
              politicalParty={candidateCampaign.party}
              showOfficeName={showOfficeName}
              stateName={stateName}
              year={`${year}`}
            />
          </CandidateCampaignWrapper>
        );
      });
    }
    if (opponentCandidateList && opponentCandidateList.length > 0) {
      opponentCandidatesHtml = opponentCandidateList.map((opposingCandidate) => {
        if (opposingCandidate.seo_friendly_path) {
          const opposingCandidateKey = `opposingCandidate-${opposingCandidate.we_vote_id}`;
          return (
            <CandidateCampaignWrapper key={opposingCandidateKey}>
              <Link
                className="u-cursor--pointer u-link-color u-link-underline-on-hover"
                to={`/${opposingCandidate.seo_friendly_path}/-/`}
              >
                {opposingCandidate.ballot_item_display_name}
              </Link>
            </CandidateCampaignWrapper>
          );
        } else {
          return null;
        }
      });
    }
    let positionListTeaserHtml = <></>;
    if (allCachedPositionsForThisPolitician && allCachedPositionsForThisPolitician.length > 0) {
      positionListTeaserHtml = (
        <CommentsListWrapper>
          <DelayedLoad waitBeforeShow={loadSlow ? 1000 : 0}>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignSubSectionTitleWrapper>
                <CampaignSubSectionTitle>
                  Endorsements
                  {!!(politicianName) && (
                    <>
                      {' '}
                      for
                      {' '}
                      {politicianName}
                    </>
                  )}
                </CampaignSubSectionTitle>
                {/* LINK THIS TO CURRENT CANDIDATE PAGE */}
                {/* !!(this.getCampaignXBasePath()) && (
                  <CampaignSubSectionSeeAll>
                    <Link to={`${this.getCampaignXBasePath()}updates`} className="u-link-color">
                      See all
                    </Link>
                  </CampaignSubSectionSeeAll>
                ) */}
              </CampaignSubSectionTitleWrapper>
              <PoliticianEndorsementsList
                politicianWeVoteId={politicianWeVoteIdForDisplay}
                startingNumberOfPositionsToDisplay={2}
              />
            </Suspense>
          </DelayedLoad>
        </CommentsListWrapper>
      );
    }
    let commentListTeaserHtml = <></>;
    if (supporterEndorsementsWithText && supporterEndorsementsWithText.length > 0) {
      commentListTeaserHtml = (
        <CommentsListWrapper>
          <DelayedLoad waitBeforeShow={loadSlow ? 1500 : 0}>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignSubSectionTitleWrapper>
                <CampaignSubSectionTitle>
                  Reasons for supporting
                </CampaignSubSectionTitle>
                {!!(this.getCampaignXBasePath()) && (
                  <CampaignSubSectionSeeAll>
                    <Link
                      to={`${this.getCampaignXBasePath()}comments`}
                      className="u-link-color"
                    >
                      See all
                    </Link>
                  </CampaignSubSectionSeeAll>
                )}
              </CampaignSubSectionTitleWrapper>
              <CampaignCommentsList
                campaignXWeVoteId={linkedCampaignXWeVoteId}
                politicianWeVoteId={politicianWeVoteIdForDisplay}
                removePoliticianEndorsements
                startingNumberOfCommentsToDisplay={2}
              />
            </Suspense>
          </DelayedLoad>
        </CommentsListWrapper>
      );
    }
    return (
      <PageContentContainer>
        <Suspense fallback={<span>&nbsp;</span>}>
          <PoliticianRetrieveController
            politicianSEOFriendlyPath={politicianSEOFriendlyPath}
            politicianWeVoteId={politicianWeVoteId}
          />
        </Suspense>
        {!!(politicianWeVoteId) && (
          <Suspense fallback={<span>&nbsp;</span>}>
            <PoliticianPositionRetrieveController politicianWeVoteId={politicianWeVoteId} />
          </Suspense>
        )}
        <Helmet>
          <title>{htmlTitle}</title>
          {politicianSEOFriendlyPathFromUrl ? (
            <link rel="canonical" href={`https://wevote.us/${politicianSEOFriendlyPathFromUrl}/-/`} />
          ) : (
            <>
              {politicianSEOFriendlyPathForDisplay && (
                <link rel="canonical" href={`https://wevote.us/${politicianSEOFriendlyPathForDisplay}/-/`} />
              )}
            </>
          )}
          <meta name="description" content={politicianDescriptionLimited} />
        </Helmet>
        <PageWrapper>
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageMobileWrapper id="cimw3">
              {politicianImageUrlLarge ? (
                <PoliticianImageMobilePlaceholder limitCardWidth profileImageBackgroundColor={profileImageBackgroundColor}>
                  <PoliticianImageMobile src={politicianImageUrlLarge} alt="Politician" />
                </PoliticianImageMobilePlaceholder>
              ) : (
                <DelayedLoad waitBeforeShow={loadSlow ? 1000 : 0}>
                  <CampaignImagePlaceholder id="cip5">
                    <CampaignImagePlaceholderText>
                      No image provided
                    </CampaignImagePlaceholderText>
                  </CampaignImagePlaceholder>
                </DelayedLoad>
              )}
            </CampaignImageMobileWrapper>
            <CampaignTitleAndScoreBar>
              <PoliticianNameMobile>{politicianName}</PoliticianNameMobile>
              {officeHeldList.length > 0 ? (
                <OfficeHeldNameMobile>
                  { officeHeldList.map((officeHeld) => (
                    <OfficeHeldNameText
                      centeredText
                      districtName={officeHeld.district_name}
                      key={officeHeld.office_held_we_vote_id}
                      officeName={officeHeld.office_held_name}
                      politicalParty={politicalParty}
                    />
                  ))}
                </OfficeHeldNameMobile>
              ) : (
                <PoliticalPartyDiv>
                  {politicalParty}
                </PoliticalPartyDiv>
              )}
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer campaignXWeVoteId={linkedCampaignXWeVoteId} finalElectionDateInPast={finalElectionDateInPast} />
              </Suspense>
              {/*
              <CampaignOwnersWrapper>
                <CampaignOwnersList politicianWeVoteId={politicianWeVoteIdForDisplay} />
              </CampaignOwnersWrapper>
              */}
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {politicianDescription}
              </CampaignDescription>
              {politicianLinks}
              {politicianButtons}
              <UpdatePoliticianInformation politicianName={politicianName} />
              {finalElectionDateInPast && (
                <IndicatorRow>
                  <IndicatorButtonWrapper>
                    <ElectionInPast>
                      Election in Past
                    </ElectionInPast>
                  </IndicatorButtonWrapper>
                </IndicatorRow>
              )}
              {!!(voterCanEditThisPolitician || voterSupportsThisPolitician) && (
                <IndicatorRow>
                  {voterCanEditThisPolitician && (
                    <IndicatorButtonWrapper>
                      <EditIndicator onClick={this.onPoliticianCampaignEditClick}>
                        Edit Politician
                      </EditIndicator>
                    </IndicatorButtonWrapper>
                  )}
                  {voterSupportsThisPolitician && (
                    <IndicatorButtonWrapper>
                      <EditIndicator onClick={this.onPoliticianCampaignShareClick}>
                        Share Politician
                      </EditIndicator>
                    </IndicatorButtonWrapper>
                  )}
                </IndicatorRow>
              )}
            </CampaignDescriptionWrapper>
            {positionListTeaserHtml}
            {isWebApp() && (
              <CampaignChipInLinkOuterWrapper>
                <CampaignChipInLink
                  campaignSEOFriendlyPath={politicianSEOFriendlyPathForDisplay}
                  campaignXWeVoteId={linkedCampaignXWeVoteId}
                  externalUniqueId="mobile"
                />
              </CampaignChipInLinkOuterWrapper>
            )}
            {commentListTeaserHtml}
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignShareChunkWrapper>
                <CampaignShareChunk
                  campaignSEOFriendlyPath={politicianSEOFriendlyPathForDisplay}
                  campaignXWeVoteId={linkedCampaignXWeVoteId}
                  politicianName={politicianName}
                  darkButtonsOff
                  privatePublicIntroductionsOff
                />
              </CampaignShareChunkWrapper>
            </Suspense>
            {(!futureFeaturesDisabled && nextReleaseFeaturesEnabled) && (
              <CommentsListWrapper>
                <DelayedLoad waitBeforeShow={loadSlow ? 1000 : 0}>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <CampaignSubSectionTitleWrapper>
                      <CampaignSubSectionTitle>
                        Updates
                      </CampaignSubSectionTitle>
                      {!!(this.getCampaignXBasePath()) && (
                        <CampaignSubSectionSeeAll>
                          <Link to={`${this.getCampaignXBasePath()}updates`} className="u-link-color">
                            See all
                          </Link>
                        </CampaignSubSectionSeeAll>
                      )}
                    </CampaignSubSectionTitleWrapper>
                    <CampaignNewsItemList
                      politicianWeVoteId={politicianWeVoteIdForDisplay}
                      politicianSEOFriendlyPath={politicianSEOFriendlyPathForDisplay}
                      showAddNewsItemIfNeeded
                      startingNumberOfCommentsToDisplay={1}
                    />
                  </Suspense>
                </DelayedLoad>
              </CommentsListWrapper>
            )}
            {candidateCampaignList && candidateCampaignList.length > 0 && (
              <CandidateCampaignListMobile>
                <CampaignSubSectionTitleWrapper>
                  <CampaignSubSectionTitle>
                    {this.getCandidateCampaignListTitle(thisYearElectionExists, nextYearElectionExists, priorYearElectionExists)}
                  </CampaignSubSectionTitle>
                </CampaignSubSectionTitleWrapper>
                <OtherElectionsWrapper>
                  {priorCandidateCampaignsHtml}
                </OtherElectionsWrapper>
              </CandidateCampaignListMobile>
            )}
            {opponentCandidateList && opponentCandidateList.length > 0 && (
              <CandidateCampaignListMobile>
                <CampaignSubSectionTitleWrapper>
                  <CampaignSubSectionTitle>
                    {opponentsSubtitle}
                  </CampaignSubSectionTitle>
                </CampaignSubSectionTitleWrapper>
                <OtherElectionsWrapper>
                  {opponentCandidatesHtml}
                </OtherElectionsWrapper>
              </CandidateCampaignListMobile>
            )}
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <PoliticianNameOuterWrapperDesktop>
              <PoliticianNameDesktop>{politicianName}</PoliticianNameDesktop>
              {officeHeldList.length > 0 ? (
                <OfficeHeldNameDesktop>
                  { officeHeldList.map((officeHeld) => (
                    <OfficeHeldNameText
                      centeredText
                      districtName={officeHeld.district_name}
                      key={officeHeld.office_held_we_vote_id}
                      officeName={officeHeld.office_held_name}
                      politicalParty={politicalParty}
                    />
                  ))}
                </OfficeHeldNameDesktop>
              ) : (
                <OfficeHeldNameDesktop>
                  <PoliticalPartyDiv>
                    {politicalParty}
                  </PoliticalPartyDiv>
                </OfficeHeldNameDesktop>
              )}
            </PoliticianNameOuterWrapperDesktop>
            <ColumnsWrapper>
              <ColumnTwoThirds>
                <CampaignImageDesktopWrapper>
                  {politicianImageUrlLarge ? (
                    <PoliticianImageDesktopPlaceholder limitCardWidth profileImageBackgroundColor={profileImageBackgroundColor}>
                      <PoliticianImageDesktop src={politicianImageUrlLarge} alt="Politician" />
                    </PoliticianImageDesktopPlaceholder>
                  ) : (
                    <DelayedLoad waitBeforeShow={loadSlow ? 1000 : 0}>
                      <CampaignImagePlaceholder id="cip6">
                        <CampaignImagePlaceholderText>
                          No image provided
                        </CampaignImagePlaceholderText>
                      </CampaignImagePlaceholder>
                    </DelayedLoad>
                  )}
                </CampaignImageDesktopWrapper>
                <CampaignOwnersDesktopWrapper>
                  <CampaignOwnersList politicianWeVoteId={politicianWeVoteIdForDisplay} />
                </CampaignOwnersDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {politicianDescription}
                  </CampaignDescriptionDesktop>
                  {politicianLinks}
                  {politicianButtons}
                  <UpdatePoliticianInformation politicianName={politicianName} />
                  {finalElectionDateInPast && (
                    <IndicatorRow>
                      <IndicatorButtonWrapper>
                        <ElectionInPast>
                          Election in Past
                        </ElectionInPast>
                      </IndicatorButtonWrapper>
                    </IndicatorRow>
                  )}
                  {voterCanEditThisPolitician && (
                    <IndicatorRow>
                      <IndicatorButtonWrapper>
                        <EditIndicator onClick={this.onPoliticianCampaignEditClick}>
                          Edit This Politician
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    </IndicatorRow>
                  )}
                </CampaignDescriptionDesktopWrapper>
                {positionListTeaserHtml}
                {commentListTeaserHtml}
                {/* Show links to this campaign in the admin tools */}
                <LinkToAdminTools
                  adminToolsUrl={campaignAdminEditUrl}
                  linkId="editCampaign"
                  linkTextNode={<span>edit campaign</span>}
                />
              </ColumnTwoThirds>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer campaignXWeVoteId={linkedCampaignXWeVoteId} finalElectionDateInPast={finalElectionDateInPast} />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignDetailsActionSideBox
                    campaignXWeVoteId={linkedCampaignXWeVoteId}
                    campaignSEOFriendlyPath={politicianSEOFriendlyPathForDisplay}
                    finalElectionDateInPast={finalElectionDateInPast}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                    politicianName={politicianName}
                  />
                </Suspense>
                {(!futureFeaturesDisabled && nextReleaseFeaturesEnabled) && (
                  <CommentsListWrapper>
                    <DelayedLoad waitBeforeShow={loadSlow ? 500 : 0}>
                      <Suspense fallback={<span>&nbsp;</span>}>
                        <CampaignSubSectionTitleWrapper>
                          <CampaignSubSectionTitle>
                            Updates
                          </CampaignSubSectionTitle>
                          {!!(this.getCampaignXBasePath()) && (
                            <CampaignSubSectionSeeAll>
                              <Link to={`${this.getCampaignXBasePath()}updates`} className="u-link-color">
                                See all
                              </Link>
                            </CampaignSubSectionSeeAll>
                          )}
                        </CampaignSubSectionTitleWrapper>
                        <CampaignNewsItemList
                          politicianWeVoteId={politicianWeVoteIdForDisplay}
                          politicianSEOFriendlyPath={politicianSEOFriendlyPathForDisplay}
                          showAddNewsItemIfNeeded
                          startingNumberOfCommentsToDisplay={1}
                        />
                      </Suspense>
                    </DelayedLoad>
                  </CommentsListWrapper>
                )}
                {candidateCampaignList && candidateCampaignList.length > 0 && (
                  <CandidateCampaignListDesktop>
                    <CampaignSubSectionTitleWrapper>
                      <CampaignSubSectionTitle>
                        {this.getCandidateCampaignListTitle(thisYearElectionExists, nextYearElectionExists, priorYearElectionExists)}
                      </CampaignSubSectionTitle>
                    </CampaignSubSectionTitleWrapper>
                    <OtherElectionsWrapper>
                      {priorCandidateCampaignsHtml}
                    </OtherElectionsWrapper>
                  </CandidateCampaignListDesktop>
                )}
                {opponentCandidateList && opponentCandidateList.length > 0 && (
                  <CandidateCampaignListDesktop>
                    <CampaignSubSectionTitleWrapper>
                      <CampaignSubSectionTitle>
                        {opponentsSubtitle}
                      </CampaignSubSectionTitle>
                    </CampaignSubSectionTitleWrapper>
                    <OtherElectionsWrapper>
                      {opponentCandidatesHtml}
                    </OtherElectionsWrapper>
                  </CandidateCampaignListDesktop>
                )}
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapperAboveFooterButtons className="u-show-mobile">
          <SupportButtonPanel>
            <Suspense fallback={<span>&nbsp;</span>}>
              <SupportButtonBeforeCompletionScreen
                campaignXWeVoteId={linkedCampaignXWeVoteId}
                functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
              />
            </Suspense>
          </SupportButtonPanel>
        </SupportButtonFooterWrapperAboveFooterButtons>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignXWeVoteId={linkedCampaignXWeVoteId} />
          {/* campaignSEOFriendlyPath={campaignSEOFriendlyPath} */}
        </Suspense>
        <CompleteYourProfileModalController
          politicianWeVoteId={politicianWeVoteId}
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportPolitician
        />
      </PageContentContainer>
    );
  }
}
PoliticianDetailsPage.propTypes = {
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

const CampaignShareChunkWrapper = styled('div')`
  margin-top: 10px;
`;

const CampaignChipInLinkOuterWrapper = styled('div')`
  margin-top: 40px;
`;

const ColumnOneThird = styled('div')`
  flex: 1;
  flex-direction: column;
  flex-basis: 40%;
  margin: 0 0 0 25px;
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
`;

const MissingPoliticianMessageContainer = styled('div')`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const MissingPoliticianText = styled('p')(({ theme }) => (`
  font-size: 24px;
  text-align: center;
  margin: 1em 2em 3em;
  ${theme.breakpoints.down('md')} {
    margin: 1em;
  }
`));

const ExternalWebSiteWrapper = styled('div')`
  margin-top: 3px;
  padding-left: 15px;
  white-space: nowrap;
  // ${() => displayNoneIfSmallerThanDesktop()};
`;

const PoliticalPartyDiv = styled('div')`
  font-size: 18px;
  // text-align: center;
  color: #999;
  font-weight: 200;
  white-space: nowrap;
`;

const PoliticianLinksWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const TwitterWrapper = styled('div')`
  margin-right: 20px;
`;

export default withStyles(styles)(PoliticianDetailsPage);
