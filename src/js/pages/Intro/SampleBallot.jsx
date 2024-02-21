import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Cookies from '../../common/utils/js-cookie/Cookies';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';

export default class SampleBallot extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
    Cookies.set('show_full_navigation', '1', { expires: 10000, path: '/' });
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
  }

  goToBallotLink () {
    const goToBallot = '/ballot';
    historyPush(goToBallot);
  }

  render () {
    renderLog('SampleBallot');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <div className="intro-story intro-story__background background--image3">
        <Helmet title="See Your Ballot - WeVote" />
        <div className="intro-story__h1--alt">See Your Ballot</div>
        <div id="header2" className="intro-story__h2">
          On the next screen, you&apos;ll see
          <br />
          your ballot from the 2016
          {' '}
          <br />
          General Election.
        </div>
        <div id="header2" className="intro-story__h2 intro-story__padding-top">
          Get ready for the next election
          <br />
          now by following voter guides
          <br />
          and inviting your friends.
        </div>
        <div className="intro-story__padding">
          <button
            type="button"
            className="btn btn-lg btn-success"
            onClick={this.goToBallotLink}
          >
            Go to Your Ballot&nbsp;&nbsp;&gt;
          </button>
        </div>
        <div className="intro-story__padding-top">Stay tuned for 2017-2018 election data!</div>
      </div>
    );
  }
}
