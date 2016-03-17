var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
class GuideStore extends FluxMapStore {

/* The store keeps nested attributes of voter guides in data, whereas the followed, ignoring, to_follow are just lists of ids.*/
    getInitialState () {
      return {
        following: [],
        ignoring: [],
        to_follow: [],
        data: {}
      };
    }

/* Given a list of ids, retrieve the complete data with all attributes and return as array */
    getOrgsFromArr (arr) {
      var state = this.getState();
      var orgs = [];
      // voterGuidesFollowedRetrieve API returns more than one voter guide per organization some times.
      var uniq_arr = arr.filter( (value, index, self) => { return self.indexOf(value) === index; });
      uniq_arr.forEach( id => {
        orgs.push( state.data[id] );
      });
      return orgs;
    }

    toFollowList () {
      return this.getOrgsFromArr(this.getState().to_follow);
    }

    followedList (){
      return this.getOrgsFromArr(this.getState().following);
    }

  reduce (state, action) {
    var voter_guides;
    var data;
    var id;

    switch (action.type) {

      case "voterGuidesToFollowRetrieve":
        voter_guides = action.res.voter_guides;
        data = state.data;
        var to_follow = [];
        voter_guides.forEach( item => {
          data[item.organization_we_vote_id] = item;
          to_follow.push(item.organization_we_vote_id);
        });
        return {
          ...state,
          to_follow: to_follow,
          data: data
        };

      case "voterGuidesFollowedRetrieve":
        voter_guides = action.res.voter_guides;
        data = state.data;
        var following = [];
        voter_guides.forEach( item => {
          data[item.organization_we_vote_id] = item;
          following.push(item.organization_we_vote_id);
        });
        return {
          ...state,
          following: following,
          data: data
        };

      case "organizationFollow":
        id = action.res.organization_we_vote_id;
        return {
          ...state,
          following: state.following.concat(id),
          to_follow: state.to_follow.filter( el => { return el !== id; }),
          ignoring: state.ignoring.filter( el => { return el !== id; })
        };

      case "organizationStopFollowing":
        id = action.res.organization_we_vote_id;
        return {
          ...state,
          following: state.following.filter( el => { return el !== id; }),
          to_follow: state.to_follow.concat(id)
        };

      case "organizationFollowIgnore":
        id = action.res.organization_we_vote_id;
        return {
          ...state,
          ignoring: state.ignoring.concat(id),
          to_follow: state.to_follow.filter( el => { return el !== id; }),
          following: state.following.filter( el => { return el !== id; })
        };

      case "error-organizationFollowIgnore" || "error-organizationFollow":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new GuideStore(Dispatcher);
