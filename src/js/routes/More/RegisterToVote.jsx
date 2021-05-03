import React from 'react';
import ReactIframeResizer from 'iframe-resizer-react';

export default function RegisterToVote () {
  return <ReactIframeResizer style={{ width: '1px', minWidth: '100%' }} id="register-to-vote-iframe" src="https://register.vote.org/?partner=111111&campaign=free-tools" />;
}
