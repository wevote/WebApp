import { Close } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
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

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const PositionItem = React.lazy(() => import(/* webpackChunkName: 'PositionItem' */ './PositionItem'));


class PositionDrawer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      featuredPosition: {},
      modalOpen: this.props.modalOpen,
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce: {},
    };

    this.closePositionDrawer = this.closePositionDrawer.bind(this);
  }

  // Ids: options, friends

  componentDidMount () {
    // console.log('PositionDrawer componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    const { ballotItemWeVoteId, featuredOrganizationWeVoteId } = this.props;
    // console.log('ballotItemWeVoteId:', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      const { contest_office_we_vote_id: officeWeVoteId } = candidate;
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
      const featuredPosition = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, featuredOrganizationWeVoteId);
      this.setState({
        featuredPosition,
        isCandidate,
      });
      AnalyticsActions.saveActionCandidate(VoterStore.electionId(), ballotItemWeVoteId);
    }
    if (isMeasure) {
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
      this.setState({
        isCandidate,
      });
      AnalyticsActions.saveActionMeasure(VoterStore.electionId(), ballotItemWeVoteId);
    }
    OrganizationActions.organizationsFollowedRetrieve();

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
    const { ballotItemWeVoteId, featuredOrganizationWeVoteId } = this.props;
    const { isCandidate } = this.state;
    // console.log('Candidate onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      const { google_civic_election_id: googleCivicElectionId } = candidate;
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
      const featuredPosition = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, featuredOrganizationWeVoteId);
      this.setState({
        featuredPosition,
      });
    }
  }

  onMeasureStoreChange () {
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

  closePositionDrawer () {
    this.setState({ modalOpen: false });
    setTimeout(() => {
      this.props.toggleFunction(normalizedHref());
    }, 500);
  }

  render () {
    // console.log(this.props.candidate_we_vote_id);
    renderLog('PositionDrawer');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, params } = this.props;
    const { featuredPosition, modalOpen } = this.state;

    return (
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        direction="left"
        id="share-menu"
        onClose={this.closePositionDrawer}
        open={modalOpen}
      >
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          id="closePositionDrawer"
          onClick={this.closePositionDrawer}
          size="large"
        >
          <span className="u-cursor--pointer">
            <Close classes={{ root: classes.closeIcon }} />
          </span>
        </IconButton>
        { (featuredPosition && featuredPosition.ballot_item_we_vote_id) && (
          <Suspense fallback={<></>}>
            <DelayedLoad showLoadingText waitBeforeShow={500}>
              <>
                <Suspense fallback={<></>}>
                  <PositionItem
                    position={featuredPosition}
                    params={params}
                    showEntireStatementText
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
PositionDrawer.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  featuredOrganizationWeVoteId: PropTypes.string,
  modalOpen: PropTypes.bool,
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

// const PositionListIntroductionText = styled('div')`
//   color: #999;
// `;

export default withTheme(withStyles(styles)(PositionDrawer));
