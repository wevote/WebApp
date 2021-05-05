import VoterActions from '../actions/VoterActions';
import VoterStore from '../stores/VoterStore';


let isInitialized = false;

const InitializeOnce = () => {
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  setTimeout(() => {
    // April 2021: This takes a half second to complete, and does tons more than
    // you would think server side.  But it should not be necessary on every voterRetrieve,
    // but if there are some odd cases where it has to be called agian, deal with them as
    // special cases.
    // voter_device_id won't be set for first time visitors, until the first API call completes!
    const voterDeviceId = VoterStore.voterDeviceId();
    if (voterDeviceId) {
      VoterActions.voterAddressRetrieve(voterDeviceId);
    } else {
      console.error('Attempted to send voterAddressRetrieve before we have a voterDeviceId!');
    }
  }, 5000);  // April 30, 2021: Tuned to keep performance up
};



export default InitializeOnce;
