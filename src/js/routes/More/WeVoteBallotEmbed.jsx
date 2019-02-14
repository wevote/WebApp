import React from 'react';
import ReactIframeResizer from 'react-iframe-resizer-super';

export default function WeVoteBalotEmbed () {
  return <ReactIframeResizer iframeResizerOptions={{ checkOrigin: false, heightCalculationMethod: 'max' }} id="myballot-embed-iframe" src="https://wevote.us/ballot?we_vote_branding_off=1&hide_intro_modal=1" />;
}
