import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';

class MessageToFriendInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messageToFriend: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateMessageToFriend = this.updateMessageToFriend.bind(this);
  }

  componentDidMount () {
    // console.log('MessageToFriendInputField, componentDidMount');
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    if (this.friendStoreUpdateTimer) clearTimeout(this.friendStoreUpdateTimer);
    this.friendStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onFriendStoreChange () {
    const { messageToFriendDefault } = this.props;
    const messageToFriendQueuedToSave = FriendStore.getMessageToFriendQueuedToSave();
    const messageToFriendQueuedToSaveSet = FriendStore.getMessageToFriendQueuedToSaveSet();
    let messageToFriendAdjusted = messageToFriendDefault;
    if (messageToFriendQueuedToSaveSet) {
      messageToFriendAdjusted = messageToFriendQueuedToSave;
    }
    // console.log('onFriendStoreChange messageToFriend: ', messageToFriend, ', messageToFriendQueuedToSave: ', messageToFriendQueuedToSave, ', messageToFriendAdjusted:', messageToFriendAdjusted);
    this.setState({
      messageToFriend: messageToFriendAdjusted,
    });
  }

  updateMessageToFriend (event) {
    const delayBeforeSentToFriendStore = 1200;
    if (event.target.name === 'messageToFriend') {
      this.setState({
        messageToFriend: event.target.value,
      });
      if (this.friendStoreUpdateTimer) clearTimeout(this.friendStoreUpdateTimer);
      this.friendStoreUpdateTimer = setTimeout(() => {
        FriendActions.messageToFriendQueuedToSave(event.target.value);
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
                  label="Enter message to send to your friends when you click Ask button."
                  name="messageToFriend"
                  margin="dense"
                  multiline
                  rows={3}
                  variant="outlined"
                  value={messageToFriend}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateMessageToFriend}
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
  messageToFriendDefault: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
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
