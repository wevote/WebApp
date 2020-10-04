import React from 'react';

import FacebookActions from '../../actions/FacebookActions';
import { renderLog } from '../../utils/logging';

class FacebookDownloadPicture extends React.Component {
  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('FacebookDownloadPicture caught error: ', `${error} with info: `, info);
  }

  didClickDownloadPicture () {
    FacebookActions.getFacebookProfilePicture();
  }

  render () {
    renderLog('FacebookDownloadPicture');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <h5 className="h5">Download Picture:</h5>
        <button id="downloadPictureButton" onClick={() => this.didClickDownloadPicture()} type="button">Download FB Picture</button>
      </div>
    );
  }
}

export default FacebookDownloadPicture;
