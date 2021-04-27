import React from 'react';

// const ReactIframeResizer = React.lazy(() => import('react-iframe-resizer-super'));  // Not react 17 compatible, last updated in 2018
const ReactIframeResizer = React.lazy(() => import('iframe-resizer-react'));

export default function VerifyRegistration () {
  return <ReactIframeResizer style={{ width: '1px', minWidth: '100%' }} id="verify-registration-iframe" src="https://verify.vote.org/?partner=111111&campaign=free-tools" />;
}
