import React from "react";
import ReactIframeResizer from "react-iframe-resizer-super";

export default function VerifyRegistration () {
  return <ReactIframeResizer iframeResizerOptions={{ checkOrigin: false }} id="verify-registration-iframe" src="https://verify.vote.org/?partner=111111&campaign=free-tools" />;
}
