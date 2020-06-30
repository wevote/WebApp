import React from 'react';
import { render } from 'react-dom';
import {
  browserHistory, Router, applyRouterMiddleware,
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import routes from './RootForReady';
import muiTheme from './mui-theme';
import styledTheme from './styled-theme';
import { renderLog } from './utils/logging';
import { numberOfNeedlesFoundInString } from './utils/search-functions';


// Adding functions to the String prototype will make stuff like `for (char in str)` break, because it will loop over the substringOccurrences property.
// As long as we use `forEach()` or `for (char of str)` then that side effect will be mitigated.
String.prototype.numberOfNeedlesFoundInString = numberOfNeedlesFoundInString; // eslint-disable-line

function startReactReadyApp () {
  renderLog('startReactReadyApp');  // Set LOG_RENDER_EVENTS to log all renders
  console.log('startReactReadyApp first line in startReactReadyApp');

  const element = (
    // eslint-disable-next-line react/jsx-filename-extension
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={styledTheme}>
        <Router
          history={browserHistory}
          render={applyRouterMiddleware(useScroll(() => true))}
        >
          {routes()}
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );

  // console.log('startReactReadyApp before render');
  render(element, document.getElementById('app'));
}

// Browser only -- this file not used for Cordova
console.log('startReactReadyApp for the WebApp (not for Cordova)');
startReactReadyApp();
