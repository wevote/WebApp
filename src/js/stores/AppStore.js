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
      chosenPreventSharingOpinions: false,
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      chosenSiteLogoUrl: '',
      getVoterGuideSettingsDashboardEditMode: '',
      getStartedMode: '',
      hideWeVoteLogo: false,
      hostname: '',
      organizationModalBallotItemWeVoteId: '',
      scrolledDown: false,
      sharedItemCode: '',
      shareModalStep: '',
      showEditAddressButton: false,
      showElectionsWithOrganizationVoterGuidesModal: false,
      showHowItWorksModal: false,
      showNewVoterGuideModal: false,
      showOrganizationModal: false,
      showPaidAccountUpgradeModal: false,
      showPersonalizedScoreIntroModal: false,
      showSelectBallotModal: false,
      showSelectBallotModalHideAddress: false,
      showSelectBallotModalHideElections: false,
      showShareModal: false,
      showSharedItemModal: false,
      showSignInModal: false,
      showVoterPlanModal: false,
      siteConfigurationHasBeenRetrieved: false,
      siteOwnerOrganizationWeVoteId: '',
      storeSignInStartFullUrl: false,
      voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
    };
  }

  getChosenPreventSharingOpinions () {
    return this.getState().chosenPreventSharingOpinions;
  }

  getChosenReadyIntroductionText () {
    return this.getState().chosenReadyIntroductionText;
  }

  getChosenReadyIntroductionTitle () {
    return this.getState().chosenReadyIntroductionTitle;
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

  getSharedItemCode () {
    return this.getState().sharedItemCode;
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
    return this.getState().onWeVoteRootUrl || isCordova() || stringContains('localhost:', window.location.href);
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

  showElectionsWithOrganizationVoterGuidesModal () {
    return this.getState().showElectionsWithOrganizationVoterGuidesModal;
  }

  showFirstPositionIntroModal () {
    return this.getState().showFirstPositionIntroModal;
  }

  showHowItWorksModal () {
    return this.getState().showHowItWorksModal;
  }

  showVoterPlanModal () {
    return this.getState().showVoterPlanModal;
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

  showSharedItemModal () {
    return this.getState().showSharedItemModal;
  }

  shareModalStep () {
    return this.getState().shareModalStep;
  }

  showSelectBallotModal () {
    return this.getState().showSelectBallotModal;
  }

  showSelectBallotModalHideAddress () {
    return this.getState().showSelectBallotModalHideAddress;
  }

  showSelectBallotModalHideElections () {
    return this.getState().showSelectBallotModalHideElections;
  }

  showSignInModal () {
    return this.getState().showSignInModal;
  }

  organizationModalBallotItemWeVoteId () {
    return this.getState().organizationModalBallotItemWeVoteId;
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
    let chosenPreventSharingOpinions;
    let chosenReadyIntroductionText;
    let chosenReadyIntroductionTitle;
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
      case 'showElectionsWithOrganizationVoterGuidesModal':
        return { ...state, showElectionsWithOrganizationVoterGuidesModal: action.payload };
      case 'showFirstPositionIntroModal':
        return { ...state, showFirstPositionIntroModal: action.payload };
      case 'showHowItWorksModal':
        return { ...state, showHowItWorksModal: action.payload };
      case 'showVoterPlanModal':
        return { ...state, showVoterPlanModal: action.payload };
      case 'showNewVoterGuideModal':
        return { ...state, showNewVoterGuideModal: action.payload };
      case 'showPaidAccountUpgradeModal':
        return { ...state, showPaidAccountUpgradeModal: action.payload };
      case 'showPersonalizedScoreIntroModal':
        return { ...state, showPersonalizedScoreIntroModal: action.payload };
      case 'showShareModal':
        return { ...state, showShareModal: action.payload };
      case 'showSharedItemModal':
        return { ...state, sharedItemCode: action.payload, showSharedItemModal: (action.payload !== '') };
      case 'shareModalStep':
        return { ...state, shareModalStep: action.payload };
      case 'showSelectBallotModal':
        return {
          ...state,
          showSelectBallotModal: action.showSelectBallotModal,
          showSelectBallotModalHideAddress: action.showSelectBallotModalHideAddress,
          showSelectBallotModalHideElections: action.showSelectBallotModalHideElections,
        };
      case 'showSignInModal':
        return { ...state, showSignInModal: action.payload };
      case 'showOrganizationModal':
        return { ...state, showOrganizationModal: action.payload };
      case 'organizationModalBallotItemWeVoteId':
        return { ...state, organizationModalBallotItemWeVoteId: action.payload };
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
          chosen_prevent_sharing_opinions: chosenPreventSharingOpinions,
          chosen_ready_introduction_text: chosenReadyIntroductionText,
          chosen_ready_introduction_title: chosenReadyIntroductionTitle,
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
            chosenPreventSharingOpinions,
            chosenReadyIntroductionText,
            chosenReadyIntroductionTitle,
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
