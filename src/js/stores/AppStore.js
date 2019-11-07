import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';
import { stringContains } from '../utils/textFormat';
import { isCordova } from '../utils/cordovaUtils'; // eslint-disable-line import/no-cycle
import VoterActions from '../actions/VoterActions'; // eslint-disable-line import/no-cycle
import VoterStore from './VoterStore'; // eslint-disable-line import/no-cycle

class AppStore extends ReduceStore {
  getInitialState () {
    return {
      chosenSiteLogoUrl: '',
      getVoterGuideSettingsDashboardEditMode: '',
      getStartedMode: '',
      headroomUnpinned: false,
      hideWeVoteLogo: false,
      hostname: '',
      scrolledDown: false,
      showEditAddressButton: false,
      showNewVoterGuideModal: false,
      showPaidAccountUpgradeModal: false,
      showSelectBallotModal: false,
      showSignInModal: false,
      siteConfigurationHasBeenRetrieved: false,
      siteOwnerOrganizationWeVoteId: '',
      storeSignInStartFullUrl: false,
      voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
    };
  }

  getChosenSiteLogoUrl () {
    return this.getState().chosenSiteLogoUrl;
  }

  getHideWeVoteLogo () {
    return this.getState().hideWeVoteLogo;
  }

  getHostname () {
    return this.getState().hostname;
  }

  getScrolledDown () {
    return this.getState().scrolledDown;
  }

  getSiteOwnerOrganizationWeVoteId () {
    return this.getState().siteOwnerOrganizationWeVoteId;
  }

  getStartedMode () {
    return this.getState().getStartedMode;
  }

  getVoterGuideSettingsDashboardEditMode () {
    return this.getState().getVoterGuideSettingsDashboardEditMode;
  }

  isOnWeVoteRootUrl () {
    return this.getState().onWeVoteRootUrl || isCordova();
  }

  isOnWeVoteSubdomainUrl () {
    return this.getState().onWeVoteSubdomainUrl;
  }

  isOnPartnerUrl () {
    return this.getState().onWeVoteSubdomainUrl || this.getState().onChosenFullDomainUrl;
  }

  voterIsAdminForThisUrl () {
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    return this.getState().siteOwnerOrganizationWeVoteId === linkedOrganizationWeVoteId;
  }

  isOnFacebookSupportedDomainUrl () {
    return this.getState().onFacebookSupportedDomainUrl;
  }

  isOnChosenFullDomainUrl () {
    return this.getState().onChosenFullDomainUrl;
  }

  headroomIsUnpinned () {
    return this.getState().headroomUnpinned;
  }

  showEditAddressButton () {
    return this.getState().showEditAddressButton;
  }

  showNewVoterGuideModal () {
    return this.getState().showNewVoterGuideModal;
  }

  showPaidAccountUpgradeModal () {
    // The chosenPaidAccount values are: free, professional, enterprise
    return this.getState().showPaidAccountUpgradeModal;
  }

  showSelectBallotModal () {
    return this.getState().showSelectBallotModal;
  }

  showSignInModal () {
    return this.getState().showSignInModal;
  }

  siteConfigurationHasBeenRetrieved () {
    return this.getState().siteConfigurationHasBeenRetrieved;
  }

  storeSignInStartFullUrl () {
    return this.getState().storeSignInStartFullUrl;
  }

  voterExternalIdHasBeenSavedOnce (externalVoterId, membershipOrganizationWeVoteId) {
    if (this.getState().voterExternalIdHasBeenSavedOnce[externalVoterId]) {
      return this.getState().voterExternalIdHasBeenSavedOnce[externalVoterId][membershipOrganizationWeVoteId] || false;
    } else {
      return false;
    }
  }

