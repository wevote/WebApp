import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import BallotIcon from '@material-ui/icons/Ballot';
import { withStyles } from '@material-ui/core/styles';
import { calculateBallotBaseUrl, capitalizeString } from '../../utils/textFormat';
import BallotActions from '../../actions/BallotActions';
import BallotSearchResults from '../Ballot/BallotSearchResults';
import BallotStore from '../../stores/BallotStore';
import DelayedLoad from '../Widgets/DelayedLoad';
import EndorsementCard from '../Widgets/EndorsementCard';
import FooterDoneBar from '../Navigation/FooterDoneBar';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import ThisIsMeAction from '../Widgets/ThisIsMeAction';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuidePositionList from './VoterGuidePositionList';
import VoterStore from '../../stores/VoterStore';

class VoterGuideEndorsements extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    classes: PropTypes.object,
    location: PropTypes.object,
    organizationWeVoteId: PropTypes.string.isRequired,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      clearSearchTextNow: false,
      currentGoogleCivicElectionId: 0,
      organization: {},
      organizationId: 0,
      organizationWeVoteId: '',
      searchIsUnderway: false,
      voter: {},
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
  }

  componentDidMount () {
    const { organizationWeVoteId } = this.props;
    // console.log('VoterGuideEndorsements componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    let googleCivicElectionIdFromUrl = this.props.params.google_civic_election_id || 0;
    // console.log('googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;
    // console.log('this.props.params.ballot_returned_we_vote_id: ', this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === 'none' ? '' : ballotLocationShortcut;
    let googleCivicElectionId = 0;
    if (googleCivicElectionIdFromUrl !== 0) {
      googleCivicElectionIdFromUrl = parseInt(googleCivicElectionIdFromUrl, 10);
      // googleCivicElectionId = googleCivicElectionIdFromUrl;
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.google_civic_election_id) {
      googleCivicElectionId = BallotStore.ballotProperties.google_civic_election_id;
    }

    // console.log('ballotReturnedWeVoteId: ', ballotReturnedWeVoteId, ', ballotLocationShortcut:', ballotLocationShortcut, ', googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    if (ballotReturnedWeVoteId || ballotLocationShortcut || googleCivicElectionIdFromUrl) {
      if (ballotLocationShortcut !== '') {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, '', ballotLocationShortcut);
        // Change the URL to match
        historyPush(`${ballotBaseUrl}/${ballotLocationShortcut}`);
      } else if (ballotReturnedWeVoteId !== '') {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, '');
        // Change the URL to match
        historyPush(`${ballotBaseUrl}/id/${ballotReturnedWeVoteId}`);
      } else if (googleCivicElectionIdFromUrl !== 0) {
        // Change the ballot on load to make sure we are getting what we expect from the url
        if (googleCivicElectionId !== googleCivicElectionIdFromUrl) {
          BallotActions.voterBallotItemsRetrieve(googleCivicElectionIdFromUrl, '', '');
          // Change the URL to match
          let ballotElectionUrl = `${ballotBaseUrl}/election/${googleCivicElectionIdFromUrl}`;
          if (this.props.activeRoute && this.props.activeRoute !== '') {
            ballotElectionUrl += `/${this.props.activeRoute}`;
          }
          historyPush(ballotElectionUrl);
        }
        // No change to the URL needed
        // Now set googleCivicElectionId
        googleCivicElectionId = googleCivicElectionIdFromUrl;
      } else if (googleCivicElectionId !== 0) {
        // No need to retrieve data again
        // Change the URL to match the current googleCivicElectionId
        let ballotElectionUrl2 = `${ballotBaseUrl}/election/${googleCivicElectionId}`;
        if (this.props.activeRoute && this.props.activeRoute !== '') {
          ballotElectionUrl2 += `/${this.props.activeRoute}`;
        }
        historyPush(ballotElectionUrl2);
      }
    } else {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }

    // NOTE: voterAllPositionsRetrieve is also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (organizationWeVoteId) {
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
      // TODO: COMMENT OUT because they were added to OrganizationVoterGuideTabs?
      // Positions for this organization, for this voter / election
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, true);
      // Positions for this organization, NOT including for this voter / election
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, false, true);
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationId = organization.organization_id;

      if (organizationId) {
        const allOrganizationPositions = OrganizationStore.getAllOrganizationPositions(organizationWeVoteId);
        const allOrganizationPositionsLength = allOrganizationPositions.length || 0;
        this.setState({
          allOrganizationPositions,
          allOrganizationPositionsLength,
          organizationWeVoteId,
          organization,
          organizationId,
        });
      }
    }
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      voter: VoterStore.getVoter(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuideEndorsements componentWillReceiveProps');
    // When a new organization is passed in, update this component to show the new data
    const differentElection = this.state.currentGoogleCivicElectionId !== VoterStore.electionId();
    const differentOrganization = this.state.organizationWeVoteId !== nextProps.organizationWeVoteId;
    // console.log('VoterGuideEndorsements componentWillReceiveProps-differentElection: ', differentElection, ' differentOrganization: ', differentOrganization);
    if (differentElection || differentOrganization) {
      // console.log('VoterGuideEndorsements componentWillReceiveProps, differentElection:', differentElection, ', differentOrganization:', differentOrganization);
      // console.log('VoterGuideEndorsements, componentWillReceiveProps, nextProps.organization: ', nextProps.organization);
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(nextProps.organizationWeVoteId, VoterStore.electionId());
      // // Positions for this organization, for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organizationWeVoteId, true);
      // // Positions for this organization, NOT including for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organizationWeVoteId, false, true);
      const { organizationWeVoteId } = nextProps;
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationId = organization.organization_id;

      if (organizationId) {
        this.setState({
          organizationWeVoteId,
          organization,
          organizationId,
        });
      }
    }
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
    });
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
  }

  onBallotStoreChange () {
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
    });
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuideEndorsements onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const allOrganizationPositions = OrganizationStore.getAllOrganizationPositions(organizationWeVoteId);
      const allOrganizationPositionsLength = allOrganizationPositions.length || 0;
      this.setState({
        allOrganizationPositions,
        allOrganizationPositionsLength,
        organization,
      });
    }
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuideEndorsements onSupportStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      this.setState({
        organization,
      });
    }
  }

  onVoterStoreChange () {
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      voter: VoterStore.getVoter(),
    });
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been cleared
  clearSearch () {
    // console.log('VoterGuideEndorsements, clearSearch');
    this.setState({
      clearSearchTextNow: true,
      searchIsUnderway: false,
    });
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been triggered
  searchUnderway (searchIsUnderway) {
    // console.log('VoterGuideEndorsements, searchIsUnderway: ', searchIsUnderway);
    this.setState({
      clearSearchTextNow: false,
      searchIsUnderway,
    });
  }

  render () {
    renderLog('VoterGuideEndorsements');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('VoterGuideEndorsements render');
    const { classes } = this.props;
    const {
      allOrganizationPositions, allOrganizationPositionsLength,
      clearSearchTextNow, currentGoogleCivicElectionId,
      organization, organizationId, organizationWeVoteId,
      searchIsUnderway,
    } = this.state;
    // console.log('voterGuideElectionListCount:', voterGuideElectionListCount);

    if (!organization) {
      // Wait until organization has been set to render
      return null;
    }
    if (!organizationId) {
      return (
        <div className="card">
          <div className="card-main">
            <h4 className="h4">Voter guide not found.</h4>
          </div>
        </div>
      );
    }

    let lookingAtSelf = false;
    if (this.state.voter) {
      lookingAtSelf = this.state.voter.linked_organization_we_vote_id === organizationWeVoteId;
    }

    // console.log("lookingAtSelf: ", lookingAtSelf);
    const organizationName = capitalizeString(organization.organization_name);
    const titleText = `${organizationName} - We Vote`;
    const descriptionText = `See endorsements and opinions from ${organizationName} for the November election`;

    return (
      <VoterGuideEndorsementsOuterWrapper>
        {/* Since VoterGuideEndorsements, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <div className="page-content-container">
          <div className="container-fluid">
            <VoterGuideEndorsementsWrapper>
              { lookingAtSelf && (
                <div className="u-margin-left--md u-push--md">
                  <BallotSearchResults
                    clearSearchTextNow={clearSearchTextNow}
                    googleCivicElectionId={currentGoogleCivicElectionId}
                    organizationWeVoteId={this.state.voter.linked_organization_we_vote_id}
                    searchUnderwayFunction={this.searchUnderway}
                  />
                </div>
              )}
              { (allOrganizationPositionsLength) ? (
                <section className="card">
                  <DelayedLoad showLoadingText waitBeforeShow={500}>
                    <VoterGuidePositionList
                      incomingPositionList={allOrganizationPositions}
                      organizationWeVoteId={organizationWeVoteId}
                      params={this.props.params}
                    />
                  </DelayedLoad>
                </section>
              ) : (
                <Card>
                  <DelayedLoad showLoadingText waitBeforeShow={2000}>
                    <EmptyBallotMessageContainer>
                      <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                      <EmptyBallotText>
                        No endorsements have been found for
                        {' '}
                        {organization.organization_name}
                        .
                      </EmptyBallotText>
                    </EmptyBallotMessageContainer>
                  </DelayedLoad>
                </Card>
              )}
            </VoterGuideEndorsementsWrapper>
            {searchIsUnderway ? (
              <span className="d-block d-sm-none">
                <FooterDoneBar doneFunction={this.clearSearch} doneButtonText="Clear Search" />
              </span>
            ) : null
            }
            <ExtraActionsWrapper>
              <EndorsementCard
                variant="primary"
                buttonText="ENDORSEMENTS MISSING?"
                organizationWeVoteId={organizationWeVoteId}
                text={`Are there endorsements from ${organizationName} that you expected to see?`}
                title="Endorsements Missing?"
              />
              {organization.organization_twitter_handle && (
                <ThisIsMeAction
                  twitterHandleBeingViewed={organization.organization_twitter_handle}
                  nameBeingViewed={organization.organization_name}
                  kindOfOwner="ORGANIZATION"
                />
              )}
            </ExtraActionsWrapper>
          </div>
        </div>
      </VoterGuideEndorsementsOuterWrapper>
    );
  }
}

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
    [theme.breakpoints.down('sm')]: {
      width: 75,
      height: 75,
    },
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
});

const EmptyBallotMessageContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  padding: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: .5em .5em;
  }
`;

const EmptyBallotText = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 1em;
  }
`;

const ExtraActionsWrapper = styled.div`
  margin-bottom: 20px;
  margin-left: -15px;
  margin-right: -15px;
`;

const VoterGuideEndorsementsWrapper = styled.div`
  margin-bottom: 10px;
  margin-left: -15px;
  margin-right: -15px;
`;

const VoterGuideEndorsementsOuterWrapper = styled.div`
`;

export default withStyles(styles)(VoterGuideEndorsements);
