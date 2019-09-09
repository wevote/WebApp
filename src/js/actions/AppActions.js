import Dispatcher from '../dispatcher/AppDispatcher';

export default {
  setGetStartedMode (getStartedMode) {
    Dispatcher.dispatch({ type: 'getStartedMode', payload: getStartedMode });
  },

  setVoterGuideSettingsDashboardEditMode (getVoterGuideSettingsDashboardEditMode) {
    Dispatcher.dispatch({ type: 'getVoterGuideSettingsDashboardEditMode', payload: getVoterGuideSettingsDashboardEditMode });
  },

  setHeadroomUnpinned (unpinned) {
    Dispatcher.dispatch({ type: 'headroomUnpinned', payload: unpinned });
  },

  setScrolled (scrolledDown) {
    Dispatcher.dispatch({ type: 'scrolledDown', payload: scrolledDown });
  },

  setShowEditAddressButton (show) {
    Dispatcher.dispatch({ type: 'showEditAddressButton', payload: show });
  },

  setShowSelectBallotModal (show) {
    Dispatcher.dispatch({ type: 'showSelectBallotModal', payload: show });
  },

  setShowNewVoterGuideModal (show) {
    Dispatcher.dispatch({ type: 'showNewVoterGuideModal', payload: show });
  },

  setShowPaidAccountUpgradeModal (chosenPaidAccount) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showPaidAccountUpgradeModal', payload: chosenPaidAccount });
  },

  setShowSignInModal (show) {
    Dispatcher.dispatch({ type: 'showSignInModal', payload: show });
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
