import React from 'react';
import ReactIframeResizer from 'react-iframe-resizer-super';

export default function ElectionReminder () {
  return <ReactIframeResizer iframeResizerOptions={{ checkOrigin: false }} id="election-reminder-iframe" src="https://reminders.vote.org/?partner=111111&campaign=free-tools" />;
}
