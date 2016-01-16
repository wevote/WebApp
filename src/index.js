import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import Root from 'Root';

import VoterStore from 'stores/VoterStore';

/****************************** Stylesheets ***********************************/
import './stylesheets/main.scss'
/******************************************************************************/

// polyfill
if (!Object.assign) Object.assign = React.__spread;

const firstVisit = VoterStore.voter_device_id ? false : true;

VoterStore
  .initialize()
  .then(() => ReactDOM.render(
        <Root
          history={createHistory()}
          firstVisit={firstVisit}/>,

        document.getElementById('app')
    )
  )
  .catch(err => console.error('unable to initialize voter'))
