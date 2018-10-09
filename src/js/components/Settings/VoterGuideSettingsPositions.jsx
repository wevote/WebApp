import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import BallotSearchResults from "../Ballot/BallotSearchResults";
import BallotStore from "../../stores/BallotStore";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import { historyPush } from "../../utils/cordovaUtils";
import FooterDoneBar from "../Navigation/FooterDoneBar";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import YourPositionsVisibilityMessage from "../../components/VoterGuide/YourPositionsVisibilityMessage";
import { isProperlyFormattedVoterGuideWeVoteId } from "../../utils/textFormat";


export default class VoterGuideSettingsPositions extends Component {
  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    voterGuideName: PropTypes.string,
    voterGuideWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      clearSearchTextNow: false,
      current_google_civic_election_id: 0,
      current_organization_we_vote_id: "",
      editMode: true,
      organization: {},
      searchIsUnderway: false,
      voter: {},
      voterGuideName: "",
      voterGuideWeVoteId: ""
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
    this.goToVoterGuideDisplay = this.goToVoterGuideDisplay.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("VoterGuideSettingsPositions componentDidMount this.props.voterGuideWeVoteId:", this.props.voterGuideWeVoteId);
    // Get Voter Guide information
    this.setState({
      editMode: true,
      voterGuideWeVoteId: this.props.voterGuideWeVoteId,
    });
    let voterGuide;
    let voterGuideFound = false;
    if (this.props.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
          voterGuideName: voterGuide.voter_guide_display_name
        });
        voterGuideFound = true;
      }
    }
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter: voter });
      let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsPositions componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization: organization,
          });
          // Positions for this organization, for this election
          if (voterGuide && voterGuide.google_civic_election_id) {
            OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
            OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
          }
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
            OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
        if (!voterGuideFound) {
          // console.log("VoterGuideSettingsDashboard voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve");
          VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        }
      }
    }

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuideSettingsPositions componentWillReceiveProps nextProps.voterGuideWeVoteId:", nextProps.voterGuideWeVoteId);
    this.setState({
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
    });
    let voterGuide;
    let voterGuideFound = false;
    if (nextProps.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
          voterGuideName: voterGuide.voter_guide_display_name
        });
        voterGuideFound = true;
      }
    }
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter: voter });
      let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsPositions componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization: organization,
          });
          // Positions for this organization, for this election
          // Might cause a loop
          // OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
            OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
        if (!voterGuideFound) {
          // console.log("VoterGuideSettingsPositions voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve");
          VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        }
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange (){
    // console.log("VoterGuideSettingsPositions onOrganizationStoreChange, org_we_vote_id: ", this.state.linkedOrganizationWeVoteId);
    let organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    this.setState({
      organization: organization,
    });
    // Positions for this organization, for this voter / election
    // OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true);
  }

  onVoterStoreChange () {
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    let update_voter = true;
    if (voter && voter.we_vote_id && this.state.voter && this.state.voter.we_vote_id && voter.we_vote_id === this.state.voter.we_vote_id) {
      // console.log("VoterGuideSettingsPositions, onVoterStoreChange, do NOT update_voter");
      update_voter = false;
    }
    if (update_voter) {
      this.setState({ voter: voter });
      let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsPositions componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization: organization,
          });
          // Positions for this organization, for this election
          // Might cause a loop
          // OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
            OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
      }
    }
  }

  onVoterGuideStoreChange (){
    // console.log("VoterGuideSettingsPositions onVoterGuideStoreChange");
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      let voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
          voterGuideName: voterGuide.voter_guide_display_name
        });
      }
    }
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been cleared
  clearSearch () {
    // console.log("VoterGuideSettingsPositions, clearSearch");
    this.setState({
      clearSearchTextNow: true,
      searchIsUnderway: false
    });
  }

  goToVoterGuideDisplay () {
    let voterGuideDisplay = "/ballot";
    if (this.state.voterGuide) {
      voterGuideDisplay = "/voterguide/" + this.state.voterGuide.organization_we_vote_id + "/ballot/election/" + this.state.voterGuide.google_civic_election_id + "/ballot";
    }
    historyPush(voterGuideDisplay);
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been triggered
  searchUnderway (searchIsUnderway) {
    // console.log("VoterGuideSettingsPositions, searchIsUnderway: ", searchIsUnderway);
    this.setState({
      clearSearchTextNow: false,
      searchIsUnderway: searchIsUnderway
    });
  }

  toggleEditMode () {
    if (this.state.editMode) {
      // If going from editMode == True to editMode == False, we want to refresh the positions
      OrganizationActions.positionListForOpinionMaker(this.state.organization.organization_we_vote_id, true, false, this.state.current_google_civic_election_id);
    }
    this.setState({editMode: !this.state.editMode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      if (this.state.editMode) {
        // If going from editMode == True to editMode == False, we want to refresh the positions
        OrganizationActions.positionListForOpinionMaker(this.state.organization.organization_we_vote_id, true, false, this.state.current_google_civic_election_id);
      }
      scope.setState({editMode: !this.state.editMode});
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter || !this.state.voterGuide || !this.state.organization) {
      return LoadingWheel;
    }

    const { position_list_for_one_election } = this.state.organization;

    let looking_at_self = false;
    if (this.state.voter) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }

    // console.log("looking_at_self: ", looking_at_self);
    const election_name = BallotStore.currentBallotElectionName;
    const at_least_one_position_found_for_this_election = position_list_for_one_election && position_list_for_one_election.length !== 0;

    return <div className="">
      <Helmet title={"Voter Guide Positions - We Vote"} />
      <BrowserPushMessage incomingProps={this.props} />
      { this.state.voter.is_signed_in ?
        null :
        <SettingsAccount />
      }
      <div className="card">
        <div className="card-main">
          <h3 className="h3">Your Positions</h3>
          { looking_at_self && at_least_one_position_found_for_this_election && !this.state.searchIsUnderway ?
            <a className="fa-pull-right u-push--md"
               tabIndex="0"
               onKeyDown={this.onKeyDownEditMode.bind(this)}
               onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit Positions"}</a> :
            null }
          <h4 className="h4 card__additional-heading">
             <span className="u-push--sm">{ election_name ? election_name : "This Election"}</span>
          </h4>
          { looking_at_self ?
            <div className="u-margin-left--md u-push--md">
              Search for candidates or measures to add to your voter guide.
              <BallotSearchResults clearSearchTextNow={this.state.clearSearchTextNow}
                                   googleCivicElectionId={this.state.voterGuide.google_civic_election_id}
                                   organizationWeVoteId={this.state.voter.linked_organization_we_vote_id}
                                   searchUnderwayFunction={this.searchUnderway} />
            </div> :
            null }
          { at_least_one_position_found_for_this_election && !this.state.searchIsUnderway ?
            <span>
              { looking_at_self ?
                <YourPositionsVisibilityMessage positionList={position_list_for_one_election} /> :
                null }
              { position_list_for_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization}
                                                 editMode={this.state.editMode}
                       />;
              }) }
            </span> :
            null
          }
        </div>
      </div>
      {/* !this.state.searchIsUnderway ?
        <div>
          <VoterGuideSettingsSuggestedBallotItems maximumSuggestedItems={5} />
        </div> :
        null */}
      <div className="fa-pull-right">
        <button type="button" className="btn btn-lg btn-success"
                onClick={this.goToVoterGuideDisplay}>
          <span className="d-none d-sm-block">See Full Ballot to Enter More Positions&nbsp;&nbsp;&gt;</span>
          <span className="d-block d-sm-none">Enter More Positions&nbsp;&nbsp;&gt;</span>
        </button>
      </div>


      {this.state.searchIsUnderway ?
        <span className="d-block d-sm-none">
          <FooterDoneBar doneFunction={this.clearSearch} doneButtonText={"Clear Search"}/>
        </span> :
        null
      }
    </div>;
  }
}
