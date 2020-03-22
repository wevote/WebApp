import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Tab, Box, Button, withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import CandidateItem from '../../components/Ballot/CandidateItem';
import VoterStore from '../../stores/VoterStore';
import AnalyticsActions from '../../actions/AnalyticsActions';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import CandidateStore from '../../stores/CandidateStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import AppStore from '../../stores/AppStore';
import { historyPush } from '../../utils/cordovaUtils';

// https://localhost:3000/candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=777&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_home_page=https%3A%2F%2Fwww.philting.com%2F
// TODO: This would be better as https://localhost:3000/candidate-for-extension&candidate_name... if you can figure out the chages in Root.jsx, I Will change the extension.
class CandidateForExtension extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisCandidate: [],
      allCachedPositionsForThisCandidateLength: 0,
      candidate: {},
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      scrolledDown: false,
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const { candidate_we_vote_id: candidateWeVoteId, organization_we_vote_id: organizationWeVoteId } = this.props.location.query;
    // console.log('candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);
      const { ballot_item_display_name: ballotItemDisplayName, contest_office_we_vote_id: officeWeVoteId } = candidate;
      // console.log('candidate:', candidate);
      this.setState({
        ballotItemDisplayName,
        candidate,
        candidateWeVoteId,
      });
      CandidateActions.candidateRetrieve(candidateWeVoteId);
      // if (candidateWeVoteId &&
      //   !this.localPositionListHasBeenRetrievedOnce(candidateWeVoteId) &&
      //   !BallotStore.positionListHasBeenRetrievedOnce(candidateWeVoteId) &&
      //   !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
      // ) {
      //   CandidateActions.positionListForBallotItemPublic(candidateWeVoteId);
      //   const { positionListHasBeenRetrievedOnce } = this.state;
      //   positionListHasBeenRetrievedOnce[candidateWeVoteId] = true;
      //   this.setState({
      //     positionListHasBeenRetrievedOnce,
      //   });
      // }
      // if (candidateWeVoteId &&
      //   !this.localPositionListFromFriendsHasBeenRetrievedOnce(candidateWeVoteId) &&
      //   !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(candidateWeVoteId) &&
      //   !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
      // ) {
      //   CandidateActions.positionListForBallotItemFromFriends(candidateWeVoteId);
      //   const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      //   positionListFromFriendsHasBeenRetrievedOnce[candidateWeVoteId] = true;
      //   this.setState({
      //     positionListFromFriendsHasBeenRetrievedOnce,
      //   });
      // }
    }

    // Get the latest guides to follow for this candidate

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    // const voterGuidesForId = VoterGuideStore.getVoterGuideForOrganizationId(organizationWeVoteId);
    // // console.log('voterGuidesForId:', voterGuidesForId);
    // if (voterGuidesForId && Object.keys(voterGuidesForId).length > 0) {
    //   // Do not request them again
    // } else {
    //   VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidateWeVoteId, 'CANDIDATE');
    // }

    OrganizationActions.organizationsFollowedRetrieve();

    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidateWeVoteId);

    if (voterGuidesForThisBallotItem) {
      voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log('oneVoterGuide: ', oneVoterGuide);
        if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
          OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
        }
      });
    }

    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
      // IssueActions.issueDescriptionsRetrieveCalled(); // TODO: Move this to AppActions? Currently throws error: "Cannot dispatch in the middle of a dispatch"
    }
    IssueActions.issuesFollowedRetrieve();
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
      // IssueActions.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId()); // TODO: Move this to AppActions? Currently throws error: "Cannot dispatch in the middle of a dispatch"
    }
    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      allCachedPositionsForThisCandidate,
      candidateWeVoteId,
      organizationWeVoteId,
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.state;
    // console.log('Candidate onCandidateStoreChange, candidateWeVoteId:', candidateWeVoteId);
    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
    // console.log('allCachedPositionsForThisCandidate:', allCachedPositionsForThisCandidate);
    let allCachedPositionsForThisCandidateLength = 0;
    if (allCachedPositionsForThisCandidate) {
      allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length;
    }
    const candidate = CandidateStore.getCandidate(candidateWeVoteId);
    const ballotItemDisplayName = candidate.ballot_item_display_name;
    this.setState({
      ballotItemDisplayName,
      candidate,
      allCachedPositionsForThisCandidate,
      allCachedPositionsForThisCandidateLength,
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Candidate onVoterGuideStoreChange');
    // Trigger an update of the candidate so we can get an updated position_list
    // CandidateActions.candidateRetrieve(this.state.candidateWeVoteId);
    // CandidateActions.positionListForBallotItemPublic(this.state.candidateWeVoteId);
  }

  handleChange (event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  render () {
    renderLog('CandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders
    const { candidate_name: candidateName, endorsement_page_url: endorsementPageUrl, candidate_home_page: candidateHomePage } = this.props.location.query;

    const { classes } = this.props;

    const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown, candidateWeVoteId, value } = this.state;

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <Wrapper>
        <span>
          <div><b>This is a stub page, that is loaded by the We Vote Endorsement Extension for Chrome</b></div>
          <br />
          <div>
            <b>candidateName:</b> {candidateName}
          </div>
          <div>
            <b>candidateWeVoteId:</b> {candidateWeVoteId}
          </div>
          <div>
            <b>endorsementPageUrl:</b> {endorsementPageUrl}
          </div>
          <div>
            <b>candidateHomePage:</b> {candidateHomePage}
          </div>
          <Tabs variant="fullWidth" classes={{ indicator: classes.indicator }} value={value} onChange={this.handleChange}>
            <Tab classes={{ root: classes.tab }} variant="fullWidth" color="primary" label="Your Opinion" />
            <Tab classes={{ root: classes.tab }} variant="fullWidth" color="primary" label="Sierra Club Endorsement" />
          </Tabs>
          <div
            role="tabpanel"
            hidden={value !== 0}
            id={`simple-tabpanel-${0}`}
            aria-labelledby={`simple-tab-${0}`}
            value={0}
          >
            {value === 0 && (
              <Box p={3}>
                <CandidateItem
                  inModal
                  candidateWeVoteId={candidateWeVoteId}
                  organizationWeVoteId={organizationWeVoteId}
                  hideShowMoreFooter
                  expandIssuesByDefault
                  showLargeImage
                  showTopCommentByBallotItem
                  showOfficeName
                  showPositionStatementActionBar
                />
                <Buttons>
                  <Button onClick={() => { historyPush('/') }} classes={{ root: classes.button }} variant="outlined" color="primary">Jump To We Vote</Button>
                  <Button classes={{ root: classes.button }} variant="outlined" color="primary">Save</Button>
                </Buttons>
              </Box>
            )}
          </div>
          <div
            role="tabpanel"
            hidden={value !== 1}
            id={`simple-tabpanel-${1}`}
            aria-labelledby={`simple-tab-${1}`}
            value={1}
          >
            {value === 1 && <Box p={3}>Item Two</Box>}
          </div>
        </span>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 2.5,
  },
  tab: {
    fontWeight: 600,
  },
  button: {
    width: '50%',
    margin: 16,
  },
});

const Wrapper = styled.div`
  height: 100vh;
  background: white;
`;

const Buttons = styled.div`
  padding: 0 16px;
  width: calc(100% + 32px);
  margin: -16px -16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default withStyles(styles)(CandidateForExtension);
