import { Box, CircularProgress } from '@mui/material';
import React from 'react';

// React functional component example
export default function LoadingWheelComp (message = null, padBottom = false) {
  const msg = message && message.message ? message.message : 'Loading...';

  return (
    <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: '30px', paddingBottom: `${padBottom ? '0px' : null}` }}>
        <CircularProgress />
      </div>
      <div>{msg}</div>
    </Box>
  );
}
