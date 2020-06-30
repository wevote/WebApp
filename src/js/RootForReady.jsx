import React, { Suspense, lazy } from 'react';
// import Loadable from 'react-loadable';
// import { IndexRedirect, Route } from 'react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ApplicationForReady from './ApplicationForReady';
// import PageNotFound from './routes/PageNotFound';
import GetReady from './routes/ReadyNoApi';
// import Ballot from './routes/Ballot/Ballot';
// const Ballot = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Ballot" */ './routes/Ballot/Ballot'));
const Ballot = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Ballot" */ './routes/Ballot/Ballot'));
// const AsyncBallotComponent = loadable( {
//     loader: () => import( './home.component' ),
//     loading: LoadingComponent
// } );
// const Ballot = Loadable({
//   loader: () => import(/* webpackPrefetch: true, webpackChunkName: "Ballot" */'./routes/Ballot/Ballot'),
//   loading: () => <div>Loading...</div>,
// });

const routes = () => {  // eslint-disable-line arrow-body-style
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/ballot" component={Ballot} />
        </Suspense>
        <Route path="/getready" component={GetReady} />
      </Switch>
      {/* <Route path="*" component={PageNotFound} /> */}
    </Router>
  );
};

export default routes;
