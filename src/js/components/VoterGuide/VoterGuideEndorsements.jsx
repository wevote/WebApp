import { Ballot, Info } from '@mui/icons-material';
import { Card } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import SupportActions from '../../actions/SupportActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { calculateBallotBaseUrl, capitalizeString } from '../../utils/textFormat';
import BallotSearchResults from '../Ballot/BallotSearchResults';
import FooterDoneBar from '../Navigation/FooterDoneBar';
import EndorsementCard from '../Widgets/EndorsementCard';
import ThisIsMeAction from '../Widgets/ThisIsMeAction';
import VoterGuidePositionList from './VoterGuidePositionList';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

class VoterGuideEndorsements extends Component {
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
    const { organizationWeVoteId, params } = this.props;
    // console.log('VoterGuideEndorsements componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    let googleCivicElectionIdFromUrl = params.google_civic_election_id || 0;
    // console.log('googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;
    // console.log('params.ballot_returned_we_vote_id: ', params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = params.ballot_location_shortcut || '';
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

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
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
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
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
    const { classes, params } = this.props;
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
                <Suspense fallback={<></>}>
                  <DelayedLoad showLoadingText waitBeforeShow={500}>
                    <VoterGuidePositionList
                      incomingPositionList={allOrganizationPositions}
                      organizationWeVoteId={organizationWeVoteId}
                      params={params}
                      positionListExistsTitle={(
                        <PositionListIntroductionText>
                          <Info classes={{ root: classes.informationIcon }} />
                          {organizationName}
                          &apos;s opinions are below. Use these filters to sort:
                        </PositionListIntroductionText>
                      )}
                    />
                  </DelayedLoad>
                </Suspense>
              </section>
            ) : (
              <Card>
                <Suspense fallback={<></>}>
                  <DelayedLoad showLoadingText waitBeforeShow={2000}>
                    <EmptyBallotMessageContainer>
                      <Ballot classes={{ root: classes.ballotIconRoot }} location={window.location} />
                      <EmptyBallotText>
                        No endorsements have been found for
                        {' '}
                        {organization.organization_name}
                        .
                      </EmptyBallotText>
                    </EmptyBallotMessageContainer>
                  </DelayedLoad>
                </Suspense>
              </Card>
            )}
          </VoterGuideEndorsementsWrapper>
          {searchIsUnderway ? (
            <span className="d-block d-sm-none">
              <FooterDoneBar
                doneFunction={this.clearSearch}
                doneButtonText="Clear Search"
              />
            </span>
          ) : null}
          <ExtraActionsWrapper>
            <EndorsementCard
              buttonText="Endorsements missing?"
              organizationWeVoteId={organizationWeVoteId}
              text={`Are there endorsements from ${organizationName} that you expected to see?`}
              title="Endorsements Missing?"
              whiteOnBlue
            />
            {organization.organization_twitter_handle && (
              <ThisIsMeAction
                kindOfOwner="ORGANIZATION"
                nameBeingViewed={organization.organization_name}
                twitterHandleBeingViewed={organization.organization_twitter_handle}
              />
            )}
          </ExtraActionsWrapper>
        </div>
      </VoterGuideEndorsementsOuterWrapper>
    );
  }
}
VoterGuideEndorsements.propTypes = {
  activeRoute: PropTypes.string,
  classes: PropTypes.object,
  location: PropTypes.object,
  organizationWeVoteId: PropTypes.string.isRequired,
  params: PropTypes.object,
};

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
    [theme.breakpoints.down('md')]: {
      width: 75,
      height: 75,
    },
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
});

const EmptyBallotMessageContainer = styled('div')`
  align-items: center;
  display: flex;
  flex-flow: column;
  padding: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: .5em .5em;
  }
`;

const EmptyBallotText = styled('p')`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 1em;
  }
`;

const ExtraActionsWrapper = styled('div')`
  margin-bottom: 20px;
  margin-left: -15px;
  margin-right: -15px;
`;

const PositionListIntroductionText = styled('div')`
  color: #999;
  margin-top: 10px;
`;

const VoterGuideEndorsementsWrapper = styled('div')`
  margin-bottom: 10px;
  margin-left: -15px;
  margin-right: -15px;
`;

const VoterGuideEndorsementsOuterWrapper = styled('div')`
  margin-bottom: 45px;
`;

export default withStyles(styles)(VoterGuideEndorsements);
