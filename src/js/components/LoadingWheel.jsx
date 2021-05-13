import React from 'react';
import { CircularProgress, Box } from '@material-ui/core';

const LoadingWheel = (
  <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ padding: '30px' }}>
      <CircularProgress />
    </div>
    <div>Loading...</div>
  </Box>
);

export default LoadingWheel;
