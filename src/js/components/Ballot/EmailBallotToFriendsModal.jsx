import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { deviceTypeString } from "../../utils/cordovaUtils";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";
import validateEmail from "../../utils/email-functions";

const web_app_config = require("../../config");

export default class EmailBallotToFriendsModal extends Component {
  static propTypes = {
    history: PropTypes.object,
    ballot_link: PropTypes.string,
    success_message: PropTypes.object,
    senderEmailAddress_from_email_ballot_modal: PropTypes.string,
    verification_email_sent: PropTypes.bool,
    ballotEmailWasSent: PropTypes.func.isRequired, // Used to transition from EmailBallotModal when ballot was sent.
  };

  constructor (props) {
    super(props);
    let ballotLinkString = "";
    const { ballot_link: ballotLink, success_message: successMessage } = this.props;
    if (ballotLink) {
      ballotLinkString = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + ballotLink;
    } else {
      ballotLinkString = `${web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME}/ballot`;
    }
    this.state = {
      emailBallotMessage: "This is a ballot on We Vote for the upcoming election.",
      voter: VoterStore.getVoter(),
      loading: false,
      row2Open: false,
      row3Open: false,
      row4Open: false,
      row5Open: false,
      friend1FirstName: "",
      friend1LastName: "",
      friend1EmailAddress: "",
      friend2FirstName: "",
      friend2LastName: "",
      friend2EmailAddress: "",
      friend3FirstName: "",
      friend3LastName: "",
      friend3EmailAddress: "",
      friend4FirstName: "",
      friend4LastName: "",
      friend4EmailAddress: "",
      friend5FirstName: "",
      friend5LastName: "",
      friend5EmailAddress: "",
      email_address_array: [],
      first_name_array: [],
      last_name_array: [],
      emailAddressesError: false,
      senderEmailAddress: VoterStore.getVoter().email,
      senderEmailAddress_error: false,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      successMessage,
      ballot_link: ballotLinkString,
    };
    this.email_address_array = [];
    this.sent_email_address_array = [];
    this.first_name_array = [];
    this.last_name_array = [];
    this.allRowsOpen.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    const { ballotEmailWasSent } = this.props;
    ballotEmailWasSent(undefined, "", false, false);
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      loading: false,
      senderEmailAddress: VoterStore.getVoter().email,
    });
  }

  _onFriendStoreChange () {
    const emailBallotDataStep = FriendStore.switchToEmailBallotDataStep();
    // console.log("EmailBallotToFriendsModal, _onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
    if (emailBallotDataStep === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        on_enter_email_addresses_step: false,
        on_collect_email_step: true,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  cacheSenderEmailAddress (e) {
    this.setState({
      senderEmailAddress: e.target.value,
    });
  }

  cacheFriendData (event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  cacheEmailMessage (e) {
    this.setState({
      emailBallotMessage: e.target.value,
    });
  }

  ballotEmailSend (e) {
    e.preventDefault();
    let senderEmailAddress = "";
    let successMessage = "";
    if (this.props.senderEmailAddress_from_email_ballot_modal &&
        this.props.senderEmailAddress_from_email_ballot_modal !== this.state.senderEmailAddress) {
      senderEmailAddress = this.props.senderEmailAddress_from_email_ballot_modal;
    } else {
      senderEmailAddress = this.state.senderEmailAddress;
    }

    if (!this.hasValidEmail() || this.props.verification_email_sent) {
      successMessage = `Success! Verification email has been sent to ${senderEmailAddress
      }. Once you verify your email, this ballot will be automatically sent to your friend's email address(es) ${
        this.sent_email_address_array.join(", ")}.`;
    } else {
      successMessage = `Success! This ballot has been sent to the email address(es) ${this.sent_email_address_array.join(", ")
      }. Would you like to send this ballot to anyone else?`;
    }

    FriendActions.emailBallotData(this.email_address_array, this.first_name_array,
      this.last_name_array, "", this.state.emailBallotMessage, this.state.ballot_link,
      senderEmailAddress, this.props.verification_email_sent, deviceTypeString());

    // After calling the API, reset the form
    this.setState({
      loading: true,
      row2Open: false,
      row3Open: false,
      row4Open: false,
      row5Open: false,
      friend1FirstName: "",
      friend1LastName: "",
      friend1EmailAddress: "",
      friend2FirstName: "",
      friend2LastName: "",
      friend2EmailAddress: "",
      friend3FirstName: "",
      friend3LastName: "",
      friend3EmailAddress: "",
      friend4FirstName: "",
      friend4LastName: "",
      friend4EmailAddress: "",
      friend5FirstName: "",
      friend5LastName: "",
      friend5EmailAddress: "",
      email_address_array: [],
      first_name_array: [],
      last_name_array: [],
      emailAddressesError: false,
      senderEmailAddress: "",
      senderEmailAddress_error: false,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      successMessage,
    });
    this.setEmailAddressArray([]);
    this.setFirstNameArray([]);
    this.setLastNameArray([]);
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return true;
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.ballotEmailSendStepsManager(event).bind(scope);
    }
  }

  ballotEmailSendStepsManager (event) {
    // This function is called when the form is submitted
    // console.log("Entering function ballotEmailSendStepsManager");
    let errorMessage = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      let emailAddressesError = false;

      if (!this.prepareApiArraysFromForm()) {
        // TBD error handling
        // console.log("ballotEmailSendStepsManager, EmailAddresses error");
        this.setState({
          // TBD emailAddressesError set to true
          loading: false,
          emailAddressesError: true,
        });
      }
      if (this.email_address_array.length === 0) {
        // console.log("ballotEmailSendStepsManager: this.state.email_add is ", this.state.email_address_array);
        emailAddressesError = true;
        errorMessage += "Please enter at least one valid email address.";
      } else {
        // TODO: Steve remove the error suppression on the next line 12/1/18, a temporary hack
        this.email_address_array.map((email_address) => { // eslint-disable-line array-callback-return
          if (!validateEmail(email_address)) {
            emailAddressesError = true;
            errorMessage += `Please enter a valid email address for ${email_address}`;
          }
        });
      }

      if (emailAddressesError) {
        // console.log("ballotEmailSendStepsManager, emailAddressesError");
        this.setState({
          loading: false,
          emailAddressesError: true,
          errorMessage,
        });
      } else if (!this.hasValidEmail()) {
        // console.log("ballotEmailSendStepsManager, NOT hasValidEmail");
        if (this.props.senderEmailAddress_from_email_ballot_modal) {
          // console.log("ballotEmailSendStepsManager, NOT hasValidEmail but voter has sent a verification email already");
          this.ballotEmailSend(event);
        } else {
          // console.log("ballotEmailSendStepsManager, NOT hasValidEmail so redirect to verification ");
          this.setState({
            loading: false,
            on_enter_email_addresses_step: false,
            on_collect_email_step: true,
          });
        }
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend(event);
      }
    } else if (this.state.on_collect_email_step) {
      // Validate sender's email addresses
      let senderEmailAddressError = false;
      if ( !this.state.senderEmailAddress ) {
        senderEmailAddressError = true;
        errorMessage += "Please enter a valid email address for yourself. ";
      } else if (!this.senderEmailAddressVerified()) {
        senderEmailAddressError = true;
        errorMessage += "This is not a valid email address. ";
      }

      if (senderEmailAddressError) {
        this.setState({
          loading: false,
          senderEmailAddress_error: true,
          errorMessage,
        });
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend(event);
      }
    }
  }

  addElementToArray (array, value) {
    array.push(value);
  }

  setEmailAddressArray (value) {
    this.sent_email_address_array = value.length !== 0 ? value : this.email_address_array;
    this.email_address_array = value;
  }

  setFirstNameArray (value) {
    this.first_name_array = value;
  }

  setLastNameArray (value) {
    this.last_name_array = value;
  }

  prepareApiArraysFromForm () {
    const _state = this.state;
    let result;
    const tmpEmailArray = _state.email_address_array.slice();
    const tmpFirstNameArray = _state.first_name_array.slice();
    const tmpLastNameArray = _state.last_name_array.slice();

    if (_state.friend1EmailAddress) {
      result = validateEmail(_state.friend1EmailAddress);
      // console.log("prepareApiArraysFromForm", result);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email", _state.friend1EmailAddress);
        this.addElementToArray(tmpEmailArray, _state.friend1EmailAddress);
        this.addElementToArray(tmpFirstNameArray, _state.friend1FirstName);
        this.addElementToArray(tmpLastNameArray, _state.friend1LastName);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address", _state.friend1EmailAddress);
        return false;
      }
    }
    if (_state.friend2EmailAddress) {
      result = validateEmail(_state.friend2EmailAddress);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email for friend2", _state.friend2EmailAddress);
        this.addElementToArray(tmpEmailArray, _state.friend2EmailAddress);
        this.addElementToArray(tmpFirstNameArray, _state.friend2FirstName);
        this.addElementToArray(tmpLastNameArray, _state.friend2LastName);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend2", _state.friend2EmailAddress);
        return false;
      }
    }
    if (_state.friend3EmailAddress) {
      result = validateEmail(_state.friend3EmailAddress);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email for friend3", _state.friend3EmailAddress);
        this.addElementToArray(tmpEmailArray, _state.friend3EmailAddress);
        this.addElementToArray(tmpFirstNameArray, _state.friend3FirstName);
        this.addElementToArray(tmpLastNameArray, _state.friend3LastName);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend3", _state.friend3EmailAddress);
        return false;
      }
    }
    if (_state.friend4EmailAddress) {
      result = validateEmail(_state.friend4EmailAddress);
      if (result) {
        this.addElementToArray(tmpEmailArray, _state.friend4EmailAddress);
        this.addElementToArray(tmpFirstNameArray, _state.friend4FirstName);
        this.addElementToArray(tmpLastNameArray, _state.friend4LastName);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend4", _state.friend4EmailAddress);
        return false;
      }
    }
    if (_state.friend5EmailAddress) {
      result = validateEmail(_state.friend5EmailAddress);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email for friend5", _state.friend5EmailAddress);
        this.addElementToArray(tmpEmailArray, _state.friend5EmailAddress);
        this.addElementToArray(tmpFirstNameArray, _state.friend5FirstName);
        this.addElementToArray(tmpLastNameArray, _state.friend5LastName);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend5", _state.friend5EmailAddress);
        return false;
      }
    }
    this.setEmailAddressArray(tmpEmailArray);
    this.setFirstNameArray(tmpFirstNameArray);
    this.setLastNameArray(tmpLastNameArray);

    this.setState({
      email_address_array: tmpEmailArray,
      first_name_array: tmpFirstNameArray,
      last_name_array: tmpLastNameArray,
    });

    // console.log("prepareApiArraysFromForm: this.email_address_array: ", this.email_address_array);
    // console.log("prepareApiArraysFromForm: this.first_name_array: ", this.first_name_array);
    // console.log("prepareApiArraysFromForm: this.last_name_array: ", this.last_name_array);
    return true;
  }

  closeRow2 () {
    this.setState({ friend2EmailAddress: "" });
    this.setState({ friend2FirstName: "" });
    this.setState({ friend2LastName: "" });
    this.setState({ row2Open: false });
  }

  closeRow3 () {
    this.setState({ friend3EmailAddress: "" });
    this.setState({ friend3FirstName: "" });
    this.setState({ friend3LastName: "" });
    this.setState({ row3Open: false });
  }

  closeRow4 () {
    this.setState({ friend4EmailAddress: "" });
    this.setState({ friend4FirstName: "" });
    this.setState({ friend4LastName: "" });
    this.setState({ row4Open: false });
  }

  closeRow5 () {
    this.setState({ friend5EmailAddress: "" });
    this.setState({ friend5FirstName: "" });
    this.setState({ friend5LastName: "" });
    this.setState({ row5Open: false });
  }

  addAnotherInvitation () {
    const _state = this.state;
    if (!_state.row2Open) this.setState({ row2Open: true });
    else if (!_state.row3Open) this.setState({ row3Open: true });
    else if (!_state.row4Open) this.setState({ row4Open: true });
    else if (!_state.row5Open) this.setState({ row5Open: true });
  }

  allRowsOpen () {
    const { row2Open, row3Open, row4Open, row5Open } = this.state;
    return row2Open && row3Open && row4Open && row5Open;
  }

  render () {
    renderLog(__filename);
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const floatRight = { float: "right" };
    const textGray = { color: "gray" };
    const {
      row2Open, row3Open, row4Open, row5Open,
      friend1FirstName, friend1LastName, friend1EmailAddress,
      friend2FirstName, friend2LastName, friend2EmailAddress,
      friend3FirstName, friend3LastName, friend3EmailAddress,
      friend4FirstName, friend4LastName, friend4EmailAddress,
      friend5FirstName, friend5LastName, friend5EmailAddress,
      emailAddressesError, senderEmailAddress, senderEmailAddress_error, error_message,
      on_enter_email_addresses_step, on_collect_email_step, successMessage } = this.state;

    return (
      <div className="share-modal">
        <div className="intro-modal__h1">
        Send This Ballot to Friends
        </div>

        <div className="share-modal-vertical-scroll-contain">
          <div className="intro-modal-vertical-scroll card">
            {/* <div className="row intro-modal__grid intro-modal__default-text"> */}
            <div className="share-modal__default-text">
              <div className="container-fluid u-inset--md text-left">
                {on_enter_email_addresses_step ? (
                  <div>
                    { successMessage ? (
                      <div className="alert alert-success">
                        {successMessage}
                      </div>
                    ) : null
                    }
                    {emailAddressesError ? (
                      <div className="alert alert-danger">
                        {error_message}
                      </div>
                    ) : null
                    }
                    <form onSubmit={this.prepareApiArraysFromForm.bind(this)}>
                      <span>
                        Email a link to this ballot to your friends to help them get prepared to vote.
                        These friends will see what you support or oppose.
                        <br />&nbsp;
                        <br />
                      </span>
                      <div className="row invite-inputs">
                        <div className="form-group col-12 col-sm-12 col-md-6">
                          <label>Email Address</label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="friend1EmailAddress"
                              className="form-control"
                              value={friend1EmailAddress}
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
                              name="friend1FirstName"
                              className="form-control"
                              value={friend1FirstName}
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
                              name="friend1LastName"
                              className="form-control"
                              value={friend1LastName}
                              onChange={this.cacheFriendData.bind(this)}
                              placeholder="Optional"
                            />
                          </div>
                        </div>
                      </div>
                      {row2Open ? (
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input
                                type="text"
                                name="friend2EmailAddress"
                                className="form-control"
                                value={friend2EmailAddress}
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
                                name="friend2FirstName"
                                className="form-control"
                                value={friend2FirstName}
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
                                name="friend2LastName"
                                className="form-control"
                                value={friend2LastName}
                                onChange={this.cacheFriendData.bind(this)}
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                          <span className="close close-on-right" name="row2Open" aria-label="Close" onClick={this.closeRow2.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      {row3Open ? (
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input
                                type="text"
                                name="friend3EmailAddress"
                                className="form-control"
                                value={friend3EmailAddress}
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
                                name="friend3FirstName"
                                className="form-control"
                                value={friend3FirstName}
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
                                name="friend3LastName"
                                className="form-control"
                                value={friend3LastName}
                                onChange={this.cacheFriendData.bind(this)}
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow3.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      {row4Open ? (
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input
                                type="text"
                                name="friend4EmailAddress"
                                className="form-control"
                                value={friend4EmailAddress}
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
                                name="friend4FirstName"
                                className="form-control"
                                value={friend4FirstName}
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
                                name="friend4LastName"
                                className="form-control"
                                value={friend4LastName}
                                onChange={this.cacheFriendData.bind(this)}
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow4.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      {row5Open ? (
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input
                                type="text"
                                name="friend5EmailAddress"
                                className="form-control"
                                value={friend5EmailAddress}
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
                                name="friend5FirstName"
                                className="form-control"
                                value={friend5FirstName}
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
                                name="friend5LastName"
                                className="form-control"
                                value={friend5LastName}
                                onChange={this.cacheFriendData.bind(this)}
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow5.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      <div>
                        {!friend1EmailAddress || this.allRowsOpen() ?
                          null : (
                            <Button
                              tabIndex="0"
                              onClick={this.addAnotherInvitation.bind(this)}
                            >
                              <span>+ Add another Friend</span>
                            </Button>
                          )}
                      </div>
                      <div className="text-right">
                        <Button
                          tabIndex="0"
                          onKeyDown={this.onKeyDown.bind(this)}
                          onClick={this.ballotEmailSendStepsManager.bind(this)}
                          variant="success"
                        >
                          { this.hasValidEmail() ?
                            <span>Send &gt;</span> :
                            <span>Next &gt;</span>
                          }
                        </Button>
                      </div>
                    </form>
                    <div className="text-center">
                      <span style={textGray}>We will never sell your email.</span>
                    </div>
                  </div>
                ) : null
                }
                {on_collect_email_step ? (
                  <div>
                    {senderEmailAddress_error ? (
                      <div className="alert alert-danger">
                        {senderEmailAddress_error}
                      </div>
                    ) : (
                      <div>
                        <div className="alert alert-warning">
                          Please make sure to check your email and verify your email
                          address. This ballot will be sent to your friends as soon as you verify your email address.
                        </div>
                      </div>
                    )}
                    <form onSubmit={this.ballotEmailSendStepsManager.bind(this)} className="u-stack--md">
                      <input
                        type="text"
                        name="senderEmailAddress"
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
                          onClick={this.ballotEmailSendStepsManager.bind(this)}
                          variant="primary"
                          disabled={!senderEmailAddress}
                        >
                          <span>Send</span>
                        </Button>
                        <div className="col-12 u-inset--md" />
                      </span>
                    </div>
                  </div>
                ) : null
              }
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}
