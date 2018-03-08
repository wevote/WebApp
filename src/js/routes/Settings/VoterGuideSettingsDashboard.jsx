import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FollowToggle from "../../components/Widgets/FollowToggle";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import SettingsNotifications from "../../components/Settings/SettingsNotifications";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideSettingsGeneral from "../../components/Settings/VoterGuideSettingsGeneral";
import VoterGuideSettingsSideBar from "../../components/Navigation/VoterGuideSettingsSideBar";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuideSettingsDashboard extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: "",
      linked_organization_we_vote_id: "",
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
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter Guide information
    let voterGuideFound = false;
    if (this.props.params.voter_guide_we_vote_id) {
      this.setState({
        voterGuideWeVoteId: this.props.params.voter_guide_we_vote_id,
      });
      let voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.params.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
        });
        voterGuideFound = true;
      }
    }
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    if (voter) {
      this.setState({ voter: voter });
      let linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsDashboard componentDidMount linked_organization_we_vote_id: ", linked_organization_we_vote_id);
      if (linked_organization_we_vote_id) {
        this.setState({
          linked_organization_we_vote_id: linked_organization_we_vote_id,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linked_organization_we_vote_id);
        if (organization) {
          this.setState({
            organization: organization,
          });
        } else {
          OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
        }
        if (!voterGuideFound) {
          // console.log("VoterGuideSettingsDashboard voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve");
          VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
        }
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.edit_mode) {
      this.setState({ editMode: nextProps.params.edit_mode });
    }
    if (nextProps.params.voter_guide_we_vote_id) {
      this.setState({
        voterGuide: VoterGuideStore.getVoterGuideByVoterGuideId(this.props.params.voter_guide_we_vote_id),
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
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linked_organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linked_organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange, this.state.voterGuideWeVoteId", this.state.voterGuideWeVoteId);
    if (this.state.voterGuideWeVoteId) {
      let voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange voterGuide FOUND");
        this.setState({
          voterGuide: voterGuide,
        });
      }
    }
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
    let linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideSettingsDashboard onVoterStoreChange linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id && this.state.linked_organization_we_vote_id !== linked_organization_we_vote_id) {
      OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
      this.setState({
        linked_organization_we_vote_id: linked_organization_we_vote_id,
      });
    }
    if (linked_organization_we_vote_id) {
      let voterGuideNeeded = true;
      if (this.state.voterGuide && this.state.voterGuide.we_vote_id) {
        voterGuideNeeded = false;
      }
      if (voterGuideNeeded) {
        // console.log("VoterGuideSettingsDashboard onVoterStoreChange calling VoterGuideActions.voterGuidesRetrieve");
        VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      }
    }
  }

  render () {
    let settingsComponentToDisplay = null;
    switch (this.state.editMode) {
      default:
      case "general":
        settingsComponentToDisplay = <VoterGuideSettingsGeneral />;
        break;
      case "notifications":
        settingsComponentToDisplay = <SettingsNotifications />;
        break;
      case "account":
        settingsComponentToDisplay = <SettingsAccount />;
        break;
    }

    return <div className="settings-dashboard">
      <div className="page-content-container">
        <div className="container-fluid">
          <div className="row ballot__body">
            { this.state.organization && this.state.organization.organization_we_vote_id ?
              <div>
                <div className="col-md-12">
                  { this.state.organization && this.state.organization.organization_banner_url !== "" ?
                    <div className="organization-banner-image-div">
                      <img className="organization-banner-image-img" src={this.state.organization.organization_banner_url} />
                    </div> :
                    <div className="organization-banner-image-non-twitter-users" />
                  }
                </div>
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-main">
                      <FollowToggle we_vote_id={this.state.organization.organization_we_vote_id} />
                      <OrganizationCard organization={this.state.organization} />
                    </div>
                  </div>
                </div>
              </div> :
              null }

            <div className="col-md-12">
              <Link to="/settings/address">&lt; Back to Personal Settings</Link>
            </div>

            <div className="col-md-3 hidden-xs sidebar-menu">
              <VoterGuideSettingsSideBar editMode={this.state.editMode}
                                         organization={this.state.organization}
                                         voterGuide={this.state.voterGuide} />
            </div>

            <div className="col-xs-12 col-md-9">
              {settingsComponentToDisplay}
            </div>

          </div>
        </div>
      </div>
    </div>;
  }
}
