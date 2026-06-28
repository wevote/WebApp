import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';

// React functional component example
export default function SignInJoinText () {
  renderLog('SignInJoinText functional component');
  return (
    <SignInJoinTextWrapper>
      <span>
        Sign in
      </span>
      {' '}
      <span
        style={{
          color: '#ccc',
          fontWeight: 200,
        }}
      >
        |
      </span>
      {' '}
      <span>
        Join
      </span>
    </SignInJoinTextWrapper>
  );
}

const SignInJoinTextWrapper = styled('span')`
`;
