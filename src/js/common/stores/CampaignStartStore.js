import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class CampaignStartStore extends ReduceStore {
  getInitialState () {
    return {
      campaignDescription: '',
      campaignDescriptionQueuedToSave: '',
      campaignDescriptionQueuedToSaveSet: false,
      campaignPhotoLargeUrl: '',
      campaignPhotoQueuedToDelete: false,
      campaignPhotoQueuedToDeleteSet: false,
      campaignPhotoQueuedToSave: '',
      campaignPhotoQueuedToSaveSet: false,
      campaignPoliticianDeleteList: [],
      campaignPoliticianList: [],
      campaignPoliticianListExists: false,
      campaignPoliticianStarterList: [],
      campaignPoliticianStarterListQueuedToSave: [],
      campaignPoliticianStarterListQueuedToSaveSet: false,
      campaignTitle: '',
      campaignTitleQueuedToSave: '',
      campaignTitleQueuedToSaveSet: false,
      campaignXOwnerList: [],
      campaignXWeVoteId: '',
      voterSignedInWithEmail: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  campaignDescriptionExists () {
    if (this.getState().campaignDescription) {
      return Boolean(this.getState().campaignDescription.length > 0);
    } else {
      return false;
    }
  }

  campaignPhotoExists () {
    if (this.getState().campaignPhotoLargeUrl) {
      return Boolean(this.getState().campaignPhotoLargeUrl.length > 10);
    } else {
      return false;
    }
  }

  campaignPoliticianListExists () {
    if (this.getState().campaignPoliticianList) {
      return Boolean(this.getState().campaignPoliticianList.length > 0);
    } else {
      return false;
    }
  }

  campaignPoliticianStarterListExists () {
    if (this.getState().campaignPoliticianStarterList) {
      return Boolean(this.getState().campaignPoliticianStarterList.length > 0);
    } else {
      return false;
    }
  }

  campaignTitleExists () {
    if (this.getState().campaignTitle) {
      return Boolean(this.getState().campaignTitle.length > 10);
    } else {
      return false;
    }
  }

  getCampaignDescription () {
    return this.getState().campaignDescription || '';
  }

  getCampaignDescriptionQueuedToSave () {
    return this.getState().campaignDescriptionQueuedToSave;
  }

  getCampaignDescriptionQueuedToSaveSet () {
    return this.getState().campaignDescriptionQueuedToSaveSet;
  }

  getCampaignPhotoLargeUrl () {
    return this.getState().campaignPhotoLargeUrl || '';
  }

  getCampaignPhotoQueuedToDelete () {
    return this.getState().campaignPhotoQueuedToDelete;
  }

  getCampaignPhotoQueuedToDeleteSet () {
    return this.getState().campaignPhotoQueuedToDeleteSet;
  }

  getCampaignPhotoQueuedToSave () {
    return this.getState().campaignPhotoQueuedToSave;
  }

  getCampaignPhotoQueuedToSaveSet () {
    return this.getState().campaignPhotoQueuedToSaveSet;
  }

  getCampaignPoliticianList () {
    return this.getState().campaignPoliticianList || [];
  }

  getCampaignPoliticianDeleteList () {
    return this.getState().campaignPoliticianDeleteList || [];
  }

  getCampaignPoliticianStarterList () {
    return this.getState().campaignPoliticianStarterList || [];
  }

  getCampaignPoliticianStarterListQueuedToSave () {
    return this.getState().campaignPoliticianStarterListQueuedToSave || [];
  }

  getCampaignPoliticianStarterListQueuedToSaveSet () {
    return this.getState().campaignPoliticianStarterListQueuedToSaveSet || false;
  }

  getCampaignTitle () {
    return this.getState().campaignTitle || '';
  }

  getCampaignTitleQueuedToSave () {
    return this.getState().campaignTitleQueuedToSave;
  }

  getCampaignTitleQueuedToSaveSet () {
    return this.getState().campaignTitleQueuedToSaveSet;
  }

  getInDraftMode () {
    return this.getState().inDraftMode;
  }

  getVoterSignedInWithEmail () {
    return this.getState().voterSignedInWithEmail || false;
  }

  reduce (state, action) {
    const { campaignPoliticianDeleteList } = state;
    switch (action.type) {
      case 'campaignDescriptionQueuedToSave':
        // console.log('CampaignStartStore campaignDescriptionQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignDescriptionQueuedToSave: '',
            campaignDescriptionQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignDescriptionQueuedToSave: action.payload,
            campaignDescriptionQueuedToSaveSet: true,
          };
        }

      case 'campaignEditAllReset':
        // console.log('campaignEditAllReset');
        return {
          ...state,
          campaignDescriptionQueuedToSave: '',
          campaignDescriptionQueuedToSaveSet: false,
          campaignPhotoQueuedToDelete: false,
          campaignPhotoQueuedToDeleteSet: false,
          campaignPhotoQueuedToSave: '',
          campaignPhotoQueuedToSaveSet: false,
          campaignPoliticianStarterListQueuedToSave: [],
          campaignPoliticianStarterListQueuedToSaveSet: false,
          campaignTitleQueuedToSave: '',
          campaignTitleQueuedToSaveSet: false,
        };

      case 'campaignPhotoQueuedToDelete':
        console.log('CampaignStartStore campaignPhotoQueuedToDelete: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignPhotoQueuedToDelete: false,
            campaignPhotoQueuedToDeleteSet: false,
          };
        } else {
          return {
            ...state,
            campaignPhotoQueuedToDelete: action.payload,
            campaignPhotoQueuedToDeleteSet: true,
          };
        }

      case 'campaignPhotoQueuedToSave':
        // console.log('CampaignStartStore campaignPhotoQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignPhotoQueuedToSave: '',
            campaignPhotoQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignPhotoQueuedToSave: action.payload,
            campaignPhotoQueuedToSaveSet: true,
          };
        }

      case 'campaignPoliticianDeleteAddQueuedToSave':
        // console.log('CampaignStartStore campaignPoliticianDeleteAddQueuedToSave: ', action.payload);
        if (campaignPoliticianDeleteList.indexOf(action.payload) === -1) {
          campaignPoliticianDeleteList.push(action.payload);
        }
        // console.log('campaignPoliticianDeleteList:', campaignPoliticianDeleteList);
        return {
          ...state,
          campaignPoliticianDeleteList,
        };

      case 'campaignPoliticianDeleteRemoveQueuedToSave':
        // console.log('CampaignStartStore campaignPoliticianDeleteRemoveQueuedToSave: ', action.payload);
        if (campaignPoliticianDeleteList.indexOf(action.payload) !== -1) {
          campaignPoliticianDeleteList.splice(campaignPoliticianDeleteList.indexOf(action.payload), 1);
        }
        // console.log('campaignPoliticianDeleteList:', campaignPoliticianDeleteList);
        return {
          ...state,
          campaignPoliticianDeleteList,
        };

      case 'campaignPoliticianStarterListQueuedToSave':
        // console.log('CampaignStartStore campaignPoliticianStarterListQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignPoliticianStarterListQueuedToSave: [],
            campaignPoliticianStarterListQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignPoliticianStarterListQueuedToSave: action.payload,
            campaignPoliticianStarterListQueuedToSaveSet: true,
          };
        }

      // case 'campaignRetrieve':
      case 'campaignRetrieveAsOwner':
        // console.log('CampaignStartStore campaignRetrieveAsOwner, action.res:', action.res);
        return {
          ...state,
          campaignDescription: action.res.campaign_description,
          campaignPhotoLargeUrl: action.res.we_vote_hosted_campaign_photo_large_url,
          campaignPhotoMediumUrl: action.res.we_vote_hosted_campaign_photo_medium_url,
          campaignPhotoSmallUrl: action.res.we_vote_hosted_campaign_photo_small_url,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignPoliticianListExists: action.res.campaignx_politician_list_exists,
          campaignPoliticianStarterList: action.res.campaignx_politician_starter_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
          inDraftMode: action.res.in_draft_mode,
          voterSignedInWithEmail: action.res.voter_signed_in_with_email,
        };

      case 'campaignStartSave':
        // console.log('CampaignStartStore campaignStartSave, action.res:', action.res);
        return {
          ...state,
          campaignDescription: action.res.campaign_description,
          campaignPhotoLargeUrl: action.res.we_vote_hosted_campaign_photo_large_url,
          campaignPhotoMediumUrl: action.res.we_vote_hosted_campaign_photo_medium_url,
          campaignPhotoSmallUrl: action.res.we_vote_hosted_campaign_photo_small_url,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignPoliticianListExists: action.res.campaignx_politician_list_exists,
          campaignPoliticianStarterList: action.res.campaignx_politician_starter_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
          inDraftMode: action.res.in_draft_mode,
          voterSignedInWithEmail: action.res.voter_signed_in_with_email,
        };

      case 'campaignTitleQueuedToSave':
        // console.log('CampaignStartStore campaignTitleQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignTitleQueuedToSave: '',
            campaignTitleQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignTitleQueuedToSave: action.payload,
            campaignTitleQueuedToSaveSet: true,
          };
        }

      case 'voterSignOut':
        // console.log("resetting Campaign");
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new CampaignStartStore(Dispatcher);
