import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsBannerAndOrganizationCard from "../../components/Settings/SettingsBannerAndOrganizationCard";
import SettingsPersonalSideBar from "../../components/Navigation/SettingsPersonalSideBar";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class SettingsMenuMobile extends Component {
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
      sliderOpen: false,
      voter: {},
      organizationType: "",
    };
    this.closeSlider = this.closeSlider.bind(this);
    this.openSlider = this.openSlider.bind(this);
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
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id) {
      VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      this.setState({
        linked_organization_we_vote_id,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linked_organization_we_vote_id);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization,
          organizationType: organization.organization_type,
        });
      } else {
        OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentWillReceiveProps linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id && this.state.linked_organization_we_vote_id !== linked_organization_we_vote_id) {
      VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      this.setState({
        linked_organization_we_vote_id,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linked_organization_we_vote_id);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization,
        });
      } else {
        OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
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
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linked_organization_we_vote_id);// this.state.linkedOrganizationWeVoteId);
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linked_organization_we_vote_id);
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
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id && this.state.linked_organization_we_vote_id !== linked_organization_we_vote_id) {
      OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
      VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      this.setState({ linked_organization_we_vote_id });
    }
  }

  openSlider () {
    this.setState({
      sliderOpen: true,
    });
  }

  closeSlider () {
    this.setState({
      sliderOpen: false,
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return null;
    }

    return (
      <div className="settings-dashboard">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />

        {/* Mobile WebApp navigation */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <SettingsPersonalSideBar onOwnPage isSignedIn={this.state.voter.is_signed_in} organizationType={this.state.organizationType} />
              <h4 className="text-left" />
              <div className="terms-and-privacy u-padding-top--md">
                <Link to="/more/terms">Terms of Service</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/more/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
