import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';


// A function component
export default function SignInButton (props) {
  renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <Button
      className="header-sign-in"
      color="primary"
      id="signInHeaderBar"
      onClick={props.toggleSignInModal}
      variant="text"
    >
      <span className="u-no-break">
        <span
          style={{
            color: 'rgb(6, 95, 212)',
            cursor: 'pointer',
            fontWeight: 500,
            letterSpacing: '0.4px',
          }}
        >
          Sign In
        </span>
        {' '}
        <span
          style={{
            color: '#ccc',
          }}
        >
          or
        </span>
        {' '}
        <span
          style={{
            color: 'rgb(6, 95, 212)',
            cursor: 'pointer',
            fontWeight: 500,
            letterSpacing: '0.4px',
          }}
        >
          Sign Up
        </span>
      </span>
    </Button>
  );
}
SignInButton.propTypes = {
  toggleSignInModal: PropTypes.func,
};
