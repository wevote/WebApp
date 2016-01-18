import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import Root from 'Root';

import VoterStore from 'stores/VoterStore';
import BallotStore from 'stores/BallotStore';

/****************************** Stylesheets ***********************************/
import './stylesheets/main.scss'
/******************************************************************************/

// polyfill
if (!Object.assign) Object.assign = React.__spread;

const firstVisit = VoterStore.voter_device_id ? false : true;


BallotStore.initialize(function (resolve, reject) {
  console.log('hello world');
  console.log(this);
  resolve(this);
});
// VoterStore
//   .initialize()
//   .then(() => ReactDOM.render(
//         <Root
//           history={createHistory()}
//           firstVisit={firstVisit}/>,
//
//         document.getElementById('app')
//     )
//   )
//   .catch(err => console.error('unable to initialize voter'))
