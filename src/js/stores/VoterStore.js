import Dispatcher from "../dispatcher/Dispatcher";
import FluxMapStore from "flux/lib/FluxMapStore";
import VoterActions from "../actions/VoterActions";
import FacebookActions from "../actions/FacebookActions";
import FacebookStore from "../stores/FacebookStore";
const cookies = require("../utils/cookies");

class VoterStore extends FluxMapStore {

  getInitialState () {
    return {
      voter: {},
      address: {}
    };
  }

  voter (){
    return this.getState().voter;
  }

  election_id (){
    return this.getState().address.google_civic_election_id;
  }

  getAddress (){
    return this.getState().address.text_for_map_search;
  }

  getFacebookPhoto (){
    return this.getState().voter.facebook_profile_image_url_https;
  }

  getFullName (){
    return this.getState().voter.full_name;
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrl (){
    return this.getState().voter.voter_photo_url;
  }

  voterDeviceId () {
    return this.getState().voter.voter_device_id || cookies.getItem("voter_device_id");
  }

  setVoterDeviceIdCookie (id){
    cookies.setItem("voter_device_id", id, Infinity, "/");
  }

  reduce (state, action) {

    switch (action.type) {

      case "voterRetrieve":
        let voter_device_id = action.res.voter_device_id;
        this.setVoterDeviceIdCookie(voter_device_id);
        VoterActions.retrieveAddress(voter_device_id);
        const url = action.res.facebook_profile_image_url_https;
        if (action.res.signed_in_facebook && (url === null || url === "")){
          const userId = FacebookStore.userId;
          FacebookActions.getFacebookProfilePicture(userId);
        }

        return {
          ...state,
          voter: action.res
      };

      case "voterAddressRetrieve":
        return {
          ...state,
          address: action.res
      };

      case "voterAddressSave":
        return {
          ...state,
          address: { text_for_map_search: action.res.text_for_map_search,
                    google_civic_election_id: action.res.google_civic_election_id }
        };

      case "voterPhotoSave":
        return {
          ...state,
          voter: {...state.voter, facebook_profile_image_url_https: action.res.facebook_profile_image_url_https}
        };

      case "voterUpdate":
        const {first_name, last_name, email} = action.res;
        return {
          ...state,
          voter: {...state.voter,
            first_name: first_name ? first_name : state.voter.first_name,
            last_name: last_name ? last_name : state.voter.last_name,
            facebook_email: email ? email : state.voter.email,
          }
        };

      case "error-voterRetrieve" || "error-voterAddressRetrieve" || "error-voterAddressSave":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

module.exports = new VoterStore(Dispatcher);
