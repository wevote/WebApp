import React, { Suspense } from 'react';
import { render } from 'react-dom';
import {
  browserHistory, hashHistory, Router, applyRouterMiddleware,
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import { isCordova } from './utils/cordovaUtils';
import routes from './Root';
import muiTheme from './mui-theme';
import styledTheme from './styled-theme';
import { renderLog } from './utils/logging';
import Application from './Application';


// May 2020, this was moved into a separate file, so that the imports can be delayed
// until after the cordova 'deviceready' event (if we are in Cordova).
// eslint-disable-next-line no-unused-vars,import/prefer-default-export
export default function startReactApp () {
  renderLog('startReactApp');  // Set LOG_RENDER_EVENTS to log all renders
  console.log('startReactApp first line in startReactApp');
  console.log('startReactApp isCordova(): ', isCordova());

  const element = (
    // eslint-disable-next-line react/jsx-filename-extension
    // <Suspense fallback={<div>&nbsp;</div>}>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={styledTheme}>

          <Router
            history={isCordova() ? hashHistory : browserHistory}
            render={applyRouterMiddleware(useScroll(() => true))}
          >
                      <Application>
            {routes()}          </Application>
          </Router>

        </ThemeProvider>
      </MuiThemeProvider>
    // </Suspense>
  );

  // console.log('startReactApp before render');
  render(element, document.getElementById('app'));
}

