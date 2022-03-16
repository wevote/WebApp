import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@mui/material/styles/styled';
import { historyPush } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';

function pushURL (event, props) {
  const { closeFunction } = props;
  if (closeFunction) closeFunction();
  const relativeURL = typeof event === 'string' ? event : event.target.value;
  console.log('Cordova device pushULR() was called with destination: ', relativeURL);
  historyPush(relativeURL);
}

function textFieldKeyStroke (event, props) {
  const enterKeyCodes = [13, 9];
  const { nativeEvent: { data: code } } = event;   // This native envent is CORDOVA specific, might need modification to work in "mobile webapp"
  // console.log('Cordova device textFieldKeyStroke() was called with keycode: ', code);
  if (enterKeyCodes.includes(code)) {
    pushURL(event, props);
  }
}

function keyPress (e, props) {
  const enterKeyCodes = [13, 9];
  if (enterKeyCodes.includes(e.keyCode)) {
    // console.log('keyPress keyPress keyPress value', e.target.value);
    pushURL(e.target.value, props);
  }
}


// React functional component example
export default function DeviceURLField (props) {
  renderLog('DeviceURLField functional component');
  return (
    <URLField>
      <TextField
        id="outlined-basic"
        label="URL to push"
        variant="outlined"
        onChange={(event) => textFieldKeyStroke(event, props)}
        onKeyDown={(event) => keyPress(event, props)}
        onBlur={pushURL}
      />
    </URLField>
  );
}
/* eslint-disable react/no-unused-prop-types */
DeviceURLField.propTypes = {
  closeFunction: PropTypes.func.isRequired,
};

const URLField = styled('div')`
  padding-top: 25px;
  padding-left: 25%
`;
