import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';


// A function component
export default function SignInButton (props) {
  renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <StyledButton
      className="header-sign-in"
      color="primary"
      onClick={props.toggleSignInModal}
      variant="text"
    >
      <SignInButtonInnerWrapper className="u-no-break">
        <span
          id="signIn"
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
          id="signUp"
          style={{
            color: 'rgb(6, 95, 212)',
            cursor: 'pointer',
            fontWeight: 500,
            letterSpacing: '0.4px',
          }}
        >
          Join
        </span>
      </SignInButtonInnerWrapper>
    </StyledButton>
  );
}
SignInButton.propTypes = {
  toggleSignInModal: PropTypes.func,
};

const SignInButtonInnerWrapper = styled('span')`
`;

const StyledButton = styled(Button)(({ theme }) => (`
  font-size: 18px;
  padding: 8px 8px 4px 8px;
  ${theme.breakpoints.between('tabMin', 'tabMdMin') && isCordova()} { // Small Tablets
    font-size: 20px;
    padding: 4px 8px 2px 8px;
  }
  ${theme.breakpoints.between('tabMdMin', 'tabLgMin') && isCordova()} { // Medium Tablets
    font-size: 20px;
    padding: 6px 8px 2px 8px;
  }
  ${theme.breakpoints.between('tabLgMin', 'tabMax') && isCordova()} { { // Larger Tablets
    font-size: 24px;
    padding: 2px 8px 4px 8px;
  },
`));
