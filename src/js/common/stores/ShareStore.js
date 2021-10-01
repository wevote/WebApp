import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import arrayContains from '../utils/arrayContains';
import removeValueFromArray from '../utils/removeValueFromArray';


class ShareStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      allCachedSharedItemsByFullUrl: {}, // This is a dictionary with fullUrl as key and the sharedItem as the value
      allCachedSharedItemsBySharedItemCode: {}, // This is a dictionary with sharedItemCode as key and the sharedItem as the value
      allCachedSharedItemsBySharedItemId: {}, // This is a dictionary with sharedItemId as key and the sharedItem as the value
      allCachedSharedItemsByYear: {}, // This is a dictionary with year as key and the list of shared items as the value
      allCachedEmailRecipientListDict: {}, // key: superShareItemId, value: list of superShareEmailRecipient dicts
      allCachedSuperShareItemDraftIdsByWeVoteId: {}, // key: WeVoteId of the item being shared, value: superShareItemId of the draft SuperShareItem
      allCachedSuperShareItems: {}, // key: super_share_item_id, value: superShareItem
      currentSharedItemOrganizationWeVoteIds: [],
      emailRecipientListQueuedToSaveDict: {}, // key: superShareItemId, value: list of superShareEmailRecipient dicts
      emailRecipientListQueuedToSaveSetDict: {}, // key: superShareItemId, value: whether the emailRecipientList has been set
      personalizedMessageQueuedToSaveDict: {}, // key: superShareItemId, value: personalizedMessage
      personalizedMessageQueuedToSaveSetDict: {}, // key: superShareItemId, value: whether personalizedMessage has been set
      personalizedSubjectQueuedToSaveDict: {}, // key: superShareItemId, value: personalizedSubject
      personalizedSubjectQueuedToSaveSetDict: {}, // key: superShareItemId, value: whether personalizedSubject has been set
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

  getPersonalizedMessageQueuedToSave (superShareItemId) {
    return this.getState().personalizedMessageQueuedToSaveDict[superShareItemId] || '';
  }

  getPersonalizedMessageQueuedToSaveSet (superShareItemId) {
    return this.getState().personalizedMessageQueuedToSaveSetDict[superShareItemId] || false;
  }

  getPersonalizedSubjectQueuedToSave (superShareItemId) {
    return this.getState().personalizedSubjectQueuedToSaveDict[superShareItemId] || '';
  }

  getPersonalizedSubjectQueuedToSaveSet (superShareItemId) {
    return this.getState().personalizedSubjectQueuedToSaveSetDict[superShareItemId] || false;
  }

  getSharedItemByCode (sharedItemCode) {
    return this.getState().allCachedSharedItemsBySharedItemCode[sharedItemCode] || {};
  }

  getSharedItemByFullUrl (destinationFullUrl) {
    const destinationFullUrlLowerCase = destinationFullUrl.toLowerCase();
    return this.getState().allCachedSharedItemsByFullUrl[destinationFullUrlLowerCase] || {};
  }

  getSuperSharedItemDraftIdByWeVoteId (subjectWeVoteId) {
    return this.getState().allCachedSuperShareItemDraftIdsByWeVoteId[subjectWeVoteId] || 0;
  }

  getEmailRecipientList (superShareItemId) {
    return this.getState().allCachedEmailRecipientListDict[superShareItemId] || [];
  }

  getEmailRecipientListQueuedToSave (superShareItemId) {
    return this.getState().emailRecipientListQueuedToSaveDict[superShareItemId] || [];
  }

  getEmailRecipientListQueuedToSaveSet (superShareItemId) {
    return this.getState().emailRecipientListQueuedToSaveSetDict[superShareItemId] || false;
  }

  getSuperShareItemById (superShareItemId) {
    return this.getState().allCachedSuperShareItems[superShareItemId] || {};
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
    const {
      allCachedSharedItemsByFullUrl, allCachedSharedItemsBySharedItemCode,
      allCachedEmailRecipientListDict,
      allCachedSuperShareItemDraftIdsByWeVoteId, allCachedSuperShareItems,
      emailRecipientListQueuedToSaveDict, emailRecipientListQueuedToSaveSetDict,
      personalizedMessageQueuedToSaveDict, personalizedMessageQueuedToSaveSetDict,
      personalizedSubjectQueuedToSaveDict, personalizedSubjectQueuedToSaveSetDict,
    } = state;
    let campaignXWeVoteId = '';
    let count = 0;
    let currentSharedItemOrganizationWeVoteIds = [];
    let emailRecipientList = [];
    let sharedItem = {};
    let sharedItemDestinationFullUrl = '';
    let sharedItemDestinationFullUrlLowerCase = '';
    let superShareEmailRecipient = '';
    let superShareItem = {};
    let superShareItemId;

    switch (action.type) {
      case 'emailRecipientListQueuedToSave':
        // console.log('ShareStore emailRecipientListQueuedToSave: ', action);
        superShareItemId = action.superShareItemId || 0;
        if (emailRecipientListQueuedToSaveSetDict[superShareItemId]) {
          emailRecipientList = emailRecipientListQueuedToSaveDict[superShareItemId] || [];
        } else {
          emailRecipientList = allCachedEmailRecipientListDict[superShareItemId] || [];
        }
        if (action.emailToAdd) {
          if (!arrayContains(action.emailToAdd.toLowerCase(), emailRecipientList)) {
            emailRecipientList.push(action.emailToAdd.toLowerCase());
          }
        } else if (action.emailToRemove) {
          emailRecipientList = removeValueFromArray(action.emailToRemove.toLowerCase(), emailRecipientList);
        }
        if (action.resetEmailRecipientList === true) {
          emailRecipientListQueuedToSaveDict[superShareItemId] = [];
          emailRecipientListQueuedToSaveSetDict[superShareItemId] = false;
        } else {
          emailRecipientListQueuedToSaveDict[superShareItemId] = emailRecipientList;
          emailRecipientListQueuedToSaveSetDict[superShareItemId] = true;
        }
        // console.log('ShareStore emailRecipientListQueuedToSave emailRecipientList:', emailRecipientList);
        return {
          ...state,
          emailRecipientListQueuedToSaveDict,
          emailRecipientListQueuedToSaveSetDict,
        };

      case 'personalizedMessageQueuedToSave':
        // console.log('ShareStore personalizedMessageQueuedToSave: ', action);
        superShareItemId = action.superShareItemId || 0;
        if (action.personalizedMessage === undefined) {
          personalizedMessageQueuedToSaveDict[superShareItemId] = undefined;
          personalizedMessageQueuedToSaveSetDict[superShareItemId] = false;
        } else {
          personalizedMessageQueuedToSaveDict[superShareItemId] = action.personalizedMessage || '';
          personalizedMessageQueuedToSaveSetDict[superShareItemId] = true;
        }
        return {
          ...state,
          personalizedMessageQueuedToSaveDict,
          personalizedMessageQueuedToSaveSetDict,
        };

      case 'personalizedSubjectQueuedToSave':
        // console.log('ShareStore personalizedSubjectQueuedToSave: ', action);
        superShareItemId = action.superShareItemId || 0;
        if (action.personalizedSubject === undefined) {
          personalizedSubjectQueuedToSaveDict[superShareItemId] = undefined;
          personalizedSubjectQueuedToSaveSetDict[superShareItemId] = false;
        } else {
          personalizedSubjectQueuedToSaveDict[superShareItemId] = action.personalizedSubject || '';
          personalizedSubjectQueuedToSaveSetDict[superShareItemId] = true;
        }
        return {
          ...state,
          personalizedSubjectQueuedToSaveDict,
          personalizedSubjectQueuedToSaveSetDict,
        };

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

      case 'superShareItemSave':
        // console.log('ShareStore superShareItemSave, action.res:', action.res);
        superShareItem = action.res || {};
        superShareItemId = action.res.super_share_item_id || 0;
        if (action.res.send_super_share_item) {
          superShareItem = allCachedSuperShareItems[superShareItemId];
          superShareItem.date_sent_to_email = action.res.date_sent_to_email;
          superShareItem.in_draft_mode = action.res.in_draft_mode;
          allCachedSuperShareItems[superShareItemId] = superShareItem;
          return {
            ...state,
            allCachedSuperShareItems,
          };
        }
        allCachedSuperShareItems[superShareItemId] = superShareItem;
        emailRecipientList = allCachedEmailRecipientListDict[superShareItemId] || [];
        if (superShareItem && superShareItem.super_share_email_recipient_list) {
          for (count = 0; count < superShareItem.super_share_email_recipient_list.length; count++) {
            superShareEmailRecipient = superShareItem.super_share_email_recipient_list[count];
            if (superShareEmailRecipient.email_address_text && !arrayContains(superShareEmailRecipient.email_address_text, emailRecipientList)) {
              emailRecipientList.push(superShareEmailRecipient.email_address_text);
            }
          }
        }
        allCachedEmailRecipientListDict[superShareItemId] = emailRecipientList || [];
        // console.log('ShareStore superShareItemSave, allCachedEmailRecipientListDict:', allCachedEmailRecipientListDict);
        campaignXWeVoteId = action.res.campaignx_we_vote_id || '';
        if (campaignXWeVoteId) {
          allCachedSuperShareItemDraftIdsByWeVoteId[campaignXWeVoteId] = superShareItemId;
        }
        return {
          ...state,
          allCachedEmailRecipientListDict,
          allCachedSuperShareItemDraftIdsByWeVoteId,
          allCachedSuperShareItems,
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
