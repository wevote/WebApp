import { Button } from '@mui/material';
import React, { Component } from 'react';
import styled from '@mui/material/styles/styled';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ElectionStore from '../../stores/ElectionStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import VoterGuideChooseElectionModal from '../VoterGuide/VoterGuideChooseElectionModal';
import SelectVoterGuidesSideBarLink from './SelectVoterGuidesSideBarLink';


export default class SelectVoterGuidesSideBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      showNewVoterGuideModal: false,
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const voterGuidesOwnedByVoter = VoterGuideStore.getAllVoterGuidesOwnedByVoter();
    this.setState({
      showNewVoterGuideModal: AppObservableStore.showNewVoterGuideModal(),
      voterGuidesOwnedByVoter,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterGuideStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.setState({
      showNewVoterGuideModal: AppObservableStore.showNewVoterGuideModal(),
    });
  }

  onVoterGuideStoreChange () {
    const { linkedOrganizationWeVoteId: previousLinkedOrganizationWeVoteId } = this.state;
    const voter = VoterStore.getVoter();
    const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;
    // console.log("SelectVoterGuidesSideBar onVoterGuideStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && (previousLinkedOrganizationWeVoteId !== linkedOrganizationWeVoteId)) {
      this.setState({ linkedOrganizationWeVoteId });
    }
    const voterGuidesOwnedByVoter = VoterGuideStore.getAllVoterGuidesOwnedByVoter();
    this.setState({ voterGuidesOwnedByVoter });
  }

  closeNewVoterGuideModal () {
    // console.log('HeaderBar closeNewVoterGuideModal');
    AppObservableStore.setShowNewVoterGuideModal(false);
  }

  openNewVoterGuideModal () {
    // console.log('SettingsDomain openNewVoterGuideModal');
    AppObservableStore.setShowNewVoterGuideModal(true);
  }

  render () {
    renderLog('SelectVoterGuidesSideBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { showNewVoterGuideModal, voterGuidesOwnedByVoter } = this.state;
    const { location: { pathname } } = window;
    let voterGuideLinksHtml = <span />;
    if (voterGuidesOwnedByVoter) {
      voterGuideLinksHtml = voterGuidesOwnedByVoter.map((voterGuide) => {
        const displaySubtitles = true;
        if (voterGuide && voterGuide.we_vote_id) {
          return (
            <Column key={`voter-guides-${voterGuide.we_vote_id}`}>
              <SelectVoterGuidesSideBarLink
                displaySubtitles={displaySubtitles}
                electionId={voterGuide.google_civic_election_id}
                label={ElectionStore.getElectionName(voterGuide.google_civic_election_id)}
                subtitle={ElectionStore.getElectionDayText(voterGuide.google_civic_election_id)}
                voterGuideWeVoteId={voterGuide.we_vote_id}
              />
            </Column>
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
          <Row>
            {voterGuideLinksHtml}
          </Row>
        </div>
        {showNewVoterGuideModal && (
          <VoterGuideChooseElectionModal
            show={showNewVoterGuideModal}
            toggleFunction={this.closeNewVoterGuideModal}
            pathname={pathname}
          />
        )}
      </div>
    );
  }
}

const SectionTitle = styled('h2')`
  width: fit-content;  font-weight: bold;
  font-size: 22px;
  margin-bottom: 16px;
`;

const Row = styled('div')`
  @media (min-width: 576px) and (max-width: 767px) {
    margin: 0 -12px;
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 24px);
  }
`;

const Column = styled('div')`
  width: 100%;
  padding: 12px 0;
  height: 100%;
  @media (min-width: 576px) and (max-width: 767px) {
    width: 50%;
    padding: 12px;
  }
`;
