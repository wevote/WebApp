import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../common/utils/logging';
import { cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

/*
The problem with urls in css for Apache Cordova
https://github.com/webpack-contrib/file-loader/issues/46
... cordova ...
"The core of the problem is that CSS loads assets relative to itself, and js loads
assets relative to the HTML. So if the CSS isn't in the same place as the HTML
then you can't use relative paths."
*/

export default class IntroNetworkDefinition extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('IntroNetworkDefinition');  // Set LOG_RENDER_EVENTS to log all renders
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
            src={normalizedImagePath('/img/how-it-works/HowItWorksForVoters-Review-20190401.gif')}
            alt="View candidate endorsements from friends"
          />
          {/* <div className="center-block intro-story__img-height intro-story__placeholder">Fle Nme: FollowValues.GIF</div> */}
        </div>
        <div className="intro-story__h2 intro-story__h2--highlight">
          See who endorsed each choice on your ballot
        </div>
        <p className="intro-story__info">Learn from the people you trust.</p>
        <button type="button"
                className="btn intro-story__btn intro-story__btn--bottom"
                onClick={this.props.next}
                style={{ top: `${cordovaNetworkNextButtonTop()}` }}
        >
          Next&nbsp;&nbsp;&gt;
        </button>
      </div>
    );
  }
}
IntroNetworkDefinition.propTypes = {
  next: PropTypes.func,
};
