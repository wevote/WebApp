import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import Helmet from "react-helmet";
import { calculateBallotBaseUrl, capitalizeString } from "../../utils/textFormat";
import BallotActions from "../../actions/BallotActions";
import BallotSearchResults from "../Ballot/BallotSearchResults";
import BallotStore from "../../stores/BallotStore";
import FooterDoneBar from "../Navigation/FooterDoneBar";
import { historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "./OrganizationPositionItem";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideRecommendationsFromOneOrganization from "./VoterGuideRecommendationsFromOneOrganization";
import VoterStore from "../../stores/VoterStore";
import YourPositionsVisibilityMessage from "./YourPositionsVisibilityMessage";

export default class VoterGuidePositions extends Component {
  static propTypes = {
    active_route: PropTypes.string,
    location: PropTypes.object,
    organization: PropTypes.object.isRequired,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      clearSearchTextNow: false,
      current_google_civic_election_id: 0,
      current_organization_we_vote_id: "",
      editMode: false,
      organization: {},
      searchIsUnderway: false,
      voter: {},
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);

    this.setState({
      mounted: true,
    });

    let google_civic_election_id_from_url = this.props.params.google_civic_election_id || 0;
    // console.log("google_civic_election_id_from_url: ", google_civic_election_id_from_url);
    let ballot_returned_we_vote_id = this.props.params.ballot_returned_we_vote_id || "";
    ballot_returned_we_vote_id = ballot_returned_we_vote_id === "none" ? "" : ballot_returned_we_vote_id;
    // console.log("this.props.params.ballot_returned_we_vote_id: ", this.props.params.ballot_returned_we_vote_id);
    let ballot_location_shortcut = this.props.params.ballot_location_shortcut || "";
    ballot_location_shortcut = ballot_location_shortcut.trim();
    ballot_location_shortcut = ballot_location_shortcut === "none" ? "" : ballot_location_shortcut;
    let google_civic_election_id = 0;
    // console.log("componentDidMount, BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    if (google_civic_election_id_from_url !== 0) {
      google_civic_election_id_from_url = parseInt(google_civic_election_id_from_url, 10);
      // google_civic_election_id = google_civic_election_id_from_url;
    } else if (BallotStore.ballot_properties && BallotStore.ballot_properties.google_civic_election_id) {
      google_civic_election_id = BallotStore.ballot_properties.google_civic_election_id;
    }

    // console.log("ballot_returned_we_vote_id: ", ballot_returned_we_vote_id, ", ballot_location_shortcut:", ballot_location_shortcut, ", google_civic_election_id_from_url: ", google_civic_election_id_from_url);
    if (ballot_returned_we_vote_id || ballot_location_shortcut || google_civic_election_id_from_url) {
      if (ballot_location_shortcut !== "") {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, "", ballot_location_shortcut);
        // Change the URL to match
        historyPush(`${ballotBaseUrl}/${ballot_location_shortcut}`);
      } else if (ballot_returned_we_vote_id !== "") {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, ballot_returned_we_vote_id, "");
        // Change the URL to match
        historyPush(`${ballotBaseUrl}/id/${ballot_returned_we_vote_id}`);
      } else if (google_civic_election_id_from_url !== 0) {
        // Change the ballot on load to make sure we are getting what we expect from the url
        if (google_civic_election_id !== google_civic_election_id_from_url) {
          BallotActions.voterBallotItemsRetrieve(google_civic_election_id_from_url, "", "");
          // Change the URL to match
          let ballotElectionUrl = `${ballotBaseUrl}/election/${google_civic_election_id_from_url}`;
          if (this.props.active_route && this.props.active_route !== "") {
            ballotElectionUrl += `/${this.props.active_route}`;
          }
          historyPush(ballotElectionUrl);
        }
        // No change to the URL needed
        // Now set google_civic_election_id
        google_civic_election_id = google_civic_election_id_from_url;
      } else if (google_civic_election_id !== 0) {
        // No need to retrieve data again
        // Change the URL to match the current google_civic_election_id
        let ballotElectionUrl2 = `${ballotBaseUrl}/election/${google_civic_election_id}`;
        if (this.props.active_route && this.props.active_route !== "") {
          ballotElectionUrl2 += `/${this.props.active_route}`;
        }
        historyPush(ballotElectionUrl2);
      }
    }
    // DALE NOTE 2018-1-18 Commented this out because it will take voter away from voter guide. Needs further testing.
    // else if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false) { // No ballot found
    //   // console.log("if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false");
    //   historyPush("/settings/location");
    // }

    // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();
    SupportActions.positionsCountForAllBallotItems(google_civic_election_id);

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(this.props.organization.organization_we_vote_id, VoterStore.election_id());
    // TODO: COMMENT OUT because they were added to OrganizationVoterGuideTabs?
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, false, true);
    this.setState({
      current_google_civic_election_id: VoterStore.election_id(),
      current_organization_we_vote_id: this.props.organization.organization_we_vote_id,
      organization: this.props.organization,
      voter: VoterStore.getVoter(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuidePositions componentWillReceiveProps");
    // When a new organization is passed in, update this component to show the new data
    const different_election = this.state.current_google_civic_election_id !== VoterStore.election_id();
    const different_organization = this.state.current_organization_we_vote_id !== nextProps.organization.organization_we_vote_id;
    // console.log("VoterGuidePositions componentWillReceiveProps-different_election: ", different_election, " different_organization: ", different_organization);
    if (different_election || different_organization) {
      // console.log("VoterGuidePositions, componentWillReceiveProps, nextProps.organization: ", nextProps.organization);
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id, VoterStore.election_id());
      // // Positions for this organization, for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, true);
      // // Positions for this organization, NOT including for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, false, true);
      this.setState({
        current_google_civic_election_id: VoterStore.election_id(),
        current_organization_we_vote_id: nextProps.organization.organization_we_vote_id,
        organization: nextProps.organization,
      });
    }
    // We do not refresh the organization since we don't want to cause the positions to have to re-render and
    //  "flash" on the screen
    // this.setState({organization: nextProps.organization});
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // console.log("VoterGuidePositions onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been cleared
  clearSearch () {
    // console.log("VoterGuidePositions, clearSearch");
    this.setState({
      clearSearchTextNow: true,
      searchIsUnderway: false,
    });
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been triggered
  searchUnderway (searchIsUnderway) {
    // console.log("VoterGuidePositions, searchIsUnderway: ", searchIsUnderway);
    this.setState({
      clearSearchTextNow: false,
      searchIsUnderway,
    });
  }

  toggleEditMode () {
    if (this.state.editMode) {
      // If going from editMode == True to editMode == False, we want to refresh the positions
      OrganizationActions.positionListForOpinionMaker(this.state.organization.organization_we_vote_id, true, false, this.state.current_google_civic_election_id);
    }
    this.setState({ editMode: !this.state.editMode });
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      if (this.state.editMode) {
        // If going from editMode == True to editMode == False, we want to refresh the positions
        OrganizationActions.positionListForOpinionMaker(this.state.organization.organization_we_vote_id, true, false, this.state.current_google_civic_election_id);
      }
      scope.setState({ editMode: !this.state.editMode });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.organization) {
      // Wait until this.state.organization has been set to render
      return null;
    }
    const { organization_id, position_list_for_one_election, position_list_for_all_except_one_election } = this.state.organization;
    if (!organization_id) {
      return (
        <div className="card">
          <div className="card-main">
            <h4 className="h4">Voter guide not found.</h4>
          </div>
        </div>
      );
    }

    let looking_at_self = false;
    if (this.state.voter) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }

    // console.log("looking_at_self: ", looking_at_self);
    const election_name = BallotStore.currentBallotElectionName;
    const organization_name = capitalizeString(this.state.organization.organization_name);
    const title_text = `${organization_name} - We Vote`;
    const description_text = `See endorsements and opinions from ${organization_name} for the November election`;
    const at_least_one_position_found_for_this_election = position_list_for_one_election && position_list_for_one_election.length !== 0;
    const at_least_one_position_found_for_other_elections = position_list_for_all_except_one_election && position_list_for_all_except_one_election.length !== 0;

    return (
      <div className="opinions-followed__container">
        {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet
          title={title_text}
          meta={[{ name: "description", content: description_text }]}
        />
        <div className="card">
          <ul className="card-child__list-group">
            { looking_at_self && at_least_one_position_found_for_this_election && !this.state.searchIsUnderway ? (
              <a className="fa-pull-right u-push--md"
                onKeyDown={this.onKeyDownEditMode.bind(this)}
                onClick={this.toggleEditMode.bind(this)}
              >
                {this.state.editMode ? "Done Editing" : "Edit Positions"}
              </a>
            ) : null
            }
            <h4 className="h4 card__additional-heading">
              <span className="u-push--sm">{ election_name || "This Election"}</span>
              {/* {this.state.ballot_election_list.length > 1 ? <img src={cordovaDot("/img/global/icons/gear-icon.png")} className="d-print-none" role="button" onClick={this.toggleSelectBallotModal}
              alt='view your ballots' /> : null} */}
            </h4>
            { looking_at_self ? (
              <div className="u-margin-left--md u-push--md">
                <BallotSearchResults
                  clearSearchTextNow={this.state.clearSearchTextNow}
                  googleCivicElectionId={this.state.current_google_civic_election_id}
                  organizationWeVoteId={this.state.voter.linked_organization_we_vote_id}
                  searchUnderwayFunction={this.searchUnderway}
                />
              </div>
            ) : null
            }
            { at_least_one_position_found_for_this_election && !this.state.searchIsUnderway ? (
              <span>
                { looking_at_self ?
                  <YourPositionsVisibilityMessage positionList={position_list_for_one_election} /> :
                  null }
                { position_list_for_one_election.map(item => (
                  <OrganizationPositionItem
                    key={item.position_we_vote_id}
                    position={item}
                    organization={this.state.organization}
                    editMode={this.state.editMode}
                  />
                )) }
              </span>
            ) : null
            }
            {/* If the position_list_for_one_election comes back empty, display a message saying that there aren't any positions for this election. */}
            { at_least_one_position_found_for_this_election ?
              null : (
                <div className="card-child__content-text">
                  { looking_at_self ?
                    null : (
                      <div>
                        There are no positions for this election in this voter guide yet.
                        <br />
                        <br />
                        <VoterGuideRecommendationsFromOneOrganization organization_we_vote_id={this.state.organization.organization_we_vote_id} />
                        {/* TODO Add search all */}
                        {/* TODO List all elections this organization has a voter guide for. */}
                      </div>
                    )}
                </div>
              )}
          </ul>
        </div>

        {/* We do not display the positions for other elections if we have even one position for this election. */}
        { at_least_one_position_found_for_other_elections && !this.state.searchIsUnderway ? (
          <div className="card">
            <ul className="card-child__list-group">
              { position_list_for_all_except_one_election.length && !at_least_one_position_found_for_this_election ? (
                <span>
                  { looking_at_self ? (
                    <a
                      className="fa-pull-right u-push--md"
                      onKeyDown={this.onKeyDownEditMode.bind(this)}
                      onClick={this.toggleEditMode.bind(this)}
                    >
                      {this.state.editMode ? "Done Editing" : "Edit Positions"}
                    </a>
                  ) :
                    null }
                  <h4 className="card__additional-heading">Positions for Other Elections</h4>
                  { position_list_for_all_except_one_election.map(item => (
                    <OrganizationPositionItem
                      key={item.position_we_vote_id}
                      position={item}
                      organization={this.state.organization}
                      editMode={this.state.editMode}
                    />
                  )) }
                </span>
              ) : null
              }
            </ul>
          </div>
        ) : null
        }
        {this.state.searchIsUnderway ? (
          <span className="d-block d-sm-none">
            <FooterDoneBar doneFunction={this.clearSearch} doneButtonText="Clear Search" />
          </span>
        ) : null
        }
        <OpenExternalWebSite
          url="https://api.wevoteusa.org/vg/create/"
          className="opinions-followed__missing-org-link"
          target="_blank"
          title="Endorsements Missing?"
          body={<Button bsPrefix="u-stack--xs" variant="primary">Endorsements Missing?</Button>}
        />
        <div className="opinions-followed__missing-org-text u-stack--lg">
        Are there endorsements from
          {" "}
          {organization_name}
          {" "}
          that you expected to see?
        </div>
      </div>
    );
  }
}
