import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LoadingWheel = (
  <div style={{ margin: '10% 0 0 45%' }}>
    <CircularProgress />
    <div style={{ margin: '16px 0 0 -10px' }}>Loading...</div>
  </div>
);

export default LoadingWheel;
