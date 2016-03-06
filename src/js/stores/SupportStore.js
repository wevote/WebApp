var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class SupportStore extends FluxMapStore {

  isRetrieved (we_vote_id){
    var props = ["is_oppose", "is_support", "support_count", "oppose_count"];
    var item = this.get(we_vote_id);
    if (!item){
      return false;
    }
    var result = true;
    props.forEach( (prop) => {
      if (!item.hasOwnProperty(prop)){
        result = false;
      }
    });
    return result;
  }

  /**
  * toggle the support state of a ballot item to On by its we_vote_id
  */
setLocalSupportOnState (we_vote_id) {
    var item = this.get(we_vote_id);
    var obj = {is_support: true, is_oppose: false, support_count: item.support_count + 1 };
    if (item.is_oppose === true){
      obj.oppose_count = item.oppose_count - 1;
    }
    return obj;
 }
 /**
 * toggle the support state of a ballot item to Off by its we_vote_id
 */
setLocalSupportOffState (we_vote_id) {
   var item = this.get(we_vote_id);
   var obj = {is_support: false};
   if (item.is_support === true) {
     obj.support_count = item.support_count - 1;
   }
   return obj;
 }

  /**
  * toggle the oppose state of a ballot item to On by its we_vote_id
  */
setLocalOpposeOnState (we_vote_id) {
   var item = this.get(we_vote_id);
   var obj = {is_oppose: true, is_support: false, oppose_count: item.oppose_count + 1};
   if (item.is_support === true){
     obj.support_count = item.support_count - 1;
   }
   return obj;
 }

  /**
  * toggle the oppose state of a ballot item to Off by its we_vote_id
  */
 setLocalOpposeOffState (we_vote_id) {
   var item = this.get(we_vote_id);
   var obj = {is_oppose: false};
   if (item.is_oppose === true) {
     obj.oppose_count = item.oppose_count - 1;
   }
   return obj;
 }

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    var we_vote_id = action.res.ballot_item_we_vote_id;
    var oldState = state.get(we_vote_id) || {};
    var newProps;

    switch (action.type) {

      case "voterPositionRetrieve":
        we_vote_id = action.res.candidate_we_vote_id || action.res.measure_we_vote_id; // TODO when API standardizes to ballot_item_we_vote_id
        return state.set(we_vote_id, assign({}, oldState,
          { is_support: action.res.is_support, is_oppose: action.res.is_oppose} ));

      case "positionSupportCountForBallotItem":
        return state.set(we_vote_id, assign({}, oldState, {support_count: action.res.count } ));

      case "positionOpposeCountForBallotItem":
        return state.set(we_vote_id, assign({}, oldState, {oppose_count: action.res.count }));

      case "voterOpposingSave":
        newProps = this.setLocalOpposeOnState(we_vote_id);
        return state.set(we_vote_id, assign({}, oldState, newProps ));

      case "voterStopOpposingSave":
        newProps = this.setLocalOpposeOffState(we_vote_id);
        return state.set(we_vote_id, assign({}, oldState, newProps ));

      case "voterSupportingSave":
        newProps = this.setLocalSupportOnState(we_vote_id);
        return state.set(we_vote_id, assign({}, oldState, newProps ));

      case "voterStopSupportingSave":
        newProps = this.setLocalSupportOffState(we_vote_id);
        return state.set(we_vote_id, assign({}, oldState, newProps ));

      default:
        return state;
    }

  }

}

module.exports = new SupportStore(Dispatcher);
