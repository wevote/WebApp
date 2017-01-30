var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
import CandidateActions from "../actions/CandidateActions";
import OrganizationActions from "../actions/OrganizationActions";
import VoterActions from "../actions/VoterActions";

class TwitterStore extends FluxMapStore {

  get () {
    return {
      kind_of_owner: this.kindOfOwner || "",
      owner_we_vote_id: this.ownerWeVoteId || "",
      twitter_handle: this.twitterHandle || "",
      twitter_description: this.getState().twitter_description || "",
      twitter_followers_count: this.getState().twitter_followers_count || "",
      twitter_name: this.getState().twitter_name || "",
      twitter_photo_url: this.getState().twitter_photo_url || "",
      twitter_user_website: this.getState().twitter_user_website || "",
      status: this.status || ""
    };
  }

  get kindOfOwner (){
    return this.getState().kind_of_owner;
  }

  get ownerWeVoteId (){
    return this.getState().owner_we_vote_id;
  }

  get twitterHandle (){
    return this.getState().twitter_handle;
  }

  get status (){
    return this.getState().status;
  }

  getTwitterAuthResponse () {
    return {
      twitter_retrieve_attempted: this.getState().twitter_retrieve_attempted,
      twitter_sign_in_found: this.getState().twitter_sign_in_found,
      twitter_sign_in_verified: this.getState().twitter_sign_in_verified,
      twitter_sign_in_failed: this.getState().twitter_sign_in_failed,
      twitter_secret_key: this.getState().twitter_secret_key,
      twitter_profile_image_url_https: this.getState().twitter_profile_image_url_https,
      voter_has_data_to_preserve: this.getState().voter_has_data_to_preserve,
      existing_twitter_account_found: this.getState().existing_twitter_account_found,
      voter_we_vote_id_attached_to_twitter: this.getState().voter_we_vote_id_attached_to_twitter,
    };
  }

  reduce (state, action) {
    // var key;
    // var merged_properties;

    switch (action.type) {

      case "twitterIdentityRetrieve":
        if (action.res.kind_of_owner === "ORGANIZATION") {
          OrganizationActions.organizationRetrieve(action.res.owner_we_vote_id);
        } else if (action.res.kind_of_owner === "CANDIDATE") {
          CandidateActions.retrieve(action.res.owner_we_vote_id);
        }

        return {
          ...state,
          kind_of_owner: action.res.kind_of_owner,
          owner_we_vote_id: action.res.owner_we_vote_id,
          twitter_handle: action.res.twitter_handle,
          twitter_description: action.res.twitter_description,
          twitter_followers_count: action.res.twitter_followers_count,
          twitter_name: action.res.twitter_name,
          twitter_photo_url: action.res.twitter_photo_url,
          twitter_user_website: action.res.twitter_user_website,
          status: action.res.status
        };

      case "twitterSignInRetrieve":
        if (action.res.twitter_sign_in_verified) {
          VoterActions.voterRetrieve();
          VoterActions.organizationSuggestionTasks('UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW',
          'FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW');
        }
        return {
          ...state,
          voter_device_id: action.res.voter_device_id,
          voter_has_data_to_preserve: action.res.voter_has_data_to_preserve,
          twitter_retrieve_attempted: action.res.twitter_retrieve_attempted,
          twitter_sign_in_found: action.res.twitter_sign_in_found,
          twitter_sign_in_verified: action.res.twitter_sign_in_verified,
          twitter_sign_in_failed: action.res.twitter_sign_in_failed,
          twitter_secret_key: action.res.twitter_secret_key,
          existing_twitter_account_found: action.res.existing_twitter_account_found,
          voter_we_vote_id_attached_to_twitter: action.res.voter_we_vote_id_attached_to_twitter,
          voter_we_vote_id_attached_to_twitter_email: action.res.voter_we_vote_id_attached_to_twitter_email,
          twitter_profile_image_url_https: action.res.twitter_profile_image_url_https,
        };
      //
      // case "twitterSignInStart":
      //   console.log("TwitterStore twitterSignInStart, action.res:", action.res);
      //   if (action.res.twitter_redirect_url) {
      //     window.location.assign(action.res.twitter_redirect_url);
      //   }
      //   return {
      //     ...state,
      //   };

      default:
        return state;
    }
  }
}

module.exports = new TwitterStore(Dispatcher);
