import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import BallotIcon from '@material-ui/icons/Ballot';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import AppActions from '../../actions/AppActions';
import BallotStore from '../../stores/BallotStore';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import { historyPush } from '../../utils/cordovaUtils';
import FooterDoneBar from '../Navigation/FooterDoneBar';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationPositionItem from '../VoterGuide/OrganizationPositionItem';
import OrganizationStore from '../../stores/OrganizationStore';
import SettingsAccount from './SettingsAccount';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';
// import BallotSearchResults from '../Ballot/BallotSearchResults';
// import YourPositionsVisibilityMessage from '../VoterGuide/YourPositionsVisibilityMessage';


class VoterGuideSettingsPositions extends Component {
  static propTypes = {
    classes: PropTypes.object,
    voterGuideWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      // clearSearchTextNow: false,
      currentGoogleCivicElectionId: 0,
      editMode: true,
      organization: {},
      searchIsUnderway: false,
      voter: {},
      voterGuide: {},
      voterGuideWeVoteId: '',
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
    this.goToVoterGuideDisplay = this.goToVoterGuideDisplay.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log('VoterGuideSettingsPositions componentDidMount');
    // Get Voter Guide information
    this.setState({
      editMode: true,
      voterGuideWeVoteId: this.props.voterGuideWeVoteId,
    });
    let voterGuide;
    if (this.props.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.props.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
    }
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter });
      const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log('VoterGuideSettingsPositions componentDidMount linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            currentGoogleCivicElectionId: BallotStore.currentBallotGoogleCivicElectionId,
            organization,
            positionListForOneElection: organization.position_list_for_one_election,
          });
          // Positions for this organization, for this election
          if (voterGuide && voterGuide.google_civic_election_id) {
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(voterGuide.google_civic_election_id, organization.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
              OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
            }
          }
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
          OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
        // if (!voterGuideFound) {
        //   // console.log("VoterGuideSettingsDashboard voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve");
        //   VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        // }
      }
    }

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuideSettingsPositions componentWillReceiveProps nextProps.voterGuideWeVoteId:', nextProps.voterGuideWeVoteId);
    this.setState({
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
    });
    let voterGuide;
    if (nextProps.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(nextProps.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
    }
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter });
      const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log('VoterGuideSettingsPositions componentDidMount linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization,
            positionListForOneElection: organization.position_list_for_one_election,
          });
          // Positions for this organization, for this election
          if (voterGuide && voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== this.state.currentGoogleCivicElectionId) {
            this.setState({ currentGoogleCivicElectionId: voterGuide.google_civic_election_id });
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(voterGuide.google_civic_election_id, organization.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
              OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
            }
          }
          // Positions for this organization, for this election
          // Might cause a loop
          // OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
          OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
        // if (!voterGuideFound) {
        //   // console.log('VoterGuideSettingsPositions voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve');
        //   VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        // }
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // console.log('VoterGuideSettingsPositions onOrganizationStoreChange, org_we_vote_id: ', this.state.linkedOrganizationWeVoteId);
    const { linkedOrganizationWeVoteId } = this.state;
    const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
    this.setState({
      organization,
      positionListForOneElection: organization.position_list_for_one_election,
    });
    // Positions for this organization, for this voter / election
    // OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true);
  }

  onVoterStoreChange () {
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    let updateVoter = true;
    if (voter && voter.we_vote_id && this.state.voter && this.state.voter.we_vote_id && voter.we_vote_id === this.state.voter.we_vote_id) {
      // console.log('VoterGuideSettingsPositions, onVoterStoreChange, do NOT update_voter');
      updateVoter = false;
    }
    if (updateVoter) {
      this.setState({ voter });
      const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log('VoterGuideSettingsPositions componentDidMount linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization,
          });
          // Positions for this organization, for this election
          // Might cause a loop
          // OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
          // OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
      }
    }
  }

  onVoterGuideStoreChange () {
    // console.log('VoterGuideSettingsPositions onVoterGuideStoreChange');
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
    }
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been cleared
  clearSearch () {
    // console.log('VoterGuideSettingsPositions, clearSearch');
    this.setState({
      // clearSearchTextNow: true,
      searchIsUnderway: false,
    });
  }

  goToVoterGuideDisplay () {
    let voterGuideDisplay = '/ballot';
    if (this.state.voterGuide) {
      voterGuideDisplay = `/voterguide/${this.state.voterGuide.organization_we_vote_id}/ballot/election/${this.state.voterGuide.google_civic_election_id}/positions`;
    }
    historyPush(voterGuideDisplay);
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been triggered
  searchUnderway (searchIsUnderway) {
    // console.log('VoterGuideSettingsPositions, searchIsUnderway: ', searchIsUnderway);
    this.setState({
      // clearSearchTextNow: false,
      searchIsUnderway,
    });
  }

  goToDifferentVoterGuideSettingsDashboardTab (dashboardEditMode = '') {
    AppActions.setVoterGuideSettingsDashboardEditMode(dashboardEditMode);
  }

  render () {
    renderLog('VoterGuideSettingsPositions');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter || !this.state.voterGuide || !this.state.organization) {
      return LoadingWheel;
    }

    const { classes } = this.props;
    const { linkedOrganizationWeVoteId, positionListForOneElection } = this.state;
    // console.log('VoterGuideSettingsPositions, positionListForOneElection:', positionListForOneElection);

    // let lookingAtSelf = false;
    // if (this.state.voter) {
    //   lookingAtSelf = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    // }

    // console.log('lookingAtSelf: ', lookingAtSelf);
    const atLeastOnePositionFoundForThisElection = positionListForOneElection && positionListForOneElection.length !== 0;

    return (
      <div className="">
        <Helmet title="Your Endorsements - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        { this.state.voter.is_signed_in ?
          null :
          <SettingsAccount />
        }
        { atLeastOnePositionFoundForThisElection && (
          <div className="card">
            <div className="card-main">
              {/* lookingAtSelf ? (
                <div className="u-margin-left--md u-push--md">
                Search for candidates or measures to add to your voter guide.
                  <BallotSearchResults
                    clearSearchTextNow={this.state.clearSearchTextNow}
                    googleCivicElectionId={this.state.voterGuide.google_civic_election_id}
                    organizationWeVoteId={this.state.voter.linked_organization_we_vote_id}
                    searchUnderwayFunction={this.searchUnderway}
                  />
                </div>
              ) : null
              */}
              { atLeastOnePositionFoundForThisElection && !this.state.searchIsUnderway ? (
                <span>
                  {/* lookingAtSelf ?
                    <YourPositionsVisibilityMessage positionList={positionListForOneElection} /> :
                    null */}
                  { positionListForOneElection.map(item => (
                    <OrganizationPositionItem
                      key={item.position_we_vote_id}
                      position={item}
                      organizationWeVoteId={linkedOrganizationWeVoteId}
                      editMode={this.state.editMode}
                    />
                  )) }
                </span>
              ) : null
              }
            </div>
          </div>
        )}
        {!atLeastOnePositionFoundForThisElection && (
          <Card>
            <EmptyBallotMessageContainer>
              <BallotIcon classes={{ root: classes.ballotIconRoot }} />
              <EmptyBallotText>You haven&apos;t endorsed any candidates or measures yet. Click &quot;Add Endorsements&quot; to help people who trust you make better voting decisions.</EmptyBallotText>
              <Button
                classes={{ root: classes.ballotButtonRoot }}
                color="primary"
                variant="contained"
                onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
              >
                <BallotIcon classes={{ root: classes.ballotButtonIconRoot }} />
                Add Endorsements
              </Button>
            </EmptyBallotMessageContainer>
          </Card>
        )}
        {/* !this.state.searchIsUnderway ?
        <div>
          <VoterGuideSettingsSuggestedBallotItems maximumSuggestedItems={5} />
        </div> :
        null */}
        {atLeastOnePositionFoundForThisElection && (
          <div className="fa-pull-right">
            <Button
              color="primary"
              id="voterGuideSettingsPositionsSeeFullBallot"
              onClick={this.goToVoterGuideDisplay}
              variant="contained"
            >
              See Preview&nbsp;&nbsp;&gt;
            </Button>
          </div>
        )
        }
        {this.state.searchIsUnderway ? (
          <span className="d-block d-sm-none">
            <FooterDoneBar doneFunction={this.clearSearch} doneButtonText="Clear Search" />
          </span>
        ) : null
        }
      </div>
    );
  }
}

const EmptyBallotMessageContainer = styled.div`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(VoterGuideSettingsPositions);
