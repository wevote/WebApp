import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import { isCordova } from './utils/cordovaUtils';
import { renderLog } from './utils/logging';
// const { useScroll } = React.lazy(() => import('react-router-scroll'));

const WeVoteRouter = React.lazy(() => import('./js/components/Widgets/WeVoteRouter'));
const muiTheme = React.lazy(() => import('./mui-theme'));
const routes = React.lazy(() => import('./Root'));
const styledTheme = React.lazy(() => import('./styled-theme'));
const { render } = React.lazy(() => import('react-dom'));

// May 2020, this was moved into a separate file, so that the imports can be delayed
// until after the cordova 'deviceready' event (if we are in Cordova).
// eslint-disable-next-line no-unused-vars,import/prefer-default-export
export default function startReactApp () {
  renderLog('startReactApp');  // Set LOG_RENDER_EVENTS to log all renders
  console.log('startReactApp first line in startReactApp');
  console.log('startReactApp isCordova(): ', isCordova());

  // const { history } = window;  // BrowserRouter knows about ReactTraining/history, So this should not be necessary, Dec 2020

  const element = (
    // eslint-disable-next-line react/jsx-filename-extension
    <Suspense fallback={<div>&nbsp;</div>}>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={styledTheme}>
          <WeVoteRouter>
            {routes()}
          </WeVoteRouter>
        </ThemeProvider>
      </MuiThemeProvider>
    </Suspense>
  );

  // console.log('startReactApp before render');
  render(element, document.getElementById('app'));
}

