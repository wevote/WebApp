import React from 'react';
import ReactIframeResizer from 'react-iframe-resizer-super';

export default function RegisterToVote () {
  return <ReactIframeResizer iframeResizerOptions={{ checkOrigin: false }} id="register-to-vote-iframe" src="https://register.vote.org/?partner=111111&campaign=free-tools" />;
}
