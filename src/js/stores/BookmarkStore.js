import { ReduceStore } from "flux/utils";
import Immutable from "immutable";
import Dispatcher from "../dispatcher/Dispatcher";
import BookmarkActions from "../actions/BookmarkActions";

class BookmarkStore extends ReduceStore {
  getInitialState () {
    return Immutable.Map();
  }

  get (ballot_item_we_vote_id) {
    return this._state.get(ballot_item_we_vote_id);
  }

  resetState () {
    return Immutable.Map();
  }

  reduce (state, action) {
    // Exit if we don't have a response. "success" is not required though -- we should deal with error conditions below.
    if (!action.res) return state;

    const key = action.res.ballot_item_we_vote_id;
    const newState = {};

    switch (action.type) {
      case "voterAllBookmarksStatusRetrieve":
        action.res.bookmark_list.forEach((el) => {
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

      case "voterSignOut":
        // console.log("resetting BookmarkStore");
        BookmarkActions.voterAllBookmarksStatusRetrieve();
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new BookmarkStore(Dispatcher);
