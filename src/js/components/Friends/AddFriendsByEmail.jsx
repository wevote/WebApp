import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { TextField, withStyles } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import LoadingWheel from '../LoadingWheel';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { validatePhoneOrEmail } from '../../utils/regex-checks';
import { renderLog } from '../../utils/logging';

class AddFriendsByEmail extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      add_friends_message: 'Please join me in preparing for the upcoming election.',
      friendsToInvite: [],
      friendFirstName: '',
      friendLastName: '',
      friendContactInfo: '',
      emailAddressesError: false,
      senderEmailAddress: '',
      senderEmailAddressError: false,
      loading: false,
      onEnterEmailAddressesStep: true,
      onCollectEmailStep: false,
      onFriendInvitationsSentStep: false,
      voter: {},
    };
    this.addFriend = this.addFriend.bind(this);
    this.deleteFriendFromList = this.deleteFriendFromList.bind(this);
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }
  
  shouldComponentUpdate (nextState) {
    if (this.state.friendsToInvite !== nextState.friendsToInvite) return true;
    return false;
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.addFriendsByEmailStepsManager(event).bind(scope);
    }
  }

  onFriendStoreChange () {
    const addFriendsByEmailStep = FriendStore.switchToAddFriendsByEmailStep();
    const errorMessageToShowVoter = FriendStore.getErrorMessageToShowVoter();
    // console.log("AddFriendsByEmail, onFriendStoreChange, addFriendsByEmailStep:", addFriendsByEmailStep);
    if (addFriendsByEmailStep === 'on_collect_email_step') {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        onEnterEmailAddressesStep: false,
        onCollectEmailStep: true,
        onFriendInvitationsSentStep: false,
        errorMessageToShowVoter,
      });
      // FriendStore.clearErrorMessageToShowVoter()
    } else {
      this.setState({
        loading: false,
        errorMessageToShowVoter: '',
      });
    }
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  cacheAddFriendsByEmailMessage = (e) => {
    this.setState({
      add_friends_message: e.target.value,
    });
  }

  cacheSenderEmailAddress = (e) => {
    this.setState({
      senderEmailAddress: e.target.value,
    });
  }

  addFriendsByEmailStepsManager = (event) => {
    // This function is called when the next button is  submitted;
    // this funtion is called twice per cycle
    console.log("Entering function addFriendsByEmailStepsManager");
    const errorMessage = '';

    if (this.state.onEnterEmailAddressesStep) {
      // Validate friends' email addresses
      const emailAddressesError = false;

      // Error message logic on submit disabled in favor of disabling buttons

      // if (!this.state.friendContactInfo ) {
      //   // console.log("addFriendsByEmailStepsManager: this.state.email_add is ");
      //   emailAddressesError = true;
      //   errorMessage += "Please enter at least one valid email address.";
      // } else {
      //   //custom error message for each invalid email
      //   for (let friendIdx = 1; friendIdx <= this.state.friendTotal; friendIdx++) {
      //     if (this.state[`friend${friendIdx}EmailAddress`] && !validatePhoneOrEmail(this.state[`friend${friendIdx}EmailAddress`])) {
      //       emailAddressesError = true;
      //       errorMessage += `Please enter a valid email address for ${this.state[`friend${friendIdx}EmailAddress`]}`;
      //     }
      //   }
      // }

      if (emailAddressesError) {
        console.log("addFriendsByEmailStepsManager, emailAddressesError");
        this.setState({
          loading: false,
          emailAddressesError: true,
          errorMessage: 'Error in sending invites.',
        });
      } else if (!this.hasValidEmail()) {
        console.log("addFriendsByEmailStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          onEnterEmailAddressesStep: false,
          onCollectEmailStep: true,
        });
      } else {
        console.log("addFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    } else if (this.state.onCollectEmailStep) {
      // Validate sender's email addresses
      const senderEmailAddressError = false;

      if (senderEmailAddressError) {
        this.setState({
          loading: false,
          senderEmailAddressError: true,
          errorMessage,
        });
      } else {
        // console.log("addFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    }
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return validatePhoneOrEmail(this.state.senderEmailAddress);
  }

  cacheFriendData (event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  allEnteredPhoneNumbersVerified () {
    const _state = this.state;

    if (_state.friendsToInvite.length !== 0) {
      return true;
    }

    return validatePhoneOrEmail(_state.friendContactInfo);
  }

  allEnteredEmailsVerified () {
    const _state = this.state;

    if (_state.friendsToInvite.length !== 0) {
      return true;
    }

    return validatePhoneOrEmail(_state.friendContactInfo);
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    // console.log("friendInvitationByEmailSend);
    const { friendsToInvite,friendContactInfo, friendFirstName, friendLastName } = this.state;

    console.log("FriendsToInvite: ", friendsToInvite);
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

    console.log("emailAddressArray: ", emailAddressArray);
    console.log("firstNameArray: ", firstNameArray);
    console.log("lastNameArray: ", lastNameArray);
    const response = FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray,
      lastNameArray, '', this.state.add_friends_message,
      this.state.senderEmailAddress);

    console.log(response);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      friendFirstName: '',
      friendLastName: '',
      friendContactInfo: '',
      emailAddressesError: false,
      senderEmailAddress: '',
      onEnterEmailAddressesStep: true,
      onCollectEmailStep: false,
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

  deleteFriendFromList (friend) {
    const { friendsToInvite } = this.state;

    const newArray = [...friendsToInvite].filter((item) => {
      return item.email !== friend.email;
    });

    console.log("New array: ", newArray);
    console.log("Email: ", friend.email);

    this.setState({ friendsToInvite: [...newArray]});
  }

  render () {
    console.log(this.state.friendsToInvite);
    renderLog('AddFriendsByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    const atLeastOneValidated = this.state.friendsToInvite.length !== 0 || validatePhoneOrEmail(this.state.friendContactInfo);

    const { loading } = this.state;
    const { classes } = this.props;

    if (loading) {
      return LoadingWheel;
    }

    return (
      <div>
        {this.state.onFriendInvitationsSentStep ? (
          <div className="alert alert-success">
          Invitations sent. Is there anyone else you&apos;d like to invite?
          </div>
        ) : null
        }
        {this.state.emailAddressesError || this.state.senderEmailAddressError ? (
          <div className="alert alert-danger">
            {this.state.errorMessage}
          </div>
        ) : null
        }
        {this.state.friendsToInvite.length !== 0 ? (
          <FriendsDisplay>
            <SectionTitle>Invite List</SectionTitle>
            {this.state.friendsToInvite.map(friend => (
              <FriendBadge>
                <strong>{friend.firstName}</strong>
                {' '}
                {friend.email}
                <Close
                  onClick={this.deleteFriendFromList.bind(this, friend)}
                  className={classes.closeIcon}
                />
              </FriendBadge>
            ))}
          </FriendsDisplay>
        ) : (
          null
        )}
        {this.state.onEnterEmailAddressesStep ? (
          <>
            {this.state.friendsToInvite.length !== 0 ? (
              <SectionTitle>Add Friend</SectionTitle>
            ) : null}
            <FormWrapper>
              <div>
                <form>
                  <Label>Email or Phone Number</Label>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    classes={{ root: classes.textField }}
                    type="text"
                    id="EmailAddress"
                    name="friendContactInfo"
                    value={this.state.friendContactInfo}
                    onChange={this.cacheFriendData.bind(this)}
                    placeholder="For example: name@domain.com"
                  />
                  <div className="row">
                    <div className="col col-6">
                      <Label>
                        First Name
                        {' (optional)'}
                      </Label>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        classes={{ root: classes.textField }}
                        type="text"
                        id="friendFirstName"
                        name="friendFirstName"
                        value={this.state.friendFirstName}
                        onChange={this.cacheFriendData.bind(this)}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="col col-6">
                      <Label>
                        Last Name
                        {' (optional)'}
                      </Label>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        classes={{ root: classes.textField }}
                        type="text"
                        id="friendLastName"
                        name="friendLastName"
                        value={this.state.friendLastName}
                        onChange={this.cacheFriendData.bind(this)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  {atLeastOneValidated ? (
                    <>
                      <Label>Add Personal Message</Label>
                      <span className="small">(Optional)</span>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        classes={{ root: classes.textField }}
                        type="text"
                        id="addFriendsMessage"
                        name="addFriendsMessage"
                        onChange={this.cacheAddFriendsByEmailMessage}
                        fullWidth
                        placeholder="Please join me in preparing for the upcoming election."
                      />
                    </>
                  ) : null
                  }
                  <ButtonContainer>
                    <Button classes={{ root: classes.addButton }} disabled={!this.allEnteredEmailsVerified()} onClick={this.addFriend} color="primary" variant="outlined">
                      Add Another
                    </Button>
                    <Button
                      color="primary"
                      classes={{ root: classes.sendButton }}
                      disabled={
                        // this.state.friendsToInvite.length === 0 ? !this.state.friendContactInfo || !this.allEnteredEmailsVerified ? true : false : false
                        !this.allEnteredEmailsVerified()
                      }
                      id="friendsNextButton"
                      onClick={this.addFriendsByEmailStepsManager}
                      onKeyDown={this.onKeyDown}
                      variant="contained"
                    >
                      { this.hasValidEmail() ?
                        <span>Send &gt;</span> :
                        <span>Next &gt;</span>
                        }
                    </Button>
                  </ButtonContainer>
                </form>
              </div>
              <FriendsAlert>
                These friends will see what you support, oppose, and which opinions you follow.
                We will never sell your email.
              </FriendsAlert>
            </FormWrapper>
          </>
        ) : null
        }

        {this.state.onCollectEmailStep ? (
          <div>
            <Label>Email Address</Label>
            <TextField
              variant="outlined"
              margin="dense"
              classes={{ root: classes.textField }}
              label="Email"
              type="text"
              name="senderEmailAddress"
              className="form-control"
              onChange={this.cacheSenderEmailAddress}
              placeholder="Enter your email address"
            />

            <Button
              color="primary"
              classes={{ root: classes.sendButton }}
              disabled={!this.state.senderEmailAddress || !this.senderEmailAddressVerified()}
              id="friendsSendButton"
              onClick={this.addFriendsByEmailStepsManager}
              onKeyDown={this.onKeyDown}
              tabIndex="0"
              variant="contained"
            >
              <span>Send</span>
            </Button>
            <p>In order to send your message, you will need to verify your email address. We will never sell your email.</p>
          </div>
        ) : null
        }
      </div>
    );
  }
}

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
    marginRight: '12px',
    background: 'white',
    '@media (max-width: 520px)': {
      width: 'calc(50% - 15px)',
    },
  },
  sendButton: {
    display: 'block',
    '@media (max-width: 520px)': {
      width: 'calc(50% - 15px)',
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
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

const FormWrapper = styled.div`
  margin-bottom: 8px;
  padding-top: 16px;
`;

const Label = styled.div`
  margin-bottom: -4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 520px) {
    justify-content: space-between;
  }
`;

const FriendsAlert = styled.p`
  margin-top: 16px;
`;

export default withStyles(styles)(AddFriendsByEmail);
