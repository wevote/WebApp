import webAppConfig from '../../config';

// If history retention is not working, see TabWithPushHistory.jsx for an example of how to do it.
// See v5: https://reactrouter.com/native/api/Hooks/usehistory
// IMPORTANT:  The HTML5 window.history, is very different from the react-router V5 history, don't use window.history!
// removePriorPathname determines whether the route  should be pushed or replace the previous entry in the history stack.
// doNotPushHistory tells whether the history needs to be updated or not.
export default function historyPush (route, removePriorPathname = false, doNotPushToHistory = false) {
  if (route !== global.weVoteGlobalHistory.location.pathname && !doNotPushToHistory) {
    if (removePriorPathname) {
      global.weVoteGlobalHistory.replace(route);
    } else {
      global.weVoteGlobalHistory.push(route);
    }
  }
  if (webAppConfig.LOG_ROUTING) {
    console.log(`historyPush ******** ${route} *******`);
  }
}
