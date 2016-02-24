import AppDispatcher from "../dispatcher/AppDispatcher";
import GuideConstants from "../constants/GuideConstants";

import { $ajax } from "../utils/service";
import { createStore } from "../utils/createStore";

const _guide_store = {};

const GuideStore = createStore({
  addOrganization: function (org) {
    console.log(org);
    _guide_store[org.organization_we_vote_id] = org;
  },

  toArray: function () {
    var t = [];

    Object.keys(_guide_store).forEach( (id) => {
      if (_guide_store.hasOwnProperty(id))
        t.push(_guide_store[id]);
    });

    return t;
  }
});

const we_vote_id = "organization_we_vote_id";

GuideStore.dispatchToken =
  AppDispatcher.register( (action) => {
    switch (action.actionType) {
      case GuideConstants.ORG_IGNORE:

        $ajax({
          endpoint: "organizationFollowIgnore",
          data: { [we_vote_id]: action.id },

          success: (res) => {
            const { organization_we_vote_id: id, success } = res;

            if (success) {
              delete _guide_store[id];
              GuideStore.emitChange();
            }
          },

          error: (err) => console.error(err)

        });

        break;

      case GuideConstants.ORG_FOLLOW:

        $ajax({
          endpoint: "organizationFollow",
          data: { [we_vote_id]: action.id },

          success: (res) => {
            const { organization_we_vote_id: id, success } = res;

            if (success) {
              delete _guide_store[id];
              GuideStore.emitChange();
            }
          },

          error: (err) => console.error(err)

        });
        break;

      default:
        break;
    }
  });

export default GuideStore;
