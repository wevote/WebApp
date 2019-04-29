import Dispatcher from '../dispatcher/AppDispatcher';

export default {
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
