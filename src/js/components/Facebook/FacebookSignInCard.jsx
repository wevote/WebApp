import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';
import FacebookSignIn from './FacebookSignIn';

const facebookText = 'By adding Facebook to your We Vote profile, it is easier to invite friends.';

const facebookInfoText = (
  <span className="social-btn-description">
    <InfoCircleIcon />
    {facebookText}
  </span>
);

class FacebookSignInCard extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('FacebookSignInCard');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="card">
        <div className="card-main">
          <div className="network-btn">
            <FacebookSignIn
              buttonText="Sign In to Find Friends"
              id="signInToFacebook"
            />
            {facebookInfoText}
          </div>
        </div>
      </div>
    );
  }
}

export default FacebookSignInCard;
