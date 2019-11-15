import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { TextField, withStyles } from '@material-ui/core';
import LoadingWheel from '../LoadingWheel';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import validateEmail from '../../utils/email-functions';
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
      friendEmailAddress: '',
      emailAddressesError: false,
      senderEmailAddress: '',
      senderEmailAddressError: false,
      loading: false,
      onEnterEmailAddressesStep: true,
      onCollectEmailStep: false,
      onFriendInvitationsSentStep: false,
      voter: {},
    };
    this.allRowsOpen.bind(this);
    this.addFriend = this.addFriend.bind(this);
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
    // console.log("Entering function addFriendsByEmailStepsManager");
    const errorMessage = '';

    if (this.state.onEnterEmailAddressesStep) {
      // Validate friends' email addresses
      const emailAddressesError = false;

      // Error message logic on submit disabled in favor of disabling buttons

      // if (!this.state.friendEmailAddress ) {
      //   // console.log("addFriendsByEmailStepsManager: this.state.email_add is ");
      //   emailAddressesError = true;
      //   errorMessage += "Please enter at least one valid email address.";
      // } else {
      //   //custom error message for each invalid email
      //   for (let friendIdx = 1; friendIdx <= this.state.friendTotal; friendIdx++) {
      //     if (this.state[`friend${friendIdx}_email_address`] && !validateEmail(this.state[`friend${friendIdx}_email_address`])) {
      //       emailAddressesError = true;
      //       errorMessage += `Please enter a valid email address for ${this.state[`friend${friendIdx}_email_address`]}`;
      //     }
      //   }
      // }

      if (emailAddressesError) {
        // console.log("addFriendsByEmailStepsManager, emailAddressesError");
        this.setState({
          loading: false,
          emailAddressesError: true,
          errorMessage,
        });
      } else if (!this.hasValidEmail()) {
        // console.log("addFriendsByEmailStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          onEnterEmailAddressesStep: false,
          onCollectEmailStep: true,
        });
      } else {
        // console.log("addFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
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
    return validateEmail(this.state.senderEmailAddress);
  }

  cacheFriendData (event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  allEnteredEmailsVerified () {
    const _state = this.state;
    let result;

    for (let friendIdx = 1; friendIdx <= this.state.friendTotal; friendIdx++) {
      if (_state[`friend${friendIdx}_email_address`]) {
        result = validateEmail(_state[`friend${friendIdx}_email_address`]);
        if (result) {
          // console.log(`allEnteredEmailsVerified: validated email for friend${friendIdx}`, _state[`friend${friendIdx}_email_address`]);
        } else {
          // console.log(`allEnteredEmailsVerified: invalid email address for friend${friendIdx}`, _state[`friend${friendIdx}_email_address`]);
          return false;
        }
      }
    }
    return true;
  }

  // closeRow (rowNumber) {
  //   this.setState({
  //     [`friend${rowNumber}EmailAddress`]: '',
  //     [`friend${rowNumber}FirstName`]: '',
  //     [`friend${rowNumber}LastName`]: '',
  //     [`row${rowNumber}Open`]: false,
  //   });
  // }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    // console.log("friendInvitationByEmailSend);
    const _state = this.state;
    const emailAddressArray = [];
    const firstNameArray = [];
    const lastNameArray = [];
    // create temporary arrays so friendInvitationByEmailSend can work
    for (let friendIdx = 1; friendIdx <= this.state.friendTotal; friendIdx++) {
      if (validateEmail(_state[`friend${friendIdx}_email_address`])) {
        emailAddressArray.push(_state[`friend${friendIdx}_email_address`]);
        firstNameArray.push(_state[`friend${friendIdx}_first_name`]);
        lastNameArray.push(_state[`friend${friendIdx}_last_name`]);
      }
    }
    // console.log("emailAddressArray: ", emailAddressArray);
    // console.log("firstNameArray: ", firstNameArray);
    // console.log("lastNameArray: ", lastNameArray);
    FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray,
      lastNameArray, '', this.state.add_friends_message,
      this.state.senderEmailAddress);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      row2Open: false,
      row3Open: false,
      row4Open: false,
      row5Open: false,
      friendFirstName: '',
      friendLastName: '',
      friendEmailAddress: '',
      emailAddressesError: false,
      senderEmailAddress: '',
      onEnterEmailAddressesStep: true,
      onCollectEmailStep: false,
      onFriendInvitationsSentStep: true,
    });
  }

  allRowsOpen () {
    return this.state.row2Open && this.state.row3Open && this.state.row4Open && this.state.row5Open;
  }

  addFriend () {
    const { friendFirstName, friendEmailAddress, friendLastName, friendsToInvite } = this.state;

    if (validateEmail(friendEmailAddress)) {
      const newArray = [...friendsToInvite];

      const newFriendObject = {
        firstName: friendFirstName,
        lastName: friendLastName,
        email: friendEmailAddress,
      };

      newArray.push(newFriendObject);

      this.setState({ friendsToInvite: [...newArray]});
    }
  }

  render () {
    console.log(this.state.friendsToInvite);
    renderLog('AddFriendsByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    const atLeastOneValidated = validateEmail(this.state.friendEmailAddress);

    const { loading } = this.state;
    const { classes } = this.props;

    if (loading) {
      return LoadingWheel;
    }
    const floatRight = {
      float: 'right',
    };

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
        {this.state.friendsToInvite !== [] ? (
          <div>
            {this.state.friendsToInvite.map(friend => (
              <div>
                NAME:
                {' '}
                {friend.firstName}
              </div>
            ))}
          </div>
        ) : (
          null
        )}
        {this.state.onEnterEmailAddressesStep ? (
          <div>
            <div>
              <form>
                <Label>Email Address</Label>
                <TextField
                  variant="outlined"
                  margin="dense"
                  classes={{ root: classes.textField }}
                  type="text"
                  id="EmailAddress"
                  name="friendEmailAddress"
                  className="form-control"
                  value={this.state.friendEmailAddress}
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
                <Button onClick={this.addFriend} color="primary" variant="contained">
                  + Friend
                </Button>
              </form>
            </div>

            <form className="u-stack--md">
              {atLeastOneValidated ? (
                <>
                  <Label>Include a Message</Label>
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
            </form>

            <div className="u-gutter__top--small">
              <span style={floatRight}>
                <Button
                  color="primary"
                  disabled={!this.state.friendEmailAddress || !this.allEnteredEmailsVerified()}
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
              </span>
              <span>
                These friends will see what you support, oppose, and which opinions you follow.
                We will never sell your email.
              </span>
            </div>
          </div>
        ) : null
        }

        {this.state.onCollectEmailStep ? (
          <div>
            <form className="u-stack--md">
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
            </form>

            <div>
              <span style={floatRight}>
                <Button
                  color="primary"
                  disabled={!this.state.senderEmailAddress || !this.senderEmailAddressVerified()}
                  id="friendsSendButton"
                  onClick={this.addFriendsByEmailStepsManager}
                  onKeyDown={this.onKeyDown}
                  tabIndex="0"
                  variant="contained"
                >
                  <span>Send</span>
                </Button>
              </span>
              <p>In order to send your message, you will need to verify your email address. We will never sell your email.</p>
            </div>
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
  },
});

const Label = styled.div`
  margin-bottom: -4px;
`;

export default withStyles(styles)(AddFriendsByEmail);
