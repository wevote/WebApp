import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';

/*
The problem with urls in css for Apache Cordova
https://github.com/webpack-contrib/file-loader/issues/46
... cordova ...
"The core of the problem is that CSS loads assets relative to itself, and js loads
assets relative to the HTML. So if the CSS isn't in the same place as the HTML
then you can't use relative paths."
*/

export default class IntroNetworkSafety extends Component {
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
        <div className="intro-story__separator" />
        <div>
          <img
            className="center-block intro-story__img-height intro-story__placeholder"
            src={normalizedImagePath('/img/how-it-works/HowItWorksForVoters-Choose-20190507.gif')}
            alt="Create your ballot with ease with WeVote"
          />
          {/* <div className="center-block intro-story__img-height intro-story__placeholder">Fle Nme: FollowValues.GIF</div> */}
        </div>
        <div className="intro-story__h2 intro-story__h2--highlight">
          Choose your interests
        </div>
        <p className="intro-story__info">Follow topics that interest you.  We will suggest endorsements based on your interests.</p>
        <button type="button"
                className="btn intro-story__btn intro-story__btn--bottom"
                onClick={this.props.next}
                style={{ top: `${cordovaNetworkNextButtonTop()}` }}
        >
          Next&nbsp;&nbsp;&gt;
        </button>
        {/* <Button
          className="intro-story__btn--bottom"
          color="primary"
          id="voterGuideSettingsPositionsSeeFullBallot"
          onClick={this.props.next}
          style={{ top: `${cordovaNetworkNextButtonTop()}` }}
          variant="contained"
        >
          Next&nbsp;&nbsp;&gt;
        </Button> */}
      </div>
    );
  }
}
IntroNetworkSafety.propTypes = {
  next: PropTypes.func,
};
