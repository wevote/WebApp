import { Close } from '@mui/icons-material'; // Info
import { Box, Drawer, IconButton, Skeleton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import IssueActions from '../../actions/IssueActions';
import MeasureActions from '../../actions/MeasureActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import PoliticianActions from '../../common/actions/PoliticianActions';
import CampaignSupportThermometer from '../../common/components/CampaignSupport/CampaignSupportThermometer';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import apiCalming from '../../common/utils/apiCalming';
import convertToInteger from '../../common/utils/convertToInteger';
import { hasCordovaNotch, heightOfCordovaSpacer } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import stringContains from '../../common/utils/stringContains';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import CardForListBodySkeleton from '../../common/components/CardForListBodySkeleton';
import VoterPositionEntryAndDisplay from '../PositionItem/VoterPositionEntryAndDisplay';
import { Candidate, CandidateNameAndPartyWrapper, CandidateNameH4, CandidateParty, CandidateTopRow } from '../Style/BallotStyles';
import { DrawerHeaderAnimateDownInnerContainer, DrawerHeaderAnimateDownOuterContainer } from '../Style/drawerLayoutStyles';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

function OrganizationModalPoliticianCardSkeleton () {
  return (
    <CardForListBodySkeleton
      hideCardMargins
      hideItemActionBar
      limitCardWidth={false}
      showPoliticianOpenInNewWindow
      useVerticalCard
    />
  );
}

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../common/components/Campaign/CampaignRetrieveController'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const MeasureItem = React.lazy(() => import(/* webpackChunkName: 'MeasureItem' */ '../Ballot/MeasureItem'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const PoliticianCardForList = React.lazy(() => import(/* webpackChunkName: 'PoliticianCardForList' */ '../PoliticianListRoot/PoliticianCardForList'));
const PositionList = React.lazy(() => import(/* webpackChunkName: 'PositionList' */ '../Ballot/PositionList'));
const ScoreSummaryListController = React.lazy(() => import(/* webpackChunkName: 'ScoreSummaryListController' */ '../Widgets/ScoreDisplay/ScoreSummaryListController'));


class OrganizationModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItem: [],
      modalOpen: this.props.modalOpen,
      politicianWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      scrolledDown: false,
      unFurlPositions: false,
      // finalElectionDateInPast: false,
      voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce: {},
    };

    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
  }

  // Ids: options, friends

  componentDidMount () {
    // console.log('OrganizationModal componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    const { ballotItemWeVoteId } = this.props;
    // console.log('ballotItemWeVoteId:', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    this.setState({
      isCandidate,
      isMeasure,
    });
    setTimeout(() => {
      const drawer = document.querySelector('.MuiDrawer-paper');
      if (drawer) {
        drawer.addEventListener('scroll', this.handleScrolledDownDrawer);
      } else {
        console.log('Drawer element NOT found make timeout longer.');
      }
    }, 100);
    if (isCandidate) {
      const candidate = CandidateStore.getCandidateByWeVoteId(ballotItemWeVoteId);
      const {
        ballot_item_display_name: ballotItemDisplayName,
        contest_office_we_vote_id: officeWeVoteId,
        politician_we_vote_id: politicianWeVoteId,
        party: politicalParty,
        candidate_photo_url_large: politicianImageUrlLarge,
      } = candidate;
      // console.log('candidate:', candidate);
      PoliticianActions.politicianRetrieve(politicianWeVoteId);
      CandidateActions.candidateRetrieve(ballotItemWeVoteId);
      if (!this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        CandidateActions.positionListForBallotItemPublic(ballotItemWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (!this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
      const allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.setState({
        allCachedPositionsForThisBallotItem,
        ballotItemDisplayName,
        politicalParty,
        politicianImageUrlLarge,
      });
      AnalyticsActions.saveActionCandidate(VoterStore.electionId(), ballotItemWeVoteId);
    }
    if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      let ballotItemDisplayName = '';
      if (measure && measure.ballot_item_display_name) {
        ballotItemDisplayName = measure.ballot_item_display_name;
      }
      MeasureActions.measureRetrieve(ballotItemWeVoteId);
      if (!this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        MeasureActions.positionListForBallotItemPublic(ballotItemWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (!this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
      const allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.setState({
        allCachedPositionsForThisBallotItem,
        ballotItemDisplayName,
      });
      AnalyticsActions.saveActionMeasure(VoterStore.electionId(), ballotItemWeVoteId);
    }
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }

    // This puts too much strain on the browser
    // // We want to make sure we have all the position information so that comments show up
    // const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);
    //
    // if (voterGuidesForThisBallotItem) {
    //   voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
    //     // console.log('oneVoterGuide: ', oneVoterGuide);
    //     if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
    //       OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
    //     }
    //   });
    // }

    // IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    // IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }
    // window.addEventListener('scroll', this.handleWindowScroll);
    // window.addEventListener('resize', this.handleResizeLocal);

    this.setState({
      modalOpen: this.props.modalOpen,
    });
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.appStateSubscription.unsubscribe();
    AppObservableStore.setScrolledDownDrawer(false);
  }

  handleScrolledDownDrawer (evt) {
    const { scrollTop } = evt.target;
    if (scrollTop > 200 && !AppObservableStore.getScrolledDownDrawer()) {
      AppObservableStore.setScrolledDownDrawer(true);
    }
    if (scrollTop < 200 && AppObservableStore.getScrolledDownDrawer()) {
      AppObservableStore.setScrolledDownDrawer(false);
    }
  }

  onAppObservableStoreChange () {
    // console.log('OrganizationModal onAppObservableStoreChange getScrolledDownDrawer: ', AppObservableStore.getScrolledDownDrawer());
    this.setState({
      scrolledDown: AppObservableStore.getScrolledDownDrawer(),
    });
  }

  onScroll = () => {
    console.log('OrganizationModal onScroll: ', AppObservableStore.getScrolledDownDrawer());
    this.setState({
      scrolledDown: AppObservableStore.getScrolledDownDrawer(),
    });
  };

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const { isCandidate } = this.state;
    // console.log('Candidate onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (isCandidate) {
      const allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      // console.log('allCachedPositionsForThisBallotItem:', allCachedPositionsForThisBallotItem);
      const candidate = CandidateStore.getCandidateByWeVoteId(ballotItemWeVoteId);
      const {
        ballot_item_display_name: ballotItemDisplayName,
        google_civic_election_id: googleCivicElectionId,
        linked_campaignx_we_vote_id: linkedCampaignXWeVoteId,
        politician_we_vote_id: politicianWeVoteId,
        party: politicalParty,
      } = candidate;
      // console.log('OrganizationModal onCandidateStoreChange candidate:', candidate);
      if (googleCivicElectionId &&
        !VoterGuideStore.voterGuidesUpcomingFromFriendsStopped(googleCivicElectionId) &&
        !this.localVoterGuidesFromFriendsUpcomingHasBeenRetrievedOnce(googleCivicElectionId)
      ) {
        VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicElectionId);
        const { voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce } = this.state;
        const googleCivicElectionIdInteger = convertToInteger(googleCivicElectionId);
        voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce[googleCivicElectionIdInteger] = true;
        this.setState({
          voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce,
        });
      }
      // If politicianWeVoteId just became available (wasn't in store on mount), fetch politician data now
      if (politicianWeVoteId && politicianWeVoteId !== this.state.politicianWeVoteId) {
        PoliticianActions.politicianRetrieve(politicianWeVoteId);
      }
      this.setState({
        allCachedPositionsForThisBallotItem,
        ballotItemDisplayName,
        linkedCampaignXWeVoteId,
        politicianWeVoteId,
        politicalParty,
      });
    }
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const { isMeasure } = this.state;
    // console.log('Measure, onMeasureStoreChange');
    if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      let ballotItemDisplayName = '';
      if (measure && measure.ballot_item_display_name) {
        ballotItemDisplayName = measure.ballot_item_display_name;
      }
      const allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.setState({
        allCachedPositionsForThisBallotItem,
        ballotItemDisplayName,
      });
    }
  }

  // handleResizeLocal () {
  //   if (handleResize('Footer')) {
  //     // console.log('Footer handleResizeEntry update');
  //     this.updateCachedSiteVars();
  //   }
  // }

  showHiddenPositions = () => {
    this.setState({ unFurlPositions: true });
  };

  localPositionListHasBeenRetrievedOnce (ballotItemWeVoteId) {
    if (ballotItemWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[ballotItemWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (ballotItemWeVoteId) {
    if (ballotItemWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId];
    }
    return false;
  }

  localVoterGuidesFromFriendsUpcomingHasBeenRetrievedOnce (googleCivicElectionId) {
    const googleCivicElectionIdInteger = convertToInteger(googleCivicElectionId);
    if (googleCivicElectionIdInteger) {
      const { voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce } = this.state;
      return voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce[googleCivicElectionIdInteger];
    }
    return false;
  }

  closeOrganizationModal () {
    this.setState({ modalOpen: false });
    setTimeout(() => {
      // console.log('In OrganizationModal, toggleFunction fired');
      this.props.toggleFunction();
    }, 500);
  }

  render () {
    // console.log(this.props.candidate_we_vote_id);
    renderLog('OrganizationModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemWeVoteId, classes, hideBallotItemInfo, hidePositions, params } = this.props;
    const {
      allCachedPositionsForThisBallotItem, ballotItemDisplayName,
      isCandidate, isMeasure, linkedCampaignXWeVoteId, modalOpen,
      politicianWeVoteId, scrolledDown, unFurlPositions, politicalParty, politicianImageUrlLarge,
    } = this.state;
    const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');
    const avatarCompressed = 'card-main__avatar-compressed';
    return (
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        direction="left"
        id="organization-modal"
        onClose={this.closeOrganizationModal}
        open={modalOpen}
      >
        <CloseDrawerIconWrapperOrganization>
          <div>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              id="closeOrganizationModal"
              onClick={this.closeOrganizationModal}
              size="large"
            >
              <span className="u-cursor--pointer">
                <Close classes={{ root: classes.closeIcon }} />
              </span>
            </IconButton>
          </div>
        </CloseDrawerIconWrapperOrganization>
        <DrawerHeaderAnimateDownOuterContainer id="organizationModalHeaderContainer" scrolledDown={scrolledDown}>
          <DrawerHeaderAnimateDownInnerContainer>
            <CandidateTopRow>
              <Candidate
                id={`organizationModalCandidateImageAndName-${politicianWeVoteId}`}
              >
                <Suspense fallback={<Skeleton variant="circular" width={40} height={40} />}>
                  <ImageHandler
                    className={avatarCompressed}
                    sizeClassName="icon-candidate-small u-push--sm "
                    imageUrl={politicianImageUrlLarge}
                    alt=""
                    kind_of_ballot_item="CANDIDATE"
                    style={{ backgroundImage: { avatarBackgroundImage } }}
                  />
                </Suspense>
                <CandidateNameAndPartyWrapper>
                  <CandidateNameH4>
                    {ballotItemDisplayName}
                  </CandidateNameH4>
                  <CandidateParty>
                    {politicalParty}
                  </CandidateParty>
                </CandidateNameAndPartyWrapper>
              </Candidate>
              <CloseDrawerHeaderIconWrapper>
                <div>
                  <IconButton
                    aria-label="Close"
                    className={classes.closeButton}
                    id="closeOrganizationModal"
                    onClick={this.closeOrganizationModal}
                    size="large"
                  >
                    <span className="u-cursor--pointer">
                      <Close classes={{ root: classes.closeIcon }} />
                    </span>
                  </IconButton>
                </div>
              </CloseDrawerHeaderIconWrapper>
            </CandidateTopRow>
            <HeartToggleAndThermometerWrapper>
              <Suspense fallback={(
                <Box>
                  <Box display="flex" gap={1} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width={60} height={36} sx={{ borderRadius: 2 }} />
                    <Box flex={1} sx={{ minWidth: 0 }}>
                      <Skeleton variant="text" width="70%" height={18} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="50%" height={18} />
                    </Box>
                  </Box>
                  <Skeleton variant="rounded" width="100%" height={12} sx={{ borderRadius: 6 }} />
                </Box>
              )}>
                <CampaignSupportThermometer
                  campaignXWeVoteId={linkedCampaignXWeVoteId}
                />
              </Suspense>
            </HeartToggleAndThermometerWrapper>
          </DrawerHeaderAnimateDownInnerContainer>
        </DrawerHeaderAnimateDownOuterContainer>
        {(isCandidate && !hideBallotItemInfo) && (
          <PoliticianCardForListWrapper>
            <Suspense fallback={<OrganizationModalPoliticianCardSkeleton />}>
              <PoliticianCardForList
                hideCardMargins
                hideItemActionBar
                politicianWeVoteId={politicianWeVoteId}
                showPoliticianOpenInNewWindow
                useCampaignSupportThermometer
                useVerticalCard
              />
            </Suspense>
            <Suspense fallback={(
              <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 3 }} />
              </Box>
            )}>
              <IssuesByBallotItemDisplayList
                ballotItemDisplayName={ballotItemDisplayName}
                ballotItemWeVoteId={ballotItemWeVoteId}
                externalUniqueId={`candidateItem-${ballotItemWeVoteId}`}
              />
            </Suspense>
            <BallotItemBottomSpacer />
          </PoliticianCardForListWrapper>
        )}
        {(isMeasure && !hideBallotItemInfo) && (
          <Suspense fallback={<Skeleton variant="rounded" width="100%" height={150} sx={{ borderRadius: 2, maxWidth: 520 }} />}>
            <>
              <MeasureItem blockOnClickShowOrganizationModalWithPositions forMoreInformationTextOff measureWeVoteId={ballotItemWeVoteId} />
              <BallotItemBottomSpacer />
            </>
          </Suspense>
        )}
        { (!hidePositions || unFurlPositions) && (
          <>
            <Suspense fallback={(
              <Box sx={{ mb: 3 }}>
                <Skeleton variant="text" width="100%" height={40} />
                <Skeleton variant="text" width="100%" height={40} />
                <Skeleton variant="text" width="80%" height={40} />
              </Box>
            )}>
              <ScoreSummaryListController
                ballotItemDisplayName={ballotItemDisplayName || ''}
                ballotItemWeVoteId={ballotItemWeVoteId}
              />
            </Suspense>
            <ScoreSummaryListControllerBottomSpacer />
          </>
        )}
        <VoterPositionEntryAndDisplayWrapper>
          <VoterPositionEntryAndDisplay
            ballotItemWeVoteId={ballotItemWeVoteId}
            politicianWeVoteId={politicianWeVoteId}
          />
        </VoterPositionEntryAndDisplayWrapper>
        { !!(allCachedPositionsForThisBallotItem.length) && (
          <>
            { !hidePositions || unFurlPositions ? (
              <Suspense fallback={(
                <Box sx={{ mb: 3 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} display="flex" gap={1} alignItems="center" sx={{ mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box flex={1}>
                        <Skeleton variant="text" width="60%" height={16} />
                        <Skeleton variant="text" width="40%" height={14} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}>
                <DelayedLoad showLoadingText waitBeforeShow={500}>
                  <>
                    <Suspense fallback={(
                      <Box sx={{ mb: 3 }}>
                        {[1, 2, 3].map((i) => (
                          <Box key={i} display="flex" gap={1} alignItems="center" sx={{ mb: 2 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box flex={1}>
                              <Skeleton variant="text" width="60%" height={16} />
                              <Skeleton variant="text" width="40%" height={14} />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}>
                      <PositionList
                        ballotItemDisplayName={ballotItemDisplayName || ''}
                        incomingPositionList={allCachedPositionsForThisBallotItem}
                        linksOpenExternalWebsite
                        params={params}
                        // positionListExistsTitle={hideBallotItemInfo ? <></> : (
                        //   <PositionListIntroductionText>
                        //     <Info classes={{ root: classes.informationIcon }} />
                        //     Endorsements are below. Use these filters to sort:
                        //   </PositionListIntroductionText>
                        // )}
                      />
                    </Suspense>
                    <br />
                    <br />
                    <br />
                  </>
                </DelayedLoad>
              </Suspense>
            ) : (
              <ShowMoreWrapper>
                <ShowMoreButtons
                  showMoreId="showMorePositions"
                  showMoreButtonsLink={this.showHiddenPositions}
                  showMoreCustomText="show endorsements"
                />
              </ShowMoreWrapper>
            )}
          </>
        )}
        {!!(linkedCampaignXWeVoteId) && (
          <Suspense fallback={<Skeleton variant="rounded" width="100%" height={200} sx={{ borderRadius: 2 }} />}>
            <CampaignRetrieveController campaignXWeVoteId={linkedCampaignXWeVoteId} retrieveAsOwnerIfVoterSignedIn />
          </Suspense>
        )}
      </Drawer>
    );
  }
}
OrganizationModal.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  hideBallotItemInfo: PropTypes.bool,
  hidePositions: PropTypes.bool,
  modalOpen: PropTypes.bool,
  // organizationWeVoteId: PropTypes.string,
  toggleFunction: PropTypes.func.isRequired,
  params: PropTypes.object,
};

const styles = () => ({
  drawer: {
    marginTop: `${heightOfCordovaSpacer(true)} !important`,
    minWidth: '360px',
    width: '100%',
    maxWidth: '550px !important',
    '& *': {
      maxWidth: '550px !important',
    },
    '@media (min-width: 577px)': {
      width: '90%',
      maxWidth: '550px !important',
    },
    '@media(max-width: 576px)': {
      minWidth: '360px',
      maxWidth: '360px !important',
      '& *': {
        maxWidth: '360px !important',
      },
    },
  },
  dialogPaper: {
    display: 'block',
    marginTop: hasCordovaNotch() ? 68 : 48,
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
    '@media (min-width: 577px)': {
      maxWidth: '550px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    '@media (max-width: 576px)': {
      maxWidth: '360px',
    },
  },
  dialogContent: {
    padding: '24px 24px 36px 24px',
    background: 'white',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '@media(max-width: 576px)': {
      justifyContent: 'flex-start !important',
    },
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginRight: 'auto',
    padding: 6,
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  closeIcon: {
    color: '#999',
    width: 24,
    height: 24,
  },
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const BallotItemBottomSpacer = styled('div')`
  margin-bottom: 32px;
`;

const CloseDrawerIconWrapperOrganization = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-right: 12px;
`;

const CloseDrawerHeaderIconWrapper = styled('div')`
`;

const HeartToggleAndThermometerWrapper = styled('div')`
  margin-top: 12px;
`;

const PoliticianCardForListWrapper = styled('div')`
  margin: 0 15px;
`;

const ScoreSummaryListControllerBottomSpacer = styled('div')`
  margin-bottom: 42px;
`;

const ShowMoreWrapper = styled('div')`
  margin-bottom: 32px;
  margin-top: 32px;
`;

const VoterPositionEntryAndDisplayWrapper = styled('div')`
  margin: 0 15px;
`;

export default withTheme(withStyles(styles)(OrganizationModal));
