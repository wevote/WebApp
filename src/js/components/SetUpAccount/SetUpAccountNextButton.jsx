import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export default function SetUpAccountNextButton (props) {
  return (
    <Button
      color="primary"
      disabled={props.nextButtonDisabled}
      onClick={props.onClickNextButton}
      style={props.isMobile ? {
        boxShadow: 'none !important',
        textTransform: 'none',
        width: '100%',
      } : {
        boxShadow: 'none !important',
        textTransform: 'none',
        width: 330,
      }}
      variant={props.nextButtonAsOutline ? 'outlined' : 'contained'}
    >
      {props.nextButtonText}
    </Button>
  );
}
SetUpAccountNextButton.propTypes = {
  isMobile: PropTypes.bool,
  nextButtonAsOutline: PropTypes.bool,
  nextButtonDisabled: PropTypes.bool,
  nextButtonText: PropTypes.string,
  onClickNextButton: PropTypes.func,
};
