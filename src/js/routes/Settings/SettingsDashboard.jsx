import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SelectVoterGuidesSideBar from "../../components/Navigation/SelectVoterGuidesSideBar";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import SettingsAddress from "../../components/Settings/SettingsAddress";
import SettingsBannerAndOrganizationCard from "../../components/Settings/SettingsBannerAndOrganizationCard";
import SettingsElection from "../../components/Settings/SettingsElection";
import SettingsNotifications from "../../components/Settings/SettingsNotifications";
import SettingsProfile from "../../components/Settings/SettingsProfile";
import SettingsPersonalSideBar from "../../components/Navigation/SettingsPersonalSideBar";
import VoterGuideActions from "../../actions/VoterGuideActions";
import SettingsIssueLinks from "../../components/Settings/SettingsIssueLinks"; // TODO: To be updated
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { isWebApp } from "../../utils/cordovaUtils";

export default class SettingsDashboard extends Component {
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
      sliderOpen: false,
      voter: {},
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

  onOrganizationStoreChange (){
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
    // console.log("SettingsDashboard render");
    let settingsComponentToDisplay = null;
    switch (this.state.editMode) {
      case "account":
        settingsComponentToDisplay = <SettingsAccount />;
        break;
      case "address":
        settingsComponentToDisplay = <SettingsAddress />;
        break;
      case "election":
        settingsComponentToDisplay = <SettingsElection />;
        break;
      case "issues":
        settingsComponentToDisplay = <SettingsIssueLinks />;  // TODO: To be implemented
        break;
      case "notifications":
        settingsComponentToDisplay = <SettingsNotifications />;
        break;
      default:
      case "profile":
        settingsComponentToDisplay = <SettingsProfile />;
        break;
    }

    // console.log("this.state.organization.organization_banner_url:", this.state.organization.organization_banner_url);
    return <div className="settings-dashboard">
      {/* Header Spacing for Desktop */}
      <div className="col-md-12 hidden-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>
      {/* Header Spacing for Mobile */}
      <div className="visible-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>

      <div className="visible-xs u-padding-top--md">
        <Link to={isWebApp() ? "/settings/menu" : "/more/hamburger"}>&lt; Back to Your Settings</Link>
      </div>

      {/* Desktop left navigation + Settings content */}
      <div className="hidden-xs">
        <div className="container-fluid">
          <div className="row">
            {/* Desktop mode left navigation */}
            <div className="col-4 sidebar-menu">
              <SettingsPersonalSideBar editMode={this.state.editMode} isSignedIn={this.state.voter.is_signed_in} />

              <SelectVoterGuidesSideBar />

              <h4 className="text-left" />
              <div className="terms-and-privacy u-padding-top--md">
                <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy Policy</Link>
              </div>
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
