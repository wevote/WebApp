import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import Root from './Root';
import VoterStore from './stores/VoterStore';

// polyfill
if (!Object.assign) Object.assign = React.__spread;

VoterStore.getDeviceId( (err, firstVisit, id) => {
  if (err) console.error(err);

  VoterStore.getLocation( (err, location) => {
    if (err) console.error(err);

    console.log(location);
    render(firstVisit);

  });

});

function render(firstVisit) {
  ReactDOM.render(
      <Root history={createHistory()} firstVisit={firstVisit} />,
      document.getElementById('app')
  )
}

//console.log("index.js: About to initialize VoterStore");
//VoterStore.initialize((voter_object) => {
//    ReactDOM.render(
//        <Root history={createHistory()} firstVisit={firstVisit} voter_object={voter_object} />,
//        document.getElementById('app')
//    );
//});


