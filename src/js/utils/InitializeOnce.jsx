import VoterActions from '../actions/VoterActions';
import cookies from './cookies';

let isInitialized = false;

const InitializeOnce = () => {
  if (isInitialized) {
    return;
  }

  this.positionItemTimer = setTimeout(() => {
    // This is a performance killer, so let's delay it for a few seconds
    // voter_device_id won't be set for first time visitors, until the first API call completes!
    const voterDeviceId = !cookies.getItem('voter_device_id');
    if (voterDeviceId) {
      isInitialized = true;
      VoterActions.voterAddressRetrieve(voterDeviceId);
    } else {
      console.error('Attempted to send voterAddressRetrieve before we have a voterDeviceId!');
    }
  }, 3000);  // April 30, 2021: Tuned to keep performance up
};


export default InitializeOnce;
