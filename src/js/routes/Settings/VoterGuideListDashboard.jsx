import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SelectVoterGuidesSideBar from "../../components/Navigation/SelectVoterGuidesSideBar";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import SettingsBannerAndOrganizationCard from "../../components/Settings/SettingsBannerAndOrganizationCard";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuideListDashboard extends Component {
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
    if (this.props.params.edit_mode) {
      this.setState({ editMode: this.props.params.edit_mode });
    } else {
      this.setState({ editMode: "address" });
    }
    this.setState({ pathname: this.props.location.pathname });
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
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
    }
  }

  componentWillReceiveProps (nextProps) {
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentWillReceiveProps linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
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
    }
    if (nextProps.params.edit_mode) {
      this.setState({ editMode: nextProps.params.edit_mode });
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linkedOrganizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    this.setState({ transitioning: false });
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId: linkedOrganizationWeVoteId });
    }
  }

  render () {
    renderLog(__filename);

    let settingsComponentToDisplay = null;
    switch (this.state.editMode) {
      default:
      case "intro":
        settingsComponentToDisplay = <div>Create your own voter guide by clicking "Create New Voter Guide".</div>;
        break;
    }

    return <div className="settings-dashboard">
      {/* Header Spacing for Desktop */}
      <div className="hidden-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>
      {/* Header Spacing for Mobile */}
      <div className="visible-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>

      <div className="container-fluid">
        <div className="row">
          {/* Mobile and Desktop mode */}
          <div className="col-12 col-md-4 sidebar-menu">
            <SelectVoterGuidesSideBar />
          </div>

          <div className="hidden-xs col-md-8">
            { !this.state.voter.is_signed_in ?
              <SettingsAccount /> :
              null }
            <div className="card">
              <div className="card-main">
                {settingsComponentToDisplay}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>;
  }
}
