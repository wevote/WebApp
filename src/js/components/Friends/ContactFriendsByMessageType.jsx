import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ShareActions from '../../common/actions/ShareActions';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { blurTextFieldAndroid, focusTextFieldAndroid } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import ShareStore from '../../common/stores/ShareStore';
import VoterStore from '../../stores/VoterStore';
import { validatePhoneOrEmail } from '../../utils/regex-checks';


class ContactFriendsByMessageType extends Component {
  constructor (props) {
    super(props);
    this.state = {
      emailAddressesError: false,
      emailsOrPhonesBrokenString: '',
      friendContactInfoArray: [],
      incomingEmailsOrPhonesString: '',
      loading: false,
      onEnterEmailAddressesStep: true,
      onFriendInvitationsSentStep: false,
      // senderEmailAddress: '',
      senderEmailAddressError: false,
      // voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log('ContactFriendsByMessageType componentDidMount');
    this.onFriendStoreChange();
    // const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    // this.setState({
    //   voterIsSignedIn,
    // });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
      FriendActions.friendListInvitationsWaitingForVerification();
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.addFriendsByEmailSubmit(event).bind(scope);
    }
  };

  onFriendStoreChange () {
    // console.log('ContactFriendsByMessageType onFriendStoreChange');
    const errorMessageToShowVoter = FriendStore.getErrorMessageToShowVoter();
    const numberOfMessagesSent = FriendStore.getNumberOfMessagesSent();
    const successMessageToShowVoter = FriendStore.getSuccessMessageToShowVoter();
    // console.log('ContactFriendsByMessageType onFriendStoreChange numberOfMessagesSent:', numberOfMessagesSent);
    this.setState({
      errorMessageToShowVoter,
      loading: false,
      numberOfMessagesSent,
      successMessageToShowVoter,
    });
  }

  onShareStoreChange () {
    // console.log('ContactFriendsByMessageType onShareStoreChange');
    const errorMessageToShowVoter = ShareStore.getErrorMessageToShowVoter();
    const numberOfMessagesSent = ShareStore.getNumberOfMessagesSent();
    const successMessageToShowVoter = ShareStore.getSuccessMessageToShowVoter();
    // console.log('ContactFriendsByMessageType onShareStoreChange numberOfMessagesSent:', numberOfMessagesSent);
    this.setState({
      errorMessageToShowVoter,
      loading: false,
      numberOfMessagesSent,
      successMessageToShowVoter,
    });
  }

  onVoterStoreChange () {
    // const voter = VoterStore.getVoter();
    // const voterIsSignedIn = voter.is_signed_in;
    // console.log('ContactFriendsByMessageType onVoterStoreChange voterIsSignedIn:', voterIsSignedIn);
    this.setState({
      // voterIsSignedIn,
      loading: false,
    });
  }

  addFriendsByEmailSubmit = (event) => {
    // This function is called when the next button is submitted;
    // console.log('Entering function addFriendsByEmailSubmit');

    // Validate friends' email addresses
    const emailAddressesError = false;

    if (emailAddressesError) {
      // console.log('addFriendsByEmailSubmit, emailAddressesError');
      this.setState({
        loading: false,
        emailAddressesError: true,
        errorMessage: 'Error sending invites.',
      });
    } else {
      // console.log('addFriendsByEmailSubmit, calling friendInvitationByEmailSend');
      this.setState({
        loading: false,
        onEnterEmailAddressesStep: false,
      });
      this.friendInvitationByEmailSend(event);
    }
  };

  cacheIncomingEmailsOrPhones = (event) => {
    const incomingEmailsOrPhonesString = event.target.value;
    const friendContactInfoArray = [];
    let emailsOrPhonesBrokenString = '';
    if (event && event.target && event.target.value) {
      if (incomingEmailsOrPhonesString) {
        // Split based on either comma or line break
        let friendContactInfoArrayRaw = incomingEmailsOrPhonesString.split(/[\n,]+/);
        friendContactInfoArrayRaw = friendContactInfoArrayRaw.map((s) => s.trim());
        for (let i = 0; i < friendContactInfoArrayRaw.length; i++) {
          if (validatePhoneOrEmail(friendContactInfoArrayRaw[i])) {
            friendContactInfoArray.push(friendContactInfoArrayRaw[i]);
          } else {
            emailsOrPhonesBrokenString = emailsOrPhonesBrokenString.concat(friendContactInfoArrayRaw[i], ', ');
          }
        }
        emailsOrPhonesBrokenString = emailsOrPhonesBrokenString.slice(0, -2);
        // console.log('friendContactInfoArray:', friendContactInfoArray);
        // console.log('emailsOrPhonesBrokenString:', emailsOrPhonesBrokenString);
      }
    }
    // this.setState({ [event.target.name]: event.target.value });
    this.setState({
      incomingEmailsOrPhonesString,
      emailsOrPhonesBrokenString,
      friendContactInfoArray,
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    // console.log('friendInvitationByEmailSend');
    const {
      friendContactInfoArray,
      // senderEmailAddress,
    } = this.state;

    // console.log('FriendsToInvite: ', friendContactInfoArray);
    const emailAddressArray = [];
    // const firstNameArray = [];
    // const lastNameArray = [];

    if (friendContactInfoArray.length === 1) {
      emailAddressArray.push(friendContactInfoArray[0]);
    } else if (friendContactInfoArray.length > 1) {
      for (let i = 0; i < friendContactInfoArray.length; i++) {
        emailAddressArray.push(friendContactInfoArray[i]);
      }
    }

    // console.log('emailAddressArray: ', emailAddressArray);
    // console.log('firstNameArray: ', firstNameArray);
    // console.log('lastNameArray: ', lastNameArray);
    FriendActions.clearErrorMessageToShowVoter();
    const hostname = AppObservableStore.getHostname();
    const destinationFullUrl = `https://${hostname}/`; // We must provide a destinationFullUrl, so we know what hostname to use in sharedItemRetrieve
    const sharedMessage = FriendStore.getMessageToFriendQueuedToSave('remindContacts');
    ShareActions.sharedItemListSaveRemindContact(destinationFullUrl, emailAddressArray, sharedMessage);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      friendContactInfoArray: [],
      incomingEmailsOrPhonesString: '',
      emailAddressesError: false,
      // senderEmailAddress: '',
      onEnterEmailAddressesStep: true,
      onFriendInvitationsSentStep: true,
    });
  }