  reduce (state, action) {
    let apiStatus;
    let apiSuccess;
    let chosenSiteLogoUrl;
    let externalVoterId;
    let hideWeVoteLogo;
    let hostname;
    let siteOwnerOrganizationWeVoteId;
    let voterExternalIdHasBeenSavedOnce;
    switch (action.type) {
      case 'getStartedMode':
        return { ...state, getStartedMode: action.payload };
      case 'getVoterGuideSettingsDashboardEditMode':
        return { ...state, getVoterGuideSettingsDashboardEditMode: action.payload };
      case 'headroomUnpinned':
        return { ...state, headroomUnpinned: action.payload };
      case 'scrolledDown':
        return { ...state, scrolledDown: action.payload };
      case 'showEditAddressButton':
        return { ...state, showEditAddressButton: action.payload };
      case 'showNewVoterGuideModal':
        return { ...state, showNewVoterGuideModal: action.payload };
      case 'showPaidAccountUpgradeModal':
        return { ...state, showPaidAccountUpgradeModal: action.payload };
      case 'showSelectBallotModal':
        return { ...state, showSelectBallotModal: action.payload };
      case 'showSignInModal':
        return { ...state, showSignInModal: action.payload };
      case 'siteConfigurationRetrieve':
        ({
          status: apiStatus,
          success: apiSuccess,
          hostname,
          organization_we_vote_id: siteOwnerOrganizationWeVoteId,
          chosen_hide_we_vote_logo: hideWeVoteLogo,
          chosen_logo_url_https: chosenSiteLogoUrl,
        } = action.res);
        if (apiSuccess) {
          let onWeVoteRootUrl = false;
          let onWeVoteSubdomainUrl = false;
          let onFacebookSupportedDomainUrl = false;
          let onChosenFullDomainUrl = false;
          // console.log('siteConfigurationRetrieve hostname:', hostname);
          if (hostname === 'wevote.us' || hostname === 'quality.wevote.us' || hostname === 'localhost') {
            onWeVoteRootUrl = true;
          } else if (stringContains('wevote.us', hostname)) {
            onWeVoteSubdomainUrl = true;
          } else {
            onChosenFullDomainUrl = true;
          }
          if (hostname === 'wevote.us' || hostname === 'quality.wevote.us' || hostname === 'localhost' || isCordova()) {
            // We should move this to the server if we can't change the Facebook sign in root url
            onFacebookSupportedDomainUrl = true;
          }
          externalVoterId = VoterStore.getExternalVoterId();
          // console.log('AppStore externalVoterId:', externalVoterId, ', siteOwnerOrganizationWeVoteId:', siteOwnerOrganizationWeVoteId);
          ({ voterExternalIdHasBeenSavedOnce } = state);
          if (externalVoterId && siteOwnerOrganizationWeVoteId) {
            if (!this.voterExternalIdHasBeenSavedOnce(externalVoterId, siteOwnerOrganizationWeVoteId)) {
              // console.log('voterExternalIdHasBeenSavedOnce has NOT been saved before.');
              VoterActions.voterExternalIdSave(externalVoterId, siteOwnerOrganizationWeVoteId);
              if (!voterExternalIdHasBeenSavedOnce[externalVoterId]) {
                voterExternalIdHasBeenSavedOnce[externalVoterId] = {};
              }
              voterExternalIdHasBeenSavedOnce[externalVoterId][siteOwnerOrganizationWeVoteId] = true;
              // AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
            } else {
              // console.log('voterExternalIdHasBeenSavedOnce has been saved before.');
            }
          }
          return {
            ...state,
            apiStatus,
            apiSuccess,
            chosenSiteLogoUrl,
            hideWeVoteLogo,
            hostname,
            onChosenFullDomainUrl,
            onFacebookSupportedDomainUrl,
            onWeVoteSubdomainUrl,
            onWeVoteRootUrl,
            siteConfigurationHasBeenRetrieved: true,
            siteOwnerOrganizationWeVoteId,
            voterExternalIdHasBeenSavedOnce,
          };
        } else {
          return state;
        }
      case 'storeSignInStartFullUrl':
        // Send a signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_full_url'
        return { ...state, storeSignInStartFullUrl: action.payload };
      case 'unsetStoreSignInStartFullUrl':
        // Turn off the signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_full_url'
        return { ...state, storeSignInStartFullUrl: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
