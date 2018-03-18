import React from "react";
import PropTypes from "prop-types";

import FacebookActions from "../../actions/FacebookActions";

class FacebookDownloadPicture extends React.Component {
  static propTypes = {
    userId: PropTypes.string
  };

    constructor (props) {
        super(props);
    }

    render () {
        return <div>
                <h5 className="h5">Download Picture:</h5>
                <button ref="downloadPictureButton" onClick={() => this.didClickDownloadPicture()}>Download FB Picture</button>
            </div>;
    }

    didClickDownloadPicture () {
        FacebookActions.getFacebookProfilePicture(this.props.userId);
    }
}

export default FacebookDownloadPicture;
