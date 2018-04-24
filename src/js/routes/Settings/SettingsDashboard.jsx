import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import { historyPush, isWebApp } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
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
import SettingsIssueLinks from "../../components/Settings/SettingsIssueLinks";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

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
      organizationType: ""
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
    let organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_type) {
      this.setState({
        organization,
        organizationType: organization.organization_type,
      });
    }
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
      case "account":
        settingsComponentToDisplay = <SettingsAccount />;
        break;
      case "address":
        settingsComponentToDisplay = <SettingsAddress />;
        break;
      case "election":
        settingsComponentToDisplay = <SettingsElection />;
        break;
      case "issues_linked":
      case "issues_to_link":
        settingsComponentToDisplay = <SettingsIssueLinks organization_we_vote_id={this.state.voter.we_vote_id} params={{active_tab: this.state.editMode}}/>;
        break;
      case "issues":
        settingsComponentToDisplay = <SettingsIssueLinks organization_we_vote_id={this.state.voter.we_vote_id} params={{active_tab: "issues_linked"}}/>;
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
    return <div className={ isWebApp() ? "settings-dashboard" : "settings-dashboard SettingsCardBottomCordova" } >
      {/* Header Spacing for Desktop */}
      { isWebApp() &&
        <div className={isWebApp() ? "col-md-12 hidden-xs hidden-print" : "col-md-12 hidden-print"}>
          <SettingsBannerAndOrganizationCard organization={this.state.organization}/>
        </div>
      }
      {/* Header Spacing for Mobile */}
      <div className={ isWebApp() ? "visible-xs hidden-print" : "hidden-print" } >
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>

      <div className={ isWebApp() ? "visible-xs u-padding-top--md" : "u-padding-top--md"}>
        <span className={"btn u-padding-left--sm u-padding-bottom--sm"}>
          <Button className={"btn btn-sm btn-default u-link-color"}
                onClick={ () => historyPush(isWebApp() ? "/settings/menu" : "/more/hamburger") }>
            <span className="fa fa-arrow-left"/> {"Settings"}
          </Button>
        </span>
      </div>

      {/* Desktop left navigation + Settings content.
          WebApp only, since the dashboard doesn't go well with the HamburgerMenu on iPad */}
      { isWebApp() &&
        <div className="hidden-xs">
          <div className="container-fluid">
            <div className="row">
              {/* Desktop mode left navigation */}
              <div className="col-4 sidebar-menu">
                <SettingsPersonalSideBar editMode={this.state.editMode} isSignedIn={this.state.voter.is_signed_in}/>

                <SelectVoterGuidesSideBar/>

                <h4 className="text-left"/>
                <div className="terms-and-privacy u-padding-top--md">
                  <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy
                  Policy</Link>
                </div>
              </div>
              {/* Desktop mode content */}
              <div className="col-8">
                {settingsComponentToDisplay}
              </div>
            </div>
          </div>
        </div>
      }

      {/* Mobile Settings content */}
      { isWebApp() ?
        <div className="visible-xs">
          {/* Mobile mode content */}
          <div className="col-12">
            {settingsComponentToDisplay}
          </div>
        </div> :
        <div className="col-12">
          {settingsComponentToDisplay}
        </div>
      }
    </div>;
  }
}
