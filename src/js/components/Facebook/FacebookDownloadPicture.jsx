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
