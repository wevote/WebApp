import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";
import validateEmail from "../../utils/email-functions";
import { renderLog } from "../../utils/logging";

export default class AddFriendsByEmail extends Component {
  static propTypes = {
    success_message: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      add_friends_message: "Please join me in preparing for the upcoming election.",
      row2_open: false,
      row3_open: false,
      row4_open: false,
      row5_open: false,
      friend_total: 5,
      friend1_first_name: "",
      friend1_last_name: "",
      friend1_email_address: "",
      friend2_first_name: "",
      friend2_last_name: "",
      friend2_email_address: "",
      friend3_first_name: "",
      friend3_last_name: "",
      friend3_email_address: "",
      friend4_first_name: "",
      friend4_last_name: "",
      friend4_email_address: "",
      friend5_first_name: "",
      friend5_last_name: "",
      friend5_email_address: "",
      email_addresses_error: false,
      sender_email_address: "",
      sender_email_address_error: false,
      redirect_url_upon_save: "/friends/sign_in", // TODO DALE Remove this?
      loading: false,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_friend_invitations_sent_step: false,
      voter: {},
    };
    this.allRowsOpen.bind(this);
  }

  // componentDidUpdate () {
  //
  // }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByEmailStepsManager(event).bind(scope);
    }
  }

  _onFriendStoreChange () {
    const addFriendsByEmailStep = FriendStore.switchToAddFriendsByEmailStep();
    const errorMessageToShowVoter = FriendStore.getErrorMessageToShowVoter();
    // console.log("AddFriendsByEmail, _onFriendStoreChange, addFriendsByEmailStep:", addFriendsByEmailStep);
    if (addFriendsByEmailStep === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        on_enter_email_addresses_step: false,
        on_collect_email_step: true,
        on_friend_invitations_sent_step: false,
        errorMessageToShowVoter,
      });
      // FriendStore.clearErrorMessageToShowVoter()
    } else {
      this.setState({
        loading: false,
        errorMessageToShowVoter: "",
      });
    }
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  _ballotLoaded () {
    // TODO DALE Remove this?
    historyPush(this.state.redirect_url_upon_save);
  }

  cacheSenderEmailAddress (e) {
    this.setState({
      sender_email_address: e.target.value,
    });
  }

  cacheAddFriendsByEmailMessage (e) {
    this.setState({
      add_friends_message: e.target.value,
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
    for (let friendIdx = 1; friendIdx <= this.state.friend_total; friendIdx++) {
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
      lastNameArray, "", this.state.add_friends_message,
      this.state.sender_email_address);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      row2_open: false,
      row3_open: false,
      row4_open: false,
      row5_open: false,
      friend1_first_name: "",
      friend1_last_name: "",
      friend1_email_address: "",
      friend2_first_name: "",
      friend2_last_name: "",
      friend2_email_address: "",
      friend3_first_name: "",
      friend3_last_name: "",
      friend3_email_address: "",
      friend4_first_name: "",
      friend4_last_name: "",
      friend4_email_address: "",
      friend5_first_name: "",
      friend5_last_name: "",
      friend5_email_address: "",
      email_addresses_error: false,
      sender_email_address: "",
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_friend_invitations_sent_step: true,
    });
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return validateEmail(this.state.sender_email_address);
  }

  AddFriendsByEmailStepsManager (event) {
    // This function is called when the next button is  submitted;
    // this funtion is called twice per cycle
    // console.log("Entering function AddFriendsByEmailStepsManager");
    const errorMessage = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      const email_addresses_error = false;

      // Error message logic on submit disabled in favor of disabling buttons

      // if (!this.state.friend1_email_address ) {
      //   // console.log("AddFriendsByEmailStepsManager: this.state.email_add is ");
      //   email_addresses_error = true;
      //   errorMessage += "Please enter at least one valid email address.";
      // } else {
      //   //custom error message for each invalid email
      //   for (let friendIdx = 1; friendIdx <= this.state.friend_total; friendIdx++) {
      //     if (this.state[`friend${friendIdx}_email_address`] && !validateEmail(this.state[`friend${friendIdx}_email_address`])) {
      //       email_addresses_error = true;
      //       errorMessage += `Please enter a valid email address for ${this.state[`friend${friendIdx}_email_address`]}`;
      //     }
      //   }
      // }

      if (email_addresses_error) {
        // console.log("AddFriendsByEmailStepsManager, email_addresses_error");
        this.setState({
          loading: false,
          email_addresses_error: true,
          errorMessage,
        });
      } else if (!this.hasValidEmail()) {
        // console.log("AddFriendsByEmailStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          on_enter_email_addresses_step: false,
          on_collect_email_step: true,
        });
      } else {
        // console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    } else if (this.state.on_collect_email_step) {
      // Validate sender's email addresses
      const sender_email_address_error = false;

      if (sender_email_address_error) {
        this.setState({
          loading: false,
          sender_email_address_error: true,
          errorMessage,
        });
      } else {
        // console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    }
  }

  cacheFriendData (event) {
    this.setState({ [event.target.name]: event.target.value });
    // console.log(`New State => ${event.target.name}: ${event.target.value}`);
  }

  AllEnteredEmailsVerified () {
    const _state = this.state;
    let result;

    for (let friendIdx = 1; friendIdx <= this.state.friend_total; friendIdx++) {
      if (_state[`friend${friendIdx}_email_address`]) {
        result = validateEmail(_state[`friend${friendIdx}_email_address`]);
        if (result) {
          // console.log(`AllEnteredEmailsVerified: validated email for friend${friendIdx}`, _state[`friend${friendIdx}_email_address`]);
        } else {
          // console.log(`AllEnteredEmailsVerified: invalid email address for friend${friendIdx}`, _state[`friend${friendIdx}_email_address`]);
          return false;
        }
      }
    }
    return true;
  }

  closeRow (rowNumber) {
    this.setState({
      [`friend${rowNumber}_email_address`]: "",
      [`friend${rowNumber}_first_name`]: "",
      [`friend${rowNumber}_last_name`]: "",
      [`row${rowNumber}_open`]: false,
    });
  }

  addAnotherInvitation () {
    const _state = this.state;
    if (!_state.row2_open) this.setState({ row2_open: true });
    else if (!_state.row3_open) this.setState({ row3_open: true });
    else if (!_state.row4_open) this.setState({ row4_open: true });
    else if (!_state.row5_open) this.setState({ row5_open: true });
  }

  allRowsOpen () {
    return this.state.row2_open && this.state.row3_open && this.state.row4_open && this.state.row5_open;
  }

  render () {
    renderLog(__filename);
    const atLeastOneValidated = validateEmail(this.state.friend1_email_address) || validateEmail(this.state.friend2_email_address) || validateEmail(this.state.friend3_email_address) || validateEmail(this.state.friend4_email_address) || validateEmail(this.state.friend5_email_address);

    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }
    const floatRight = {
      float: "right",
    };

    return (
      <div>
        {this.state.on_friend_invitations_sent_step ? (
          <div className="alert alert-success">
          Invitations sent. Is there anyone else you&apos;d like to invite?
          </div>
        ) : null
        }
        {this.state.email_addresses_error || this.state.sender_email_address_error ? (
          <div className="alert alert-danger">
            {this.state.errorMessage}
          </div>
        ) : null
        }
        {this.state.on_enter_email_addresses_step ? (
          <div>
            <div>
              <form>
                <div className="container-fluid">
                  <div className="row invite-inputs">
                    <div className="form-group col-12 col-sm-12 col-md-6">
                      <label>Email Address</label>
                      <div className="input-group">
                        <input
                          type="text"
                          name="friend1_email_address"
                          className="form-control"
                          value={this.state.friend1_email_address}
                          onChange={this.cacheFriendData.bind(this)}
                          placeholder="For example: name@domain.com"
                        />
                      </div>
                    </div>
                    <div className="form-group col-6 col-sm-6 col-md-3">
                      <label>First Name</label>
                      <div className="input-group">
                        <input
                          type="text"
                          name="friend1_first_name"
                          className="form-control"
                          value={this.state.friend1_first_name}
                          onChange={this.cacheFriendData.bind(this)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div className="form-group col-6 col-sm-6 col-md-3">
                      <label>Last Name</label>
                      <div className="input-group">
                        <input
                          type="text"
                          name="friend1_last_name"
                          className="form-control"
                          value={this.state.friend1_last_name}
                          onChange={this.cacheFriendData.bind(this)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                  {this.state.row2_open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <label>Email Address</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend2_email_address"
                            className="form-control"
                            value={this.state.friend2_email_address}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="For example: name@domain.com"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>First Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend2_first_name"
                            className="form-control"
                            value={this.state.friend2_first_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>Last Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend2_last_name"
                            className="form-control"
                            value={this.state.friend2_last_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <span className="close close-on-right" name="row2_open" aria-label="Close" onClick={this.closeRow.bind(this, 2)}><span aria-hidden="true">&times;</span></span>
                    </div>
                  ) : null
                  }
                  {this.state.row3_open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <label>Email Address</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend3_email_address"
                            className="form-control"
                            value={this.state.friend3_email_address}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="For example: name@domain.com"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>First Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend3_first_name"
                            className="form-control"
                            value={this.state.friend3_first_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>Last Name</label>
                        <div className="input-group">
                          <input
                          type="text"
                            name="friend3_last_name"
                            className="form-control"
                            value={this.state.friend3_last_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 3)}>
                        <span aria-hidden="true">&times;</span>
                      </span>
                    </div>
                  ) : null
                  }
                  {this.state.row4_open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <label>Email Address</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend4_email_address"
                            className="form-control"
                            value={this.state.friend4_email_address}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="For example: name@domain.com"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>First Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend4_first_name"
                            className="form-control"
                            value={this.state.friend4_first_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>Last Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend4_last_name"
                            className="form-control"
                            value={this.state.friend4_last_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
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
                  {this.state.row5_open ? (
                    <div className="row invite-inputs">
                      <div className="form-group col-12 col-sm-12 col-md-6">
                        <label>Email Address</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend5_email_address"
                            className="form-control"
                            value={this.state.friend5_email_address}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="For example: name@domain.com"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>First Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend5_first_name"
                            className="form-control"
                            value={this.state.friend5_first_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-sm-6 col-md-3">
                        <label>Last Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="friend5_last_name"
                            className="form-control"
                            value={this.state.friend5_last_name}
                            onChange={this.cacheFriendData.bind(this)}
                            placeholder="Optional"
                          />
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
                    {!this.state.friend1_email_address || this.allRowsOpen() ?
                      null : (
                        <Button
                          tabIndex="0"
                          onClick={this.addAnotherInvitation.bind(this)}
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
                  <label htmlFor="last-name">
                  Include a Message
                    <span className="small">(Optional)</span>
                  </label>
                  <br />
                  <input
                    type="text"
                    name="add_friends_message"
                    className="form-control"
                    onChange={this.cacheAddFriendsByEmailMessage.bind(this)}
                    placeholder="Please join me in preparing for the upcoming election."
                  />
                </span>
              ) : null
              }
            </form>

            <div className="u-gutter__top--small">
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown.bind(this)}
                  onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                  variant="primary"
                  disabled={!this.state.friend1_email_address || !this.AllEnteredEmailsVerified()}
                >
                  { this.hasValidEmail() ?
                    <span>Send &gt;</span> :
                    <span>Next &gt;</span>
                    }
                </Button>
              </span>
              <span>
                These friends will see what you support, oppose, and which opinions you listen to.
                We will never sell your email.
              </span>
            </div>
          </div>
        ) : null
        }

        {this.state.on_collect_email_step ? (
          <div>
            <form className="u-stack--md">
              <input
                type="text"
                name="sender_email_address"
                className="form-control"
                onChange={this.cacheSenderEmailAddress.bind(this)}
                placeholder="Enter your email address"
              />
            </form>

            <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown.bind(this)}
                  onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                  variant="primary"
                  disabled={!this.state.sender_email_address || !this.senderEmailAddressVerified()}
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
