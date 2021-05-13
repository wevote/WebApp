import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideSettingsSideBar from '../../components/Navigation/VoterGuideSettingsSideBar';
import SettingsBannerAndOrganizationCard from '../../components/Settings/SettingsBannerAndOrganizationCard';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class VoterGuideSettingsMenuMobile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editMode: '',
      linkedOrganizationWeVoteId: '',
      organization: {},
      voterGuide: {},
      voterGuideWeVoteId: '',
    };
  }

  componentDidMount () {
    const { match: { params: { edit_mode: editMode, voter_guide_we_vote_id: VoterGuideWeVoteId } } } = this.props;
    if (editMode) {
      this.setState({ editMode });
    } else {
      this.setState({ editMode: '' });
    }
    // Get Voter Guide information
    let voterGuideFound = false;
    if (VoterGuideWeVoteId) {
      this.setState({
        voterGuideWeVoteId: VoterGuideWeVoteId,
      });
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(VoterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
        voterGuideFound = true;
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

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { match: { params } } = this.props;
    const { match: { nextParams } } = nextProps;
    if (nextParams.edit_mode) {
      this.setState({ editMode: nextParams.edit_mode });
    }
    if (nextParams.voter_guide_we_vote_id) {
      this.setState({
        voterGuide: VoterGuideStore.getVoterGuideByVoterGuideId(params.voter_guide_we_vote_id),
        voterGuideWeVoteId: nextParams.voter_guide_we_vote_id,
      });
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { linkedOrganizationWeVoteId } = this.state;
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    const { voterGuideWeVoteId } = this.state;
    // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange, voterGuideWeVoteId", voterGuideWeVoteId);
    if (voterGuideWeVoteId) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        // console.log("VoterGuideSettingsDashboard onVoterGuideStoreChange voterGuide FOUND");
        this.setState({
          voterGuide,
        });
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
    renderLog('VoterGuideSettingsMenuMobile');  // Set LOG_RENDER_EVENTS to log all renders
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

        {/* Mobile WebApp navigation */}
        <div className="container-fluid">
          <div className="row">
            <VoterGuideSettingsSideBar
              editMode={this.state.editMode}
              voterGuide={this.state.voterGuide}
            />
          </div>
        </div>
      </div>
    );
  }
}
VoterGuideSettingsMenuMobile.propTypes = {
  match: PropTypes.object,
};
