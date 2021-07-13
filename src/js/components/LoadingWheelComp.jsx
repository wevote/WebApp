import React from 'react';
import { CircularProgress, Box } from '@material-ui/core';

// React functional component example
export default function LoadingWheelComp (message = null) {
  const msg = message && message.message ? message.message : 'Loading...';

  return (
    <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: '30px' }}>
        <CircularProgress />
      </div>
      <div>{msg}</div>
    </Box>
  );
}
