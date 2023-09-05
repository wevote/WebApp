import React from 'react';
import ReactIframeResizer from 'iframe-resizer-react';

export default function WeVoteBallotEmbed () {
  // return <ReactIframeResizer iframeResizerOptions={{ checkOrigin: false, heightCalculationMethod: 'max' }} id="myballot-embed-iframe" src="https://wevote.us/ballot?we_vote_branding_off=1&hide_intro_modal=1" />;
  return <ReactIframeResizer style={{ width: '1px', minWidth: '100%' }} id="myballot-embed-iframe" src="https://wevote.us/ballot?we_vote_branding_off=1&hide_intro_modal=1" />;
}
