import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';


class ShareStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      allCachedSharedItemsByFullUrl: {}, // This is a dictionary with fullUrl as key and the sharedItem as the value
      allCachedSharedItemsBySharedItemCode: {}, // This is a dictionary with sharedItemCode as key and the sharedItem as the value
      allCachedSharedItemsBySharedItemId: {}, // This is a dictionary with sharedItemId as key and the sharedItem as the value
      allCachedSharedItemsByYear: {}, // This is a dictionary with year as key and the list of shared items as the value
    };
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
      return sharedItem.url_with_shared_item_code_with_opinions;
    } else {
      return sharedItem.url_with_shared_item_code_no_opinions;
    }
  }

  reduce (state, action) {
    const { allCachedSharedItemsByFullUrl, allCachedSharedItemsBySharedItemCode } = state;
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
        if (action.res.shared_item_code_with_opinions) {
          allCachedSharedItemsBySharedItemCode[action.res.shared_item_code_with_opinions] = sharedItem;
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

      default:
        return state;
    }
  }
}

export default new ShareStore(Dispatcher);
