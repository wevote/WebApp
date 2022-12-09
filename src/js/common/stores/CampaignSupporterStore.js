import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class CampaignSupporterStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedCampaignXSupporters: {}, // Dictionary with CampaignXSupporter simple id as key and the CampaignXSupporter as value
      allCachedCampaignXSupporterVoterEntries: {}, // Dictionary with campaignx_we_vote_id as key and the CampaignXSupporter for this voter as value
      latestCampaignXSupporterEndorsements: {}, // Dict with key campaignx_we_vote_id and value of List of Dicts w/ latest campaignx_supporter entries with supporter_endorsement values
      latestCampaignXSupporters: {}, // Dict with key campaignx_we_vote_id and value of List of Dicts w/ latest campaignx_supporter entries, ordered newest to oldest
      shareButtonClicked: false,
      supporterEndorsementQueuedToSave: '',
      supporterEndorsementQueuedToSaveSet: false,
      visibleToPublic: true, // Default setting
      visibleToPublicQueuedToSave: true, // Default setting
      visibleToPublicQueuedToSaveSet: false,
      voterSignedInWithEmail: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  voterChipInExists (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = this.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('voterSupporterEndorsementExists, campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      if ('chip_in_total' in campaignXSupporterVoterEntry && campaignXSupporterVoterEntry.chip_in_total) {
        // console.log('CampaignSupporterStore chip_in_total: ', campaignXSupporterVoterEntry.chip_in_total, ', voterChipInExists:', Boolean(campaignXSupporterVoterEntry.chip_in_total !== 'none'));
        return Boolean(campaignXSupporterVoterEntry.chip_in_total !== 'none');
      }
    }
    return false;
  }

  voterSupporterEndorsementExists (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = this.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('voterSupporterEndorsementExists, campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      if ('supporter_endorsement' in campaignXSupporterVoterEntry && campaignXSupporterVoterEntry.supporter_endorsement) {
        return Boolean(campaignXSupporterVoterEntry.supporter_endorsement.length > 0);
      }
    }
    return false;
  }

  getCampaignXSupporterById (campaignXSupporterId) {
    return this.getState().allCachedCampaignXSupporters[campaignXSupporterId] || {};
  }

  getCampaignXSupporterEndorsementsList (campaignXWeVoteId) {
    return this.getState().latestCampaignXSupporterEndorsements[campaignXWeVoteId] || [];
  }

  getCampaignXSupportersList (campaignXWeVoteId) {
    return this.getState().latestCampaignXSupporters[campaignXWeVoteId] || [];
  }

  getCampaignXSupporterVoterEntry (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXSupporterVoterEntries[campaignXWeVoteId] || {};
  }

  getShareButtonClicked () {
    return this.getState().shareButtonClicked;
  }

  getSupporterEndorsementQueuedToSave () {
    return this.getState().supporterEndorsementQueuedToSave;
  }

  getSupporterEndorsementQueuedToSaveSet () {
    return this.getState().supporterEndorsementQueuedToSaveSet;
  }

  getVisibleToPublic (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = this.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('voterSupporterEndorsementExists, campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      if ('visible_to_public' in campaignXSupporterVoterEntry) {
        return Boolean(campaignXSupporterVoterEntry.visible_to_public);
      }
    }
    return true;
  }

  getVisibleToPublicQueuedToSave () {
    return Boolean(this.getState().visibleToPublicQueuedToSave);
  }

  getVisibleToPublicQueuedToSaveSet () {
    return this.getState().visibleToPublicQueuedToSaveSet;
  }

  getVoterSignedInWithEmail () {
    return this.getState().voterSignedInWithEmail || false;
  }

  updateCampaignXSupporterGenericList (campaignXSupporterGenericListIncoming, campaignSupporterFromAPIResponse) {
    const campaignXSupporterGenericList = campaignXSupporterGenericListIncoming;
    // console.log('Incoming campaignXSupporterGenericList:', campaignXSupporterGenericList);
    // console.log('Incoming campaignSupporterFromAPIResponse:', campaignSupporterFromAPIResponse);
    if (!(campaignSupporterFromAPIResponse.campaignx_we_vote_id in campaignXSupporterGenericList)) {
      // console.log('campaignx_we_vote_id not in campaignXSupporterGenericList, adding: ', campaignSupporterFromAPIResponse.campaignx_we_vote_id);
      campaignXSupporterGenericList[campaignSupporterFromAPIResponse.campaignx_we_vote_id] = [];
    }
    const tempCampaignXSupporterGenericList = campaignXSupporterGenericList[campaignSupporterFromAPIResponse.campaignx_we_vote_id] || [];
    let alreadyExists = false;
    for (let i = 0; i < tempCampaignXSupporterGenericList.length; ++i) {
      if (tempCampaignXSupporterGenericList[i].voter_we_vote_id === campaignSupporterFromAPIResponse.voter_we_vote_id) {
        tempCampaignXSupporterGenericList[i] = campaignSupporterFromAPIResponse;
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      tempCampaignXSupporterGenericList.unshift(campaignSupporterFromAPIResponse);
    }
    campaignXSupporterGenericList[campaignSupporterFromAPIResponse.campaignx_we_vote_id] = tempCampaignXSupporterGenericList;
    return campaignXSupporterGenericList;
  }

  reduce (state, action) {
    const {
      allCachedCampaignXSupporters, allCachedCampaignXSupporterVoterEntries,
    } = state;
    let {
      latestCampaignXSupporterEndorsements, latestCampaignXSupporters,
    } = state;
    let campaignXList;
    let campaignXSupporter;

    let revisedState;
    switch (action.type) {
      case 'campaignListRetrieve':
        // See CampaignStore for code to take in the following campaignX values:
        // - campaignx_owner_list
        // - campaignx_politician_list
        // - seo_friendly_path_list

        // console.log('CampaignSupporterStore campaignListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        campaignXList = action.res.campaignx_list || [];
        // console.log('campaignListRetrieve latestCampaignXSupporters before:', latestCampaignXSupporters);
        // console.log('campaignListRetrieve latestCampaignXSupporterEndorsements before:', latestCampaignXSupporterEndorsements);
        campaignXList.forEach((oneCampaignX) => {
          // if (!(oneCampaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
          //   allCachedCampaignXWeVoteIdsBySEOFriendlyPath[oneCampaignX.seo_friendly_path] = oneCampaignX.campaignx_we_vote_id;
          // }
          if ('latest_campaignx_supporter_endorsement_list' in oneCampaignX) {
            for (let i = 0; i < oneCampaignX.latest_campaignx_supporter_endorsement_list.length; ++i) {
              campaignXSupporter = oneCampaignX.latest_campaignx_supporter_endorsement_list[i];
              allCachedCampaignXSupporters[campaignXSupporter.id] = campaignXSupporter;
              latestCampaignXSupporterEndorsements = this.updateCampaignXSupporterGenericList(latestCampaignXSupporterEndorsements, campaignXSupporter);
            }
          }
          if ('latest_campaignx_supporter_list' in oneCampaignX) {
            for (let i = 0; i < oneCampaignX.latest_campaignx_supporter_list.length; ++i) {
              campaignXSupporter = oneCampaignX.latest_campaignx_supporter_list[i];
              allCachedCampaignXSupporters[campaignXSupporter.id] = campaignXSupporter;
              latestCampaignXSupporters = this.updateCampaignXSupporterGenericList(latestCampaignXSupporters, campaignXSupporter);
            }
          }
          if ('voter_campaignx_supporter' in oneCampaignX) {
            if ('campaignx_we_vote_id' in oneCampaignX.voter_campaignx_supporter) {
              allCachedCampaignXSupporterVoterEntries[oneCampaignX.campaignx_we_vote_id] = oneCampaignX.voter_campaignx_supporter;
              allCachedCampaignXSupporters[oneCampaignX.voter_campaignx_supporter.id] = oneCampaignX.voter_campaignx_supporter;
            }
          }
        });
        // console.log('campaignListRetrieve latestCampaignXSupporters after:', latestCampaignXSupporters);
        // console.log('campaignListRetrieve latestCampaignXSupporterEndorsements after:', latestCampaignXSupporterEndorsements);
        revisedState = { ...revisedState, allCachedCampaignXSupporters };
        revisedState = { ...revisedState, allCachedCampaignXSupporterVoterEntries };
        revisedState = { ...revisedState, latestCampaignXSupporters };
        revisedState = { ...revisedState, latestCampaignXSupporterEndorsements };
        return revisedState;

      case 'campaignRetrieve':
        // See CampaignStore for code to take in the following campaignX values:
        // - campaignx_owner_list
        // - campaignx_politician_list
        // - seo_friendly_path_list

        // console.log('CampaignSupporterStore campaignRetrieve action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        if (action.res.campaignx_we_vote_id) {
          if ('latest_campaignx_supporter_endorsement_list' in action.res) {
            for (let i = 0; i < action.res.latest_campaignx_supporter_endorsement_list.length; ++i) {
              campaignXSupporter = action.res.latest_campaignx_supporter_endorsement_list[i];
              allCachedCampaignXSupporters[campaignXSupporter.id] = campaignXSupporter;
              latestCampaignXSupporterEndorsements = this.updateCampaignXSupporterGenericList(latestCampaignXSupporterEndorsements, campaignXSupporter);
            }
          }
          if ('latest_campaignx_supporter_list' in action.res) {
            for (let i = 0; i < action.res.latest_campaignx_supporter_list.length; ++i) {
              campaignXSupporter = action.res.latest_campaignx_supporter_list[i];
              allCachedCampaignXSupporters[campaignXSupporter.id] = campaignXSupporter;
              latestCampaignXSupporters = this.updateCampaignXSupporterGenericList(latestCampaignXSupporters, campaignXSupporter);
            }
          }
          if ('voter_campaignx_supporter' in action.res) {
            if ('campaignx_we_vote_id' in action.res.voter_campaignx_supporter) {
              allCachedCampaignXSupporterVoterEntries[action.res.campaignx_we_vote_id] = action.res.voter_campaignx_supporter;
              allCachedCampaignXSupporters[action.res.voter_campaignx_supporter.id] = action.res.voter_campaignx_supporter;
            }
          }
        }
        // console.log('allCachedCampaignXSupporters:', allCachedCampaignXSupporters);
        revisedState = { ...revisedState, allCachedCampaignXSupporters };
        revisedState = { ...revisedState, allCachedCampaignXSupporterVoterEntries };
        revisedState = { ...revisedState, latestCampaignXSupporters };
        revisedState = { ...revisedState, latestCampaignXSupporterEndorsements };
        return revisedState;

      case 'campaignSupporterSave':
        // console.log('CampaignSupporterStore campaignSupporterSave');
        if (action.res.campaignx_we_vote_id && action.res.success) {
          allCachedCampaignXSupporterVoterEntries[action.res.campaignx_we_vote_id] = action.res;
        }
        // console.log('campaignSupporterSave latestCampaignXSupporters before:', latestCampaignXSupporters);
        if (action.res.supporter_endorsement) {
          latestCampaignXSupporterEndorsements = this.updateCampaignXSupporterGenericList(latestCampaignXSupporterEndorsements, action.res);
        }
        latestCampaignXSupporters = this.updateCampaignXSupporterGenericList(latestCampaignXSupporters, action.res);
        // console.log('campaignSupporterSave latestCampaignXSupporters after:', latestCampaignXSupporters);
        return {
          ...state,
          allCachedCampaignXSupporterVoterEntries,
          latestCampaignXSupporterEndorsements,
          latestCampaignXSupporters,
          voterSignedInWithEmail: Boolean(action.res.voter_signed_in_with_email),
        };

      case 'shareButtonClicked':
        // console.log('CampaignSupporterStore shareButtonClicked: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            shareButtonClicked: false,
          };
        } else {
          return {
            ...state,
            shareButtonClicked: action.payload,
          };
        }

      case 'supporterEndorsementQueuedToSave':
        // console.log('CampaignSupporterStore supporterEndorsementQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            supporterEndorsementQueuedToSave: '',
            supporterEndorsementQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            supporterEndorsementQueuedToSave: action.payload,
            supporterEndorsementQueuedToSaveSet: true,
          };
        }

      case 'visibleToPublicQueuedToSave':
        // console.log('CampaignSupporterStore visibleToPublicQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            visibleToPublicQueuedToSave: true,
            visibleToPublicQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            visibleToPublicQueuedToSave: Boolean(action.payload),
            visibleToPublicQueuedToSaveSet: true,
          };
        }

      case 'voterSignOut':
        // console.log("resetting Campaign");
        // console.log('CampaignSupporterStore voterSignOut, state:', state);
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new CampaignSupporterStore(Dispatcher);
