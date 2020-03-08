import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';

// https://localhost:3000/candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=777&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_home_page=https%3A%2F%2Fwww.philting.com%2F
// TODO: This would be better as https://localhost:3000/candidate-for-extension&candidate_name... if you can figure out the chages in Root.jsx, I Will change the extension.
export default class CandidateForExtension extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    console.log('CandidateForExtension componentDidMount');
  }

  componentWillUnmount () {
    console.log('CandidateForExtension componentWillUnmount');
    this.appStoreListener.remove();
  }

  render () {
    renderLog('CandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders
    const { candidate_name: candidateName, candidate_we_vote_id: candidateWeVoteId,
      endorsement_page_url: endorsementPageUrl, candidate_home_page: candidateHomePage } = this.props.location.query;

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <span>
        <div><b>This is a stub page, that is loaded by the We Vote Endorsement Extension for Chrome</b></div>
        <br />
        <div>
          <b>candidateName:</b> {candidateName}
        </div>
        <div>
          <b>candidateWeVoteId:</b> {candidateWeVoteId}
        </div>
        <div>
          <b>endorsementPageUrl:</b> {endorsementPageUrl}
        </div>
        <div>
          <b>candidateHomePage:</b> {candidateHomePage}
        </div>
      </span>
    );
  }
}
