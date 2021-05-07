import React from 'react';
import ReactIframeResizer from 'iframe-resizer-react';

export default function VerifyRegistration () {
  return <ReactIframeResizer style={{ width: '1px', minWidth: '100%' }} id="verify-registration-iframe" src="https://verify.vote.org/?partner=111111&campaign=free-tools" />;
}
