const simState = {
  waitingForFacebookApiCompletion: false,
};

// Since SignInModal physically covers the UI where facebook error messages appear,
// we need to save some state here, so that the SignInModal dialog can retrieve it
// This global store is needed to set and read state info in the middle of a
// react dispatch (where a nested dispatch would cause an error to be thrown).
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
