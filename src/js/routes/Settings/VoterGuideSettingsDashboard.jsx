import React, { Component } from "react";
import PropTypes from "prop-types";
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
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: "",
      linkedOrganizationWeVoteId: "",
      organization: {},
      voterGuide: {},
      voterGuideWeVoteId: "",
    };
  }

  componentDidMount () {
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
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.params.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
        voterGuideFound = true;
        if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
          // console.log("VoterGuideSettingsDashboard componentDidMount retrieving ballot for: ", voterGuide.google_civic_election_id);
          BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, "", "");
        }
      }
    }
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    if (voter) {
      const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization,
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

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linkedOrganizationWeVoteId);
    const { linkedOrganizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange, this.state.voterGuideWeVoteId", this.state.voterGuideWeVoteId);
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange voterGuide FOUND");
        this.setState({
          voterGuide,
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
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideSettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
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
        settingsComponentToDisplay = <VoterGuideSettingsGeneral />;
        break;
      case "positions":
        settingsComponentToDisplay = <VoterGuideSettingsPositions voterGuideWeVoteId={this.state.voterGuideWeVoteId} />;
        break;
    }

    return (
      <div className="settings-dashboard">
        {/* Header Spacing for Desktop */}
        <div className="col-md-12 d-none d-sm-block d-print-none">
          <SettingsBannerAndOrganizationCard organization={this.state.organization} />
        </div>
        {/* Header Spacing for Mobile */}
        <div className="d-block d-sm-none d-print-none">
          <SettingsBannerAndOrganizationCard organization={this.state.organization} />
        </div>

        {/* Desktop left navigation + Settings content */}
        <div className="d-none d-sm-block">
          <div className="container-fluid">
            <div className="row">
              {/* Desktop mode left navigation */}
              <div className="col-4 sidebar-menu">
                <VoterGuideSettingsSideBar
                  editMode={this.state.editMode}
                  voterGuide={this.state.voterGuide}
                />
              </div>
              {/* Desktop mode content */}
              <div className="col-8">
                {settingsComponentToDisplay}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Settings content */}
        <div className="d-block d-sm-none">
          {/* Mobile mode content */}
          <div className="col-12">
            {settingsComponentToDisplay}
          </div>
        </div>
      </div>
    );
  }
}
