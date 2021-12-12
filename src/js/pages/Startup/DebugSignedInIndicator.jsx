import { Grid } from '@material-ui/core';
import React from 'react';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';


// React functional component example
export default function DebugSignedInIndicator () {
  renderLog('DebugSignedInIndicator functional component');
  const signedInStatusText = VoterStore.getVoterIsSignedIn() ? 'signed in' : 'signed out';
  if (webAppConfig.SHOW_CORDOVA_DEBUG_HELPERS) {
    return (
      <Grid container justify="flex-end" style={{ padding: '30px 10px 0px 0px' }}>
        {signedInStatusText}
      </Grid>
    );
  } else {
    return '';
  }
}
