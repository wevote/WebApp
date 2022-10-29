import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { blurTextFieldAndroid, focusTextFieldAndroid } from '../../common/utils/cordovaUtils';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { validatePhoneOrEmail } from '../../utils/regex-checks';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../SignIn/SignInOptionsPanel'));


class AddFriendsByEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messageToFriend: 'I\'m getting ready to vote. Would you like to join me in deciding how to vote?',
      emailAddressesError: false,
      emailsOrPhonesBrokenString: '',
      friendContactInfoArray: [],
      friendFirstName: '',
      friendLastName: '',
      friendInvitationsWaitingForVerification: [],
      incomingEmailsOrPhonesString: '',
      invitationEmailsAlreadyScheduledStepFromApi: false,
      loading: false,
      onEnterEmailAddressesStep: true,
      onFriendInvitationsSentStep: false,
      senderEmailAddress: '',
      senderEmailAddressError: false,
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log('AddFriendsByEmail componentDidMount');
    this.onFriendStoreChange();
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterIsSignedIn,
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
      FriendActions.friendListInvitationsWaitingForVerification();
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
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
    // console.log('AddFriendsByEmail onFriendStoreChange');
    const friendInvitationsWaitingForVerification = FriendStore.friendInvitationsWaitingForVerification() || [];
    const errorMessageToShowVoter = FriendStore.getErrorMessageToShowVoter();
    const numberOfMessagesSent = FriendStore.getNumberOfMessagesSent();
    const successMessageToShowVoter = FriendStore.getSuccessMessageToShowVoter();
    if (friendInvitationsWaitingForVerification && friendInvitationsWaitingForVerification.length) {
      this.setState({
        friendInvitationsWaitingForVerification,
        invitationEmailsAlreadyScheduledStepFromApi: true,
      });
    }
    // console.log('AddFriendsByEmail onFriendStoreChange numberOfMessagesSent:', numberOfMessagesSent);
    this.setState({
      errorMessageToShowVoter,
      loading: false,
      numberOfMessagesSent,
      successMessageToShowVoter,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    // console.log('AddFriendsByEmail onVoterStoreChange voterIsSignedIn:', voterIsSignedIn);
    this.setState({
      voterIsSignedIn,
      loading: false,
    });
  }

  cacheAddFriendsByEmailMessage = (e) => {
    this.setState({
      messageToFriend: e.target.value,
    });
  };

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

  cacheFirstName = (event) => {
    const friendFirstName = event.target.value;
    // this.setState({ [event.target.name]: event.target.value });
    this.setState({
      friendFirstName,
    });
  }

  cacheLastName = (event) => {
    const friendLastName = event.target.value;
    // this.setState({ [event.target.name]: event.target.value });
    this.setState({
      friendLastName,
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    // console.log('friendInvitationByEmailSend');
    const {
      messageToFriend, friendContactInfoArray,
      friendFirstName, friendLastName,
      senderEmailAddress,
    } = this.state;

    // console.log('FriendsToInvite: ', friendContactInfoArray);
    const emailAddressArray = [];
    const firstNameArray = [];
    const lastNameArray = [];

    if (friendContactInfoArray.length === 1) {
      emailAddressArray.push(friendContactInfoArray[0]);
      firstNameArray.push(friendFirstName);
      lastNameArray.push(friendLastName);
    } else if (friendContactInfoArray.length > 1) {
      for (let i = 0; i < friendContactInfoArray.length; i++) {
        emailAddressArray.push(friendContactInfoArray[i]);
      }
    }

    // console.log('emailAddressArray: ', emailAddressArray);
    // console.log('firstNameArray: ', firstNameArray);
    // console.log('lastNameArray: ', lastNameArray);
    FriendActions.clearErrorMessageToShowVoter();
    FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray,
      lastNameArray, '', messageToFriend,
      senderEmailAddress);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      friendContactInfoArray: [],
      friendFirstName: '',
      friendLastName: '',
      incomingEmailsOrPhonesString: '',
      emailAddressesError: false,
      senderEmailAddress: '',
      onEnterEmailAddressesStep: true,
      onFriendInvitationsSentStep: true,
    });
  }

  render () {
    renderLog('AddFriendsByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, inSideColumn, uniqueExternalId } = this.props;
    const {
      emailAddressesError, emailsOrPhonesBrokenString, errorMessage, errorMessageToShowVoter,
      friendContactInfoArray,
      friendFirstName, friendInvitationsWaitingForVerification, friendLastName,
      incomingEmailsOrPhonesString, invitationEmailsAlreadyScheduledStepFromApi, loading,
      messageToFriend,
      numberOfMessagesSent, onEnterEmailAddressesStep, onFriendInvitationsSentStep,
      senderEmailAddressError, successMessageToShowVoter, voterIsSignedIn,
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
        {((onFriendInvitationsSentStep || (numberOfMessagesSent > 0)) && voterIsSignedIn) && (
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
        {(invitationEmailsAlreadyScheduledStepFromApi && !voterIsSignedIn) ? (
          <Suspense fallback={<></>}>
            <DelayedLoad waitBeforeShow={1000}>
              <>
                <Alert severity="error">
                  Your invitations will be sent after you sign in:
                  <ul>
                    {friendInvitationsWaitingForVerification.map((friend) => (
                      <li key={friend.invitation_sent_to}>
                        {friend.invitation_sent_to}
                      </li>
                    ))}
                  </ul>
                </Alert>
                <Suspense fallback={<></>}>
                  <SignInOptionsPanel
                    pleaseSignInTitle="Sign In to Send Your Friend Requests"
                    pleaseSignInSubTitle=""
                  />
                </Suspense>
              </>
            </DelayedLoad>
          </Suspense>
        ) : (
          <>
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
                        maxRows={3}
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
                      {(friendContactInfoArray.length === 1) && (
                        <div className="row">
                          <div className={inSideColumn ? 'col col-12' : 'col col-6'}>
                            <TextField
                              variant="outlined"
                              margin="dense"
                              classes={{ root: classes.textField }}
                              type="text"
                              id={uniqueExternalId ? `friendFirstName-${uniqueExternalId}` : 'friendFirstName'}
                              label="Enter Friend&apos;s First Name"
                              name="friendFirstName"
                              value={friendFirstName}
                              onChange={this.cacheFirstName}
                              onFocus={focusTextFieldAndroid}
                              onBlur={blurTextFieldAndroid}
                              placeholder={isMobileScreenSize() || inSideColumn ? 'Optional' : 'Optional, but helpful!'}
                            />
                          </div>
                          <div className={inSideColumn ? 'col col-12' : 'col col-6'}>
                            <TextField
                              variant="outlined"
                              margin="dense"
                              classes={{ root: classes.textField }}
                              type="text"
                              id={uniqueExternalId ? `friendLastName-${uniqueExternalId}` : 'friendLastName'}
                              label="Enter Friend&apos;s Last Name"
                              name="friendLastName"
                              value={friendLastName}
                              onChange={this.cacheLastName}
                              onFocus={focusTextFieldAndroid}
                              onBlur={blurTextFieldAndroid}
                              placeholder="Optional"
                            />
                          </div>
                        </div>
                      )}
                      {(friendContactInfoArray.length > 0) ? (
                        <>
                          <TextField
                            classes={{ root: classes.textField }}
                            fullWidth
                            id={uniqueExternalId ? `addFriendsMessage-${uniqueExternalId}` : 'addFriendsMessage'}
                            label="Add Personal Message"
                            lines={2}
                            margin="dense"
                            maxRows={3}
                            multiline
                            name="addFriendsMessage"
                            onChange={this.cacheAddFriendsByEmailMessage}
                            onFocus={focusTextFieldAndroid}
                            onBlur={blurTextFieldAndroid}
                            placeholder={messageToFriend}
                            type="text"
                            value={messageToFriend}
                            variant="outlined"
                          />
                        </>
                      ) : null}
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
                        </Button>
                      </ButtonContainer>
                    </form>
                  </div>
                </FormWrapper>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
AddFriendsByEmail.propTypes = {
  classes: PropTypes.object,
  inSideColumn: PropTypes.bool,
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
  justify-content: flex-end;
  ${theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
`));

export default withStyles(styles)(AddFriendsByEmail);
