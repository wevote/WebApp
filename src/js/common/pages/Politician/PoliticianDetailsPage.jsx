import styled from 'styled-components';
import { PersonSearch, Launch } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';
import {
  CampaignDescription, CampaignDescriptionDesktop, CampaignDescriptionWrapper,
  CampaignDescriptionDesktopWrapper, CampaignImagePlaceholder, CampaignImagePlaceholderText,
  CampaignImageDesktopWrapper, CampaignImageMobileWrapper,
  CampaignOwnersDesktopWrapper, CampaignSubSectionSeeAll, CampaignSubSectionTitle, CampaignSubSectionTitleWrapper,  // CampaignOwnersWrapper
  CampaignTitleAndScoreBar, CommentsListWrapper,
  DetailsSectionDesktopTablet, DetailsSectionMobile, OtherElectionsWrapper,
  SupportButtonFooterWrapperAboveFooterButtons, SupportButtonPanel,
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
import OfficeHeldStore from '../../stores/OfficeHeldStore';
import PoliticianStore from '../../stores/PoliticianStore';
import RepresentativeStore from '../../../stores/RepresentativeStore';
import { convertStateCodeToStateText } from '../../utils/addressFunctions';
import { getYearFromUltimateElectionDate } from '../../utils/dateFormat';
import { getPoliticianValuesFromIdentifiers, retrievePoliticianFromIdentifiersIfNeeded } from '../../utils/politicianUtils';
import { displayNoneIfSmallerThanDesktop } from '../../utils/isMobileScreenSize';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import TwitterAccountStats from '../../../components/Widgets/TwitterAccountStats';
import SearchOnGoogle from '../../components/Widgets/SearchOnGoogle';
import ViewOnBallotpedia from '../../components/Widgets/ViewOnBallotpedia';
import ViewOnWikipedia from '../../components/Widgets/ViewOnWikipedia';
import webAppConfig from '../../../config';

const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignDetailsActionSideBox = React.lazy(() => import(/* webpackChunkName: 'CampaignDetailsActionSideBox' */ '../../components/CampaignSupport/CampaignDetailsActionSideBox'));
const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../components/Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../components/Widgets/OpenExternalWebSite'));
const PoliticianEndorsementsList = React.lazy(() => import(/* webpackChunkName: 'PoliticianEndorsementsList' */ '../../components/Politician/PoliticianEndorsementsList'));
const PoliticianRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianRetrieveController' */ '../../components/Politician/PoliticianRetrieveController'));
const PoliticianPositionRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianPositionRetrieveController' */ '../../components/Position/PoliticianPositionRetrieveController'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));

const futureFeaturesDisabled = true;
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


class PoliticianDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotpediaPoliticianUrl: '',
      supporterEndorsementsWithText: [],
      politicalParty: '',
      politicianImageUrlLarge: '',
      politicianSEOFriendlyPath: '',
      politicianName: '',
      politicianWeVoteId: '',
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      officeHeldList: [],
      // inPrivateLabelMode: false,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      stateText: '',
      step2Completed: false,
      voterCanEditThisPolitician: false,
      wikipediaUrl: '',
      // youtubeUrl: '',
    };
  }

  componentDidMount () {
    // console.log('PoliticianDetailsPage componentDidMount');
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath, politicianWeVoteId } = params;
    // console.log('componentDidMount politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.officeHeldStoreListener = OfficeHeldStore.addListener(this.onOfficeHeldStoreChange.bind(this));
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.onRepresentativeStoreChange();
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    if (politicianSEOFriendlyPath) {
      const politician = PoliticianStore.getPoliticianBySEOFriendlyPath(politicianSEOFriendlyPath);
      if (politician && politician.politician_we_vote_id) {
        this.setState({
          linkedCampaignXWeVoteId: politician.linked_campaignx_we_vote_id,
          politicianWeVoteId: politician.politician_we_vote_id,
        }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
      }
      this.setState({
        politicianSEOFriendlyPath,
      });
    } else if (politicianWeVoteId) {
      this.setState({
        politicianWeVoteId,
      });
    }
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

  onfirstRetrievalOfPoliticianWeVoteId () {
    this.onCampaignSupporterStoreChange();
    this.onCandidateStoreChange();
    this.onOfficeHeldStoreChange();
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
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromParams, politicianWeVoteId: politicianWeVoteIdFromParams } = params;
    // console.log('onPoliticianStoreChange politicianSEOFriendlyPathFromParams: ', politicianSEOFriendlyPathFromParams, ', politicianWeVoteIdFromParams: ', politicianWeVoteIdFromParams);
    const {
      ballotpediaPoliticianUrl,
      candidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      linkedCampaignXWeVoteId,
      politicalParty,
      politicianDescription,
      politicianImageUrlLarge,
      // politicianSEOFriendlyPath,
      politicianName,
      politicianUrl,
      politicianWeVoteId,
      stateCode,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
      wikipediaUrl,
      // youtubeUrl,
    } = getPoliticianValuesFromIdentifiers(politicianSEOFriendlyPathFromParams, politicianWeVoteIdFromParams);
    if (politicianWeVoteId) {
      const voterCanEditThisPolitician = PoliticianStore.getVoterCanEditThisPolitician(politicianWeVoteId);
      const voterSupportsThisPolitician = PoliticianStore.getVoterSupportsThisPolitician(politicianWeVoteId);
      this.setState({
        politicianWeVoteId,
        voterCanEditThisPolitician,
        voterSupportsThisPolitician,
      }, () => this.onfirstRetrievalOfPoliticianWeVoteId());
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
      linkedCampaignXWeVoteId,
      politicalParty,
      politicianDescription,
      politicianDescriptionLimited,
      politicianImageUrlLarge,
      politicianName,
      politicianUrl,
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

  orderCandidatesByUltimateDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  getCampaignXBasePath = () => {
    const { linkedCampaignXWeVoteId } = this.state;
    // let campaignXBasePath;
    // if (politicianSEOFriendlyPath) {
    //   campaignXBasePath = `/c/${politicianSEOFriendlyPath}`;
    // } else {
    //   campaignXBasePath = `/id/${campaignXWeVoteId}`;
    // }
    // return campaignXBasePath;
    return `/id/${linkedCampaignXWeVoteId}`;
  }

  getPoliticianBasePath = () => {
    const { politicianSEOFriendlyPath, politicianWeVoteId } = this.state;
    let politicianBasePath;
    if (politicianSEOFriendlyPath) {
      politicianBasePath = `/${politicianSEOFriendlyPath}/-`;
    } else {
      politicianBasePath = `/${politicianWeVoteId}/p`;
    }

    return politicianBasePath;
  }

  functionToUseToKeepHelping = () => {
    const { finalElectionDateInPast, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log('functionToUseToKeepHelping sharingStepCompleted:', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted, ', step2Completed:', step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, finalElectionDateInPast);
    historyPush(`${this.getCampaignXBasePath()}/${keepHelpingDestinationString}`);
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
    historyPush(`${this.getCampaignXBasePath()}/edit`);
    return null;
  }

  onPoliticianCampaignShareClick = () => {
    historyPush(`${this.getCampaignXBasePath()}/share-politician`);
    return null;
  }

  render () {
    renderLog('PoliticianDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const {
      allCachedPositionsForThisPolitician, ballotpediaPoliticianUrl, candidateCampaignList, chosenWebsiteName,
      supporterEndorsementsWithText, finalElectionDateInPast, linkedCampaignXWeVoteId,
      officeHeldList, officeHeldNameForSearch, politicalParty,
      politicianDescription, politicianDescriptionLimited, politicianImageUrlLarge,
      politicianSEOFriendlyPath, politicianName, politicianUrl, politicianWeVoteId,
      stateText, twitterHandle, twitterHandle2, twitterFollowersCount,
      voterCanEditThisPolitician, voterSupportsThisPolitician,
      wikipediaUrl, // youtubeUrl,
    } = this.state;

    const politicianDataNotFound = false;
    if (politicianDataNotFound) {
      return (
        <PageContentContainer>
          <Helmet title="Candidate Not Found - We Vote" />
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
    let positionListTeaserHtml = <></>;
    if (allCachedPositionsForThisPolitician && allCachedPositionsForThisPolitician.length > 0) {
      positionListTeaserHtml = (
        <CommentsListWrapper>
          <DelayedLoad waitBeforeShow={1000}>
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
                    <Link to={`${this.getCampaignXBasePath()}/updates`} className="u-link-color">
                      See all
                    </Link>
                  </CampaignSubSectionSeeAll>
                ) */}
              </CampaignSubSectionTitleWrapper>
              <PoliticianEndorsementsList
                politicianWeVoteId={politicianWeVoteId}
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
          <DelayedLoad waitBeforeShow={1500}>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignSubSectionTitleWrapper>
                <CampaignSubSectionTitle>
                  Reasons for supporting
                </CampaignSubSectionTitle>
                {!!(this.getCampaignXBasePath()) && (
                  <CampaignSubSectionSeeAll>
                    <Link
                      to={`${this.getCampaignXBasePath()}/comments`}
                      className="u-link-color"
                    >
                      See all
                    </Link>
                  </CampaignSubSectionSeeAll>
                )}
              </CampaignSubSectionTitleWrapper>
              <CampaignCommentsList
                campaignXWeVoteId={linkedCampaignXWeVoteId}
                politicianWeVoteId={politicianWeVoteId}
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
                <CampaignOwnersList politicianWeVoteId={politicianWeVoteId} />
              </CampaignOwnersWrapper>
              */}
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
            {commentListTeaserHtml}
            {(!futureFeaturesDisabled && nextReleaseFeaturesEnabled) && (
              <CommentsListWrapper>
                <DelayedLoad waitBeforeShow={1000}>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <CampaignSubSectionTitleWrapper>
                      <CampaignSubSectionTitle>
                        Updates
                      </CampaignSubSectionTitle>
                      {!!(this.getCampaignXBasePath()) && (
                        <CampaignSubSectionSeeAll>
                          <Link to={`${this.getCampaignXBasePath()}/updates`} className="u-link-color">
                            See all
                          </Link>
                        </CampaignSubSectionSeeAll>
                      )}
                    </CampaignSubSectionTitleWrapper>
                    <CampaignNewsItemList
                      politicianWeVoteId={politicianWeVoteId}
                      politicianSEOFriendlyPath={politicianSEOFriendlyPath}
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
                        <EditIndicator onClick={this.onPoliticianCampaignEditClick}>
                          Edit This Politician
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    </IndicatorRow>
                  )}
                </CampaignDescriptionDesktopWrapper>
                {positionListTeaserHtml}
                {commentListTeaserHtml}
              </ColumnTwoThirds>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer campaignXWeVoteId={linkedCampaignXWeVoteId} finalElectionDateInPast={finalElectionDateInPast} />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignDetailsActionSideBox
                    campaignXWeVoteId={linkedCampaignXWeVoteId}
                    finalElectionDateInPast={finalElectionDateInPast}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                    politicianSEOFriendlyPath={politicianSEOFriendlyPath}
                    politicianWeVoteId={politicianWeVoteId}
                  />
                </Suspense>
                {(!futureFeaturesDisabled && nextReleaseFeaturesEnabled) && (
                  <CommentsListWrapper>
                    <DelayedLoad waitBeforeShow={500}>
                      <Suspense fallback={<span>&nbsp;</span>}>
                        <CampaignSubSectionTitleWrapper>
                          <CampaignSubSectionTitle>
                            Updates
                          </CampaignSubSectionTitle>
                          {!!(this.getCampaignXBasePath()) && (
                            <CampaignSubSectionSeeAll>
                              <Link to={`${this.getCampaignXBasePath()}/updates`} className="u-link-color">
                                See all
                              </Link>
                            </CampaignSubSectionSeeAll>
                          )}
                        </CampaignSubSectionTitleWrapper>
                        <CampaignNewsItemList
                          politicianWeVoteId={politicianWeVoteId}
                          politicianSEOFriendlyPath={politicianSEOFriendlyPath}
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
