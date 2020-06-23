import React, { Suspense, lazy } from 'react';
// import { IndexRedirect, Route } from 'react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ApplicationForReady from './ApplicationForReady';
// import PageNotFound from './routes/PageNotFound';
import GetReady from './routes/GetReady';

const Ballot = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Ballot" */ './routes/Ballot/Ballot'));
// import Ballot from './routes/Ballot/Ballot';
// const Ballot = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Ballot" */ './routes/Ballot/Ballot').then(
//   module => ({
//     default: module.Ballot
//   }),
// ));
// const Ballot = lazy(() => import('./routes/Ballot/Ballot'));
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
        {/* <Route exact path="/ballot" component={Ballot} /> */}
        <Route path="/getready" component={GetReady} />
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/ballot" component={Ballot} />
        </Suspense>
      </Switch>
      {/* <Route path="*" component={PageNotFound} /> */}
    </Router>
  );
  // return (
  //   <Route path="/getready" component={GetReady} />
  // );
};

export default routes;
