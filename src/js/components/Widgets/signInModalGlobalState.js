const simState = {
  // Since SignInModal physically covers the UI where facebook error messages appear,
  // we need to save some state here, so that the SignInModal dialog can retrieve it
  // This global store is needed to set and read state info in the middle of a
  // react dispatch (where a nested dispatch would cause an error to be thrown).
  waitingForFacebookApiCompletion: false,

  // Since SignInModal physically covers the UI where all the store listeners are still running,
  // we need to block those stores from setting state, and thereby closing the sign in model, because if that happens,
  // any code that is necessary to run on propper close of the SignInModal won't execute.
  //  As a result you end up with "ghost" dialogs still on the screen, or the dialog background still covering the
  //  otherwise working ballot page, or close of dialog components attempting to change state which results in "dispatch within dispatch"
  //  errors from React.
  textOrEmailSignInInProcess: false,
};

export default {
  set (key, value) {
    simState[key] = value;
  },

  // eslint-disable-next-line no-unused-vars
  remove (key) {
    delete simState[key];
  },

  // eslint-disable-next-line no-unused-vars
  get (key) {
    return simState[key];
  },

  // eslint-disable-next-line no-unused-vars
  getBool (key) {
    return simState[key] ? simState[key] : false;
  },
};
