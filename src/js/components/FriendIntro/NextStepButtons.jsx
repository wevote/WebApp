import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';

// React functional component example
export default function NextStepButtons (props) {
  renderLog('NextStepButtons functional component');
  return (
    <>
      <Button
        color="primary"
        onClick={props.onClickNextButton}
        style={props.desktopMode ? {
          boxShadow: 'none !important',
          textTransform: 'none',
          width: 250,
        } : {
          boxShadow: 'none !important',
          textTransform: 'none',
          width: '100%',
        }}
        variant="contained"
      >
        {props.nextStepButtonText}
      </Button>
      {!props.skipForNowOff && (
        <Button
          classes={props.desktopMode ? { root: props.classes.desktopSimpleLink } : { root: props.classes.mobileSimpleLink }}
          color="primary"
          onClick={props.goToSkipForNow}
        >
          Skip for now
        </Button>
      )}
    </>
  );
}
NextStepButtons.propTypes = {
  classes: PropTypes.object,
  desktopMode: PropTypes.bool,
  goToSkipForNow: PropTypes.func,
  nextStepButtonText: PropTypes.string,
  onClickNextButton: PropTypes.func,
  skipForNowOff: PropTypes.bool,
};
