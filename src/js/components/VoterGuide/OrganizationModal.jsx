import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Drawer, IconButton } from '@material-ui/core';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import CandidateItem from '../Ballot/CandidateItem';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterStore from '../../stores/VoterStore';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';

class OrganizationModal extends Component {
  static propTypes = {
    candidateWeVoteId: PropTypes.string,
    classes: PropTypes.object,
    open: PropTypes.bool,
    organizationWeVoteId: PropTypes.string,
    pathname: PropTypes.string,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: '',
      open: false,
      candidateWeVoteId: '',
      organizationWeVoteId: '',
    };

    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
  }

  // Ids: options, friends

  componentDidMount () {
    // this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // FriendActions.currentFriends();
    // console.log('Candidate componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    const { candidateWeVoteId, organizationWeVoteId } = this.props;
    // console.log('candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      this.setState({
        candidateWeVoteId,
      });
      CandidateActions.candidateRetrieve(candidateWeVoteId);
    }

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
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
    }
    IssueActions.issuesFollowedRetrieve();
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }

    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      candidateWeVoteId,
      organizationWeVoteId,
      open: this.props.open,
      pathname: this.props.pathname,
    });
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
  }

  onCandidateStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  closeOrganizationModal () {
    this.setState({ open: false });
    setTimeout(() => {
      this.props.toggleFunction(this.state.pathname);
    }, 500);
  }

  render () {
    // console.log(this.props.candidate_we_vote_id);

    renderLog('OrganizationModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    const { organizationWeVoteId, candidateWeVoteId } = this.state;

    // console.log("organizationWeVoteId: ", organizationWeVoteId);
    // console.log("candidateWeVoteId: ", candidateWeVoteId);

    // console.log('currentSelectedPlanCostForPayment:', currentSelectedPlanCostForPayment);
    // console.log(this.state);

    return (
      <>
        <Drawer classes={{ paper: classes.drawer }} id="share-menu" anchor="right" open={this.state.open} direction="left" onClose={this.closeOrganizationModal}>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            id="closeOrganizationModal"
          >
            <span className="fas fa-times u-cursor--pointer" onClick={this.closeOrganizationModal} />
          </IconButton>
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
        </Drawer>
      </>
    );
  }
}
const styles = () => ({
  drawer: {
    maxWidth: '360px !important',
    '& *': {
      maxWidth: '360px !important',
    },
  },
  dialogPaper: {
    display: 'block',
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
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
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
});


export default withTheme(withStyles(styles)(OrganizationModal));
