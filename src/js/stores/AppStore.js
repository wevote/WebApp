import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';
import { stringContains } from '../utils/textFormat';

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
      siteOwnerOrganizationWeVoteId: '',
      storeSignInStartFullUrl: false,
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
    return this.getState().onWeVoteRootUrl;
  }

  isOnWeVoteSubDomainUrl () {
    return this.getState().onWeVoteSubDomainUrl;
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

  storeSignInStartFullUrl () {
    return this.getState().storeSignInStartFullUrl;
  }

  reduce (state, action) {
    let apiStatus;
    let apiSuccess;
    let hideWeVoteLogo;
    let hostname;
    let chosenSiteLogoUrl;
    let siteOwnerOrganizationWeVoteId;
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
          let onWeVoteSubDomainUrl = false;
          let onChosenFullDomainUrl = false;
          // console.log('siteConfigurationRetrieve hostname:', hostname);
          if (hostname === 'wevote.us' || hostname === 'localhost') {
            onWeVoteRootUrl = true;
          } else if (stringContains('wevote.us', hostname)) {
            onWeVoteSubDomainUrl = true;
          } else {
            onChosenFullDomainUrl = true;
          }
          return {
            ...state,
            apiStatus,
            apiSuccess,
            chosenSiteLogoUrl,
            hideWeVoteLogo,
            hostname,
            onChosenFullDomainUrl,
            onWeVoteSubDomainUrl,
            onWeVoteRootUrl,
            siteOwnerOrganizationWeVoteId,
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
