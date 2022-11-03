import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import createMessageToFriendDefaults from '../../utils/createMessageToFriendDefaults';


class MessageToFriendInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messageToFriend: '',
      messageToFriendChangedLocally: false,
      messageToFriendDefault: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateMessageToFriend = this.updateMessageToFriend.bind(this);
  }

  componentDidMount () {
    // console.log('MessageToFriendInputField, componentDidMount');
    // this.onFriendStoreChange();
    this.createMessageToFriendDefault();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    // if (this.friendStoreUpdateTimer) clearTimeout(this.friendStoreUpdateTimer);
    // this.friendStoreListener.remove();
    if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
    this.ballotStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onBallotStoreChange () {
    this.createMessageToFriendDefault();
  }

  // onFriendStoreChange () {
  //   let { messageToFriendType } = this.props;
  //   const { messageToFriendDefault } = this.state;
  //   messageToFriendType = messageToFriendType || 'inviteMessage';
  //   const messageToFriendQueuedToSave = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
  //   const messageToFriendQueuedToSaveSet = FriendStore.getMessageToFriendQueuedToSaveSet(messageToFriendType);
  //   let messageToFriendAdjusted = messageToFriendDefault;
  //   if (messageToFriendQueuedToSaveSet) {
  //     messageToFriendAdjusted = messageToFriendQueuedToSave;
  //   }
  //   // console.log('onFriendStoreChange messageToFriendDefault: ', messageToFriendDefault, ', messageToFriendQueuedToSave: ', messageToFriendQueuedToSave, ', messageToFriendQueuedToSaveSet: ', messageToFriendQueuedToSaveSet, ', messageToFriendAdjusted:', messageToFriendAdjusted);
  //   this.setState({
  //     messageToFriend: messageToFriendAdjusted,
  //   });
  // }

  createMessageToFriendDefault = () => {
    const { messageToFriendType } = this.props;
    const { messageToFriendChangedLocally } = this.state;
    let { messageToFriend } = this.state;
    const messageToFriendQueuedToSaveSetPreviously = FriendStore.getMessageToFriendQueuedToSaveSet(messageToFriendType);
    const messageToFriendQueuedToSave = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
    const results = createMessageToFriendDefaults(messageToFriendType);
    const { messageToFriendDefault } = results;
    // const { messageToFriendDefaultAsk, messageToFriendDefaultRemind, messageToFriendDefaultInviteFriend } = results;
    if (messageToFriendQueuedToSaveSetPreviously) {
      messageToFriend = messageToFriendQueuedToSave;
    } else if (!messageToFriendChangedLocally) {
      messageToFriend = messageToFriendDefault;
    }
    this.setState({
      messageToFriend,
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

  updateMessageToFriend (event) {
    let { messageToFriendType } = this.props;
    messageToFriendType = messageToFriendType || 'inviteFriend';
    const delayBeforeSentToFriendStore = 1200;
    // console.log('updateMessageToFriend');
    if (event.target.name === 'messageToFriend') {
      this.setState({
        messageToFriend: event.target.value,
        messageToFriendChangedLocally: true,
      });
      if (this.friendStoreUpdateTimer) clearTimeout(this.friendStoreUpdateTimer);
      this.friendStoreUpdateTimer = setTimeout(() => {
        FriendActions.messageToFriendQueuedToSave(event.target.value, messageToFriendType);
      }, delayBeforeSentToFriendStore);
    }
  }

  render () {
    renderLog('MessageToFriendInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { messageToFriend } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <MessageToFriendInputFieldWrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`messageToFriendTextArea-${externalUniqueId}`}
                  label="Message"
                  margin="dense"
                  maxRows={8}
                  multiline
                  name="messageToFriend"
                  onChange={this.updateMessageToFriend}
                  onKeyDown={this.handleKeyPress}
                  value={messageToFriend}
                  variant="outlined"
                />
              </FormControl>
            </ColumnFullWidth>
          </MessageToFriendInputFieldWrapper>
        </form>
      </div>
    );
  }
}
MessageToFriendInputField.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  messageToFriendType: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  // TODO: Figure out how to apply to TextField
  textField: {
    fontSize: '22px',
  },
});

const ColumnFullWidth = styled('div')`
  // padding: 8px 12px;
  width: 100%;
`;

const MessageToFriendInputFieldWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export default withStyles(styles)(MessageToFriendInputField);
