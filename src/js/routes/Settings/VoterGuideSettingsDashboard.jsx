import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import AppStore from '../../stores/AppStore';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideSettingsAddPositions from '../../components/Settings/VoterGuideSettingsAddPositions';
import VoterGuideSettingsPositions from '../../components/Settings/VoterGuideSettingsPositions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';
// import { cordovaScrollablePaneTopPadding } from '../../utils/cordovaOffsets';

class VoterGuideSettingsDashboard extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      getVoterGuideSettingsDashboardEditMode: '',
      linkedOrganizationWeVoteId: '',
      voterGuide: {},
      voterGuideWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('VoterGuideSettingsDashboard componentDidMount');
    // if (this.props.params.edit_mode) {  // We are going to ignore the incoming edit_mode
    this.onAppStoreChange();
    // Get Voter Guide information
    let voterGuideFound = false;
    if (this.props.params.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(this.props.params.voter_guide_we_vote_id)) {
      this.setState({
        voterGuideWeVoteId: this.props.params.voter_guide_we_vote_id,
      });
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.params.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
        voterGuideFound = true;
        if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
          // console.log('VoterGuideSettingsDashboard componentDidMount retrieving ballot for: ', voterGuide.google_civic_election_id);
          BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, '', '');
        }
      }
    }
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    if (voter) {
      const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log('VoterGuideSettingsDashboard componentDidMount linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            // organization,
          });
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
        }
        if (!voterGuideFound) {
          // console.log('VoterGuideSettingsDashboard voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve');
          VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        }
      }
    }
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuideSettingsDashboard componentDidMount');
    this.onAppStoreChange();
    if (nextProps.params.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(nextProps.params.voter_guide_we_vote_id)) {
      this.setState({
        voterGuide: VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.params.voter_guide_we_vote_id),
        voterGuideWeVoteId: nextProps.params.voter_guide_we_vote_id,
      });
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      getVoterGuideSettingsDashboardEditMode: AppStore.getVoterGuideSettingsDashboardEditMode(),
    });
  }

  onOrganizationStoreChange () {
    // console.log('VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ', this.state.linkedOrganizationWeVoteId);
    // const { linkedOrganizationWeVoteId } = this.state;
    this.setState({
      // organization: OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // console.log('VoterGuideSettingsDashboard onVoterGuideStoreChange, this.state.voterGuideWeVoteId', this.state.voterGuideWeVoteId);
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        // console.log('VoterGuideSettingsDashboard onVoterGuideStoreChange voterGuide FOUND');
        this.setState({
          voterGuide,
        });
        // May not be necessary
        // if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
        //   console.log('VoterGuideSettingsDashboard onVoterGuideStoreChange retrieving ballot for: ', voterGuide.google_civic_election_id);
        //   BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, "", "");
        // }
      }
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log('VoterGuideSettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
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
        // console.log('VoterGuideSettingsDashboard onVoterStoreChange calling VoterGuideActions.voterGuidesRetrieve');
        VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  render () {
    renderLog(__filename);
    const { getVoterGuideSettingsDashboardEditMode } = this.state;
    // console.log('VoterGuideSettingsDashboard, getVoterGuideSettingsDashboardEditMode:', getVoterGuideSettingsDashboardEditMode);

    // const cordovaPaddingTop = cordovaScrollablePaneTopPadding();
    // const paddingTop = cordovaPaddingTop || '125px';
    const paddingTop = '10px';

    return (
      <Wrapper padTop={paddingTop}>
        <EndorsementListBody>
          {/* Body of page "/vg/wvYYvgYY/settings/positions" */}
          {getVoterGuideSettingsDashboardEditMode === 'addpositions' ? (
            <VoterGuideSettingsAddPositions voterGuideWeVoteId={this.state.voterGuideWeVoteId} />
          ) : (
            <VoterGuideSettingsPositions voterGuideWeVoteId={this.state.voterGuideWeVoteId} />
          )}
        </EndorsementListBody>
      </Wrapper>
    );
  }
}

const styles = () => ({
  formControl: {
    width: '100%',
  },
});

const Wrapper = styled.div`
  padding-top: ${({ padTop }) => padTop};
`;

const EndorsementListBody = styled.div`
`;

export default withStyles(styles)(VoterGuideSettingsDashboard);
