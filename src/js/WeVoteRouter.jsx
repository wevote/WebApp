import { BrowserRouter } from 'react-router-dom';
import webAppConfig from './config';

// https://stackoverflow.com/questions/34093913/how-to-debug-react-router
export default class WeVoteRouter extends BrowserRouter {
  constructor (props) {
    super(props);
    if (webAppConfig.LOG_ROUTING) {
      console.log('Router: initial history is: ', JSON.stringify(this.history, null, 2));
      this.history.listen((location, action) => {
        console.log(`Router: The current URL is ${location.pathname}${location.search}${location.hash}`);
        console.log(`Router: The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
      });
    }
  }
}
