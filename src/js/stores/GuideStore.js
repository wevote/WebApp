import { createStore } from "../utils/createStore";

const _guide_store = {};

const GuideStore = createStore({
  addOrganization: function (org) {
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

export default GuideStore;
