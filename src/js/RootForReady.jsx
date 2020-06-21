import React from 'react';
import { IndexRedirect, Route } from 'react-router';
// import ApplicationForReady from './ApplicationForReady';
// import PageNotFound from './routes/PageNotFound';
import GetReady from './routes/GetReady';

const routes = () => {  // eslint-disable-line arrow-body-style
  return (
    <Route path="/" component={GetReady}>
      {                       // 12/4/18: Not sure why we need the following disabled
        (function redir () {  // eslint-disable-line wrap-iife
          return <IndexRedirect to="/getready" />;
        }
        )()
      }
      <Route path="/getready" component={GetReady} />
      {/* <Route path="*" component={PageNotFound} /> */}
    </Route>
  );
  // return (
  //   <Route path="/getready" component={GetReady} />
  // );
};

export default routes;
