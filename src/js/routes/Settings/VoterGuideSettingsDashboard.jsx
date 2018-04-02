import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";
import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterGuideActions from "../../actions/VoterGuideActions";
import SettingsBannerAndOrganizationCard from "../../components/Settings/SettingsBannerAndOrganizationCard";
import VoterGuideSettingsGeneral from "../../components/Settings/VoterGuideSettingsGeneral";
import VoterGuideSettingsPositions from "../../components/Settings/VoterGuideSettingsPositions";
import VoterGuideSettingsSideBar from "../../components/Navigation/VoterGuideSettingsSideBar";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { isProperlyFormattedVoterGuideWeVoteId } from "../../utils/textFormat";

export default class VoterGuideSettingsDashboard extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: "",
      linkedOrganizationWeVoteId: "",
      organization: {},
      organizationName: "",
      voter: {},
      voterGuide: {},
      voterGuideWeVoteId: "",
    };
  }

  componentDidMount () {
    this.setState({ pathname: this.props.location.pathname });
    if (this.props.params.edit_mode) {
      this.setState({ editMode: this.props.params.edit_mode });
    } else {
      this.setState({ editMode: "general" });
    }
    // Get Voter Guide information
    let voterGuideFound = false;
    if (this.props.params.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(this.props.params.voter_guide_we_vote_id)) {
      this.setState({
        voterGuideWeVoteId: this.props.params.voter_guide_we_vote_id,
      });
      let voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.params.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
        });
        voterGuideFound = true;
        if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
          // console.log("VoterGuideSettingsDashboard componentDidMount retrieving ballot for: ", voterGuide.google_civic_election_id);
          BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, "", "");
        }
      }
    }
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    if (voter) {
      this.setState({ voter: voter });
      let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization: organization,
          });
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
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
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.edit_mode) {
      this.setState({ editMode: nextProps.params.edit_mode });
    }
    if (nextProps.params.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(nextProps.params.voter_guide_we_vote_id)) {
      this.setState({
        voterGuide: VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.params.voter_guide_we_vote_id),
        voterGuideWeVoteId: nextProps.params.voter_guide_we_vote_id,
      });
    }
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange (){
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linkedOrganizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange, this.state.voterGuideWeVoteId", this.state.voterGuideWeVoteId);
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      let voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange voterGuide FOUND");
        this.setState({
          voterGuide: voterGuide,
        });
        // May not be necessary
        // if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
        //   console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange retrieving ballot for: ", voterGuide.google_civic_election_id);
        //   BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, "", "");
        // }
      }
    }
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideSettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
      });
    }
    if (linkedOrganizationWeVoteId) {
      let voterGuideNeeded = true;
      if (this.state.voterGuide && this.state.voterGuide.we_vote_id) {
        voterGuideNeeded = false;
      }
      if (voterGuideNeeded) {
        // console.log("VoterGuideSettingsDashboard onVoterStoreChange calling VoterGuideActions.voterGuidesRetrieve");
        VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  render () {
    renderLog(__filename);
    let settingsComponentToDisplay = null;
    switch (this.state.editMode) {
      default:
      case "general":
        settingsComponentToDisplay = <VoterGuideSettingsGeneral voterGuideWeVoteId={this.state.voterGuideWeVoteId} />;
        break;
      case "positions":
        settingsComponentToDisplay = <VoterGuideSettingsPositions voterGuideWeVoteId={this.state.voterGuideWeVoteId} />;
        break;
    }

    return <div className="settings-dashboard">
      {/* Header Spacing for Desktop */}
      <div className="col-md-12 hidden-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>
      {/* Header Spacing for Mobile */}
      <div className="visible-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>

      {/* Desktop mode */}
      <div className="hidden-xs col-md-12  u-padding-top--md">
        <Link to="/settings/voterguidelist">&lt; Back to Your Voter Guides</Link>
      </div>
      {/* Mobile mode */}
      <div className="col-12 visible-xs">
        {this.state.voterGuideWeVoteId && this.state.voterGuideWeVoteId !== "" ?
          <Link to={"/vg/" + this.state.voterGuideWeVoteId + "/settings/menu"}>&lt; Voter Guide</Link> :
          <Link to={"/settings/voterguidesmenu"}>&lt; Voter Guide</Link>
        }
      </div>

      {/* Desktop left navigation + Settings content */}
      <div className="hidden-xs">
        <div className="container-fluid">
          <div className="row">
            {/* Desktop mode left navigation */}
            <div className="col-4 sidebar-menu">
              <VoterGuideSettingsSideBar editMode={this.state.editMode}
                                         organization={this.state.organization}
                                         voterGuide={this.state.voterGuide} />
            </div>
            {/* Desktop mode content */}
            <div className="col-8">
              {settingsComponentToDisplay}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Settings content */}
      <div className="visible-xs">
        {/* Mobile mode content */}
        <div className="col-12">
          {settingsComponentToDisplay}
        </div>
      </div>
    </div>;
  }
}
