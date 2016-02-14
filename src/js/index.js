import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import Root from './Root';

import { voterBallotItemsRetrieveFromGoogleCivic } from './utils/service';
import VoterStore from './stores/VoterStore';

console.log('Entering WebApp/src/js/index.js');

// polyfill
if (!Object.assign) Object.assign = React.__spread;

VoterStore.getDeviceId( (firstVisit, id) =>
  ReactDOM.render(
      <Root history={createHistory()} firstVisit={firstVisit} />,
      document.getElementById('app')
  )
);

//console.log("index.js: About to initialize VoterStore");
//VoterStore.initialize((voter_object) => {
//    ReactDOM.render(
//        <Root history={createHistory()} firstVisit={firstVisit} voter_object={voter_object} />,
//        document.getElementById('app')
//    );
//});


