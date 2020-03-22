import Dispatcher from '../dispatcher/AppDispatcher';

export default {
  setGetStartedMode (getStartedMode) {
    Dispatcher.dispatch({ type: 'getStartedMode', payload: getStartedMode });
  },

  setVoterGuideSettingsDashboardEditMode (getVoterGuideSettingsDashboardEditMode) {
    Dispatcher.dispatch({ type: 'getVoterGuideSettingsDashboardEditMode', payload: getVoterGuideSettingsDashboardEditMode });
  },

  setScrolled (scrolledDown) {
    Dispatcher.dispatch({ type: 'scrolledDown', payload: scrolledDown });
  },

  setShareModalStep (step) {
    Dispatcher.dispatch({ type: 'shareModalStep', payload: step });
  },

  setShowAdviserIntroModal (show) {
    Dispatcher.dispatch({ type: 'showAdviserIntroModal', payload: show });
  },

  setShowEditAddressButton (show) {
    Dispatcher.dispatch({ type: 'showEditAddressButton', payload: show });
  },

  setShowFirstPositionIntroModal (show) {
    Dispatcher.dispatch({ type: 'showFirstPositionIntroModal', payload: show });
  },

  setShowHowItWorksModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showHowItWorksModal', payload: show });
  },

  setShowNewVoterGuideModal (show) {
    Dispatcher.dispatch({ type: 'showNewVoterGuideModal', payload: show });
  },

  setShowPaidAccountUpgradeModal (chosenPaidAccount) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showPaidAccountUpgradeModal', payload: chosenPaidAccount });
  },

  setShowPersonalizedScoreIntroModal (show) {
    Dispatcher.dispatch({ type: 'showPersonalizedScoreIntroModal', payload: show });
  },

  setShowSelectBallotModal (show) {
    Dispatcher.dispatch({ type: 'showSelectBallotModal', payload: show });
  },

  setShowShareModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showShareModal', payload: show });
  },

  setShowSignInModal (show) {
    Dispatcher.dispatch({ type: 'showSignInModal', payload: show });
  },

  setShowOrganizationModal (show) {
    // console.log("Setting organizationModal to ", show);
    Dispatcher.dispatch({ type: 'showOrganizationModal', payload: show });
  },

  setOrganizationModalId (id) {
    Dispatcher.dispatch({ type: 'organizationModalId', payload: id });
  },

  setShowValuesIntroModal (show) {
    Dispatcher.dispatch({ type: 'showValuesIntroModal', payload: show });
  },

  siteConfigurationRetrieve (hostname, refresh_string = '') {
    Dispatcher.loadEndpoint('siteConfigurationRetrieve',
      {
        hostname,
        refresh_string,
      });
  },

  storeSignInStartFullUrl () {
    Dispatcher.dispatch({ type: 'storeSignInStartFullUrl', payload: true });
  },

  unsetStoreSignInStartFullUrl () {
    Dispatcher.dispatch({ type: 'unsetStoreSignInStartFullUrl', payload: false });
  },
};
