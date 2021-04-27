import React from 'react';

// const ReactIframeResizer = React.lazy(() => import('react-iframe-resizer-super'));  // Not react 17 compatible, last updated in 2018
const ReactIframeResizer = React.lazy(() => import('iframe-resizer-react'));


export default function WeVoteBalotEmbed () {
  // return <ReactIframeResizer iframeResizerOptions={{ checkOrigin: false, heightCalculationMethod: 'max' }} id="myballot-embed-iframe" src="https://wevote.us/ballot?we_vote_branding_off=1&hide_intro_modal=1" />;
  return <ReactIframeResizer style={{ width: '1px', minWidth: '100%' }} id="myballot-embed-iframe" src="https://wevote.us/ballot?we_vote_branding_off=1&hide_intro_modal=1" />;
}
