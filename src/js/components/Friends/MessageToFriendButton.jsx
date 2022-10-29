import { Button } from '@mui/material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import createMessageToFriendDefaults from '../../utils/createMessageToFriendDefaults';


export default class MessageToFriendButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isFriend: false,
      messageToFriendDefault: '',
      messageToFriendSent: false,
      voterIsSignedIn: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    this.onFriendStoreChange();
    this.onVoterStoreChange();
    // this.createMessageToFriendDefault(); // This is done in onFriendStoreChange above, so we don't need to call again
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    this.createMessageToFriendDefault();
  }

  onFriendStoreChange () {
    const { otherVoterWeVoteId } = this.props;
    const { isFriend } = this.state;
    if (FriendStore.isFriend(otherVoterWeVoteId) !== isFriend) {
      this.setState({
        isFriend: FriendStore.isFriend(otherVoterWeVoteId),
      });
    }
    this.createMessageToFriendDefault();
  }

  onVoterStoreChange () {
    const { voterIsSignedIn, voterWeVoteId } = this.state;
    if ((VoterStore.getVoterWeVoteId() !== voterWeVoteId) || (VoterStore.getVoterIsSignedIn() !== voterIsSignedIn)) {
      this.setState({
        voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
        voterWeVoteId: VoterStore.getVoterWeVoteId(),
      });
    }
  }

  createMessageToFriendDefault = () => {
    const { messageToFriendType } = this.props;
    const results = createMessageToFriendDefaults(messageToFriendType);
    const { messageToFriendDefault } = results;
    // const { messageToFriendDefaultAsk, messageToFriendDefaultRemind, messageToFriendDefaultInviteFriend } = results;
    this.setState({
      messageToFriendDefault,
    }, () => this.setMessageToFriendQueuedToSave());
  }

  setMessageToFriendQueuedToSave = () => {
    const { messageToFriendType } = this.props;
    const messageToFriendQueuedToSaveSetPreviously = FriendStore.getMessageToFriendQueuedToSaveSet(messageToFriendType);
    if (!messageToFriendQueuedToSaveSetPreviously) {
      // Only proceed if it hasn't already been set
      if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
      this.setMessageTimer = setTimeout(() => {
        const { messageToFriendDefault } = this.state;
        const messageToFriendQueuedToSave = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
        if (messageToFriendDefault !== messageToFriendQueuedToSave) {
          // If voter hasn't changed this, update this.
          FriendActions.messageToFriendQueuedToSave(messageToFriendDefault, messageToFriendType);
        }
      }, 500);
    }
  }

  sendMessageToFriend = () => {
    const { electionDateInFutureFormatted, electionDateIsToday, messageToFriendIncoming, otherVoterWeVoteId } = this.props;
    let { messageToFriendType } = this.props;
    messageToFriendType = messageToFriendType || 'inviteMessage';
    const { messageToFriendDefault, voterIsSignedIn } = this.state;
    // console.log('sendMessageToFriend');

    if (voterIsSignedIn) {
      let messageToSend;
      if (messageToFriendIncoming) {
        // If an override was passed in, use that
        messageToSend = messageToFriendIncoming;
      } else if (messageToFriendType && FriendStore.getMessageToFriendQueuedToSaveSet(messageToFriendType)) {
        // If the voter made a change to the message, use that
        messageToSend = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
      } else {
        messageToSend = messageToFriendDefault;
      }
      FriendActions.messageToFriendSend(otherVoterWeVoteId, messageToSend, electionDateInFutureFormatted, electionDateIsToday);
      this.setState({
        messageToFriendSent: true,
      });
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('MessageToFriendButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { displayFullWidth, lightModeOn, otherVoterWeVoteId, voterEmailAddressMissing } = this.props;
    const { messageToFriendSent, isFriend, voterWeVoteId } = this.state;
    // console.log('MessageToFriendButton, otherVoterWeVoteId:', otherVoterWeVoteId, ', isFriend:', isFriend);
    const isLookingAtSelf = voterWeVoteId === otherVoterWeVoteId;
    if (isLookingAtSelf) {
      // You should not be able to friend yourself
      // console.log('MessageToFriendButton, isLookingAtSelf');
      return <div />;
    }

    return (
      <MessageToFriendButtonWrapper displayFullWidth={displayFullWidth}>
        <Button
          color="primary"
          disabled={messageToFriendSent || !isFriend || voterEmailAddressMissing}
          fullWidth
          onClick={this.sendMessageToFriend}
          variant={`${lightModeOn ? 'outlined' : 'contained'}`}
        >
          {voterEmailAddressMissing ? (
            <>
              Email missing
            </>
          ) : (
            <>
              {messageToFriendSent ? 'Sent' : 'Ask'}
            </>
          )}
        </Button>
      </MessageToFriendButtonWrapper>
    );
  }
}
MessageToFriendButton.propTypes = {
  displayFullWidth: PropTypes.bool,
  electionDateInFutureFormatted: PropTypes.string,
  electionDateIsToday: PropTypes.bool,
  messageToFriendIncoming: PropTypes.string,
  messageToFriendType: PropTypes.string,
  lightModeOn: PropTypes.bool,
  otherVoterWeVoteId: PropTypes.string.isRequired,
  voterEmailAddressMissing: PropTypes.bool,
};

const MessageToFriendButtonWrapper = styled('div', {
  shouldForwardProp: (prop) => !['displayFullWidth'].includes(prop),
})(({ displayFullWidth }) => (`
  white-space: nowrap;
  width: 100%;
  // margin-right: 12px;
  @media(min-width: 400px) {
    ${displayFullWidth ? 'width: 100%;' : 'width: fit-content;'}
    margin: 0;
  }
  @media(min-width: 520px) {
    margin: 0;
  }
`));
