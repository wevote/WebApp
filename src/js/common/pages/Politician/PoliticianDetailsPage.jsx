import styled from 'styled-components';
import { Launch } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import {
  CampaignDescription, CampaignDescriptionDesktop, CampaignDescriptionWrapper,
  CampaignDescriptionDesktopWrapper, CampaignImagePlaceholder, CampaignImagePlaceholderText,
  CampaignImageDesktopWrapper, CampaignImageMobileWrapper,
  CampaignOwnersDesktopWrapper, CampaignOwnersWrapper, CampaignSubSectionTitle,
  CampaignTitleAndScoreBar, CommentsListWrapper,
  DetailsSectionDesktopTablet, DetailsSectionMobile,
  SupportButtonFooterWrapper, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import {
  CandidateCampaignListDesktop, CandidateCampaignListMobile, CandidateCampaignWrapper,
  OfficeHeldNameDesktop, OfficeHeldNameMobile,
  PoliticianImageDesktop, PoliticianImageDesktopPlaceholder,
  PoliticianImageMobile, PoliticianImageMobilePlaceholder,
  PoliticianNameMobile, PoliticianNameDesktop, PoliticianNameOuterWrapperDesktop,
} from '../../components/Style/PoliticianDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import OfficeHeldNameText from '../../components/Widgets/OfficeHeldNameText';
// import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import returnFirstXWords from '../../utils/returnFirstXWords';
import CampaignOwnersList from '../../components/CampaignSupport/CampaignOwnersList';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import { EditIndicator, ElectionInPast, IndicatorButtonWrapper, IndicatorRow } from '../../components/Style/CampaignIndicatorStyles';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import CandidateStore from '../../../stores/CandidateStore';
import OfficeHeldStore from '../../../stores/OfficeHeldStore';
import PoliticianStore from '../../stores/PoliticianStore';
import RepresentativeStore from '../../../stores/RepresentativeStore';
import { convertStateCodeToStateText } from '../../utils/addressFunctions';
import { getYearFromUltimateElectionDate } from '../../utils/dateFormat';
import { getPoliticianValuesFromIdentifiers, retrievePoliticianFromIdentifiersIfNeeded } from '../../utils/politicianUtils';
import initializejQuery from '../../utils/initializejQuery';
import { displayNoneIfSmallerThanDesktop } from '../../utils/isMobileScreenSize';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import TwitterAccountStats from '../../../components/Widgets/TwitterAccountStats';
import SearchOnGoogle from '../../../components/Widgets/SearchOnGoogle';
import ViewOnBallotpedia from '../../../components/Widgets/ViewOnBallotpedia';
import ViewOnWikipedia from '../../../components/Widgets/ViewOnWikipedia';

// const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
// const CampaignDetailsActionSideBox = React.lazy(() => import(/* webpackChunkName: 'CampaignDetailsActionSideBox' */ '../../components/CampaignSupport/CampaignDetailsActionSideBox'));
// const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
// const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../components/Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../components/Widgets/OpenExternalWebSite'));
const PoliticianEndorsementsList = React.lazy(() => import(/* webpackChunkName: 'PoliticianEndorsementsList' */ '../../components/Politician/PoliticianEndorsementsList'));
const PoliticianRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianRetrieveController' */ '../../components/Politician/PoliticianRetrieveController'));
const PoliticianPositionRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianPositionRetrieveController' */ '../../components/Position/PoliticianPositionRetrieveController'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));


class PoliticianDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotpediaPoliticianUrl: '',
      politicianImageUrlLarge: '',
      politicianSEOFriendlyPath: '',
      politicianName: '',
      politicianWeVoteId: '',
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      officeHeldList: [],
      // inPrivateLabelMode: false,
      pathToUseWhenProfileComplete: '',
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      stateText: '',
      step2Completed: false,
      voterCanEditThisPolitician: false,
      wikipediaUrl: '',
      youtubeUrl: '',
    };
  }

  componentDidMount () {
    // console.log('PoliticianDetailsPage componentDidMount');
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath, politicianWeVoteId } = params;
    // console.log('componentDidMount politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.onCandidateStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onOfficeHeldStoreChange();
    this.officeHeldStoreListener = OfficeHeldStore.addListener(this.onOfficeHeldStoreChange.bind(this));
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.onRepresentativeStoreChange();
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    let pathToUseWhenProfileComplete;
    if (politicianSEOFriendlyPath) {
      this.setState({
        politicianSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${politicianSEOFriendlyPath}/why-do-you-support`;
    } else {
      this.setState({
        politicianWeVoteId,
      });
      pathToUseWhenProfileComplete = `/id/${politicianWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseWhenProfileComplete,
    });
    // Take the "calculated" identifiers and retrieve if missing
    retrievePoliticianFromIdentifiersIfNeeded(politicianSEOFriendlyPath, politicianWeVoteId);
    window.scrollTo(0, 0);
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

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      chosenWebsiteName,
      // inPrivateLabelMode,
      payToPromoteStepTurnedOn,
    });
  }

  onCampaignSupporterStoreChange () {
    const { politicianWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(politicianWeVoteId);
    const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(politicianWeVoteId);
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange step2Completed: ', step2Completed, ', sharingStepCompleted: ', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
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
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromParams, politicianWeVoteId: politicianWeVoteIdFromParams } = params;
    // console.log('onPoliticianStoreChange politicianSEOFriendlyPathFromParams: ', politicianSEOFriendlyPathFromParams, ', politicianWeVoteIdFromParams: ', politicianWeVoteIdFromParams);
    const {
      ballotpediaPoliticianUrl,
      candidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      politicianDescription,
      politicianImageUrlLarge,
      politicianSEOFriendlyPath,
      politicianName,
      politicianUrl,
      politicianWeVoteId,
      stateCode,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      youtubeUrl,
    } = getPoliticianValuesFromIdentifiers(politicianSEOFriendlyPathFromParams, politicianWeVoteIdFromParams);
    let pathToUseWhenProfileComplete;
    if (politicianSEOFriendlyPath) {
      this.setState({
        politicianSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${politicianSEOFriendlyPath}/why-do-you-support`;
    } else if (politicianWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${politicianWeVoteId}/why-do-you-support`;
    }
    if (politicianWeVoteId) {
      const voterCanEditThisPolitician = PoliticianStore.getVoterCanEditThisPolitician(politicianWeVoteId);
      const voterSupportsThisPolitician = PoliticianStore.getVoterSupportsThisPolitician(politicianWeVoteId);
      this.setState({
        politicianWeVoteId,
        voterCanEditThisPolitician,
        voterSupportsThisPolitician,
      }, () => this.onCandidateStoreChange());
    }
    const politicianDescriptionLimited = returnFirstXWords(politicianDescription, 200);
    const filteredCandidateCampaignList = candidateCampaignList.sort(this.orderCandidatesByUltimateDate);
    let stateText = '';
    if (stateCode) {
      stateText = convertStateCodeToStateText(stateCode);
    }
    this.setState({
      ballotpediaPoliticianUrl,
      candidateCampaignList: filteredCandidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      politicianDescription,
      politicianDescriptionLimited,
      politicianImageUrlLarge,
      politicianName,
      politicianUrl,
      pathToUseWhenProfileComplete,
      stateText,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      youtubeUrl,
    });
  }

  onRepresentativeStoreChange () {
    //
  }

  orderCandidatesByUltimateDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  getPoliticianBasePath = () => {
    const { politicianSEOFriendlyPath, politicianWeVoteId } = this.state;
    let politicianBasePath;
    if (politicianSEOFriendlyPath) {
      politicianBasePath = `/c/${politicianSEOFriendlyPath}`;
    } else {
      politicianBasePath = `/id/${politicianWeVoteId}`;
    }

    return politicianBasePath;
  }

  goToNextPage = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
    return null;
  }

  functionToUseToKeepHelping = () => {
    const { finalElectionDateInPast, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log('functionToUseToKeepHelping sharingStepCompleted:', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted, ', step2Completed:', step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, finalElectionDateInPast);
    historyPush(`${this.getPoliticianBasePath()}/${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete = () => {
    const { politicianWeVoteId } = this.state;
    const politicianSupported = true;
    const politicianSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('functionToUseWhenProfileComplete, blockCampaignXRedirectOnSignIn:', AppObservableStore.blockCampaignXRedirectOnSignIn());
    const saveVisibleToPublic = true;
    if (!AppObservableStore.blockCampaignXRedirectOnSignIn()) {
      initializejQuery(() => {
        CampaignSupporterActions.supportCampaignSave(politicianWeVoteId, politicianSupported, politicianSupportedChanged, visibleToPublic, saveVisibleToPublic);
      }, this.goToNextPage());
    }
  }

  onPoliticianEditClick = () => {
    const { politicianSEOFriendlyPath, politicianWeVoteId } = this.state;
    // console.log('politician:', politician);
    if (politicianSEOFriendlyPath) {
      historyPush(`/c/${politicianSEOFriendlyPath}/edit`);
    } else {
      historyPush(`/id/${politicianWeVoteId}/edit`);
    }
    return null;
  }

  onPoliticianShareClick = () => {
    const { politicianSEOFriendlyPath, politicianWeVoteId } = this.state;
    if (politicianSEOFriendlyPath) {
      historyPush(`/c/${politicianSEOFriendlyPath}/share-politician`);
    } else {
      historyPush(`/id/${politicianWeVoteId}/share-politician`);
    }
    return null;
  }

  render () {
    renderLog('PoliticianDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders

    const {
      allCachedPositionsForThisPolitician, ballotpediaPoliticianUrl, candidateCampaignList, chosenWebsiteName,
      finalElectionDateInPast,
      officeHeldList, officeHeldNameForSearch,
      politicianDescription, politicianDescriptionLimited, politicianImageUrlLarge,
      politicianSEOFriendlyPath, politicianName, politicianUrl, politicianWeVoteId,
      stateText, twitterHandle, twitterHandle2, twitterFollowersCount,
      voterCanEditThisPolitician, voterSupportsThisPolitician,
      wikipediaUrl, // youtubeUrl,
    } = this.state;
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
    let priorCandidateCampaignsHtml = '';
    if (candidateCampaignList && candidateCampaignList.length > 0) {
      let contestOfficeName;
      let districtName;
      let year;
      const yearsAndNamesAlreadySeen = [];
      const candidateCampaignListFiltered = candidateCampaignList.filter((candidateCampaign) => {
        contestOfficeName = candidateCampaign.contest_office_name;
        if (!contestOfficeName) {
          if (candidateCampaign.contest_office_list) {
            contestOfficeName = candidateCampaign.contest_office_list[0].contest_office_name;
          }
        }
        year = getYearFromUltimateElectionDate(candidateCampaign.candidate_ultimate_election_date);
        const candidateCampaignYearAndName = `${year}-${contestOfficeName}`;
        // console.log('candidateCampaignYearAndName: ', candidateCampaignYearAndName);
        if (yearsAndNamesAlreadySeen.indexOf(candidateCampaignYearAndName) === -1) {
          yearsAndNamesAlreadySeen.push(candidateCampaignYearAndName);
          return candidateCampaign;
        } else {
          return null;
        }
      });
      // console.log('candidateCampaignListFiltered: ', candidateCampaignListFiltered);
      priorCandidateCampaignsHtml = candidateCampaignListFiltered.map((candidateCampaign) => {
        const key = `candidateCampaign-${candidateCampaign.we_vote_id}`;
        contestOfficeName = candidateCampaign.contest_office_name;
        if (!contestOfficeName) {
          if (candidateCampaign.contest_office_list) {
            contestOfficeName = candidateCampaign.contest_office_list[0].contest_office_name;
          }
        }
        if (candidateCampaign.contest_office_list) {
          districtName = candidateCampaign.contest_office_list[0].district_name;
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
    let positionListTeaserHtml = <></>;
    if (allCachedPositionsForThisPolitician && allCachedPositionsForThisPolitician.length > 0) {
      positionListTeaserHtml = (
        <CommentsListWrapper>
          <DelayedLoad waitBeforeShow={1000}>
            <Suspense fallback={<span>&nbsp;</span>}>
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
              <PoliticianEndorsementsList politicianWeVoteId={politicianWeVoteId} startingNumberOfPositionsToDisplay={2} />
            </Suspense>
          </DelayedLoad>
        </CommentsListWrapper>
      );
    }
    return (
      <PageContentContainer>
        <Suspense fallback={<span>&nbsp;</span>}>
          <PoliticianRetrieveController politicianSEOFriendlyPath={politicianSEOFriendlyPath} politicianWeVoteId={politicianWeVoteId} />
        </Suspense>
        {!!(politicianWeVoteId) && (
          <Suspense fallback={<span>&nbsp;</span>}>
            <PoliticianPositionRetrieveController politicianWeVoteId={politicianWeVoteId} />
          </Suspense>
        )}
        <Helmet>
          <title>{htmlTitle}</title>
          <meta
            name="description"
            content={politicianDescriptionLimited}
          />
        </Helmet>
        <PageWrapper>
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageMobileWrapper>
              {politicianImageUrlLarge ? (
                <PoliticianImageMobilePlaceholder limitCardWidth>
                  <PoliticianImageMobile src={politicianImageUrlLarge} alt="Politician" />
                </PoliticianImageMobilePlaceholder>
              ) : (
                <DelayedLoad waitBeforeShow={1000}>
                  <CampaignImagePlaceholder>
                    <CampaignImagePlaceholderText>
                      No image provided
                    </CampaignImagePlaceholderText>
                  </CampaignImagePlaceholder>
                </DelayedLoad>
              )}
            </CampaignImageMobileWrapper>
            <CampaignTitleAndScoreBar>
              <PoliticianNameMobile>{politicianName}</PoliticianNameMobile>
              {officeHeldList.length > 0 && (
                <OfficeHeldNameMobile>
                  { officeHeldList.map((officeHeld) => (
                    <OfficeHeldNameText
                      districtName={officeHeld.district_name}
                      key={officeHeld.office_held_we_vote_id}
                      officeName={officeHeld.office_held_name}
                      politicalParty={officeHeld.political_party}
                    />
                  ))}
                </OfficeHeldNameMobile>
              )}
              {/*
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer politicianWeVoteId={politicianWeVoteId} />
              </Suspense>
              */}
              <CampaignOwnersWrapper>
                <CampaignOwnersList politicianWeVoteId={politicianWeVoteId} />
              </CampaignOwnersWrapper>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {politicianDescription}
              </CampaignDescription>
              {politicianLinks}
              {politicianButtons}
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
                      <EditIndicator onClick={this.onPoliticianEditClick}>
                        Edit Politician
                      </EditIndicator>
                    </IndicatorButtonWrapper>
                  )}
                  {voterSupportsThisPolitician && (
                    <IndicatorButtonWrapper>
                      <EditIndicator onClick={this.onPoliticianShareClick}>
                        Share Politician
                      </EditIndicator>
                    </IndicatorButtonWrapper>
                  )}
                </IndicatorRow>
              )}
            </CampaignDescriptionWrapper>
            {positionListTeaserHtml}
            {/*
            <CommentsListWrapper>
              <DelayedLoad waitBeforeShow={1000}>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSubSectionTitle>
                    Reasons for supporting
                  </CampaignSubSectionTitle>
                  <CampaignCommentsList politicianWeVoteId={politicianWeVoteId} startingNumberOfCommentsToDisplay={2} />
                </Suspense>
              </DelayedLoad>
            </CommentsListWrapper>
            */}
            {/*
            <CommentsListWrapper>
              <DelayedLoad waitBeforeShow={1000}>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSubSectionTitle>
                    Updates
                  </CampaignSubSectionTitle>
                  <CampaignNewsItemList
                    politicianWeVoteId={politicianWeVoteId}
                    politicianSEOFriendlyPath={politicianSEOFriendlyPath}
                    showAddNewsItemIfNeeded
                    startingNumberOfCommentsToDisplay={1}
                  />
                </Suspense>
              </DelayedLoad>
            </CommentsListWrapper>
            */}
            {candidateCampaignList && candidateCampaignList.length > 0 && (
              <CandidateCampaignListMobile>
                <CampaignSubSectionTitle>
                  Previous Elections
                </CampaignSubSectionTitle>
                {priorCandidateCampaignsHtml}
              </CandidateCampaignListMobile>
            )}
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <PoliticianNameOuterWrapperDesktop>
              <PoliticianNameDesktop>{politicianName}</PoliticianNameDesktop>
              {officeHeldList.length > 0 && (
                <OfficeHeldNameDesktop>
                  { officeHeldList.map((officeHeld) => (
                    <OfficeHeldNameText
                      districtName={officeHeld.district_name}
                      key={officeHeld.office_held_we_vote_id}
                      officeName={officeHeld.office_held_name}
                      politicalParty={officeHeld.political_party}
                    />
                  ))}
                </OfficeHeldNameDesktop>
              )}
            </PoliticianNameOuterWrapperDesktop>
            <ColumnsWrapper>
              <ColumnTwoThirds>
                <CampaignImageDesktopWrapper>
                  {politicianImageUrlLarge ? (
                    <PoliticianImageDesktopPlaceholder limitCardWidth>
                      <PoliticianImageDesktop src={politicianImageUrlLarge} alt="Politician" />
                    </PoliticianImageDesktopPlaceholder>
                  ) : (
                    <DelayedLoad waitBeforeShow={1000}>
                      <CampaignImagePlaceholder>
                        <CampaignImagePlaceholderText>
                          No image provided
                        </CampaignImagePlaceholderText>
                      </CampaignImagePlaceholder>
                    </DelayedLoad>
                  )}
                </CampaignImageDesktopWrapper>
                <CampaignOwnersDesktopWrapper>
                  <CampaignOwnersList politicianWeVoteId={politicianWeVoteId} />
                </CampaignOwnersDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {politicianDescription}
                  </CampaignDescriptionDesktop>
                  {politicianLinks}
                  {politicianButtons}
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
                        <EditIndicator onClick={this.onPoliticianEditClick}>
                          Edit This Politician
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    </IndicatorRow>
                  )}
                </CampaignDescriptionDesktopWrapper>
                {positionListTeaserHtml}
                {/*
                <CommentsListWrapper>
                  <DelayedLoad waitBeforeShow={500}>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignSubSectionTitle>
                        Reasons for supporting
                      </CampaignSubSectionTitle>
                      <CampaignCommentsList politicianWeVoteId={politicianWeVoteId} startingNumberOfCommentsToDisplay={2} />
                    </Suspense>
                  </DelayedLoad>
                </CommentsListWrapper>
                */}
              </ColumnTwoThirds>
              <ColumnOneThird>
                {/*
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer politicianWeVoteId={politicianWeVoteId} finalElectionDateInPast={finalElectionDateInPast} />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignDetailsActionSideBox
                    politicianSEOFriendlyPath={politicianSEOFriendlyPath}
                    politicianWeVoteId={politicianWeVoteId}
                    finalElectionDateInPast={finalElectionDateInPast}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                  />
                </Suspense>
                */}
                {/*
                <CommentsListWrapper>
                  <DelayedLoad waitBeforeShow={500}>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignSubSectionTitle>
                        Updates
                      </CampaignSubSectionTitle>
                      <CampaignNewsItemList
                        politicianWeVoteId={politicianWeVoteId}
                        politicianSEOFriendlyPath={politicianSEOFriendlyPath}
                        showAddNewsItemIfNeeded
                        startingNumberOfCommentsToDisplay={1}
                      />
                    </Suspense>
                  </DelayedLoad>
                </CommentsListWrapper>
                */}
                {candidateCampaignList && candidateCampaignList.length > 0 && (
                  <CandidateCampaignListDesktop>
                    <CampaignSubSectionTitle>
                      Previous Elections
                    </CampaignSubSectionTitle>
                    {priorCandidateCampaignsHtml}
                  </CandidateCampaignListDesktop>
                )}
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapper className="u-show-mobile">
          {!finalElectionDateInPast && (
            <SupportButtonPanel>
              <Suspense fallback={<span>&nbsp;</span>}>
                <SupportButtonBeforeCompletionScreen
                  politicianSEOFriendlyPath={politicianSEOFriendlyPath}
                  politicianWeVoteId={politicianWeVoteId}
                  functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                  functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                />
              </Suspense>
            </SupportButtonPanel>
          )}
        </SupportButtonFooterWrapper>
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
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

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

const ExternalWebSiteWrapper = styled('div')`
  margin-top: 3px;
  padding-left: 15px;
  white-space: nowrap;
  // ${() => displayNoneIfSmallerThanDesktop()};
`;

const PoliticianLinksWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
`;

const TwitterWrapper = styled('div')`
  margin-right: 20px;
`;

export default withStyles(styles)(PoliticianDetailsPage);
