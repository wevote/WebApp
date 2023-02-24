import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom';
import webAppConfig from '../../../config';
import AppObservableStore from '../../stores/AppObservableStore';
import { normalizedHrefPage } from '../../utils/hrefUtils';

// https://stackoverflow.com/questions/34093913/how-to-debug-react-router
// When a history.push is called correctly for the v5 react-router, the incoming
// component receives a props.location like ...
// location:
//   hash: ""
//   key: "qcccs4"
//   pathname: "/ballot"
//   search: ""
//   state: undefined
// And a props.history like...
// history:
//   action: "PUSH"
//   block: ƒ block(prompt)
//   createHref: ƒ createHref(location)
//   go: ƒ go(n)
//   goBack: ƒ goBack()
//   goForward: ƒ goForward()
//     length: 39
//   listen: ƒ listen(listener)
//   location: {pathname: "/ballot", search: "", hash: "", state: undefined, key: "qcccs4"}
//   push: ƒ push(path, state)
//   replace: ƒ replace(path, state)

// Possible: https://stackoverflow.com/questions/59402649/how-can-i-use-history-pushpath-in-react-router-5-1-2-in-stateful-component
// Possible: https://stackoverflow.com/questions/63400050/refactoring-react-class-to-hooks-entity-update-component
export default class WeVoteRouter extends BrowserRouter {
  constructor (props) {
    super(props);
    global.weVoteGlobalHistory = this.history;
    if (webAppConfig.LOG_ROUTING) {
      console.log('Router:  initial history is: ', JSON.stringify(this.history, null, 2));
    }
    this.history.listen((location, action) => {
      // TODO: Why is this passed twice?
      if (AppObservableStore.getGoogleAnalyticsEnabled()) {
        ReactGA.send({ hitType: 'pageview', page: normalizedHrefPage() ? `/${normalizedHrefPage()}` : '/readyLight' });
      }
      AppObservableStore.incrementObservableUpdateCounter();   // Encourage an update of Header.jsx on each push
      const currentPathname = location.pathname || '';
      AppObservableStore.setCurrentPathname(currentPathname);
      if (AppObservableStore.getGoogleAnalyticsEnabled()) {
        ReactGA.send({ hitType: 'pageview', page: normalizedHrefPage() ? `/${normalizedHrefPage()}` : '/readyLight' });
      }
      if (webAppConfig.LOG_ROUTING) {
        console.log(` Router: The current URL is ${location.pathname}${location.search}${location.hash}`);
        console.log(` Router: The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
      }
      // This message has to be handled in the componentDidMount of the class that will receive it
      if (location && location.state && location.state.message) {
        AppObservableStore.setPendingSnackMessage(location.state.message, location.state.severity);
      }
    });
  }
}
