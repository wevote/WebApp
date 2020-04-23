import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import { arrayContains } from "../utils/textFormat";


class ShareStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      allCachedSharedItemsByFullUrl: {}, // This is a dictionary with fullUrl as key and the sharedItem as the value
      allCachedSharedItemsBySharedItemCode: {}, // This is a dictionary with sharedItemCode as key and the sharedItem as the value
      allCachedSharedItemsBySharedItemId: {}, // This is a dictionary with sharedItemId as key and the sharedItem as the value
      allCachedSharedItemsByYear: {}, // This is a dictionary with year as key and the list of shared items as the value
      currentSharedItemOrganizationWeVoteIds: [],
    };
  }

  currentSharedItemOrganizationWeVoteIDList () {
    // We track the organizationWeVoteIds that have shared with this voter
    const { currentSharedItemOrganizationWeVoteIds } = this.getState();
    return currentSharedItemOrganizationWeVoteIds || [];
  }

  getCurrentSharedItemOrganizationWeVoteIdsLength () {
    // console.log('OrganizationStore.getCurrentSharedItemOrganizationWeVoteIdsLength, currentSharedItemOrganizationWeVoteIds: ', this.getState().currentSharedItemOrganizationWeVoteIds);
    if (this.getState().currentSharedItemOrganizationWeVoteIds) {
      return this.getState().currentSharedItemOrganizationWeVoteIds.length;
    }
    return 0;
  }

  getSharedItemByCode (sharedItemCode) {
    return this.getState().allCachedSharedItemsBySharedItemCode[sharedItemCode] || {};
  }

  getSharedItemByFullUrl (destinationFullUrl) {
    const destinationFullUrlLowerCase = destinationFullUrl.toLowerCase();
    return this.getState().allCachedSharedItemsByFullUrl[destinationFullUrlLowerCase] || {};
  }

  getUrlWithSharedItemCodeByFullUrl (destinationFullUrl, withOpinions = false) {
    const destinationFullUrlLowerCase = destinationFullUrl.toLowerCase();
    const sharedItem = this.getState().allCachedSharedItemsByFullUrl[destinationFullUrlLowerCase] || {};
    // console.log('getUrlWithSharedItemCodeByFullUrl destinationFullUrl:', destinationFullUrl, ', sharedItem:', sharedItem, ', withOpinions:', withOpinions);
    if (withOpinions) {
      return sharedItem.url_with_shared_item_code_all_opinions;
    } else {
      return sharedItem.url_with_shared_item_code_no_opinions;
    }
  }

  voterHasAccessToSharedItemFromThisOrganization (organizationWeVoteId) {
    const { currentSharedItemOrganizationWeVoteIds } = this.getState();
    // console.log('ShareStore, voterHasAccessToSharedItemFromThisOrganization, currentSharedItemOrganizationWeVoteIds: ', currentSharedItemOrganizationWeVoteIds);
    if (currentSharedItemOrganizationWeVoteIds.length) {
      const hasAccessToSharedItem = arrayContains(organizationWeVoteId, currentSharedItemOrganizationWeVoteIds);
      // console.log('ShareStore, hasAccessToSharedItem:', hasAccessToSharedItem, ', organizationWeVoteId:', organizationWeVoteId);
      return hasAccessToSharedItem;
    } else {
      // console.log('ShareStore, hasAccessToSharedItem: NO currentSharedItemOrganizationWeVoteIds, organizationWeVoteId: ', organizationWeVoteId);
      return false;
    }
  }

  reduce (state, action) {
    const { allCachedSharedItemsByFullUrl, allCachedSharedItemsBySharedItemCode } = state;
    let count = 0;
    let currentSharedItemOrganizationWeVoteIds = [];
    let sharedItem = {};
    let sharedItemDestinationFullUrl = '';
    let sharedItemDestinationFullUrlLowerCase = '';

    switch (action.type) {
      case 'sharedItemRetrieve':
        // console.log('ShareStore sharedItemRetrieve, action.res:', action.res);
        sharedItem = action.res || {};
        sharedItemDestinationFullUrl = action.res.destination_full_url || '';
        sharedItemDestinationFullUrlLowerCase = sharedItemDestinationFullUrl.toLowerCase();
        allCachedSharedItemsByFullUrl[sharedItemDestinationFullUrlLowerCase] = sharedItem;
        if (action.res.shared_item_code_no_opinions) {
          allCachedSharedItemsBySharedItemCode[action.res.shared_item_code_no_opinions] = sharedItem;
        }
        if (action.res.shared_item_code_all_opinions) {
          allCachedSharedItemsBySharedItemCode[action.res.shared_item_code_all_opinions] = sharedItem;
        }
        return {
          ...state,
          allCachedSharedItemsByFullUrl,
          allCachedSharedItemsBySharedItemCode,
        };

      case 'sharedItemSave':
        // console.log('ShareStore sharedItemSave, action.res:', action.res);
        sharedItem = action.res || {};
        sharedItemDestinationFullUrl = action.res.destination_full_url || '';
        sharedItemDestinationFullUrlLowerCase = sharedItemDestinationFullUrl.toLowerCase();
        allCachedSharedItemsByFullUrl[sharedItemDestinationFullUrlLowerCase] = sharedItem;
        return {
          ...state,
          allCachedSharedItemsByFullUrl,
        };

      case 'voterGuidesFromFriendsUpcomingRetrieve':
        // console.log('ShareStore voterGuidesFromFriendsUpcomingRetrieve, action.res:', action.res);
        ({ currentSharedItemOrganizationWeVoteIds } = state);
        if (action.res.voter_guides) {
          for (count = 0; count < action.res.voter_guides.length; count++) {
            if (action.res.voter_guides[count].from_shared_item && !arrayContains(action.res.voter_guides[count].organization_we_vote_id, currentSharedItemOrganizationWeVoteIds)) {
              currentSharedItemOrganizationWeVoteIds.push(action.res.voter_guides[count].organization_we_vote_id);
            }
          }
        }
        // console.log('currentSharedItemOrganizationWeVoteIds:', currentSharedItemOrganizationWeVoteIds);
        return {
          ...state,
          currentSharedItemOrganizationWeVoteIds,
        };

      default:
        return state;
    }
  }
}

export default new ShareStore(Dispatcher);
