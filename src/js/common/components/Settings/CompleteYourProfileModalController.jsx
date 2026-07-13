import React, { Component } from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CompleteYourProfileModal from './CompleteYourProfileModal';
import { renderLog } from '../../utils/logging';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import initializejQuery from '../../utils/initializejQuery';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import CampaignStartActions from '../../actions/CampaignStartActions';
import historyPush from '../../utils/historyPush';

class CompleteYourProfileModalController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CompleteYourProfileModalController, componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    const showCompleteYourProfileModalDict = AppObservableStore.showCompleteYourProfileModalDict();
    // console.log('CompleteYourProfileModalController componentDidMount:', showCompleteYourProfileModalDict);
    this.setState(showCompleteYourProfileModalDict);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const showCompleteYourProfileModalDict = AppObservableStore.showCompleteYourProfileModalDict();
    // console.log('CompleteYourProfileModalController onAppObservableStoreChange', showCompleteYourProfileModalDict);
    this.setState(showCompleteYourProfileModalDict);
  }

  functionToUseWhenProfileComplete = () => {
    const { campaignXWeVoteId, challengeWeVoteId, startCampaign, supportCampaign, supportPolitician } = this.state;
    if (supportCampaign) {
      if (campaignXWeVoteId) {
        const campaignSupported = true;
        const campaignSupportedChanged = true;
        // From this page we always send value for 'visibleToPublic'
        let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
        const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
        if (visibleToPublicChanged) {
          // If it has changed, use new value
          visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
        }
        // console.log('functionToUseWhenProfileComplete, blockCampaignXRedirectOnSignIn:', AppObservableStore.blockCampaignXRedirectOnSignIn());
        const saveVisibleToPublic = true;
        if (!AppObservableStore.blockCampaignXRedirectOnSignIn()) {
          initializejQuery(() => {
            CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
          }, this.goToNextPage());
        }
      } else {
        console.log('CompleteYourProfileModalController supportCampaign functionToUseWhenProfileComplete campaignXWeVoteId not found');
      }
    } else if (supportPolitician) {
      if (campaignXWeVoteId) {
        saveCampaignSupportAndGoToNextPage(campaignXWeVoteId);  // campaignXBasePath
      } else if (challengeWeVoteId) {
        saveCampaignSupportAndGoToNextPage(challengeWeVoteId);  // challengeBasePath
      } else {
        console.log('CompleteYourProfileModalController supportPolitician functionToUseWhenProfileComplete neither campaignXWeVoteId nor challengeWeVoteId found');
      }
    } else if (startCampaign) {
      CampaignStartActions.inDraftModeSave('', false);
      historyPush('/profile/started');
    } else {
      console.log('CompleteYourProfileModalController functionToUseWhenProfileComplete WeVoteId not found');
    }
  };

  closeModal () {
    // console.log('CompleteYourProfileModalController closeModal');
    const modalDictionary = {
      becomeMember: false,
      campaignXWeVoteId: '',
      challengeWeVoteId: '',
      clickSource: 'COMPLETE_YOUR_PROFILE_MODAL_CONTROLLER ',
      isOppose: false,
      isStopOpposing: false,
      isStopSupporting: false,
      isSupport: false,
      politicianWeVoteId: '',
      showModal: false,
      startCampaign: false,
      supportCampaign: false,
      supportPolitician: false,
    };
    AppObservableStore.setShowCompleteYourProfileModalDict(modalDictionary);
  }

  render () {
    renderLog('CompleteYourProfileModalController');  // Set LOG_RENDER_EVENTS to log all renders

    const { becomeMember, campaignXWeVoteId, showModal, startCampaign, supportCampaign, supportPolitician } = this.state;
    // console.log('CompleteYourProfileModalController render', showModal, ', supportCampaign:', supportCampaign, ', supportPolitician:', supportPolitician);
    return (
      <div>
        {showModal && (
          <CompleteYourProfileModal
            becomeMember={becomeMember}
            campaignXWeVoteId={campaignXWeVoteId}
            closeFunction={this.closeModal}
            functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
            show={showModal}
            startCampaign={startCampaign}
            supportCampaign={supportCampaign}
            supportPolitician={supportPolitician}
          />
        )}
      </div>
    );
  }
}

export default CompleteYourProfileModalController;
