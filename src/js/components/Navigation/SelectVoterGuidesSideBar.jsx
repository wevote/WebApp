import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import ElectionStore from '../../stores/ElectionStore';
import { renderLog } from '../../utils/logging';
import SelectVoterGuidesSideBarLink from './SelectVoterGuidesSideBarLink';
import VoterGuideChooseElectionModal from '../VoterGuide/VoterGuideChooseElectionModal';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

export default class SelectVoterGuidesSideBar extends Component {
  static propTypes = {
    voterGuideWeVoteIdSelected: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      showNewVoterGuideModal: false,
      voterGuideWeVoteIdSelected: '',
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      showNewVoterGuideModal: AppStore.showNewVoterGuideModal(),
      voterGuideWeVoteIdSelected: this.props.voterGuideWeVoteIdSelected,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ voterGuideWeVoteIdSelected: nextProps.voterGuideWeVoteIdSelected });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   if (this.state.showNewVoterGuideModal !== nextState.showNewVoterGuideModal) {
  //     return true;
  //   }
  //   return false;
  // }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      showNewVoterGuideModal: AppStore.showNewVoterGuideModal(),
    });
  }

  onVoterGuideStoreChange () {
    const voter = VoterStore.getVoter();
    const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;
    // console.log("SelectVoterGuidesSideBar onVoterGuideStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  closeNewVoterGuideModal () {
    // console.log('HeaderBar closeNewVoterGuideModal');
    AppActions.setShowNewVoterGuideModal(false);
  }

  openNewVoterGuideModal () {
    // console.log('SettingsDomain openNewVoterGuideModal');
    AppActions.setShowNewVoterGuideModal(true);
  }

  render () {
    renderLog('SelectVoterGuidesSideBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { showNewVoterGuideModal } = this.state;
    const voterGuidesOwnedByVoter = VoterGuideStore.getAllVoterGuidesOwnedByVoter();
    let voterGuideLinksHtml = <span />;
    if (voterGuidesOwnedByVoter) {
      voterGuideLinksHtml = voterGuidesOwnedByVoter.map((voterGuide) => {
        const displaySubtitles = true;
        if (voterGuide && voterGuide.we_vote_id) {
          return (
            <div key={`voter-guides-${voterGuide.we_vote_id}`}>
              <SelectVoterGuidesSideBarLink
                linkTo={`/vg/${voterGuide.we_vote_id}/settings/positions`}
                label={ElectionStore.getElectionName(voterGuide.google_civic_election_id)}
                subtitle={ElectionStore.getElectionDayText(voterGuide.google_civic_election_id)}
                displaySubtitles={displaySubtitles}
                voterGuideWeVoteId={voterGuide.we_vote_id}
                voterGuideWeVoteIdSelected={this.state.voterGuideWeVoteIdSelected}
              />
            </div>
          );
        } else {
          return null;
        }
      });
    }
    return (
      <div className="card">
        <div className="card-main">
          <SectionTitle>Your Endorsements</SectionTitle>
          <div className="u-padding-bottom--md">
            <Button
              color="primary"
              fullWidth
              id="selectVoterGuidesSideBarNewVoterGuide"
              onClick={() => this.openNewVoterGuideModal()}
              variant="contained"
            >
             Choose New Election
            </Button>
          </div>
          {voterGuideLinksHtml}
        </div>
        {showNewVoterGuideModal && (
          <VoterGuideChooseElectionModal
            show={showNewVoterGuideModal}
            toggleFunction={this.closeNewVoterGuideModal}
          />
        )}
      </div>
    );
  }
}

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 22px;
  margin-bottom: 16px;
`;
