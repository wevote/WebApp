import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';

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
      storeSignInStartPath: false,
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

  storeSignInStartPath () {
    return this.getState().storeSignInStartPath;
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
          return {
            ...state,
            apiStatus,
            apiSuccess,
            hideWeVoteLogo,
            hostname,
            chosenSiteLogoUrl,
            siteOwnerOrganizationWeVoteId,
          };
        } else {
          return state;
        }
      case 'storeSignInStartPath':
        // Send a signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_path'/'sign_in_start_full_url'
        return { ...state, storeSignInStartPath: action.payload };
      case 'unsetStoreSignInStartPath':
        // Turn off the signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_path'/'sign_in_start_full_url'
        return { ...state, storeSignInStartPath: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
