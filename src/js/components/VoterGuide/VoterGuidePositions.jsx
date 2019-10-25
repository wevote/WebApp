import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { calculateBallotBaseUrl, capitalizeString } from '../../utils/textFormat';
import BallotActions from '../../actions/BallotActions';
import BallotSearchResults from '../Ballot/BallotSearchResults';
import BallotStore from '../../stores/BallotStore';
import EndorsementCard from '../Widgets/EndorsementCard';
import FooterDoneBar from '../Navigation/FooterDoneBar';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import OrganizationPositionItem from './OrganizationPositionItem';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import ThisIsMeAction from '../Widgets/ThisIsMeAction';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideRecommendationsFromOneOrganization from './VoterGuideRecommendationsFromOneOrganization';
import VoterStore from '../../stores/VoterStore';
import YourPositionsVisibilityMessage from './YourPositionsVisibilityMessage';

export default class VoterGuidePositions extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    location: PropTypes.object,
    organizationWeVoteId: PropTypes.string.isRequired,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      clearSearchTextNow: false,
      currentGoogleCivicElectionId: 0,
      editMode: false,
      organization: {},
      organizationId: 0,
      organizationWeVoteId: '',
      positionListForOneElection: [],
      searchIsUnderway: false,
      voter: {},
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    let googleCivicElectionIdFromUrl = this.props.params.google_civic_election_id || 0;
    // console.log("googleCivicElectionIdFromUrl: ", googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;
    // console.log("this.props.params.ballot_returned_we_vote_id: ", this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === 'none' ? '' : ballotLocationShortcut;
    let googleCivicElectionId = 0;
    // console.log("componentDidMount, BallotStore.ballotProperties: ", BallotStore.ballotProperties);
    if (googleCivicElectionIdFromUrl !== 0) {
      googleCivicElectionIdFromUrl = parseInt(googleCivicElectionIdFromUrl, 10);
      // googleCivicElectionId = googleCivicElectionIdFromUrl;
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.google_civic_election_id) {
      googleCivicElectionId = BallotStore.ballotProperties.google_civic_election_id;
    }

    // console.log("ballotReturnedWeVoteId: ", ballotReturnedWeVoteId, ", ballotLocationShortcut:", ballotLocationShortcut, ", googleCivicElectionIdFromUrl: ", googleCivicElectionIdFromUrl);
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
    }
    // DALE NOTE 2018-1-18 Commented this out because it will take voter away from voter guide. Needs further testing.
    // else if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false) { // No ballot found
    //   // console.log("if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false");
    //   historyPush("/settings/location");
    // }

    // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();
    SupportActions.positionsCountForAllBallotItems(googleCivicElectionId);

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { organizationWeVoteId } = this.props;
    if (organizationWeVoteId) {
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
      // TODO: COMMENT OUT because they were added to OrganizationVoterGuideTabs?
      // Positions for this organization, for this voter / election
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, true);
      // Positions for this organization, NOT including for this voter / election
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, false, true);
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationId = organization.organization_id;

      let positionListForOneElection = [];
      let positionListForOneElectionLength = 0;
      if (organizationId) {
        if (organization.position_list_for_one_election) {
          positionListForOneElection = organization.position_list_for_one_election;
          positionListForOneElectionLength = positionListForOneElection.length || 0;
        }
        this.setState({
          organizationWeVoteId,
          organization,
          organizationId,
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
    }
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      voter: VoterStore.getVoter(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuidePositions componentWillReceiveProps');
    // When a new organization is passed in, update this component to show the new data
    const differentElection = this.state.currentGoogleCivicElectionId !== VoterStore.electionId();
    const differentOrganization = this.state.organizationWeVoteId !== nextProps.organizationWeVoteId;
    // console.log('VoterGuidePositions componentWillReceiveProps-differentElection: ', differentElection, ' differentOrganization: ', differentOrganization);
    if (differentElection || differentOrganization) {
      // console.log('VoterGuidePositions, componentWillReceiveProps, nextProps.organization: ', nextProps.organization);
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(nextProps.organizationWeVoteId, VoterStore.electionId());
      // // Positions for this organization, for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organizationWeVoteId, true);
      // // Positions for this organization, NOT including for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organizationWeVoteId, false, true);
      const { organizationWeVoteId } = nextProps;
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationId = organization.organization_id;

      let positionListForOneElection = [];
      let positionListForOneElectionLength = 0;
      if (organizationId) {
        if (organization.position_list_for_one_election) {
          positionListForOneElection = organization.position_list_for_one_election;
          positionListForOneElectionLength = positionListForOneElection.length || 0;
        }
        this.setState({
          organizationWeVoteId,
          organization,
          organizationId,
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
      this.setState({
        currentGoogleCivicElectionId: VoterStore.electionId(),
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.currentGoogleCivicElectionId !== nextState.currentGoogleCivicElectionId) {
      // console.log('shouldComponentUpdate: this.state.currentGoogleCivicElectionId', this.state.currentGoogleCivicElectionId, ', nextState.currentGoogleCivicElectionId', nextState.currentGoogleCivicElectionId);
      return true;
    }
    if (this.state.currentOrganizationWeVoteId !== nextState.currentOrganizationWeVoteId) {
      // console.log('shouldComponentUpdate: this.state.currentOrganizationWeVoteId', this.state.currentOrganizationWeVoteId, ', nextState.currentOrganizationWeVoteId', nextState.currentOrganizationWeVoteId);
      return true;
    }
    if (this.state.organizationId !== nextState.organizationId) {
      // console.log('shouldComponentUpdate: this.state.organizationId', this.state.organizationId, ', nextState.organizationId', nextState.organizationId);
      return true;
    }
    if (this.state.currentOrganizationWeVoteId !== nextState.currentOrganizationWeVoteId) {
      // console.log('shouldComponentUpdate: this.state.currentOrganizationWeVoteId', this.state.currentOrganizationWeVoteId, ', nextState.currentOrganizationWeVoteId', nextState.currentOrganizationWeVoteId);
      return true;
    }
    if (this.state.positionListForOneElectionLength !== nextState.positionListForOneElectionLength) {
      // console.log('shouldComponentUpdate: this.state.positionListForOneElectionLength', this.state.positionListForOneElectionLength, ', nextState.positionListForOneElectionLength', nextState.positionListForOneElectionLength);
      return true;
    }
    // console.log('shouldComponentUpdate no changes');
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuidePositions onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.position_list_for_one_election) {
        const positionListForOneElection = organization.position_list_for_one_election;
        const positionListForOneElectionLength = positionListForOneElection.length || 0;
        this.setState({
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
      this.setState({
        organization,
      });
    }
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuidePositions onSupportStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.position_list_for_one_election) {
        const positionListForOneElection = organization.position_list_for_one_election;
        const positionListForOneElectionLength = positionListForOneElection.length || 0;
        this.setState({
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
      this.setState({
        organization,
      });
    }
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      if (this.state.editMode) {
        // If going from editMode == True to editMode == False, we want to refresh the positions
        OrganizationActions.positionListForOpinionMaker(this.state.organizationWeVoteId, true, false, this.state.currentGoogleCivicElectionId);
      }
      scope.setState({ editMode: !this.state.editMode });
    }
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been cleared
  clearSearch () {
    // console.log('VoterGuidePositions, clearSearch');
    this.setState({
      clearSearchTextNow: true,
      searchIsUnderway: false,
    });
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been triggered
  searchUnderway (searchIsUnderway) {
    // console.log('VoterGuidePositions, searchIsUnderway: ', searchIsUnderway);
    this.setState({
      clearSearchTextNow: false,
      searchIsUnderway,
    });
  }

  toggleEditMode () {
    const { editMode } = this.state;
    if (editMode) {
      // If going from editMode == True to editMode == False, we want to refresh the positions
      const { currentGoogleCivicElectionId, organizationWeVoteId } = this.state;
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, true, false, currentGoogleCivicElectionId);
    }
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog('VoterGuidePositions');  // Set LOG_RENDER_EVENTS to log all renders
    const { organization } = this.state;
    if (!organization) {
      // Wait until organization has been set to render
      return null;
    }
    const {
      organizationId, positionListForOneElection,
    } = this.state;
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
      lookingAtSelf = this.state.voter.linked_organization_we_vote_id === this.state.organizationWeVoteId;
    }

    // console.log("lookingAtSelf: ", lookingAtSelf);
    const electionName = BallotStore.currentBallotElectionName;
    const organizationName = capitalizeString(organization.organization_name);
    const titleText = `${organizationName} - We Vote`;
    const descriptionText = `See endorsements and opinions from ${organizationName} for the November election`;
    const atLeastOnePositionFoundForThisElection = positionListForOneElection && positionListForOneElection.length !== 0;

    return (
      <div className="opinions-followed__container">
        {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <div className="card">
          <ul className="card-child__list-group">
            { lookingAtSelf && atLeastOnePositionFoundForThisElection && !this.state.searchIsUnderway ? (
              <a // eslint-disable-line
                className="fa-pull-right u-push--md"
                onKeyDown={this.onKeyDownEditMode.bind(this)}
                onClick={this.toggleEditMode.bind(this)}
              >
                {this.state.editMode ? 'Done Editing' : 'Edit Positions'}
              </a>
            ) : null
            }
            <h4 className="h4 card__additional-heading">
              <span className="u-push--sm">{ electionName || 'This Election'}</span>
              {/* {this.state.ballot_election_list.length > 1 ? <img src={cordovaDot("/img/global/icons/gear-icon.png")} className="d-print-none" role="button" onClick={this.toggleSelectBallotModal}
              alt='view your ballots' /> : null} */}
            </h4>
            { lookingAtSelf ? (
              <div className="u-margin-left--md u-push--md">
                <BallotSearchResults
                  clearSearchTextNow={this.state.clearSearchTextNow}
                  googleCivicElectionId={this.state.currentGoogleCivicElectionId}
                  organizationWeVoteId={this.state.voter.linked_organization_we_vote_id}
                  searchUnderwayFunction={this.searchUnderway}
                />
              </div>
            ) : null
            }
            { atLeastOnePositionFoundForThisElection && !this.state.searchIsUnderway ? (
              <span>
                { lookingAtSelf ?
                  <YourPositionsVisibilityMessage positionList={positionListForOneElection} /> :
                  null }
                { positionListForOneElection.map(item => (
                  <OrganizationPositionItem
                    key={item.position_we_vote_id}
                    position={item}
                    organization={organization}
                    editMode={this.state.editMode}
                  />
                )) }
              </span>
            ) : null
            }
            {/* If the positionListForOneElection comes back empty, display a message saying that there aren't any positions for this election. */}
            { !atLeastOnePositionFoundForThisElection && (
              <div className="card-child__content-text">
                { lookingAtSelf ?
                  null : (
                    <div>
                      There are no positions for this election in this voter guide yet.
                      <br />
                      <br />
                      <VoterGuideRecommendationsFromOneOrganization organization_we_vote_id={this.state.organizationWeVoteId} />
                      {/* TODO Add search all */}
                      {/* TODO List all elections this organization has a voter guide for. */}
                    </div>
                  )}
              </div>
            )}
          </ul>
        </div>

        {this.state.searchIsUnderway ? (
          <span className="d-block d-sm-none">
            <FooterDoneBar doneFunction={this.clearSearch} doneButtonText="Clear Search" />
          </span>
        ) : null
        }
        <EndorsementCard
          bsPrefix="u-stack--xs"
          variant="primary"
          buttonText="ENDORSEMENTS MISSING?"
          text={`Are there endorsements from ${organizationName} that you expected to see?`}
          title="Endorsements Missing?"
        />
        {organization.organization_twitter_handle && (
          <ThisIsMeAction
            twitterHandleBeingViewed={organization.organization_twitter_handle}
            nameBeingViewed={organization.organization_name}
            kindOfOwner="ORGANIZATION"
          />
        )
        }
      </div>
    );
  }
}
