import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';
import apiCalming from '../../utils/apiCalming';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';

const UPDATE_NO_MORE_OFTEN_THAN = 30000;  // 30 seconds

class ChallengeParticipantFirstRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('ChallengeParticipantFirstRetrieveController componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.challengeParticipantFirstRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.challengeParticipantFirstRetrieve();
  }

  challengeParticipantFirstRetrieve = () => {
    const { challengeWeVoteId } = this.props;
    initializejQuery(() => {
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('ChallengeParticipantFirstRetrieveController challengeParticipantFirstRetrieveInitiated: ', challengeParticipantFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted) {
        if (apiCalming(`challengeParticipantFirstRetrieve-${challengeWeVoteId}`, UPDATE_NO_MORE_OFTEN_THAN)) {
          ChallengeParticipantActions.challengeParticipantRetrieve(challengeWeVoteId);
        }
      }
    });
  }

  render () {
    renderLog('ChallengeParticipantFirstRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ChallengeParticipantFirstRetrieveController render');
    return (
      <span />
    );
  }
}
ChallengeParticipantFirstRetrieveController.propTypes = {
  challengeWeVoteId: PropTypes.string,
};

export default ChallengeParticipantFirstRetrieveController;
