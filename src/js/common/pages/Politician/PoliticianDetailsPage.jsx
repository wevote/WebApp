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
  CampaignTitleAndScoreBar,
  // CommentsListWrapper,
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

// const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
// const CampaignDetailsActionSideBox = React.lazy(() => import(/* webpackChunkName: 'CampaignDetailsActionSideBox' */ '../../components/CampaignSupport/CampaignDetailsActionSideBox'));
// const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
// const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../components/Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../components/Widgets/OpenExternalWebSite'));
const PoliticianRetrieveController = React.lazy(() => import(/* webpackChunkName: 'PoliticianRetrieveController' */ '../../components/Politician/PoliticianRetrieveController'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));


class PoliticianDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
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
      step2Completed: false,
      voterCanEditThisPolitician: false,
    };
  }

  componentDidMount () {
    // console.log('PoliticianDetailsPage componentDidMount');
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath, politicianWeVoteId } = params;
    // console.log('componentDidMount politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onOfficeHeldStoreChange();
    this.OfficeHeldStoreListener = OfficeHeldStore.addListener(this.onOfficeHeldStoreChange.bind(this));
    this.onPoliticianStoreChange();
    this.PoliticianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.politicianSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.onRepresentativeStoreChange();
    this.RepresentativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
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
    this.OfficeHeldStoreListener.remove();
    this.PoliticianStoreListener.remove();
    this.RepresentativeStoreListener.remove();
    this.politicianSupporterStoreListener.remove();
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

  onOfficeHeldStoreChange () {
    const { politicianWeVoteId } = this.state;
    const officeHeldList = OfficeHeldStore.getOfficeHeldListByPoliticianWeVoteId(politicianWeVoteId);
    const officeHeldListFiltered = [];
    const districtNameAlreadySeenList = [];
    const officeHeldNamesNotAllowedList = ['legislatorLowerBody'];
    for (let i = 0; i < officeHeldList.length; i += 1) {
      const officeHeld = officeHeldList[i];
      if (!(districtNameAlreadySeenList.includes(officeHeld.district_name) && !officeHeldNamesNotAllowedList.includes(officeHeld.office_held_name))) {
        districtNameAlreadySeenList.push(officeHeld.district_name);
        officeHeldListFiltered.push(officeHeld);
      }
    }
    this.setState({
      officeHeldList: officeHeldListFiltered,
    });
  }

  onPoliticianStoreChange () {
    const { match: { params } } = this.props;
    const { politicianSEOFriendlyPath: politicianSEOFriendlyPathFromParams, politicianWeVoteId: politicianWeVoteIdFromParams } = params;
    // console.log('onPoliticianStoreChange politicianSEOFriendlyPathFromParams: ', politicianSEOFriendlyPathFromParams, ', politicianWeVoteIdFromParams: ', politicianWeVoteIdFromParams);
    const {
      candidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      politicianDescription,
      politicianImageUrlLarge,
      politicianSEOFriendlyPath,
      politicianName,
      politicianUrl,
      politicianWeVoteId,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
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
      });
    }
    const politicianDescriptionLimited = returnFirstXWords(politicianDescription, 200);
    const filteredCandidateCampaignList = candidateCampaignList.sort(this.orderCandidatesByUltimateDate);
    this.setState({
      candidateCampaignList: filteredCandidateCampaignList,
      finalElectionDateInPast,
      // isSupportersCountMinimumExceeded,
      politicianDescription,
      politicianDescriptionLimited,
      politicianImageUrlLarge,
      politicianName,
      politicianUrl,
      pathToUseWhenProfileComplete,
      twitterFollowersCount,
      twitterHandle,
      twitterHandle2,
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
      candidateCampaignList, chosenWebsiteName,
      finalElectionDateInPast,
      officeHeldList,
      politicianDescription, politicianDescriptionLimited, politicianImageUrlLarge,
      politicianSEOFriendlyPath, politicianName, politicianUrl, politicianWeVoteId,
      twitterHandle, twitterHandle2, twitterFollowersCount,
      voterCanEditThisPolitician, voterSupportsThisPolitician,
    } = this.state;
    // console.log('render isSupportersCountMinimumExceeded: ', isSupportersCountMinimumExceeded);
    const htmlTitle = `${politicianName} - ${chosenWebsiteName}`;
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
    let priorCandidateCampaignsHtml = '';
    if (candidateCampaignList && candidateCampaignList.length > 0) {
      let contestOfficeName;
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
        const showOfficeName = !!(contestOfficeName);
        const stateName = convertStateCodeToStateText(candidateCampaign.state_code);
        year = getYearFromUltimateElectionDate(candidateCampaign.candidate_ultimate_election_date);
        return (
          <CandidateCampaignWrapper key={key}>
            <OfficeNameText
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
    return (
      <PageContentContainer>
        <Suspense fallback={<span>&nbsp;</span>}>
          <PoliticianRetrieveController politicianSEOFriendlyPath={politicianSEOFriendlyPath} politicianWeVoteId={politicianWeVoteId} />
        </Suspense>
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
                      officeHeldName={officeHeld.office_held_name}
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
                      officeHeldName={officeHeld.office_held_name}
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
