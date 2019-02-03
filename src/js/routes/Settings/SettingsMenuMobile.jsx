import React, { Component } from "react";
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
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: "",
      organization: {},
      voter: {},
      organizationType: "",
    };
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization,
          organizationType: organization.organization_type,
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillReceiveProps () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentWillReceiveProps linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
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
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);// this.state.linkedOrganizationWeVoteId);
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linked_organization_we_vote_id);
    if (organization && organization.organization_type) {
      this.setState({
        organization,
        organizationType: organization.organization_type,
      });
    }
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
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
              <div className="h4 text-left" />
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
