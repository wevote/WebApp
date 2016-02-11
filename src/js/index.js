import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import Root from './Root';

import VoterStore from './stores/VoterStore';

console.log('Entering WebApp/src/js/index.js');

// polyfill
if (!Object.assign) Object.assign = React.__spread;

const firstVisit = VoterStore.voter_device_id ? false : true;

//console.log("index.js: About to initialize VoterStore");
//VoterStore.initialize((voter_object) => {
//    ReactDOM.render(
//        <Root history={createHistory()} firstVisit={firstVisit} voter_object={voter_object} />,
//        document.getElementById('app')
//    );
//});

ReactDOM.render(
    <Root history={createHistory()} firstVisit={firstVisit} />,
    document.getElementById('app')
);
