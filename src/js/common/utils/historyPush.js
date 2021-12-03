import webAppConfig from '../../config';

// If history retention is not working, see TabWithPushHistory.jsx for an example of how to do it.
// See v5: https://reactrouter.com/native/api/Hooks/usehistory
// IMPORTANT:  The HTML5 window.history, is very different from the react-router V5 history, don't use window.history!
export default function historyPush (route) {
  if (webAppConfig.LOG_ROUTING) {
    console.log(`historyPush ******** ${route} *******`);
  }
  global.weVoteGlobalHistory.push(route);
}
