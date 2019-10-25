import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import SelectVoterGuidesSideBar from '../../components/Navigation/SelectVoterGuidesSideBar';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

export default class VoterGuidesMenuMobile extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log('VoterGuidesMenuMobile componentDidMount linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (!(organization && organization.organization_we_vote_id)) {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillReceiveProps () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log('VoterGuidesMenuMobile componentWillReceiveProps linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (!(organization && organization.organization_we_vote_id)) {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log('VoterGuidesMenuMobile onVoterStoreChange linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  render () {
    renderLog('VoterGuidesMenuMobile');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <div className="settings-dashboard">
        {/* Mobile WebApp navigation */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <SelectVoterGuidesSideBar />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
