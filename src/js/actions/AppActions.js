import Dispatcher from '../dispatcher/AppDispatcher';

export default {
  setHeadroomUnpinned (unpinned) {
    Dispatcher.dispatch({ type: 'headroomUnpinned', payload: unpinned });
  },

  setShowSelectBallotModal (show) {
    Dispatcher.dispatch({ type: 'showSelectBallotModal', payload: show });
  },
};
