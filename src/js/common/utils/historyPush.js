import webAppConfig from '../../config';
import { isCordova } from './isCordovaOrWebApp';

// If history retention is not working, see TabWithPushHistory.jsx for an example of how to do it.
// See v5: https://reactrouter.com/native/api/Hooks/usehistory
// IMPORTANT:  The HTML5 window.history, is very different from the react-router V5 history, don't use window.history!
// removePriorPathname determines whether the route  should be pushed or replace the previous entry in the history stack.
// doNotPushHistory tells whether the history needs to be updated or not.
export default function historyPush (route, removePriorPathname = false, doNotPushToHistory = false) {
  if (webAppConfig.LOG_ROUTING  && isCordova()) {
    console.log(`historyPush (common before push) route: '${route}', href: '${window.location.href}', global.weVoteGlobalHistory: '${JSON.stringify(global?.weVoteGlobalHistory)}'`);
  }

  if (route !== global.weVoteGlobalHistory.location.pathname && !doNotPushToHistory) {
    if (removePriorPathname) {
      global.weVoteGlobalHistory.replace(route);
    } else {
      global.weVoteGlobalHistory.push(route);
    }
  }
  if (webAppConfig.LOG_ROUTING) {
    console.log(`historyPush (common after push) route: '${route}', href: '${window.location.href}'`);
  }
}
