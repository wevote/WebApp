import Dispatcher from '../dispatcher/AppDispatcher';

export default {
  setGetStartedMode (getStartedMode) {
    Dispatcher.dispatch({ type: 'getStartedMode', payload: getStartedMode });
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

  setShowPaidAccountUpgradeModal (chosenPaidAccount) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showPaidAccountUpgradeModal', payload: chosenPaidAccount });
  },

  setShowSignInModal (show) {
    Dispatcher.dispatch({ type: 'showSignInModal', payload: show });
  },

  storeSignInStartPath () {
    Dispatcher.dispatch({ type: 'storeSignInStartPath', payload: true });
  },

  unsetStoreSignInStartPath () {
    Dispatcher.dispatch({ type: 'unsetStoreSignInStartPath', payload: false });
  },
};
