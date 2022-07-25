import { Button } from '@mui/material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';


export default class MessageToFriendButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isFriend: false,
      messageToFriendSent: false,
      voterIsSignedIn: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFriendStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    const { otherVoterWeVoteId } = this.props;
    const { isFriend } = this.state;
    if (FriendStore.isFriend(otherVoterWeVoteId) !== isFriend) {
      this.setState({
        isFriend: FriendStore.isFriend(otherVoterWeVoteId),
      });
    }
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

  sendMessageToFriend = () => {
    const { electionDateInFutureFormatted, electionDateIsToday, messageToFriendDefault, otherVoterWeVoteId } = this.props;
    const { voterIsSignedIn } = this.state;
    // console.log('sendMessageToFriend');
    if (voterIsSignedIn) {
      let messageToSend;
      if (FriendStore.getMessageToFriendQueuedToSaveSet()) {
        messageToSend = FriendStore.getMessageToFriendQueuedToSave();
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
  messageToFriendDefault: PropTypes.string,
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
