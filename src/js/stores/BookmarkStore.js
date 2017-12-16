import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
import Immutable from "immutable";

class BookmarkStore extends ReduceStore {

  getInitialState () {
    return Immutable.Map();
  }

  get (ballot_item_we_vote_id) {
    if (!(this.supportList && this.opposeList && this.supportCounts && this.opposeCounts)) {
      return undefined;
    }

    return { ...state };
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    var key = action.res.ballot_item_we_vote_id;

    switch (action.type) {

      case "voterAllBookmarksStatusRetrieve":
        let newState = {};
        action.res.bookmark_list.forEach(el =>{
          newState[el.ballot_item_we_vote_id] = el.bookmark_on;
        });
        return state.merge(Immutable.Map(newState));

      case "voterBookmarkOnSave":
        return state.set(key, true);

      case "voterBookmarkOffSave":
        return state.set(key, false);

      case "error-BookmarkRetrieve" || "error-voterBookmarkOnSave" || "error-voterBookmarkOnSave":
        console.log(action.res);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new BookmarkStore(Dispatcher);
