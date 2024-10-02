import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeInviteeActions from '../../actions/ChallengeInviteeActions';
import apiCalming from '../../utils/apiCalming';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';


class FirstChallengeInviteeListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstChallengeInviteeListController componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.challengeInviteeListFirstRetrieve();
  }

  componentDidUpdate (prevProps) {
    if (this.props.challengeWeVoteId !== prevProps.challengeWeVoteId) {
      this.challengeInviteeListFirstRetrieve();
    }
    if (this.props.searchText !== prevProps.searchText) {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.ChallengeInviteeSearchRetrieve();
      }, 500);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  onVoterStoreChange () {
    this.challengeInviteeListFirstRetrieve();
  }

  challengeInviteeListFirstRetrieve = () => {
    const { challengeWeVoteId } = this.props;
    initializejQuery(() => {
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstChallengeInviteeListController challengeInviteeListFirstRetrieveInitiated, voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted && challengeWeVoteId) {
        if (apiCalming(`challengeInviteeListFirstRetrieve-${challengeWeVoteId}`, 30000)) {
          ChallengeInviteeActions.challengeInviteeListRetrieve(challengeWeVoteId);
        }
      }
    });
  }

  ChallengeInviteeSearchRetrieve = () => {
    const { challengeWeVoteId, searchText } = this.props;
    initializejQuery(() => {
      // console.log(`challengeInviteeListRetrieve-${searchText}`);
      if (apiCalming(`challengeInviteeListRetrieve-${challengeWeVoteId}-${searchText}`, 180000)) {
        ChallengeInviteeActions.challengeInviteeListRetrieve(challengeWeVoteId, searchText);
      }
    });
  }

  render () {
    renderLog('FirstChallengeInviteeListController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstChallengeInviteeListController render');
    return (
      <span />
    );
  }
}
FirstChallengeInviteeListController.propTypes = {
  challengeWeVoteId: PropTypes.string,
  searchText: PropTypes.string,
};

export default FirstChallengeInviteeListController;
