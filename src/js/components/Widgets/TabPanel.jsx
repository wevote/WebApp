import { Box } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React from 'react';

export default function TabPanel (props) {
  const { children, value, index, ...other } = props;

  // This function really does need prop-spreading.
  /* eslint-disable react/jsx-props-no-spreading */
  // The bad prop spreading case is where it is used to avoid having to list the props you want, leaving the code
  // very difficult to maintain.  In this situation, we are naming all the props we know about, and using
  // spreading only for those we don't yet use or know about.

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      style={{ borderTop: '1px solid rgb(128,128,128)' }}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ padding: 'unset' }}>
          {children}
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
