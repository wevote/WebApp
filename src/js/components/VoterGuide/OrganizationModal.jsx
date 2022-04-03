import { Close, Info } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import IssueActions from '../../actions/IssueActions';
import MeasureActions from '../../actions/MeasureActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import apiCalming from '../../common/utils/apiCalming';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaDrawerTopMargin } from '../../utils/cordovaOffsets';
import { convertToInteger, stringContains } from '../../utils/textFormat';

const CandidateItem = React.lazy(() => import(/* webpackChunkName: 'CandidateItem' */ '../Ballot/CandidateItem'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const MeasureItem = React.lazy(() => import(/* webpackChunkName: 'MeasureItem' */ '../Ballot/MeasureItem'));
const PositionList = React.lazy(() => import(/* webpackChunkName: 'PositionList' */ '../Ballot/PositionList'));


class OrganizationModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItem: [],
      modalOpen: this.props.modalOpen,
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce: {},
    };

    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
  }

  // Ids: options, friends

  componentDidMount () {
    // console.log('OrganizationModal componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    const { ballotItemWeVoteId } = this.props;
    // console.log('ballotItemWeVoteId:', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      const { ballot_item_display_name: ballotItemDisplayName, contest_office_we_vote_id: officeWeVoteId } = candidate;
      // console.log('candidate:', candidate);
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
        isCandidate,
        isMeasure,
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
        isCandidate,
        isMeasure,
      });
      AnalyticsActions.saveActionMeasure(VoterStore.electionId(), ballotItemWeVoteId);
    }
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }

    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);

    if (voterGuidesForThisBallotItem) {
      voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log('oneVoterGuide: ', oneVoterGuide);
        if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
          OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
        }
      });
    }

    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }

    this.setState({
      modalOpen: this.props.modalOpen,
    });
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const { isCandidate } = this.state;
    // console.log('Candidate onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (isCandidate) {
      const allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      // console.log('allCachedPositionsForThisBallotItem:', allCachedPositionsForThisBallotItem);
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      const { ballot_item_display_name: ballotItemDisplayName, google_civic_election_id: googleCivicElectionId } = candidate;
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
      this.setState({
        ballotItemDisplayName,
        allCachedPositionsForThisBallotItem,
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
      this.props.toggleFunction(normalizedHref());
    }, 500);
  }

  render () {
    // console.log(this.props.candidate_we_vote_id);
    renderLog('OrganizationModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemWeVoteId, classes, hideBallotItemInfo, hidePositions, organizationWeVoteId, params } = this.props;
    const { allCachedPositionsForThisBallotItem, ballotItemDisplayName, isCandidate, isMeasure, modalOpen } = this.state;

    return (
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        direction="left"
        id="share-menu"
        onClose={this.closeOrganizationModal}
        open={modalOpen}
      >
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
        {(isCandidate && !hideBallotItemInfo) && (
          <Suspense fallback={<></>}>
            <CandidateItem
              candidateWeVoteId={ballotItemWeVoteId}
              expandIssuesByDefault
              forMoreInformationTextOff
              hideShowMoreFooter
              inModal
              linksOpenNewPage
              linkToBallotItemPage
              organizationWeVoteId={organizationWeVoteId}
              showLargeImage
              showTopCommentByBallotItem
              showOfficeName
              showPositionStatementActionBar
            />
          </Suspense>
        )}
        {(isMeasure && !hideBallotItemInfo) && (
          <Suspense fallback={<></>}>
            <MeasureItem forMoreInformationTextOff measureWeVoteId={ballotItemWeVoteId} />
          </Suspense>
        )}
        { (!!(allCachedPositionsForThisBallotItem.length) && !hidePositions) && (
          <Suspense fallback={<></>}>
            <DelayedLoad showLoadingText waitBeforeShow={500}>
              <>
                <Suspense fallback={<></>}>
                  <PositionList
                    ballotItemDisplayName={ballotItemDisplayName || ''}
                    incomingPositionList={allCachedPositionsForThisBallotItem}
                    params={params}
                    positionListExistsTitle={!hideBallotItemInfo && (
                      <PositionListIntroductionText>
                        <Info classes={{ root: classes.informationIcon }} />
                        Opinions about this ballot item are below. Use these filters to sort:
                      </PositionListIntroductionText>
                    )}
                  />
                </Suspense>
                <br />
                <br />
                <br />
              </>
            </DelayedLoad>
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
  organizationWeVoteId: PropTypes.string,
  toggleFunction: PropTypes.func.isRequired,
  params: PropTypes.object,
};

const styles = () => ({
  drawer: {
    marginTop: cordovaDrawerTopMargin(),
    maxWidth: '550px !important',
    '& *': {
      maxWidth: '550px !important',
    },
    '@media(max-width: 576px)': {
      maxWidth: '360px !important',
      '& *': {
        maxWidth: '360px !important',
      },
    },
  },
  dialogPaper: {
    display: 'block',
    marginTop: hasIPhoneNotch() ? 68 : 48,
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

const PositionListIntroductionText = styled('div')`
  color: #999;
`;

export default withTheme(withStyles(styles)(OrganizationModal));
