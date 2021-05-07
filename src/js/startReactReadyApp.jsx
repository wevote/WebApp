// import { MuiThemeProvider } from '@material-ui/core/styles';
// import React from 'react';
// import { Router } from 'react-router-dom';
// import { ThemeProvider } from 'styled-components';
// import { polyfillFixes } from './utils/cordovaUtils';
// import { renderLog } from './utils/logging';
// import { numberOfNeedlesFoundInString } from './utils/searchFunctions';
// // const { useScroll } = React.lazy(() => import('react-router-scroll'));
//
// const { render } = React.lazy(() => import('react-dom'));
// const muiTheme = React.lazy(() => import('./mui-theme'));
// const routes = React.lazy(() => import('./RootForReady'));
// const styledTheme = React.lazy(() => import('./styled-theme'));
//
// polyfillFixes('startReactReadyApp');
//
// // Adding functions to the String prototype will make stuff like `for (char in str)` break, because it will loop over the substringOccurrences property.
// // As long as we use `forEach()` or `for (char of str)` then that side effect will be mitigated.
// String.prototype.numberOfNeedlesFoundInString = numberOfNeedlesFoundInString; // eslint-disable-line
//
// function startReactReadyApp () {
//   renderLog('startReactReadyApp');  // Set LOG_RENDER_EVENTS to log all renders
//   console.log('startReactReadyApp first line in startReactReadyApp');
//   // TODO: This should not be necessary with V5 react-router <Router history={history} >
//   const element = (
//     // eslint-disable-next-line react/jsx-filename-extension
//     <MuiThemeProvider theme={muiTheme}>
//       <ThemeProvider theme={styledTheme}>
//         <Router>
//           {routes()}
//         </Router>
//       </ThemeProvider>
//     </MuiThemeProvider>
//   );
//
//   // console.log('startReactReadyApp before render');
//   render(element, document.getElementById('app'));
// }
//
// // Browser only -- this file not used for Cordova
// console.log('startReactReadyApp for the WebApp (not for Cordova)');
// startReactReadyApp();
