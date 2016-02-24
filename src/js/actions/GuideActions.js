import AppDispatcher from "../dispatcher/AppDispatcher";
import GuideConstants from "../constants/GuideConstants";

const GuideActions = {
  /**
   * @param {String} id to ignore
   */
  ignore: function (id) {
    AppDispatcher.dispatch({
      actionType: GuideConstants.ORG_IGNORE, id
    });
  },

  /**
   * @param {String} id to follow
   */
  follow: function (id) {
    AppDispatcher.dispatch({
      actionType: GuideConstants.ORG_FOLLOW, id
    });
  }
};

export default GuideActions;
