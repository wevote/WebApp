import { Button, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../utils/apiCalming';
import { blurTextFieldAndroid, focusTextFieldAndroid } from '../../utils/cordovaUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import { validatePhoneOrEmail } from '../../utils/regex-checks';
import LoadingWheel from '../LoadingWheel';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));
const SettingsAccount = React.lazy(() => import(/* webpackChunkName: 'SettingsAccount' */ '../Settings/SettingsAccount'));


class AddFriendsByEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      addFriendsMessage: 'Here’s how I’m figuring out this election.',
      friendsToInvite: [],
      friendFirstName: '',
      friendLastName: '',
      friendContactInfo: '',
      friendInvitationsWaitingForVerification: [],
      emailAddressesError: false,
      senderEmailAddress: '',
      senderEmailAddressError: false,
      loading: false,
      onEnterEmailAddressesStep: true,
      invitationEmailsAlreadyScheduledStepFromApi: false,
      onFriendInvitationsSentStep: false,
      voter: {},
      voterIsSignedIn: false,
    };
    this.addFriend = this.addFriend.bind(this);
    this.cacheFriendData = this.cacheFriendData.bind(this);
  }

  componentDidMount () {
    // console.log('AddFriendsByEmail componentDidMount');
    this.onFriendStoreChange();
    this.setState({
      loading: true,
      voter: VoterStore.getVoter(),
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendListsAll', 1500)) {
      FriendActions.getAllFriendLists();
      // FriendActions.friendInvitationsWaitingForVerification();
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
    if (friendInvitationsWaitingForVerification && friendInvitationsWaitingForVerification.length) {
      this.setState({
        friendInvitationsWaitingForVerification,
        invitationEmailsAlreadyScheduledStepFromApi: true,
      });
    }
    this.setState({
      errorMessageToShowVoter,
      loading: false,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    // console.log('AddFriendsByEmail onVoterStoreChange voterIsSignedIn:', voterIsSignedIn);
    this.setState({
      voter,
      voterIsSignedIn,
      loading: false,
    });
  }

  cacheAddFriendsByEmailMessage = (e) => {
    this.setState({
      addFriendsMessage: e.target.value,
    });
  };

  cacheSenderEmailAddress = (e) => {
    this.setState({
      senderEmailAddress: e.target.value,
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
        errorMessage: 'Error in sending invites.',
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

  deleteFriendFromList = (friend) => {
    const { friendsToInvite } = this.state;

    const newArray = [...friendsToInvite].filter((item) => item.email !== friend.email);

    // console.log('New array: ', newArray);
    // console.log('Email: ', friend.email);

    this.setState({ friendsToInvite: [...newArray]});
  };

  cacheFriendData (event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  allEnteredEmailsOrPhonesVerified () {
    const _state = this.state;

    if (_state.friendsToInvite.length !== 0) {
      return true;
    }

    return validatePhoneOrEmail(_state.friendContactInfo);
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    // console.log('friendInvitationByEmailSend');
    const { addFriendsMessage, friendsToInvite, friendContactInfo, friendFirstName, friendLastName } = this.state;

    // console.log('FriendsToInvite: ', friendsToInvite);
    const emailAddressArray = [];
    const firstNameArray = [];
    const lastNameArray = [];

    if (friendsToInvite.length !== 0) {
      for (let i = 0; i < friendsToInvite.length; i++) {
        emailAddressArray.push(friendsToInvite[i].email);
        firstNameArray.push(friendsToInvite[i].firstName);
        lastNameArray.push(friendsToInvite[i].lastName);
      }
    }

    if (friendContactInfo && validatePhoneOrEmail(friendContactInfo)) {
      emailAddressArray.push(friendContactInfo);
      firstNameArray.push(friendFirstName);
      lastNameArray.push(friendLastName);
    }

    // console.log('emailAddressArray: ', emailAddressArray);
    // console.log('firstNameArray: ', firstNameArray);
    // console.log('lastNameArray: ', lastNameArray);
    // const response =
    FriendActions.clearErrorMessageToShowVoter();
    FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray,
      lastNameArray, '', addFriendsMessage,
      this.state.senderEmailAddress);
    // console.log(response);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      friendFirstName: '',
      friendLastName: '',
      friendContactInfo: '',
      emailAddressesError: false,
      senderEmailAddress: '',
      onEnterEmailAddressesStep: true,
      onFriendInvitationsSentStep: true,
    });
  }

  addFriend () {
    const { friendFirstName, friendContactInfo, friendLastName, friendsToInvite } = this.state;

    if (validatePhoneOrEmail(friendContactInfo)) {
      const newArray = [...friendsToInvite];

      const newFriendObject = {
        firstName: friendFirstName,
        lastName: friendLastName,
        email: friendContactInfo,
      };

      newArray.push(newFriendObject);

      this.setState({
        friendsToInvite: [...newArray],
        friendContactInfo: '',
        friendFirstName: '',
        friendLastName: '',
      });
    }
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }


  render () {
    renderLog('AddFriendsByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    const { addAnotherButtonOff, classes, inSideColumn, uniqueExternalId } = this.props;
    const {
      emailAddressesError, errorMessageToShowVoter, friendContactInfo, friendFirstName, friendInvitationsWaitingForVerification,
      friendLastName, friendsToInvite,
      invitationEmailsAlreadyScheduledStepFromApi, loading,
      onEnterEmailAddressesStep, onFriendInvitationsSentStep, senderEmailAddressError, voterIsSignedIn,
    } = this.state;

    // console.log(friendsToInvite);
    const atLeastOneValidated = friendsToInvite.length !== 0 || validatePhoneOrEmail(friendContactInfo);

    if (loading) {
      return LoadingWheel;
    }
    return (
      <div>
        {emailAddressesError || errorMessageToShowVoter || senderEmailAddressError ? (
          <div className="alert alert-danger">
            {this.state.errorMessage}
            {this.state.errorMessageToShowVoter}
          </div>
        ) : (
          <div>
            {(onFriendInvitationsSentStep && voterIsSignedIn) && (
              <div className="alert alert-success">
                Invitations sent. Is there anyone else you&apos;d like to invite?
              </div>
            )}
          </div>
        )}
        {friendsToInvite.length !== 0 && (
          <FriendsDisplay>
            <SectionTitle>Invite List</SectionTitle>
            {friendsToInvite.map((friend) => (
              <FriendBadge key={friend.email}>
                <strong>{friend.firstName}</strong>
                {' '}
                {friend.email}
                <Close
                  onClick={() => this.deleteFriendFromList(friend)}
                  className={classes.closeIcon}
                />
              </FriendBadge>
            ))}
          </FriendsDisplay>
        )}
        {(invitationEmailsAlreadyScheduledStepFromApi && !voterIsSignedIn) ? (
          <Suspense fallback={<></>}>
            <DelayedLoad waitBeforeShow={1000}>
              <>
                <Alert variant="danger">
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
                  <SettingsAccount
                    pleaseSignInTitle="Sign in to Send Your Friend Requests"
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
                {friendsToInvite.length !== 0 ? (
                  <SectionTitle>Add Friend</SectionTitle>
                ) : null}
                <FormWrapper>
                  <div>
                    <form>
                      <Label>Email of One Friend</Label>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        classes={{ root: classes.textField }}
                        type="text"
                        id={uniqueExternalId ? `EmailAddress-${uniqueExternalId}` : 'EmailAddress'}
                        name="friendContactInfo"
                        value={friendContactInfo}
                        onChange={this.cacheFriendData}
                        onFocus={focusTextFieldAndroid}
                        onBlur={blurTextFieldAndroid}
                        placeholder="For example: name@domain.com"
                      />
                      {friendContactInfo && (
                        <div className="row">
                          <div className={inSideColumn ? 'col col-12' : 'col col-6'}>
                            <Label>
                              Friend&apos;s First Name
                            </Label>
                            <TextField
                              variant="outlined"
                              margin="dense"
                              classes={{ root: classes.textField }}
                              type="text"
                              id={uniqueExternalId ? `friendFirstName-${uniqueExternalId}` : 'friendFirstName'}
                              name="friendFirstName"
                              value={friendFirstName}
                              onChange={this.cacheFriendData}
                              onFocus={focusTextFieldAndroid}
                              onBlur={blurTextFieldAndroid}
                              placeholder={isMobileScreenSize() || inSideColumn ? 'Optional' : 'Optional, but helpful!'}
                            />
                          </div>
                          <div className={inSideColumn ? 'col col-12' : 'col col-6'}>
                            <Label>
                              Friend&apos;s Last Name
                            </Label>
                            <TextField
                              variant="outlined"
                              margin="dense"
                              classes={{ root: classes.textField }}
                              type="text"
                              id={uniqueExternalId ? `friendLastName-${uniqueExternalId}` : 'friendLastName'}
                              name="friendLastName"
                              value={friendLastName}
                              onChange={this.cacheFriendData}
                              onFocus={focusTextFieldAndroid}
                              onBlur={blurTextFieldAndroid}
                              placeholder="Optional"
                            />
                          </div>
                        </div>
                      )}
                      {atLeastOneValidated ? (
                        <>
                          <Label>Add Personal Message</Label>
                          <span className="small">(Optional)</span>
                          <TextField
                            variant="outlined"
                            margin="dense"
                            classes={{ root: classes.textField }}
                            type="text"
                            id={uniqueExternalId ? `addFriendsMessage-${uniqueExternalId}` : 'addFriendsMessage'}
                            name="addFriendsMessage"
                            onChange={this.cacheAddFriendsByEmailMessage}
                            fullWidth
                            onFocus={focusTextFieldAndroid}
                            onBlur={blurTextFieldAndroid}
                            placeholder="Here’s how I’m figuring out this election."
                          />
                        </>
                      ) : null}
                      <ButtonContainer>
                        {!addAnotherButtonOff && (
                          <Button
                            classes={{ root: classes.addButton }}
                            disabled={!this.allEnteredEmailsOrPhonesVerified()}
                            onClick={this.addFriend}
                            color="primary"
                            variant="outlined"
                          >
                            <span className="u-show-mobile">
                              Add
                            </span>
                            <span className="u-show-desktop-tablet">
                              Add Another
                            </span>
                          </Button>
                        )}
                        <Button
                          color="primary"
                          classes={{ root: classes.sendButton }}
                          disabled={!this.allEnteredEmailsOrPhonesVerified()}
                          id={uniqueExternalId ? `friendsNextButton-${uniqueExternalId}` : 'friendsNextButton'}
                          onClick={this.addFriendsByEmailSubmit}
                          onKeyDown={this.onKeyDown}
                          variant="contained"
                        >
                          { this.hasValidEmail() ?
                            <span>Send</span> :
                            <span>Next &gt;</span>}
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
  addAnotherButtonOff: PropTypes.bool,
  classes: PropTypes.object,
  inSideColumn: PropTypes.bool,
  uniqueExternalId: PropTypes.string,
};

const styles = () => ({
  textField: {
    marginBottom: 16,
    width: '100%',
    background: 'white',
  },
  closeIcon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  addButton: {
    display: 'block',
    marginRight: '6px',
    background: 'white',
    '@media (max-width: 520px)': {
      width: 'calc(50% - 6px)',
    },
  },
  sendButton: {
    display: 'block',
    '@media (max-width: 520px)': {
      width: 'calc(50% - 6px)',
    },
  },
});

const FriendsDisplay = styled.div`
  background: #fff;
  padding: 12px 0;
  margin-bottom: 8px;
`;

const FriendBadge = styled.div`
  background: #eee;
  margin: 0 10px 0 0;
  display: inline-block;
  padding: 6px 8px;
`;

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;

const FormWrapper = styled.div`
  margin-bottom: 8px;
`;

const Label = styled.div`
  margin-bottom: -4px;
  white-space: nowrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 520px) {
    justify-content: space-between;
  }
`;

export default withStyles(styles)(AddFriendsByEmail);