  render () {
    renderLog('ContactFriendsByMessageType');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, messageToFriendType, uniqueExternalId } = this.props;
    const {
      emailAddressesError, emailsOrPhonesBrokenString, errorMessage, errorMessageToShowVoter,
      friendContactInfoArray,
      incomingEmailsOrPhonesString, loading,
      numberOfMessagesSent, onEnterEmailAddressesStep, onFriendInvitationsSentStep,
      senderEmailAddressError, successMessageToShowVoter, // voterIsSignedIn,
    } = this.state;

    if (loading) {
      return (
        <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ padding: '30px' }}>
            <CircularProgress />
          </div>
          <div>Sending...</div>
        </Box>
      );
    }
    return (
      <div>
        {(emailAddressesError || errorMessageToShowVoter || senderEmailAddressError) && (
          <Alert severity="error">
            {errorMessage}
            {errorMessageToShowVoter}
          </Alert>
        )}
        {(successMessageToShowVoter) && (
          <Alert severity="success">
            {successMessageToShowVoter}
          </Alert>
        )}
        {(onFriendInvitationsSentStep || (numberOfMessagesSent > 0)) && (
          <Alert severity="success">
            {numberOfMessagesSent ? (
              <>
                {numberOfMessagesSent}
                {' '}
                invitation
                {(numberOfMessagesSent > 1) && <>s</>}
                {' '}
                sent.
              </>
            ) : (
              <>
                Sent.
              </>
            )}
            {' '}
            Is there anyone else you&apos;d like to invite?
          </Alert>
        )}
        {onEnterEmailAddressesStep && (
          <>
            <FormWrapper>
              <div>
                <form>
                  <TextField
                    classes={{ root: classes.textField }}
                    id={uniqueExternalId ? `EmailAddress-${uniqueExternalId}` : 'EmailAddress'}
                    label="Enter email addresses of friends"
                    margin="dense"
                    maxRows={5}
                    multiline
                    name="incomingEmailsOrPhonesString"
                    onChange={this.cacheIncomingEmailsOrPhones}
                    onFocus={focusTextFieldAndroid}
                    onBlur={blurTextFieldAndroid}
                    placeholder="For example: name@domain.com"
                    type="text"
                    value={incomingEmailsOrPhonesString}
                    variant="outlined"
                  />
                  {(emailsOrPhonesBrokenString.length > 0) && (
                    <EmailsOrPhonesBrokenStringAlertWrapper>
                      <Alert severity="error">
                        Incomplete:
                        {' '}
                        {emailsOrPhonesBrokenString}
                      </Alert>
                    </EmailsOrPhonesBrokenStringAlertWrapper>
                  )}
                  <ButtonContainer>
                    <Button
                      color="primary"
                      classes={{ root: classes.sendButton }}
                      disabled={friendContactInfoArray.length === 0}
                      id={uniqueExternalId ? `friendsNextButton-${uniqueExternalId}` : 'friendsNextButton'}
                      onClick={this.addFriendsByEmailSubmit}
                      onKeyDown={this.onKeyDown}
                      variant="contained"
                    >
                      {messageToFriendType === 'remindContacts' ? (
                        <>
                          Send my
                          {' '}
                          friend
                          {friendContactInfoArray.length === 1 ? '' : 's'}
                          {' '}
                          reminder
                          {friendContactInfoArray.length === 1 ? '' : 's'}
                          {' '}
                          to vote
                        </>
                      ) : (
                        <>
                          Send
                          {' '}
                          {(friendContactInfoArray.length > 0) && (
                            <>
                              {friendContactInfoArray.length}
                              {' '}
                            </>
                          )}
                          Invitation
                          {friendContactInfoArray.length === 1 ? '' : 's'}
                        </>
                      )}
                    </Button>
                  </ButtonContainer>
                </form>
              </div>
            </FormWrapper>
          </>
        )}
      </div>
    );
  }
}
ContactFriendsByMessageType.propTypes = {
  classes: PropTypes.object,
  messageToFriendType: PropTypes.string,
  uniqueExternalId: PropTypes.string,
};

const styles = () => ({
  textField: {
    width: '100%',
    background: 'white',
  },
  closeIcon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  sendButton: {
    display: 'block',
    width: '100%',
  },
});

const EmailsOrPhonesBrokenStringAlertWrapper = styled('div')`
  margin-bottom: 3px;
`;

const FormWrapper = styled('div')`
  margin-bottom: 8px;
`;

const ButtonContainer = styled('div')(({ theme }) => (`
  display: flex;
  align-items: center;
  margin-top: 9px;
  justify-content: flex-end;
  ${theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
`));

export default withStyles(styles)(ContactFriendsByMessageType);
