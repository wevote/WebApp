import React, { Component } from "react";
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
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: "",
      organization: {},
    };
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuidesMenuMobile componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
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

  componentWillReceiveProps () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuidesMenuMobile componentWillReceiveProps linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
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
    const { linkedOrganizationWeVoteId } = this.state;
    // console.log("VoterGuidesMenuMobile onOrganizationStoreChange, linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuidesMenuMobile onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  render () {
    renderLog(__filename);

    return (
      <div className="settings-dashboard">
        {/* Header Spacing for Desktop */}
        <div className="d-none d-sm-block d-print-none">
          <SettingsBannerAndOrganizationCard organization={this.state.organization} />
        </div>
        {/* Header Spacing for Mobile */}
        <div className="d-block d-sm-none d-print-none">
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
      </div>
    );
  }
}
