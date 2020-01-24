import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

/*
The problem with urls in css for Apache Cordova
https://github.com/webpack-contrib/file-loader/issues/46
... cordova ...
"The core of the problem is that CSS loads assets relative to itself, and js loads
assets relative to the HTML. So if the CSS isn't in the same place as the HTML
then you can't use relative paths."
*/

class FriendInvitationOnboardingIntro extends Component {
  static propTypes = {
    next: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('IntroNetworkSafety');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="intro-story__padding intro-story__margin--auto">
        <div className="intro-story__h1">
          Plan your entire ballot
          <br />
          <span className="intro-story__h1--highlight">
          in 6 minutes
          </span>
        </div>
        <div className="intro-story__seperator" />
        <div>
          <img
            className="center-block intro-story__img-height intro-story__placeholder"
            src={cordovaDot('/img/how-it-works/HowItWorksForVoters-Choose-20190507.gif')}
            alt="Create your ballot with ease with We Vote"
          />
          {/* <div className="center-block intro-story__img-height intro-story__placeholder">Fle Nme: FollowValues.GIF</div> */}
        </div>
        <div className="intro-story__h2 intro-story__h2--highlight">
          Choose your interests
        </div>
        <p className="intro-story__info">Follow topics that interest you.  We will suggest endorsements based on your interests.</p>
      </div>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const OrganizationInformationOnlySquare = styled.div`
  color: ${({ theme }) => theme.colors.grayMid};
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 3px solid ${({ theme }) => theme.colors.grayMid};
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationInfoOnlyIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '4px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-5px' : '0')};
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingIntro));
