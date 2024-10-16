import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';
import apiCalming from '../../utils/apiCalming';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';

const UPDATE_NO_MORE_OFTEN_THAN = 30000;  // 30 seconds

class FirstChallengeParticipantListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstChallengeParticipantListController componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.challengeParticipantListFirstRetrieve();
  }

  componentDidUpdate (prevProps) {
    if (this.props.challengeWeVoteId !== prevProps.challengeWeVoteId) {
      this.challengeParticipantListFirstRetrieve();
    }
    if (this.props.searchText !== prevProps.searchText) {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.ChallengeParticipantSearchRetrieve();
      }, 500);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  onVoterStoreChange () {
    this.challengeParticipantListFirstRetrieve();
  }

  challengeParticipantListFirstRetrieve = () => {
    const { challengeWeVoteId } = this.props;
    initializejQuery(() => {
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstChallengeParticipantListController challengeParticipantListFirstRetrieveInitiated, voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted, ', challengeWeVoteId: ', challengeWeVoteId);
      if (voterFirstRetrieveCompleted && challengeWeVoteId) {
        if (apiCalming(`challengeParticipantListFirstRetrieve-${challengeWeVoteId}`, UPDATE_NO_MORE_OFTEN_THAN)) {
          ChallengeParticipantActions.challengeParticipantListRetrieve(challengeWeVoteId);
        }
      }
    });
  }

  ChallengeParticipantSearchRetrieve = () => {
    const { challengeWeVoteId, searchText } = this.props;
    initializejQuery(() => {
      // console.log(`challengeParticipantListRetrieve-${searchText}`);
      if (challengeWeVoteId) {
        if (apiCalming(`challengeParticipantListRetrieve-${challengeWeVoteId}-${searchText}`, 180000)) {
          ChallengeParticipantActions.challengeParticipantListRetrieve(challengeWeVoteId, searchText);
        }
      }
    });
  }

  render () {
    renderLog('FirstChallengeParticipantListController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstChallengeParticipantListController render');
    return (
      <span />
    );
  }
}
FirstChallengeParticipantListController.propTypes = {
  challengeWeVoteId: PropTypes.string,
  searchText: PropTypes.string,
};

export default FirstChallengeParticipantListController;
