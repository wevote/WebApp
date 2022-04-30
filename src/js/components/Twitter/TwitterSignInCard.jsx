import styled from 'styled-components';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';
import TwitterSignIn from './TwitterSignIn';

class TwitterSignInCard extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('TwitterSignInCard');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <div>
          <div className="network-btn">
            <TwitterSignIn
              buttonText="Find Public Opinions"
              id="signInToFindVoterGuides"
            />
            <InfoText>
              <InfoCircleIcon />
              Signing into Twitter is the fastest way to find voter guides related to your values. We Vote will find the voter guides of everyone you are following on Twitter.
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

export default TwitterSignInCard;
