import { Grid } from '@mui/material';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';


// React functional component example
export default function DebugSignedInIndicator () {
  renderLog('DebugSignedInIndicator functional component');
  const signedInStatusText = VoterStore.getVoterIsSignedIn() ? 'signed in' : 'signed out';
  if (webAppConfig.SHOW_CORDOVA_DEBUG_HELPERS) {
    return (
      <Grid container justifyContent="flex-end" style={{ padding: '30px 10px 0px 0px' }}>
        {signedInStatusText}
      </Grid>
    );
  } else {
    return '';
  }
}
