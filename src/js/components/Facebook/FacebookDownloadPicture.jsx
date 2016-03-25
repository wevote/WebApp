import React, { PropTypes } from "react";

import FacebookActionCreators from "../../actions/FacebookActionCreators";

class FacebookDownloadPicture extends React.Component {
  static propTypes = {
    userId: PropTypes.string
  };

    constructor (props) {
        super(props);
    }

    render () {
        return <div>
                <h5>Download Picture:</h5>
                <button ref="downloadPictureButton" onClick={() => this.didClickDownloadPicture()}>Download FB Picture</button>
            </div>;
    }

    didClickDownloadPicture () {
        FacebookActionCreators.getFacebookProfilePicture(this.props.userId);
    }
}

export default FacebookDownloadPicture;
