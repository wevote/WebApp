import styled from '@mui/material/styles/styled';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';
import FacebookSignIn from './FacebookSignIn';

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
            <InfoText>
              <InfoCircleIcon />
              By adding Facebook to your We Vote profile, it is easier to invite friends.
            </InfoText>
          </div>
        </div>
      </div>
    );
  }
}

const InfoText = styled('div')`
  margin-top: 10px;
  word-wrap: break-word;
  float: left;
  text-align: left;
`;

export default FacebookSignInCard;
