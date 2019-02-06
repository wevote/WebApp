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

const webAppConfig = require("../../config");

export default class EmailBallotToFriendsModal extends Component {
  static propTypes = {
    ballot_link: PropTypes.string,
    success_message: PropTypes.object,
    senderEmailAddressFromEmailBallotModal: PropTypes.string,
    verification_email_sent: PropTypes.bool,
    ballotEmailWasSent: PropTypes.func.isRequired, // Used to transition from EmailBallotModal when ballot was sent.
  };

  constructor (props) {
    super(props);
    let ballotLinkString = "";
    const { ballot_link: ballotLink, success_message: successMessage } = this.props;
    if (ballotLink) {
      ballotLinkString = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + ballotLink;
    } else {
      ballotLinkString = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/ballot`;
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
      emailAddressArray: [],
      firstNameArray: [],
      lastNameArray: [],
      emailAddressesError: false,
      senderEmailAddress: VoterStore.getVoter().email,
      senderEmailAddressError: false,
      onEnterEmailAddressesStep: true,
      onCollectEmailStep: false,
      successMessage,
      ballot_link: ballotLinkString,
    };
    this.emailAddressArray = [];
    this.sentEmailAddressArray = [];
    this.firstNameArray = [];
    this.lastNameArray = [];
    this.allRowsOpen.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    const { ballotEmailWasSent } = this.props;
    ballotEmailWasSent(undefined, "", false, false);
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      loading: false,
      senderEmailAddress: VoterStore.getVoter().email,
    });
  }

  onFriendStoreChange () {
    const emailBallotDataStep = FriendStore.switchToEmailBallotDataStep();
    // console.log("EmailBallotToFriendsModal, onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
    if (emailBallotDataStep === "on_collect_email_step") {
      // Switch to "onCollectEmailStep"
      this.setState({
        loading: false,
        onEnterEmailAddressesStep: false,
        onCollectEmailStep: true,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  setEmailAddressArray (value) {
    this.sentEmailAddressArray = value.length !== 0 ? value : this.emailAddressArray;
    this.emailAddressArray = value;
  }

  setFirstNameArray (value) {
    this.firstNameArray = value;
  }

  setLastNameArray (value) {
    this.lastNameArray = value;
  }

  addAnotherInvitation = () => {
    const _state = this.state;
    if (!_state.row2Open) this.setState({ row2Open: true });
    else if (!_state.row3Open) this.setState({ row3Open: true });
    else if (!_state.row4Open) this.setState({ row4Open: true });
    else if (!_state.row5Open) this.setState({ row5Open: true });
  }

  cacheSenderEmailAddress = (e) => {
    this.setState({
      senderEmailAddress: e.target.value,
    });
  }

  ballotEmailSendStepsManager = (event) => {
    // This function is called when the form is submitted
    // console.log("Entering function ballotEmailSendStepsManager");
    let errorMessage = "";
    const { onEnterEmailAddressesStep } = this.state;
    if (onEnterEmailAddressesStep) {
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
      if (this.emailAddressArray.length === 0) {
        // console.log("ballotEmailSendStepsManager: this.state.email_add is ", this.state.emailAddressArray);
        emailAddressesError = true;
        errorMessage += "Please enter at least one valid email address.";
      } else {
        // TODO: Steve remove the error suppression on the next line 12/1/18, a temporary hack
        this.emailAddressArray.map((emailAddress) => { // eslint-disable-line array-callback-return
          if (!validateEmail(emailAddress)) {
            emailAddressesError = true;
            errorMessage += `Please enter a valid email address for ${emailAddress}`;
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
        if (this.props.senderEmailAddressFromEmailBallotModal) {
          // console.log("ballotEmailSendStepsManager, NOT hasValidEmail but voter has sent a verification email already");
          this.ballotEmailSend(event);
        } else {
          // console.log("ballotEmailSendStepsManager, NOT hasValidEmail so redirect to verification ");
          this.setState({
            loading: false,
            onEnterEmailAddressesStep: false,
            onCollectEmailStep: true,
          });
        }
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend(event);
      }
    } else if (this.state.onCollectEmailStep) {
      // Validate sender's email addresses
      let senderEmailAddressError = false;
      if (!this.state.senderEmailAddress) {
        senderEmailAddressError = true;
        errorMessage += "Please enter a valid email address for yourself. ";
      } else if (!this.senderEmailAddressVerified()) {
        senderEmailAddressError = true;
        errorMessage += "This is not a valid email address. ";
      }

      if (senderEmailAddressError) {
        this.setState({
          loading: false,
          senderEmailAddressError: true,
          errorMessage,
        });
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend(event);
      }
    }
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.ballotEmailSendStepsManager(event).bind(scope);
    }
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
    let { senderEmailAddress } = this.state;
    let successMessage = "";
    if (this.props.senderEmailAddressFromEmailBallotModal &&
        this.props.senderEmailAddressFromEmailBallotModal !== senderEmailAddress) {
      senderEmailAddress = this.props.senderEmailAddressFromEmailBallotModal;
    }

    if (!this.hasValidEmail() || this.props.verification_email_sent) {
      successMessage = `Success! Verification email has been sent to ${senderEmailAddress
      }. Once you verify your email, this ballot will be automatically sent to your friend's email address(es) ${
        this.sentEmailAddressArray.join(", ")}.`;
    } else {
      successMessage = `Success! This ballot has been sent to the email address(es) ${this.sentEmailAddressArray.join(", ")
      }. Would you like to send this ballot to anyone else?`;
    }

    FriendActions.emailBallotData(this.emailAddressArray, this.firstNameArray,
      this.lastNameArray, "", this.state.emailBallotMessage, this.state.ballot_link,
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
      emailAddressArray: [],
      firstNameArray: [],
      lastNameArray: [],
      emailAddressesError: false,
      senderEmailAddress: "",
      senderEmailAddressError: false,
      onEnterEmailAddressesStep: true,
      onCollectEmailStep: false,
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

  addElementToArray (array, value) {
    array.push(value);
  }

  prepareApiArraysFromForm () {
    const _state = this.state;
    let result;
    const tmpEmailArray = _state.emailAddressArray.slice();
    const tmpFirstNameArray = _state.firstNameArray.slice();
    const tmpLastNameArray = _state.lastNameArray.slice();

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
      emailAddressArray: tmpEmailArray,
      firstNameArray: tmpFirstNameArray,
      lastNameArray: tmpLastNameArray,
    });

    // console.log("prepareApiArraysFromForm: this.emailAddressArray: ", this.emailAddressArray);
    // console.log("prepareApiArraysFromForm: this.firstNameArray: ", this.firstNameArray);
    // console.log("prepareApiArraysFromForm: this.lastNameArray: ", this.lastNameArray);
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
      emailAddressesError, senderEmailAddress, senderEmailAddressError, errorMessage,
      onEnterEmailAddressesStep, onCollectEmailStep, successMessage } = this.state;

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
                {onEnterEmailAddressesStep ? (
                  <div>
                    { successMessage ? (
                      <div className="alert alert-success">
                        {successMessage}
                      </div>
                    ) : null
                    }
                    {emailAddressesError ? (
                      <div className="alert alert-danger">
                        {errorMessage}
                      </div>
                    ) : null
                    }
                    <form onSubmit={this.prepareApiArraysFromForm.bind(this)}>
                      <span>
                        Email a link to this ballot to your friends to help them get prepared to vote.
                        These friends will see what you support or oppose.
                        <br />
                        <br />
                      </span>
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
                                value={friend1EmailAddress}
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
                                value={friend1FirstName}
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
                                value={friend1LastName}
                                onChange={this.cacheFriendData.bind(this)}
                                placeholder="Optional"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      {row2Open ? (
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
                                  value={friend2EmailAddress}
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
                                  value={friend2FirstName}
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
                                  value={friend2LastName}
                                  onChange={this.cacheFriendData.bind(this)}
                                  placeholder="Optional"
                                />
                              </label>
                            </div>
                          </div>
                          <span className="close close-on-right" name="row2Open" aria-label="Close" onClick={this.closeRow2.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      {row3Open ? (
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
                                  value={friend3EmailAddress}
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
                                  value={friend3FirstName}
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
                                  value={friend3LastName}
                                  onChange={this.cacheFriendData.bind(this)}
                                  placeholder="Optional"
                                />
                              </label>
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow3.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      {row4Open ? (
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
                                  value={friend4EmailAddress}
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
                                  value={friend4FirstName}
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
                                  value={friend4LastName}
                                  onChange={this.cacheFriendData.bind(this)}
                                  placeholder="Optional"
                                />
                              </label>
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow4.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div>
                      ) :
                        null}
                      {row5Open ? (
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
                                  value={friend5EmailAddress}
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
                                  value={friend5FirstName}
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
                                  className="form-control"
                                  id="friend5LastName"
                                  name="friend5LastName"
                                  onChange={this.cacheFriendData.bind(this)}
                                  placeholder="Optional"
                                  type="text"
                                  value={friend5LastName}
                                />
                              </label>
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
                              onClick={this.addAnotherInvitation}
                            >
                              <span>+ Add another Friend</span>
                            </Button>
                          )}
                      </div>
                      <div className="text-right">
                        <Button
                          tabIndex="0"
                          onKeyDown={this.onKeyDown}
                          onClick={this.ballotEmailSendStepsManager}
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
                {onCollectEmailStep ? (
                  <div>
                    {senderEmailAddressError ? (
                      <div className="alert alert-danger">
                        {senderEmailAddressError}
                      </div>
                    ) : (
                      <div>
                        <div className="alert alert-warning">
                          Please make sure to check your email and verify your email
                          address. This ballot will be sent to your friends as soon as you verify your email address.
                        </div>
                      </div>
                    )}
                    <form onSubmit={this.ballotEmailSendStepsManager} className="u-stack--md">
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
                          onClick={this.ballotEmailSendStepsManager}
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
