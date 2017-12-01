import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../LoadingWheel";
import VoterStore from "../../stores/VoterStore";
import { validateEmail } from "../../utils/email-functions";

const NEXT_BUTTON_TEXT = "Next >";

export default class EmailBallotToFriendsModal extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func,
    ballot_link: PropTypes.string,
    success_message: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      email_ballot_message: "This is WeVote Ballot data for the upcoming election.",
      voter: VoterStore.getVoter(),
      loading: false,
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
      email_address_array: [],
      first_name_array: [],
      last_name_array: [],
      email_addresses_error: false,
      sender_email_address: VoterStore.getVoter().email,
      sender_email_address_error: false,
      next_button_text: NEXT_BUTTON_TEXT,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_ballot_email_sent_step: false,
      success_message: this.props.success_message,
    };
    this.email_address_array = "";
    this.first_name_array = "";
    this.last_name_array = "";
    this.allRowsOpen.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    // this.onNext = this.onNext.bind(this);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      loading: false,
      sender_email_address: VoterStore.getVoter().email,
    });
  }

  _onFriendStoreChange () {
    let email_ballot_data_step = FriendStore.switchToEmailBallotDataStep();
    let error_message_to_show_voter = FriendStore.getErrorMessageToShowVoter();
    // console.log("EmailBallotToFriendsModal, _onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
    if (email_ballot_data_step === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        on_enter_email_addresses_step: false,
        on_collect_email_step: true,
        on_ballot_email_sent_step: false,
        error_message_to_show_voter: error_message_to_show_voter
      });
    } else {
      this.setState({
        loading: false,
        error_message_to_show_voter: ""
      });

    }
  }

  cacheSenderEmailAddress (e) {
    this.setState({
      sender_email_address: e.target.value,
    });
  }

  cacheFriendData (event) {
    this.setState({[event.target.name]: event.target.value});
  }

  cacheEmailMessage (e) {
    this.setState({
      email_ballot_message: e.target.value
    });
  }

  ballotEmailSend (e) {
    e.preventDefault();
    FriendActions.emailBallotData(this.email_address_array, this.first_name_array,
      this.last_name_array, "", this.state.email_ballot_message, this.props.ballot_link,
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
      email_address_array: [],
      first_name_array: [],
      last_name_array: [],
      email_addresses_error: false,
      sender_email_address: "",
      sender_email_address_error: false,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_ballot_email_sent_step: true,
      success_message: "",
    });
    this.setEmailAddressArray("");
    this.setFirstNameArray("");
    this.setLastNameArray("");
  }

  hasValidEmail () {
    let { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return true;
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByEmailStepsManager(event).bind(scope);
    }
  }

  ballotEmailSendStepsManager (event) {
    // This function is called when the form is submitted
    // console.log("Entering function ballotEmailSendStepsManager");
    let error_message = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      let email_addresses_error = false;

      if (!this.prepareApiArraysFromForm()) {
        //TBD error handling
        // console.log("ballotEmailSendStepsManager, EmailAddresses error");
        this.setState({
          //TBD email_addresses_error set to true
          loading: false,
          email_addresses_error: true,
        });
      }
      if (!this.state.email_address_array) {
        // console.log("ballotEmailSendStepsManager: this.state.email_add is ", this.state.email_address_array);
        email_addresses_error = true;
        error_message += "Please enter at least one email address.";
      }

      if (email_addresses_error) {
        // console.log("ballotEmailSendStepsManager, email_addresses_error");
        this.setState({
          loading: false,
          email_addresses_error: true,
          error_message: error_message
        });
      } else if (!this.hasValidEmail()) {
        console.log("ballotEmailSendStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          on_enter_email_addresses_step: false,
          on_collect_email_step: true,
        });
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend(event);
      }
    } else if (this.state.on_collect_email_step) {
      // Validate sender's email addresses
      let sender_email_address_error = false;
      if (!this.state.email_address_array) {
        sender_email_address_error = true;
        error_message += "Please enter a valid email address for yourself. ";
      } else if (!this.senderEmailAddressVerified()) {
        sender_email_address_error = true;
        error_message += "This is not a valid email address. ";
      }

      if (sender_email_address_error) {
        this.setState({
          loading: false,
          sender_email_address_error: true,
          error_message: error_message
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
    this.email_address_array = value;
  }

  setFirstNameArray (value) {
    this.first_name_array = value;
  }

  setLastNameArray (value) {
    this.last_name_array = value;
  }

  prepareApiArraysFromForm () {
    var _state = this.state;
    var result;
    var tmpEmailArray = _state.email_address_array.slice();
    var tmpFirstNameArray = _state.first_name_array.slice();
    var tmpLastNameArray = _state.last_name_array.slice();

    if (_state.friend1_email_address) {
      result = validateEmail(_state.friend1_email_address);
      // console.log("prepareApiArraysFromForm", result);
      if (result) {
        //console.log("prepareApiArraysFromForm: validated email", _state.friend1_email_address);
        this.addElementToArray(tmpEmailArray, _state.friend1_email_address);
        this.addElementToArray(tmpFirstNameArray, _state.friend1_first_name);
        this.addElementToArray(tmpLastNameArray, _state.friend1_last_name);
      } else {
        //console.log("prepareApiArraysFromForm: invalid email address", _state.friend1_email_address);
        return false;
      }
    }
    if (_state.friend2_email_address) {
      result = validateEmail(_state.friend2_email_address);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email for friend2", _state.friend2_email_address);
        this.addElementToArray(tmpEmailArray, _state.friend2_email_address);
        this.addElementToArray(tmpFirstNameArray, _state.friend2_first_name);
        this.addElementToArray(tmpLastNameArray, _state.friend2_last_name);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend2", _state.friend2_email_address);
        return false;
      }
    }
    if (_state.friend3_email_address) {
      result = validateEmail(_state.friend3_email_address);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email for friend3", _state.friend3_email_address);
        this.addElementToArray(tmpEmailArray, _state.friend3_email_address);
        this.addElementToArray(tmpFirstNameArray, _state.friend3_first_name);
        this.addElementToArray(tmpLastNameArray, _state.friend3_last_name);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend3", _state.friend3_email_address);
        return false;
      }
    }
    if (_state.friend4_email_address) {
      result = validateEmail(_state.friend4_email_address);
      if (result) {
        this.addElementToArray(tmpEmailArray, _state.friend4_email_address);
        this.addElementToArray(tmpFirstNameArray, _state.friend4_first_name);
        this.addElementToArray(tmpLastNameArray, _state.friend4_last_name);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend4", _state.friend4_email_address);
        return false;
      }
    }
    if (_state.friend5_email_address) {
      result = validateEmail(_state.friend5_email_address);
      if (result) {
        // console.log("prepareApiArraysFromForm: validated email for friend5", _state.friend5_email_address);
        this.addElementToArray(tmpEmailArray, _state.friend5_email_address);
        this.addElementToArray(tmpFirstNameArray, _state.friend5_first_name);
        this.addElementToArray(tmpLastNameArray, _state.friend5_last_name);
      } else {
        // console.log("prepareApiArraysFromForm: invalid email address for friend5", _state.friend5_email_address);
        return false;
      }
    }

    this.setEmailAddressArray(_state.email_address_array.concat(tmpEmailArray));
    this.setFirstNameArray(_state.first_name_array.concat(tmpFirstNameArray));
    this.setLastNameArray(_state.last_name_array.concat(tmpLastNameArray));

    // console.log("prepareApiArraysFromForm: this.email_address_array: ", this.email_address_array);
    // console.log("prepareApiArraysFromForm: this.first_name_array: ", this.first_name_array);
    // console.log("prepareApiArraysFromForm: this.last_name_array: ", this.last_name_array);
    return true;
  }

  closeRow2 () {
    this.setState({ friend2_email_address: ""});
    this.setState({ friend2_first_name: ""});
    this.setState({ friend2_last_name: ""});
    this.setState({ row2_open: false});
  }

  closeRow3 () {
    this.setState({ friend3_email_address: ""});
    this.setState({ friend3_first_name: ""});
    this.setState({ friend3_last_name: ""});
    this.setState({ row3_open: false});
  }

  closeRow4 () {
    this.setState({ friend4_email_address: ""});
    this.setState({ friend4_first_name: ""});
    this.setState({ friend4_last_name: ""});
    this.setState({ row4_open: false});
  }

  closeRow5 () {
    this.setState({ friend5_email_address: ""});
    this.setState({ friend5_first_name: ""});
    this.setState({ friend5_last_name: ""});
    this.setState({ row5_open: false});
  }

  addAnotherInvitation () {
    var _state = this.state;
    if (!_state.row2_open)
      this.setState({ row2_open: true});
    else if (!_state.row3_open)
      this.setState({ row3_open: true});
    else if (!_state.row4_open)
      this.setState({ row4_open: true});
    else if (!_state.row5_open)
      this.setState({ row5_open: true});
  }

  allRowsOpen () {
    return this.state.row2_open && this.state.row3_open && this.state.row4_open && this.state.row5_open;
  }

  onNext () {
    this.props.next();
  }

  render () {
    let { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    let floatRight = { float: "right" };
    let textGray = { color: "gray" };

    return (
    <div className="intro-modal">
      <div className="intro-modal__h1">
        Send your Ballot to Friends through Email or Facebook?
      </div>

      <div>
        <div className="intro-modal-vertical-scroll-contain">
          <div className="intro-modal-vertical-scroll card">
            <div className="row intro-modal__grid intro-modal__default-text">
              <div className="container-fluid u-inset--md text-left">
                { this.state.success_message ? <div className="alert alert-success">
                  {this.state.success_message}
                </div> : null
                }
                {this.state.on_ballot_email_sent_step ?
                  <div className="alert alert-success">
                    Your Ballot sent. Is there anyone else   you'd like to send your Ballot?
                  </div> :
                  null }
                {this.state.email_addresses_error || this.state.sender_email_address_error ?
                  <div className="alert alert-danger">
                    {this.state.error_message}
                  </div> :
                  null }
                {this.state.on_enter_email_addresses_step ? <div>
                    <form onSubmit={this.prepareApiArraysFromForm.bind(this)}>
                      <label>Email your Ballot to Friends</label>
                      <div className="row invite-inputs">
                        <div className="form-group col-12 col-sm-12 col-md-6">
                          <label>Email Address</label>
                          <div className="input-group">
                            <input type="text" name="friend1_email_address"
                                   className="form-control"
                                   value={this.state.friend1_email_address}
                                   onChange={this.cacheFriendData.bind(this)}
                                   placeholder="name@domain.com"/>
                          </div>
                        </div>
                        <div className="form-group col-6 col-sm-6 col-md-3">
                          <label>First Name</label>
                          <div className="input-group">
                            <input type="text" name="friend1_first_name"
                                   className="form-control"
                                   value={this.state.friend1_first_name}
                                   onChange={this.cacheFriendData.bind(this)}
                                   placeholder="Optional"/>
                          </div>
                        </div>
                        <div className="form-group col-6 col-sm-6 col-md-3">
                          <label>Last Name</label>
                          <div className="input-group">
                            <input type="text" name="friend1_last_name"
                                   className="form-control"
                                   value={this.state.friend1_last_name}
                                   onChange={this.cacheFriendData.bind(this)}
                                   placeholder="Optional"/>
                          </div>
                        </div>
                      </div>
                      {this.state.row2_open ?
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input type="text" name="friend2_email_address"
                                     className="form-control"
                                     value={this.state.friend2_email_address}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="name@domain.com"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>First Name</label>
                            <div className="input-group">
                              <input type="text" name="friend2_first_name"
                                     className="form-control"
                                     value={this.state.friend2_first_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>Last Name</label>
                            <div className="input-group">
                              <input type="text" name="friend2_last_name"
                                     className="form-control"
                                     value={this.state.friend2_last_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <span className="close close-on-right" name="row2_open" aria-label="Close" onClick={this.closeRow2.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div> :
                        null}
                      {this.state.row3_open ?
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input type="text" name="friend3_email_address"
                                     className="form-control"
                                     value={this.state.friend3_email_address}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="name@domain.com"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>First Name</label>
                            <div className="input-group">
                              <input type="text" name="friend3_first_name"
                                     className="form-control"
                                     value={this.state.friend3_first_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>Last Name</label>
                            <div className="input-group">
                              <input type="text" name="friend3_last_name"
                                     className="form-control"
                                     value={this.state.friend3_last_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow3.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div> :
                        null}
                      {this.state.row4_open ?
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input type="text" name="friend4_email_address"
                                     className="form-control"
                                     value={this.state.friend4_email_address}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="name@domain.com"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>First Name</label>
                            <div className="input-group">
                              <input type="text" name="friend4_first_name"
                                     className="form-control"
                                     value={this.state.friend4_first_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>Last Name</label>
                            <div className="input-group">
                              <input type="text" name="friend4_last_name"
                                     className="form-control"
                                     value={this.state.friend4_last_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow4.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div> :
                        null}
                      {this.state.row5_open ?
                        <div className="row invite-inputs">
                          <div className="form-group col-12 col-sm-12 col-md-6">
                            <label>Email Address</label>
                            <div className="input-group">
                              <input type="text" name="friend5_email_address"
                                     className="form-control"
                                     value={this.state.friend5_email_address}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="name@domain.com"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>First Name</label>
                            <div className="input-group">
                              <input type="text" name="friend5_first_name"
                                     className="form-control"
                                     value={this.state.friend5_first_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <div className="form-group col-6 col-sm-6 col-md-3">
                            <label>Last Name</label>
                            <div className="input-group">
                              <input type="text" name="friend5_last_name"
                                     className="form-control"
                                     value={this.state.friend5_last_name}
                                     onChange={this.cacheFriendData.bind(this)}
                                     placeholder="Optional"/>
                            </div>
                          </div>
                          <span className="close close-on-right" aria-label="Close" onClick={this.closeRow5.bind(this)}><span aria-hidden="true">&times;</span></span>
                        </div> :
                        null}
                      <div>
                        {!this.state.friend1_email_address || this.allRowsOpen() ?
                          null :
                          <Button
                            tabIndex="0"
                            onClick={this.addAnotherInvitation.bind(this)}>
                            <span>+ Add another Friend</span>
                          </Button>}
                      </div>
                      <div>
                        <span style={floatRight}>
                          <Button
                            tabIndex="0"
                            onKeyDown={this.onKeyDown.bind(this)}
                            onClick={this.ballotEmailSendStepsManager.bind(this)}
                            bsStyle="primary"
                            disabled={!this.state.email_address_array}
                          >
                            { this.hasValidEmail() ?
                              <span>Send &gt;</span> :
                              <span>Next &gt;</span>
                            }
                          </Button>
                        </span>
                      </div>
                    </form>
                    <div className="row invite-inputs col-12 u-inset--md" />
                    <div className="text-center">
                        <span style={textGray}>We will never sell your email.</span>
                    </div>
                  </div> : null
                }
                {this.state.on_collect_email_step ?
                  <div>
                    <form onSubmit={this.ballotEmailSendStepsManager.bind(this)} className="u-stack--md">
                      <input type="text" name="sender_email_address"
                             className="form-control"
                             onChange={this.cacheSenderEmailAddress.bind(this)}
                             placeholder="Enter your email address" />
                    </form>

                    <div>
                      <span style={floatRight}>
                        <Button
                                tabIndex="0"
                                onKeyDown={this.onKeyDown.bind(this)}
                                onClick={this.ballotEmailSendStepsManager.bind(this)}
                                bsStyle="primary"
                                disabled={!this.state.sender_email_address} >
                          <span>Send</span>
                        </Button>
                      </span>
                      <p>In order to send your message, you will need to verify your email address. We will never sell your email.</p>
                    </div>
                  </div> : null
                }
              </div>
            </div>
          </div>
        </div>
        <br/>
        {/*<div className="intro-modal__button-wrap">*/}
          {/*<Button type="submit"*/}
                  {/*className="btn btn-success intro-modal__button"*/}
                  {/*onClick={this.onNext}>*/}
            {/*<span>{this.state.next_button_text}</span>*/}
          {/*</Button>*/}
        {/*</div>*/}
        <br/>
      </div>
    </div>);
  }
}
