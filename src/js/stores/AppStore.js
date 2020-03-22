import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';
import VoterActions from '../actions/VoterActions'; // eslint-disable-line import/no-cycle
import VoterStore from './VoterStore'; // eslint-disable-line import/no-cycle
import webAppConfig from '../config'; // eslint-disable-line import/no-cycle
import { isCordova } from '../utils/cordovaUtils'; // eslint-disable-line import/no-cycle
import { stringContains } from '../utils/textFormat';

/**
 * AppStore allows you to store state information, in situations where there is no API call needed
 */
class AppStore extends ReduceStore {
  getInitialState () {
    return {
      chosenSiteLogoUrl: '',
      getVoterGuideSettingsDashboardEditMode: '',
      getStartedMode: '',
      hideWeVoteLogo: false,
      hostname: '',
      scrolledDown: false,
      showEditAddressButton: false,
      showHowItWorksModal: false,
      shareModalStep: 'options',
      showNewVoterGuideModal: false,
      showPaidAccountUpgradeModal: false,
      showPersonalizedScoreIntroModal: false,
      showSelectBallotModal: false,
      showShareModal: false,
      showSignInModal: false,
      organizationModalId: '',
      showOrganizationModal: false,
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
    return this.getState().hostname || '';
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

  showingOneCompleteYourProfileModal () {
    return this.getState().showAdviserIntroModal || this.getState().showFirstPositionIntroModal || this.getState().showHowItWorksModal || this.getState().showPersonalizedScoreIntroModal || this.getState().showValuesIntroModal || this.getState().showSelectBallotModal;
  }

  showAdviserIntroModal () {
    return this.getState().showAdviserIntroModal;
  }

  showEditAddressButton () {
    return this.getState().showEditAddressButton;
  }

  showFirstPositionIntroModal () {
    return this.getState().showFirstPositionIntroModal;
  }

  showHowItWorksModal () {
    return this.getState().showHowItWorksModal;
  }

  showNewVoterGuideModal () {
    return this.getState().showNewVoterGuideModal;
  }

  showPaidAccountUpgradeModal () {
    // The chosenPaidAccount values are: free, professional, enterprise
    return this.getState().showPaidAccountUpgradeModal;
  }

  showPersonalizedScoreIntroModal () {
    return this.getState().showPersonalizedScoreIntroModal;
  }

  showShareModal () {
    return this.getState().showShareModal;
  }

  shareModalStep () {
    return this.getState().shareModalStep;
  }

  showSelectBallotModal () {
    return this.getState().showSelectBallotModal;
  }

  showSignInModal () {
    return this.getState().showSignInModal;
  }

  organizationModalId () {
    return this.getState().organizationModalId;
  }

  showOrganizationModal () {
    return this.getState().showOrganizationModal;
  }

  showValuesIntroModal () {
    return this.getState().showValuesIntroModal;
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
      case 'scrolledDown':
        return { ...state, scrolledDown: action.payload };
      case 'showAdviserIntroModal':
        return { ...state, showAdviserIntroModal: action.payload };
      case 'showEditAddressButton':
        return { ...state, showEditAddressButton: action.payload };
      case 'showFirstPositionIntroModal':
        return { ...state, showFirstPositionIntroModal: action.payload };
      case 'showHowItWorksModal':
        return { ...state, showHowItWorksModal: action.payload };
      case 'showNewVoterGuideModal':
        return { ...state, showNewVoterGuideModal: action.payload };
      case 'showPaidAccountUpgradeModal':
        return { ...state, showPaidAccountUpgradeModal: action.payload };
      case 'showPersonalizedScoreIntroModal':
        return { ...state, showPersonalizedScoreIntroModal: action.payload };
      case 'showShareModal':
        return { ...state, showShareModal: action.payload };
      case 'shareModalStep':
        return { ...state, shareModalStep: action.payload };
      case 'showSelectBallotModal':
        return { ...state, showSelectBallotModal: action.payload };
      case 'showSignInModal':
        return { ...state, showSignInModal: action.payload };
      case 'showOrganizationModal':
        return { ...state, showOrganizationModal: action.payload };
      case 'organizationModalId':
        return { ...state, organizationModalId: action.payload };
      case 'showValuesIntroModal':
        return { ...state, showValuesIntroModal: action.payload };
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

          if (isCordova()) {
            hostname = webAppConfig.WE_VOTE_HOSTNAME;
          }

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
