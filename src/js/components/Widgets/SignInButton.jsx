import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';


// A function component
export default function SignInButton (props) {
  renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <Button
      className="header-sign-in"
      // classes={{ root: classes.headerButtonRoot }}
      color="primary"
      id="signInHeaderBar"
      onClick={props.toggleSignInModal}
      variant="text"
    >
      <span
        className="u-no-break"
        style={{
          color: 'rgb(6, 95, 212)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.4px',
        }}
      >
        Sign In
      </span>
    </Button>
  );
}
SignInButton.propTypes = {
  toggleSignInModal: PropTypes.func,
};
