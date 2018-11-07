import React from "react";
import PropTypes from "prop-types";

import FacebookActions from "../../actions/FacebookActions";
import { renderLog } from "../../utils/logging";

class FacebookDownloadPicture extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
  };

  constructor (props) {
    super(props);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error("FacebookDownloadPicture caught error: ", error + " with info: ", info);
  }

  render () {
    renderLog(__filename);
    return <div>
              <h5 className="h5">Download Picture:</h5>
              <button ref="downloadPictureButton" onClick={() => this.didClickDownloadPicture()}>Download FB Picture</button>
          </div>;
  }

  didClickDownloadPicture () {
    FacebookActions.getFacebookProfilePicture();
  }
}

export default FacebookDownloadPicture;
