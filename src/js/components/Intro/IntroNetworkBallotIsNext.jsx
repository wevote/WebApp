import React, { Component } from 'react';
import Helmet from 'react-helmet';
import cookies from '../../utils/cookies';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

export default class IntroNetworkBallotIsNext extends Component {
  static goToBallotLink () {
    const goToBallot = '/ballot';
    historyPush(goToBallot);
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
    cookies.setItem('show_full_navigation', '1', Infinity, '/');
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
  }

  render () {
    renderLog(__filename);
    return (
      <div
        className="intro-story intro-story__background background--image5"
        style={isCordova() ? { backgroundImage: 'url(./img/global/intro-story/slide5-flagpole-698x600.jpg)' } : null}
      >
        <Helmet title="See Your Ballot - We Vote" />
        <div className="intro-story__h1--alt">We Vote</div>
        <div id="header2" className="intro-story__h2 intro-story__padding-top">
          Ready to
          {' '}
          <strong>vote your values</strong>
          ?
        </div>
        <div id="header2" className="intro-story__h2">
          On the next screen, you&apos;ll see
          <br />
          the next election
          <br />
          in your area.
        </div>
        <div><br /></div>
        <div className="intro-story__padding">
          <button
            type="button"
            className="btn btn-lg btn-success"
            onClick={IntroNetworkBallotIsNext.goToBallotLink}
          >
            Go to Your Ballot&nbsp;&nbsp;&gt;
          </button>
        </div>
        <div className="intro-story__padding-top">{/* Stay tuned for the latest election data! */}</div>
      </div>
    );
  }
}
