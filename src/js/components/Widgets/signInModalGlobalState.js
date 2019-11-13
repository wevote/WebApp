const simState = {};

// Since SignInModal physically covers the UI where facebook error messages appear,
// we need to save its state here, so that the SignInModal dialog can retrieve it
export default {
  set (key, value) {
    simState.key = value;
  },

  // eslint-disable-next-line no-unused-vars
  remove (key) {
    delete simState.key;
  },

  // eslint-disable-next-line no-unused-vars
  get (key) {
    return simState.key;
  },
};
