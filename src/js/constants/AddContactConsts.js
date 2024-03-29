import keyMirror from 'keymirror';

const AddContactConsts = {
  uninitialized: null,
  initializedSignedOut: null,
  initializedSignedIn: null,
  requestingSignIn: null,
  requestingContacts: null,
  receivedContacts: null,
  sendingContacts: null,
  savedContacts: null,
  noContactsFound: null,
  permissionDenied: null,
  defaultVal: null,
};

export default keyMirror(AddContactConsts);
