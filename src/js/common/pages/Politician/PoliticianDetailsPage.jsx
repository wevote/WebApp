import { keyframes } from '@emotion/react';
import { PersonSearch } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DesignTokenColors from '../../components/Style/DesignTokenColors';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import webAppConfig from '../../../config';
import AnalyticsActions from '../../../actions/AnalyticsActions';
import BallotActions from '../../../actions/BallotActions';
import OrganizationActions from '../../../actions/OrganizationActions';
import SupportActions from '../../../actions/SupportActions';
import RepresentativeStore from '../../../stores/RepresentativeStore';
import BallotStore from '../../../stores/BallotStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import CandidateStore from '../../../stores/CandidateStore';
import OfficeHeldStore from '../../stores/OfficeHeldStore';
import PoliticianStore from '../../stores/PoliticianStore';
import CampaignChipInLink from '../../components/Campaign/CampaignChipInLink';
import CampaignOwnersList from '../../components/CampaignSupport/CampaignOwnersList';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import { Candidate, CandidateNameH4, CandidateNameAndPartyWrapper, CandidateParty, CandidateTopRow } from '../../../components/Style/BallotStyles';
import {
  CampaignDescription, CampaignDescriptionDesktop, CampaignDescriptionDesktopWrapper, CampaignDescriptionWrapper,
  // CampaignImageDesktopWrapper, CampaignImageMobileWrapper, CampaignImagePlaceholder, CampaignImagePlaceholderText,
  CampaignOwnersDesktopWrapper, CampaignSubSectionSeeAll, CampaignSubSectionTitle, CampaignSubSectionTitleWrapper, // CampaignTitleAndScoreBar,
  CommentsListWrapper, DetailsSectionDesktopTablet, DetailsSectionMobile, OtherElectionsWrapper, SupportButtonFooterWrapperAboveFooterButtons, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import { EditIndicator, IndicatorButtonWrapper, IndicatorRow } from '../../components/Style/CampaignIndicatorStyles';
import {
  CandidateCampaignListDesktop, CandidateCampaignListMobile, CandidateCampaignWrapper,
  // OfficeHeldNameDesktop, OfficeHeldNameMobile, PoliticianImageDesktop, PoliticianImageDesktopPlaceholder, PoliticianImageMobile, PoliticianImageMobilePlaceholder, PoliticianNameDesktop, PoliticianNameMobile, PoliticianNameOuterWrapperDesktop,
  SectionTitleSimple,
} from '../../components/Style/PoliticianDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import LinkToAdminTools from '../../components/Widgets/LinkToAdminTools';
// import OfficeHeldNameText from '../../components/Widgets/OfficeHeldNameText';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { convertStateCodeToStateText } from '../../utils/addressFunctions';
import apiCalming from '../../utils/apiCalming';
import { getYearFromUltimateElectionDate } from '../../utils/dateFormat';
import historyPush from '../../utils/historyPush';
import { isCordova, isWebApp } from '../../utils/isCordovaOrWebApp';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import { cordovaOffsetLog, renderLog } from '../../utils/logging';
import { getPoliticianValuesFromIdentifiers, retrievePoliticianFromIdentifiersIfNeeded } from '../../utils/politicianUtils';
import returnFirstXWords from '../../utils/returnFirstXWords';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';
import standardBoxShadow from '../../components/Style/standardBoxShadow';
import { cordovaBallotFilterTopMargin } from '../../../utils/cordovaOffsets';
import { headroomWrapperOffset } from '../../../utils/cordovaCalculatedOffsets';
import { getPageKey } from '../../../utils/cordovaPageUtils';
import normalizedImagePath from '../../utils/normalizedImagePath';

// const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
const CampaignShareChunk = React.lazy(() => import(/* webpackChunkName: 'CampaignShareChunk' */ '../../components/Campaign/CampaignShareChunk'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../../../components/ImageHandler'));
// const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../../../components/Widgets/ItemActionBar/ItemActionBar'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../components/Widgets/OfficeNameText'));
const OfficeItemCompressed = React.lazy(() => import(/* webpackChunkName: 'OfficeItemCompressed' */ '../../../components/Ballot/OfficeItemCompressed'));
const PoliticianCardForList = React.lazy(() => import(/* webpackChunkName: 'PoliticianCardForList' */ '../../../components/PoliticianListRoot/PoliticianCardForList'));
const PoliticianEndorsementsList = React.lazy(() => import(/* webpackChunkName: 'PoliticianEndorsementsList' */ '../../components/Politician/PoliticianEndorsementsList'));
const PoliticianLinks = React.lazy(() => import(/* webpackChunkName: 'PolitianLinks' */ '../../components/Politician/PoliticianLinks'));
const PoliticianRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianRetrieveController' */ '../../components/Politician/PoliticianRetrieveController'));
const PoliticianPositionRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianPositionRetrieveController' */ '../../components/Position/PoliticianPositionRetrieveController'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../components/Widgets/ReadMore'));
const UpdatePoliticianInformation = React.lazy(() => import(/* webpackChunkName: 'UpdatePoliticianInformation' */ '../../components/Politician/UpdatePoliticianInformation'));
const ViewUpcomingBallotButton = React.lazy(() => import(/* webpackChunkName: 'ViewUpcomingBallotButton' */ '../../../components/Ready/ViewUpcomingBallotButton'));

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
    cordovaOffsetLog(`PoliticianDetailsPage HeadroomWrapper offset: ${offset}, page: ${getPageKey()}`);
    return offset;
    // end calculated approach
  }
  return 0;
}


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
      opponentCandidatesToShowCount: 5,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      politicianDataFound: false,
      politicianDataNotFound: false,
      politicianSEOFriendlyPath: '',
      politicianSEOFriendlyPathForDisplay: '', // Value for politician already received
      politicianName: '',
      politicianWeVoteId: '',
      politicianWeVoteIdForDisplay: '', // Value for politician already received
      sharingStepCompleted: false,
      showMobileViewUpcomingBallot: false,
      stateText: '',
      step2Completed: false,
      supporterEndorsementsWithText: [],
      voterCanEditThisPolitician: false,
      wikipediaUrl: '',
      // youtubeUrl: '',
    };
    // this.onScroll = this.onScroll.bind(this);
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

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    SupportActions.voterAllPositionsRetrieve();

    this.positionItemTimer = setTimeout(() => {
      // This is a performance killer, so let's delay it for a few seconds
      if (!BallotStore.ballotFound) {
        // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
        if (apiCalming('voterBallotItemsRetrieve', 3000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

    this.ballotButtonTimer = setTimeout(() => {
      this.setState({
        showMobileViewUpcomingBallot: true,
      });
    }, 5000);

    // console.log('componentDidMount triggerSEOPathRedirect: ', triggerSEOPathRedirect, ', politicianSEOFriendlyPathFromObject: ', politicianSEOFriendlyPathFromObject);
    if (triggerSEOPathRedirect && politicianSEOFriendlyPathFromObject) {
      historyPush(`/${politicianSEOFriendlyPathFromObject}/-/`, true);
    }
    this.analyticsTimer = setTimeout(() => {
      AnalyticsActions.saveActionPoliticianPageVisit(politicianSEOFriendlyPathFromUrl, politicianWeVoteId);
    }, 3000);
    window.scrollTo(0, 0);
    // window.addEventListener('scroll', this.onScroll);
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
    // console.log('componentDidUpdate politicianSEOFriendlyPathFromUrl: ', politicianSEOFriendlyPathFromUrl, ', politicianSEOFriendlyPathFromObject: ', politicianSEOFriendlyPathFromObject, ', prevPoliticianSEOFriendlyPath:', prevPoliticianSEOFriendlyPath);
    // console.log('politicianWeVoteId: ', politicianWeVoteId, ', prevPoliticianWeVoteId: ', prevPoliticianWeVoteId);
    if (politicianSEOFriendlyPathFromUrl && (politicianSEOFriendlyPathFromUrl !== prevPoliticianSEOFriendlyPath)) {
      // console.log('politicianSEOFriendlyPathFromUrl CHANGE 1');
      // console.log('componentDidUpdate prevPoliticianSEOFriendlyPath: ', prevPoliticianSEOFriendlyPath);
      const politicianWeVoteIdFromUrl = PoliticianStore.getPoliticianWeVoteIdFromPoliticianSEOFriendlyPath(politicianSEOFriendlyPathFromUrl);
      const politicianWeVoteIdFromPreviousUrl = PoliticianStore.getPoliticianWeVoteIdFromPoliticianSEOFriendlyPath(prevPoliticianSEOFriendlyPath);
      const isSamePolitician = politicianWeVoteIdFromPreviousUrl && (politicianWeVoteIdFromUrl === politicianWeVoteIdFromPreviousUrl);
      // Only change politician if the we_vote_id is different
      if (isSamePolitician) {
        // console.log('isSamePolitician');
        // Don't change the politician if the we_vote_id is the same as the previous
        // but specify that we want to triggerSEOPathRedirect
        politicianSEOFriendlyPath = politician.seo_friendly_path;
        triggerSEOPathRedirect = true;
      } else {
        // console.log('NOT isSamePolitician');
        if (politician && politician.politician_we_vote_id) {
          this.setState({
            linkedCampaignXWeVoteId: politician.linked_campaignx_we_vote_id,
            politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl,
            politicianSEOFriendlyPathForDisplay: politicianSEOFriendlyPathFromUrl,
            politicianWeVoteId: politician.politician_we_vote_id,
            politicianWeVoteIdForDisplay: politician.politician_we_vote_id,
          });  // , () => this.onfirstRetrievalOfPoliticianWeVoteId());
        } else {
          this.setState({
            politicianSEOFriendlyPath: politicianSEOFriendlyPathFromUrl,
            politicianSEOFriendlyPathForDisplay: politicianSEOFriendlyPathFromUrl,
          });  // , () => this.onfirstRetrievalOfPoliticianWeVoteId());
        }
        triggerFreshRetrieve = true;
        triggerSEOPathRedirect = true;
      }
    } else if (politicianSEOFriendlyPathFromObject && (politicianSEOFriendlyPathFromUrl !== politicianSEOFriendlyPathFromObject)) {
      // console.log('politicianSEOFriendlyPathFromObject CHANGE');
      politicianSEOFriendlyPath = politicianSEOFriendlyPathFromObject;
      triggerFreshRetrieve = true;
      triggerSEOPathRedirect = true;
    } else if (politicianSEOFriendlyPathFromUrl !== prevPoliticianSEOFriendlyPath) {
      // console.log('politicianSEOFriendlyPathFromUrl CHANGE 2');
      triggerFreshRetrieve = true;
      triggerSEOPathRedirect = true;
    } else if (politicianWeVoteId && (politicianWeVoteId !== prevPoliticianWeVoteId)) {
      // console.log('POLITICIAN CHANGE componentDidUpdate prevPoliticianWeVoteId: ', prevPoliticianWeVoteId);
      if (politician && politician.politician_we_vote_id) {
        this.setState({
          linkedCampaignXWeVoteId: politician.linked_campaignx_we_vote_id,
          politicianSEOFriendlyPath: politician.seo_friendly_path,
          politicianSEOFriendlyPathForDisplay: politician.seo_friendly_path,
          politicianWeVoteId,
          politicianWeVoteIdForDisplay: politicianWeVoteId,
        }); // , () => this.onfirstRetrievalOfPoliticianWeVoteId());
      } else {
        this.setState({
          politicianWeVoteId,
          politicianWeVoteIdForDisplay: politicianWeVoteId,
        }); // , () => this.onfirstRetrievalOfPoliticianWeVoteId());
      }
      triggerFreshRetrieve = true;
      triggerSEOPathRedirect = true;
      // } else {
      //   console.log('PoliticianDetailsPage NO CHANGE');
    }
    // console.log('componentDidUpdate triggerSEOPathRedirect: ', triggerSEOPathRedirect, ', politicianSEOFriendlyPath: ', politicianSEOFriendlyPath);
    if (triggerSEOPathRedirect && politicianSEOFriendlyPath) {
      // Direct to the updated SEO path
      historyPush(`/${politicianSEOFriendlyPath}/-/`, true);
      this.clearPoliticianValues();
      this.onPoliticianStoreChange();
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
    if (this.ballotButtonTimer) {
      clearTimeout(this.ballotButtonTimer);
      this.ballotButtonTimer = null;
    }
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
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
    // window.removeEventListener('scroll', this.onScroll);
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
      scrolledDown: AppObservableStore.getScrolledDown(),
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
      contestOfficeName,
      finalElectionDateInPast,
      instagramHandle,
      // isSupportersCountMinimumExceeded,
      linkedCampaignXWeVoteId,
      officeWeVoteId,
      opponentCandidateList,
      politicalParty,
      politicianDataFound,
      politicianDescription,
      // politicianSEOFriendlyPath,
      politicianImageUrlLarge,
      politicianName,
      politicianUrl,
      politicianWeVoteId,
      stateCode,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      youtubeUrl,
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
      contestOfficeName,
      finalElectionDateInPast,
      instagramHandle,
      // isSupportersCountMinimumExceeded,
      linkedCampaignXWeVoteId,
      officeWeVoteId,
      opponentCandidateList: filteredOpponentCandidateList,
      politicalParty,
      politicianDataFound,
      politicianDataNotFound,
      politicianDescription,
      politicianDescriptionLimited,
      politicianImageUrlLarge,
      politicianName,
      politicianUrl,
      stateText,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      youtubeUrl,
    });
  }

  onRepresentativeStoreChange () {
    //
  }

  // onScroll () {
  //   const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
  //   // console.log('showMoreItemsElement: ', showMoreItemsElement);
  //   if (showMoreItemsElement) {
  //   }
  // }

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
      contestOfficeName: '',
      finalElectionDateInPast: false,
      instagramHandle: '',
      // isSupportersCountMinimumExceeded: false,
      linkedCampaignXWeVoteId: '',
      officeWeVoteId: '',
      opponentCandidateList: [],
      politicalParty: '',
      politicianDataFound: false,
      politicianDataNotFound: false,
      politicianDescription: '',
      politicianDescriptionLimited: '',
      politicianImageUrlLarge: '',
      politicianName: '',
      politicianUrl: '',
      politicianWeVoteIdForDisplay: '', // We don't clear politicianWeVoteId because we may need it to load next politician
      politicianSEOFriendlyPathForDisplay: '', // We don't clear politicianSEOFriendlyPath because we may need it to load next politician
      stateText: '',
      twitterHandle: '',
      twitterHandle2: '',
      wikipediaUrl: '',
      youtubeUrl: '',
    });
  }

  showMoreOpponentCandidates = () => {
    const { opponentCandidatesToShowCount } = this.state;
    this.setState({
      opponentCandidatesToShowCount: opponentCandidatesToShowCount + 10,
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
      // const campaignXBasePath = this.getCampaignXBasePath();
      // console.log('PoliticianDetailsPage functionToUseWhenProfileComplete campaignXBasePath (IGNORED):', campaignXBasePath);
      saveCampaignSupportAndGoToNextPage(linkedCampaignXWeVoteId);  // campaignXBasePath
    } else {
      console.log('PoliticianDetailsPage functionToUseWhenProfileComplete linkedCampaignXWeVoteId not found');
    }
  }

  goToBallot = () => {
    historyPush('/ballot');
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
    const {
      allCachedPositionsForThisPolitician, ballotpediaPoliticianUrl, candidateCampaignList, chosenWebsiteName,
      // contestOfficeName: contestOfficeNameFromOpponentList,
      // supporterEndorsementsWithText,
      finalElectionDateInPast, instagramHandle,
      linkedCampaignXWeVoteId, loadSlow,
      // officeHeldList,
      officeWeVoteId,
      officeHeldNameForSearch, opponentCandidateList, opponentCandidatesToShowCount,
      politicalParty,
      politicianDataFound, politicianDataNotFound,
      politicianDescription, politicianDescriptionLimited, politicianImageUrlLarge,
      politicianSEOFriendlyPath, politicianSEOFriendlyPathForDisplay,
      politicianName, politicianUrl,
      politicianWeVoteId, politicianWeVoteIdForDisplay,
      scrolledDown, showMobileViewUpcomingBallot,
      stateText, twitterHandle, twitterHandle2,
      voterCanEditThisPolitician, voterSupportsThisPolitician,
      wikipediaUrl, youtubeUrl,
    } = this.state;
    let { contestOfficeName } = this.state;

    const politicianLinksList = [];
    if (politicianUrl) {
      politicianLinksList.push({
        linkText: 'Candidate website',
        externalLinkUrl: politicianUrl,
      });
    }
    if (instagramHandle) {
      const instagramHandleCleaned = instagramHandle.trim();
      politicianLinksList.push({
        linkText: `instagram.com/${instagramHandleCleaned}`,
        externalLinkUrl: `https://instagram.com/${instagramHandleCleaned}`,
      });
    }
    if (youtubeUrl) {
      politicianLinksList.push({
        linkText: 'youtube.com',
        externalLinkUrl: youtubeUrl,
      });
    }
    if (wikipediaUrl) {
      politicianLinksList.push({
        linkText: 'wikipedia.org',
        externalLinkUrl: wikipediaUrl,
      });
    }
    if (ballotpediaPoliticianUrl) {
      politicianLinksList.push({
        linkText: 'ballotpedia.org',
        externalLinkUrl: ballotpediaPoliticianUrl,
      });
    }
    if (politicianName || officeHeldNameForSearch) {
      const googleQuery = `${politicianName} ${stateText} ${officeHeldNameForSearch}`;
      const googleQueryUrlFriendly = googleQuery.replace(/ /g, '+');
      const googleSearchUrl = `https://www.google.com/search?q=${googleQueryUrlFriendly}&oq=${googleQueryUrlFriendly}`;
      politicianLinksList.push({
        linkText: 'Google search',
        externalLinkUrl: googleSearchUrl,
      });
      const bingQuery = `${politicianName} ${stateText} ${officeHeldNameForSearch}`;
      const bingQueryUrlFriendly = bingQuery.replace(/ /g, '+');
      const bingSearchUrl = `https://www.bing.com/search?q=${bingQueryUrlFriendly}&pq=${bingQueryUrlFriendly}`;
      politicianLinksList.push({
        linkText: 'Bing AI',
        externalLinkUrl: bingSearchUrl,
      });
    }
    if (twitterHandle) {
      const twitterHandleCleaned = twitterHandle.trim();
      politicianLinksList.push({
        linkText: `X.com/${twitterHandleCleaned}`,
        externalLinkUrl: `https://x.com/${twitterHandleCleaned}`,
      });
    }
    if (twitterHandle2 && (twitterHandle2 !== twitterHandle)) {
      const twitterHandle2Cleaned = twitterHandle2.trim();
      politicianLinksList.push({
        linkText: `X.com/${twitterHandle2Cleaned}`,
        externalLinkUrl: `https://x.com/${twitterHandle2Cleaned}`,
      });
    }

    const campaignAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}campaign/${linkedCampaignXWeVoteId}/summary`;
    // const candidateWeVoteId = CandidateStore.getCandidateWeVoteIdRunningFromPoliticianWeVoteId(politicianWeVoteId);
    const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');
    const avatarCompressed = 'card-main__avatar-compressed';

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

    let htmlTitle = `${chosenWebsiteName}`;
    if (politicianName) {
      htmlTitle = `${politicianName} - ${chosenWebsiteName}`;
    }

    const politicianLinksContainer = (politicianLinksList) ? (
      <PoliticianLinksWrapper>
        <SectionTitleSimple>More candidate information</SectionTitleSimple>
        <PoliticianLinks links={politicianLinksList} />
      </PoliticianLinksWrapper>
    ) : <PoliticianLinksWrapper />;

    let opponentCandidatesHtml = '';
    const opponentsSubtitle = finalElectionDateInPast ? 'Candidates who ran for same office' : 'Candidates running for same office';
    let priorCandidateCampaignsHtml = '';
    const currentYear = 2023;
    let nextYearElectionExists = false;
    let priorYearElectionExists = false;
    let thisYearElectionExists = false;
    if (candidateCampaignList && candidateCampaignList.length > 0) {
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
      let opponentCandidatesShownCount = 0;
      opponentCandidatesHtml = opponentCandidateList.map((opposingCandidate) => {
        if (opposingCandidate.seo_friendly_path) {
          if (opponentCandidatesShownCount < opponentCandidatesToShowCount) {
            opponentCandidatesShownCount += 1;
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
        } else {
          return null;
        }
      });
      const opponentCandidatesMoreToShow = opponentCandidatesShownCount < opponentCandidateList.length;
      if (opponentCandidatesMoreToShow) {
        const showMoreHTML = (
          <div className="u-link-color u-link-underline-on-hover"
            id="opposingShowMore"
            key="opposingShowMoreKey"
            onClick={this.showMoreOpponentCandidates}
          >
            Show more
          </div>
        );
        opponentCandidatesHtml.push(showMoreHTML);
      }
    }
    let positionListTeaserHtml = <></>;
    if (allCachedPositionsForThisPolitician && allCachedPositionsForThisPolitician.length > 0) {
      positionListTeaserHtml = (
        <CommentsListWrapper>
          <DelayedLoad waitBeforeShow={loadSlow ? 1000 : 0}>
            <Suspense fallback={<span>&nbsp;</span>}>
              <PoliticianEndorsementsList
                hideEncouragementToEndorse
                politicianWeVoteId={politicianWeVoteIdForDisplay}
                showTitle
                startingNumberOfPositionsToDisplay={2}
              />
            </Suspense>
          </DelayedLoad>
        </CommentsListWrapper>
      );
    }
    // let commentListTeaserHtml = <></>;
    // if (supporterEndorsementsWithText && supporterEndorsementsWithText.length > 0) {
    //   commentListTeaserHtml = (
    //     <CommentsListWrapper>
    //       <DelayedLoad waitBeforeShow={loadSlow ? 1500 : 0}>
    //         <Suspense fallback={<span>&nbsp;</span>}>
    //           <CampaignSubSectionTitleWrapper>
    //             <CampaignSubSectionTitle>
    //               Reasons for supporting
    //             </CampaignSubSectionTitle>
    //             {!!(this.getCampaignXBasePath()) && (
    //               <CampaignSubSectionSeeAll>
    //                 <Link
    //                   to={`${this.getCampaignXBasePath()}comments`}
    //                   className="u-link-color"
    //                 >
    //                   See all
    //                 </Link>
    //               </CampaignSubSectionSeeAll>
    //             )}
    //           </CampaignSubSectionTitleWrapper>
    //           <CampaignCommentsList
    //             campaignXWeVoteId={linkedCampaignXWeVoteId}
    //             politicianWeVoteId={politicianWeVoteIdForDisplay}
    //             removePoliticianEndorsements
    //             startingNumberOfCommentsToDisplay={2}
    //           />
    //         </Suspense>
    //       </DelayedLoad>
    //     </CommentsListWrapper>
    //   );
    // }
    const pigsCanFly = false;
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
            <MobileHeaderOuterContainer id="politicianHeaderContainer" scrolledDown={scrolledDown}>
              <MobileHeaderInnerContainer>
                <MobileHeaderContentContainer>
                  <CandidateTopRow>
                    <Candidate
                      id={`politicianDetailsImageAndName-${politicianWeVoteId}`}
                    >
                      {/* Candidate Image */}
                      <Suspense fallback={<></>}>
                        <ImageHandler
                          className={avatarCompressed}
                          sizeClassName="icon-candidate-small u-push--sm "
                          imageUrl={politicianImageUrlLarge}
                          alt=""
                          kind_of_ballot_item="CANDIDATE"
                          style={{ backgroundImage: { avatarBackgroundImage } }}
                        />
                      </Suspense>
                      {/* Candidate Name */}
                      <CandidateNameAndPartyWrapper>
                        <CandidateNameH4>
                          {politicianName}
                        </CandidateNameH4>
                        <CandidateParty>
                          {politicalParty}
                        </CandidateParty>
                      </CandidateNameAndPartyWrapper>
                    </Candidate>
                  </CandidateTopRow>
                  <HeartToggleAndThermometerWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignSupportThermometer
                        campaignXWeVoteId={linkedCampaignXWeVoteId}
                        finalElectionDateInPast={finalElectionDateInPast}
                      />
                    </Suspense>
                  </HeartToggleAndThermometerWrapper>
                </MobileHeaderContentContainer>
              </MobileHeaderInnerContainer>
            </MobileHeaderOuterContainer>
            <Suspense fallback={<span>&nbsp;</span>}>
              <PoliticianCardForList
                politicianWeVoteId={politicianWeVoteIdForDisplay}
                useCampaignSupportThermometer
                useVerticalCard
              />
            </Suspense>
            <CampaignDescriptionWrapper hideCardMargins>
              {politicianDataFound && (
                <DelayedLoad waitBeforeShow={250}>
                  <CampaignDescription>
                    <AboutAndEditFlex>
                      <SectionTitleSimple>
                        About
                      </SectionTitleSimple>
                      <div>
                        <Suspense fallback={<span>&nbsp;</span>}>
                          <UpdatePoliticianInformation politicianName={politicianName} />
                        </Suspense>
                      </div>
                    </AboutAndEditFlex>
                    {politicianDescription ? (
                      <ReadMore numberOfLines={6} textToDisplay={politicianDescription} />
                    ) : (
                      <NoInformationProvided>No description has been provided for this candidate.</NoInformationProvided>
                    )}
                  </CampaignDescription>
                </DelayedLoad>
              )}
              {politicianDataFound && (
                <DelayedLoad waitBeforeShow={250}>
                  {politicianLinksContainer}
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
            {(opponentCandidateList && opponentCandidateList.length > 0) && (
              <CandidateCampaignListMobile>
                <CampaignSubSectionTitleWrapper>
                  <CampaignSubSectionTitle>
                    {opponentsSubtitle}
                  </CampaignSubSectionTitle>
                </CampaignSubSectionTitleWrapper>
                {(officeWeVoteId) ? (
                  <BallotOverflowWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <OfficeItemCompressed
                        officeWeVoteId={officeWeVoteId}
                        ballotItemDisplayName=""  // {contestOfficeNameFromOpponentList}
                        candidateList={opponentCandidateList}
                        // candidatesToShowForSearchResults={candidatesToShowForSearchResults}
                        disableAutoRollUp
                      // isFirstBallotItem={isFirstBallotItem}
                      // primaryParty={primaryParty}
                      />
                    </Suspense>
                  </BallotOverflowWrapper>
                ) : (
                  <OtherElectionsWrapper>
                    {opponentCandidatesHtml}
                  </OtherElectionsWrapper>
                )}
              </CandidateCampaignListMobile>
            )}
            {positionListTeaserHtml}
            {(isWebApp() && pigsCanFly) && (
              <CampaignChipInLinkOuterWrapper>
                <CampaignChipInLink
                  campaignSEOFriendlyPath={politicianSEOFriendlyPathForDisplay}
                  campaignXWeVoteId={linkedCampaignXWeVoteId}
                  externalUniqueId="mobile"
                />
              </CampaignChipInLinkOuterWrapper>
            )}
            {/* {commentListTeaserHtml} */}
            {pigsCanFly && (
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
            )}
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
            {/* <ViewBallotButtonWrapper> */}
            {/*  <Suspense fallback={<></>}> */}
            {/*    <ViewUpcomingBallotButton onClickFunction={this.goToBallot} onlyOfferViewYourBallot /> */}
            {/*  </Suspense> */}
            {/* </ViewBallotButtonWrapper> */}
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <ColumnsWrapper>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <PoliticianCardForList
                    politicianWeVoteId={politicianWeVoteIdForDisplay}
                    useCampaignSupportThermometer
                    useVerticalCard
                  />
                </Suspense>
                <CampaignOwnersDesktopWrapper>
                  <CampaignOwnersList politicianWeVoteId={politicianWeVoteIdForDisplay} />
                </CampaignOwnersDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  {politicianDataFound && (
                    <DelayedLoad waitBeforeShow={250}>
                      <CampaignDescriptionDesktop>
                        <AboutAndEditFlex>
                          <SectionTitleSimple>
                            About
                          </SectionTitleSimple>
                          <div>
                            <Suspense fallback={<span>&nbsp;</span>}>
                              <UpdatePoliticianInformation politicianName={politicianName} />
                            </Suspense>
                          </div>
                        </AboutAndEditFlex>
                        {politicianDescription ? (
                          <ReadMore numberOfLines={6} textToDisplay={politicianDescription} />
                        ) : (
                          <NoInformationProvided>No description has been provided for this candidate.</NoInformationProvided>
                        )}
                      </CampaignDescriptionDesktop>
                    </DelayedLoad>
                  )}
                  {politicianDataFound && (
                    <DelayedLoad waitBeforeShow={250}>
                      {politicianLinksContainer}
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
                {/* Show links to this campaign in the admin tools */}
                <LinkToAdminTools
                  adminToolsUrl={campaignAdminEditUrl}
                  linkId="editCampaign"
                  linkTextNode={<span>jump to Admin tools</span>}
                />
              </ColumnOneThird>
              <ColumnTwoThirds>
                {(opponentCandidateList && opponentCandidateList.length > 0) && (
                  <CandidateCampaignListDesktop>
                    <CampaignSubSectionTitleWrapper>
                      <CampaignSubSectionTitle>
                        {opponentsSubtitle}
                      </CampaignSubSectionTitle>
                    </CampaignSubSectionTitleWrapper>
                    {(officeWeVoteId) ? (
                      <BallotOverflowWrapper>
                        <OfficeItemCompressed
                          officeWeVoteId={officeWeVoteId}
                          ballotItemDisplayName=""  // {contestOfficeNameFromOpponentList}
                          candidateList={opponentCandidateList}
                          // candidatesToShowForSearchResults={candidatesToShowForSearchResults}
                          disableAutoRollUp
                        // isFirstBallotItem={isFirstBallotItem}
                        // primaryParty={primaryParty}
                        />
                      </BallotOverflowWrapper>
                    ) : (
                      <OtherElectionsWrapper>
                        {opponentCandidatesHtml}
                      </OtherElectionsWrapper>
                    )}
                  </CandidateCampaignListDesktop>
                )}
                <ViewBallotButtonWrapper>
                  <Suspense fallback={<></>}>
                    <ViewUpcomingBallotButton buttonText="View Your Full Ballot" onClickFunction={this.goToBallot} onlyOfferViewYourBallot />
                  </Suspense>
                </ViewBallotButtonWrapper>
                {positionListTeaserHtml}
                {/* {commentListTeaserHtml} */}
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
              </ColumnTwoThirds>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        {showMobileViewUpcomingBallot && (
          <SupportButtonFooterWrapperAboveFooterButtons className="u-show-mobile">
            <SupportButtonPanel>
              <CenteredDiv>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <ViewUpcomingBallotButton buttonText="View Your Full Ballot" onClickFunction={this.goToBallot} onlyOfferViewYourBallot />
                  {/* {(finalElectionDateInPast) ? ( || usePoliticianWeVoteIdForBallotItem */}
                  {/*  <ItemActionBar */}
                  {/*    ballotItemWeVoteId={politicianWeVoteId} */}
                  {/*    ballotItemDisplayName={politicianName} */}
                  {/*    commentButtonHide */}
                  {/*    externalUniqueId={`PoliticianDetailsPage-ItemActionBar-${politicianWeVoteId}`} */}
                  {/*    hidePositionPublicToggle */}
                  {/*    // inCard */}
                  {/*    positionPublicToggleWrapAllowed */}
                  {/*    shareButtonHide */}
                  {/*    useHelpDefeatOrHelpWin */}
                  {/*    useSupportWording */}
                  {/*  /> */}
                  {/* ) : ( */}
                  {/*  <ItemActionBar */}
                  {/*    ballotItemWeVoteId={candidateWeVoteId} */}
                  {/*    ballotItemDisplayName={politicianName} */}
                  {/*    commentButtonHide */}
                  {/*    externalUniqueId={`PoliticianDetailsPage-ItemActionBar-${candidateWeVoteId}`} */}
                  {/*    hidePositionPublicToggle */}
                  {/*    // inCard */}
                  {/*    positionPublicToggleWrapAllowed */}
                  {/*    shareButtonHide */}
                  {/*    useHelpDefeatOrHelpWin */}
                  {/*    // useSupportWording */}
                  {/*  /> */}
                  {/* )} */}
                </Suspense>
              </CenteredDiv>
            </SupportButtonPanel>
          </SupportButtonFooterWrapperAboveFooterButtons>
        )}
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignXWeVoteId={linkedCampaignXWeVoteId} retrieveAsOwnerIfVoterSignedIn />
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

const AboutAndEditFlex = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const BallotOverflowWrapper = styled('div')(({ theme }) => (`
  overflow-x: hidden;
  max-width: 55vw;
  ${theme.breakpoints.down('sm')} {
    max-width: 500px;
  }
`));

const CampaignShareChunkWrapper = styled('div')`
  margin-top: 10px;
`;

const CampaignChipInLinkOuterWrapper = styled('div')`
  margin-top: 40px;
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

const HeartToggleAndThermometerWrapper = styled('div')`
  margin-top: 12px;
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

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const MobileHeaderContentContainer = styled('div')(({ theme }) => (`
  padding: 15px 15px 0 15px;
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
  width: 100%;
  background-color: #fff;
  // ${scrolledDown ? 'border-bottom: 1px solid #aaa' : ''};
  // ${scrolledDown ? `box_shadow: ${standardBoxShadow('wide')}` : ''};
  // ${scrolledDown ? 'display: block' : 'display: none'};
  overflow: hidden;
  position: fixed;
  z-index: 1;
  right: 0;
  transform: translateY(${scrolledDown ? 0 : '-100%'});
  transition: transform 0.3s ease-in-out;
  visibility: ${scrolledDown ? 'visible' : 'hidden'};
  opacity: ${scrolledDown ? 1 : 0};

  ${scrolledDown && `
    animation: ${slideIn} 0.7s ease-out;
    border-bottom: 1px solid #aaa;
    box-shadow: ${standardBoxShadow('wide')};
 `}

  margin-top: ${marginTopOffset(scrolledDown)};
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

const PoliticianLinksWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  p {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    padding-top: 18px;
    margin: 0;
  }
`;

const ViewBallotButtonWrapper = styled('div')`
  display: flex;
  height: 50px;
  justify-content: center;
  margin-top: 0;
  margin-bottom: 80px;
`;

export default withStyles(styles)(PoliticianDetailsPage);
