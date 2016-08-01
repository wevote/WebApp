var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import CandidateActions from "../actions/CandidateActions";
import OrganizationActions from "../actions/OrganizationActions";

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

  reduce (state, action) {
    // var key;
    // var merged_properties;

    switch (action.type) {

      case "twitterIdentityRetrieve":
        if (action.res.kind_of_owner === "ORGANIZATION") {
          OrganizationActions.retrieve(action.res.owner_we_vote_id);
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

      default:
        return state;
    }

  }

}

module.exports = new TwitterStore(Dispatcher);
