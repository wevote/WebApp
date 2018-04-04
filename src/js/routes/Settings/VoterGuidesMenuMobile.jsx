import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsBannerAndOrganizationCard from "../../components/Settings/SettingsBannerAndOrganizationCard";
import SelectVoterGuidesSideBar from "../../components/Navigation/SelectVoterGuidesSideBar";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuidesMenuMobile extends Component {
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
    let voter = VoterStore.getVoter();
    let linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id) {
      VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      this.setState({
        linked_organization_we_vote_id: linked_organization_we_vote_id,
      });
      let organization = OrganizationStore.getOrganizationByWeVoteId(linked_organization_we_vote_id);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization: organization,
        });
      } else {
        OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    let voter = VoterStore.getVoter();
    let linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentWillReceiveProps linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id && this.state.linked_organization_we_vote_id !== linked_organization_we_vote_id) {
      VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      this.setState({
        linked_organization_we_vote_id: linked_organization_we_vote_id,
      });
      let organization = OrganizationStore.getOrganizationByWeVoteId(linked_organization_we_vote_id);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization: organization,
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

  onOrganizationStoreChange (){
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linked_organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linked_organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    this.setState({ transitioning: false });
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
    let linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linked_organization_we_vote_id && this.state.linked_organization_we_vote_id !== linked_organization_we_vote_id) {
      OrganizationActions.organizationRetrieve(linked_organization_we_vote_id);
      VoterGuideActions.voterGuidesRetrieve(linked_organization_we_vote_id);
      this.setState({ linked_organization_we_vote_id: linked_organization_we_vote_id });
    }
  }

  openSlider () {
    this.setState({
      sliderOpen: true
    });
  }
  closeSlider () {
    this.setState({
      sliderOpen: false
    });
  }

  render () {
    renderLog(__filename);

    return <div className="settings-dashboard">
      {/* Header Spacing for Desktop */}
      <div className="hidden-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>
      {/* Header Spacing for Mobile */}
      <div className="visible-xs hidden-print">
        <SettingsBannerAndOrganizationCard organization={this.state.organization} />
      </div>

      {/* Mobile WebApp navigation */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <SelectVoterGuidesSideBar onOwnPage />
          </div>
        </div>
      </div>
    </div>;
  }
}
