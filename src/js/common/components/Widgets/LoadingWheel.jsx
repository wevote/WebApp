import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingWheel = (
  <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ padding: '30px' }}>
      <CircularProgress />
    </div>
    <div>Loading...</div>
  </Box>
);

export default LoadingWheel;
