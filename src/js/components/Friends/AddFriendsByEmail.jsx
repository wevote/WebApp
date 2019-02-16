import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import LoadingWheel from '../LoadingWheel';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import validateEmail from '../../utils/email-functions';
import { renderLog } from '../../utils/logging';

export default class AddFriendsByEmail extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      add_friends_message: 'Please join me in preparing for the upcoming election.',
      row2Open: false,
      row3Open: false,
      row4Open: false,
      row5Open: false,
      friendTotal: 5,
      friend1FirstName: '',
      friend1LastName: '',
      friend1EmailAddress: '',
      friend2FirstName: '',
      friend2LastName: '',
      friend2EmailAddress: '',
      friend3FirstName: '',
      friend3LastName: '',
      friend3EmailAddress: '',
      friend4FirstName: '',
      friend4LastName: '',
      friend4EmailAddress: '',
      friend5FirstName: '',
      friend5LastName: '',
      friend5EmailAddress: '',
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

      // if (!this.state.friend1EmailAddress ) {
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

  addAnotherInvitation = () => {
    const _state = this.state;
    if (!_state.row2Open) this.setState({ row2Open: true });
    else if (!_state.row3Open) this.setState({ row3Open: true });
    else if (!_state.row4Open) this.setState({ row4Open: true });
    else if (!_state.row5Open) this.setState({ row5Open: true });
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
    // console.log(`New State => ${event.target.name}: ${event.target.value}`);
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

  closeRow (rowNumber) {
    this.setState({
      [`friend${rowNumber}EmailAddress`]: '',
      [`friend${rowNumber}FirstName`]: '',
      [`friend${rowNumber}LastName`]: '',
      [`row${rowNumber}Open`]: false,
    });
  }

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
      friend1FirstName: '',
      friend1LastName: '',
      friend1EmailAddress: '',
      friend2FirstName: '',
      friend2LastName: '',
      friend2EmailAddress: '',
      friend3FirstName: '',
      friend3LastName: '',
      friend3EmailAddress: '',
      friend4FirstName: '',
      friend4LastName: '',
      friend4EmailAddress: '',
      friend5FirstName: '',
      friend5LastName: '',
      friend5EmailAddress: '',
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

  render () {
    renderLog(__filename);
    const atLeastOneValidated = validateEmail(this.state.friend1EmailAddress) || validateEmail(this.state.friend2EmailAddress) || validateEmail(this.state.friend3EmailAddress) || validateEmail(this.state.friend4EmailAddress) || validateEmail(this.state.friend5EmailAddress);

    const { loading } = this.state;
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
        {this.state.onEnterEmailAddressesStep ? (
          <div>
            <div>
              <form>
                <div className="container-fluid">
                  <div className="row invite-inputs">
                    <div className="form-group col-12 col-sm-12 col-md-6">
                      <div className="input-group">
                        <label htmlFor="friend1EmailAddress">
                          <span className="u-no-break">Email Address</span>
                          <input
                            type="text"
                            id="friend1EmailAddress"
                            name="friend1EmailAddress"
                            className="form-control"
                            value={this.state.friend1EmailAddress}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="For example: name@domain.com"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="form-group col-6 col-sm-6 col-md-3">
                      <div className="input-group">
                        <label htmlFor="friend1FirstName">
                          <span className="u-no-break">First Name</span>
                          <input
                            type="text"
                            id="friend1FirstName"
                            name="friend1FirstName"
                            className="form-control"
                            value={this.state.friend1FirstName}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="form-group col-6 col-sm-6 col-md-3">
                      <div className="input-group">
                        <label htmlFor="friend1LastName">
                          <span className="u-no-break">Last Name</span>
                          <input
                            type="text"
                            id="friend1LastName"
                            name="friend1LastName"
                            className="form-control"
                            value={this.state.friend1LastName}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {this.state.row2Open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <div className="input-group">
                          <label htmlFor="friend2EmailAddress">
                            <span className="u-no-break">Email Address</span>
                            <input
                              type="text"
                              id="friend2EmailAddress"
                              name="friend2EmailAddress"
                              className="form-control"
                              value={this.state.friend2EmailAddress}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="For example: name@domain.com"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend2FirstName">
                            <span className="u-no-break">First Name</span>
                            <input
                              type="text"
                              id="friend2FirstName"
                              name="friend2FirstName"
                              className="form-control"
                              value={this.state.friend2FirstName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend2LastName">
                            <span className="u-no-break">Last Name</span>
                            <input
                              type="text"
                              id="friend2LastName"
                              name="friend2LastName"
                              className="form-control"
                              value={this.state.friend2LastName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="close close-on-right" name="row2Open" aria-label="Close" onClick={this.closeRow.bind(this, 2)}><span aria-hidden="true">&times;</span></span>
                    </div>
                  ) : null
                  }
                  {this.state.row3Open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <div className="input-group">
                          <label htmlFor="friend3EmailAddress">
                            <span className="u-no-break">Email Address</span>
                            <input
                              type="text"
                              id="friend3EmailAddress"
                              name="friend3EmailAddress"
                              className="form-control"
                              value={this.state.friend3EmailAddress}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="For example: name@domain.com"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend3FirstName">
                            <span className="u-no-break">First Name</span>
                            <input
                              type="text"
                              id="friend3FirstName"
                              name="friend3FirstName"
                              className="form-control"
                              value={this.state.friend3FirstName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend3LastName">
                            <span className="u-no-break">Last Name</span>
                            <input
                              type="text"
                              id="friend3LastName"
                              name="friend3LastName"
                              className="form-control"
                              value={this.state.friend3LastName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 3)}>
                        <span aria-hidden="true">&times;</span>
                      </span>
                    </div>
                  ) : null
                  }
                  {this.state.row4Open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <div className="input-group">
                          <label htmlFor="friend4EmailAddress">
                            <span className="u-no-break">Email Address</span>
                            <input
                              type="text"
                              id="friend4EmailAddress"
                              name="friend4EmailAddress"
                              className="form-control"
                              value={this.state.friend4EmailAddress}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="For example: name@domain.com"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend4FirstName">
                            <span className="u-no-break">First Name</span>
                            <input
                              type="text"
                              id="friend4FirstName"
                              name="friend4FirstName"
                              className="form-control"
                              value={this.state.friend4FirstName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend4LastName">
                            <span className="u-no-break">Last Name</span>
                            <input
                              type="text"
                              id="friend4LastName"
                              name="friend4LastName"
                              className="form-control"
                              value={this.state.friend4LastName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 4)}>
                        <span aria-hidden="true">
                          &times;
                        </span>
                      </span>
                    </div>
                  ) : null
                  }
                  {this.state.row5Open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <div className="input-group">
                          <label htmlFor="friend5EmailAddress">
                            <span className="u-no-break">Email Address</span>
                            <input
                              type="text"
                              id="friend5EmailAddress"
                              name="friend5EmailAddress"
                              className="form-control"
                              value={this.state.friend5EmailAddress}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="For example: name@domain.com"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend5FirstName">
                            <span className="u-no-break">First Name</span>
                            <input
                              type="text"
                              id="friend5FirstName"
                              name="friend5FirstName"
                              className="form-control"
                              value={this.state.friend5FirstName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <div className="input-group">
                          <label htmlFor="friend5LastName">
                            <span className="u-no-break">Last Name</span>
                            <input
                              type="text"
                              id="friend5LastName"
                              name="friend5LastName"
                              className="form-control"
                              value={this.state.friend5LastName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 5)}>
                        <span aria-hidden="true">
                          &times;
                        </span>
                      </span>
                    </div>
                  ) : null
                  }
                  <div className="row invite-inputs">
                    {!this.state.friend1EmailAddress || this.allRowsOpen() ?
                      null : (
                        <Button
                          tabIndex="0"
                          onClick={this.addAnotherInvitation}
                        >
                          <span>+ Add another invitation</span>
                        </Button>
                      )}
                  </div>
                </div>

              </form>
            </div>

            <form className="u-stack--md">
              {atLeastOneValidated ? (
                <span>
                  <label htmlFor="addFriendsMessage">
                    Include a Message
                    {' '}
                    <span className="small">(Optional)</span>
                    <input
                      type="text"
                      id="addFriendsMessage"
                      name="addFriendsMessage"
                      className="form-control"
                      onChange={this.cacheAddFriendsByEmailMessage}
                      placeholder="Please join me in preparing for the upcoming election."
                    />
                  </label>
                </span>
              ) : null
              }
            </form>

            <div className="u-gutter__top--small">
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown}
                  onClick={this.addFriendsByEmailStepsManager}
                  variant="primary"
                  disabled={!this.state.friend1EmailAddress || !this.allEnteredEmailsVerified()}
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
              <input
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
                  tabIndex="0"
                  onKeyDown={this.onKeyDown}
                  onClick={this.addFriendsByEmailStepsManager}
                  variant="primary"
                  disabled={!this.state.senderEmailAddress || !this.senderEmailAddressVerified()}
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
