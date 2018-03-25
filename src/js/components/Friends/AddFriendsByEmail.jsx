import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";
import { validateEmail } from "../../utils/email-functions";
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
        redirect_url_upon_save: "/friends/sign_in",  // TODO DALE Remove this?
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

  _onFriendStoreChange () {
    let add_friends_by_email_step = FriendStore.switchToAddFriendsByEmailStep();
    let error_message_to_show_voter = FriendStore.getErrorMessageToShowVoter();
    // console.log("AddFriendsByEmail, _onFriendStoreChange, add_friends_by_email_step:", add_friends_by_email_step);
    if (add_friends_by_email_step === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        on_enter_email_addresses_step: false,
        on_collect_email_step: true,
        on_friend_invitations_sent_step: false,
        error_message_to_show_voter: error_message_to_show_voter
      });
      // FriendStore.clearErrorMessageToShowVoter()
    } else {
      this.setState({
        loading: false,
        error_message_to_show_voter: ""
      });

    }
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  _ballotLoaded (){
    // TODO DALE Remove this?
    historyPush(this.state.redirect_url_upon_save);
  }

  cacheSenderEmailAddress (e) {
    this.setState({
      sender_email_address: e.target.value
    });
  }

  cacheAddFriendsByEmailMessage (e) {
    this.setState({
      add_friends_message: e.target.value
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    //console.log("friendInvitationByEmailSend);
    let _state = this.state;
    let email_address_array = [];
    let first_name_array = [];
    let last_name_array = [];
    //create temporary arrays so friendInvitationByEmailSend can work
    for (let friend_index = 1; friend_index <= this.state.friend_total; friend_index++) {
      if (validateEmail(_state[`friend${friend_index}_email_address`])){
        email_address_array.push(_state[`friend${friend_index}_email_address`]);
        first_name_array.push(_state[`friend${friend_index}_first_name`]);
        last_name_array.push(_state[`friend${friend_index}_last_name`]);
      }
    }
    // console.log("email_address_array: ", email_address_array);
    // console.log("first_name_array: ", first_name_array);
    // console.log("last_name_array: ", last_name_array);
    FriendActions.friendInvitationByEmailSend(email_address_array, first_name_array,
                                              last_name_array, "", this.state.add_friends_message,
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
    let { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return validateEmail(this.state.sender_email_address);
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByEmailStepsManager(event).bind(scope);
    }
  }

  AddFriendsByEmailStepsManager (event) {
    // This function is called when the next button is  submitted;
    // this funtion is called twice per cycle
    // console.log("Entering function AddFriendsByEmailStepsManager");
    let error_message = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      let email_addresses_error = false;

      //Error message logic on submit disabled in favor of disabling buttons

      // if (!this.state.friend1_email_address ) {
      //   // console.log("AddFriendsByEmailStepsManager: this.state.email_add is ");
      //   email_addresses_error = true;
      //   error_message += "Please enter at least one valid email address.";
      // } else {
      //   //custom error message for each invalid email
      //   for (let friend_index = 1; friend_index <= this.state.friend_total; friend_index++){
      //     if (this.state[`friend${friend_index}_email_address`] && !validateEmail(this.state[`friend${friend_index}_email_address`])) {
      //       email_addresses_error = true;
      //       error_message += `Please enter a valid email address for ${this.state[`friend${friend_index}_email_address`]}`;
      //     }
      //   }
      // }

      if (email_addresses_error) {
        // console.log("AddFriendsByEmailStepsManager, email_addresses_error");
        this.setState({
          loading: false,
          email_addresses_error: true,
          error_message: error_message
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
      let sender_email_address_error = false;

      //Error message logic on submit disabled in favor of disabling buttons

      // if (!this.state.sender_email_address ) {
      //   sender_email_address_error = true;
      //   error_message += "Please enter an email address for yourself. ";
      // } else if (!this.senderEmailAddressVerified()) {
      //   sender_email_address_error = true;
      //   error_message += "Your email address is not a valid. ";
      // }

      if (sender_email_address_error) {
        this.setState({
          loading: false,
          sender_email_address_error: true,
          error_message: error_message
        });
      } else {
        // console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    }
  }

  cacheFriendData (event) {
    this.setState({[event.target.name]: event.target.value});
    // console.log(`New State => ${event.target.name}: ${event.target.value}`);
  }

  AllEnteredEmailsVerified () {
    let _state = this.state;
    let result;

    for (let friend_index = 1; friend_index <= this.state.friend_total; friend_index++) {
      if (_state[`friend${friend_index}_email_address`]){
        result = validateEmail(_state[`friend${friend_index}_email_address`]);
        if (result) {
          // console.log(`AllEnteredEmailsVerified: validated email for friend${friend_index}`, _state[`friend${friend_index}_email_address`]);
        } else {
          // console.log(`AllEnteredEmailsVerified: invalid email address for friend${friend_index}`, _state[`friend${friend_index}_email_address`]);
          return false;
        }
      }
    }
    return true;
  }

  closeRow (row_number) {
    this.setState({
      [`friend${row_number}_email_address`]: "",
      [`friend${row_number}_first_name`]: "",
      [`friend${row_number}_last_name`]: "",
      [`row${row_number}_open`]: false
    });
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

	render () {
    renderLog(__filename);
    var atLeastOneValidated = validateEmail(this.state.friend1_email_address) || validateEmail(this.state.friend2_email_address) || validateEmail(this.state.friend3_email_address) || validateEmail(this.state.friend4_email_address) || validateEmail(this.state.friend5_email_address);

    var { loading } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var floatRight = {
        float: "right"
    };

		return <div>
      {this.state.on_friend_invitations_sent_step ?
        <div className="alert alert-success">
          Invitations sent. Is there anyone else you'd like to invite?
        </div> :
        null }
      {this.state.email_addresses_error || this.state.sender_email_address_error ?
        <div className="alert alert-danger">
          {this.state.error_message}
        </div> :
        null }
      {this.state.on_enter_email_addresses_step ?
        <div>
        <div>
          <form>
            <div className="container-fluid">
              <div className="row invite-inputs">
                <div className="form-group col-12 col-sm-12 col-md-6">
                  <label>Email Address</label>
                  <div className="input-group">
                    <input type="text" name="friend1_email_address"
                      className="form-control"
                      value={this.state.friend1_email_address}
                      onChange={this.cacheFriendData.bind(this)}
                      placeholder="For example: name@domain.com"/>
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
                       placeholder="For example: name@domain.com"/>
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
                <span className="close close-on-right" name="row2_open" aria-label="Close" onClick={this.closeRow.bind(this, 2)}><span aria-hidden="true">&times;</span></span>
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
                       placeholder="For example: name@domain.com"/>
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
                <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 3)}><span aria-hidden="true">&times;</span></span>
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
                       placeholder="For example: name@domain.com"/>
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
                <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 4)}><span aria-hidden="true">&times;</span></span>
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
                       placeholder="For example: name@domain.com"/>
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
                <span className="close close-on-right" aria-label="Close" onClick={this.closeRow.bind(this, 5)}><span aria-hidden="true">&times;</span></span>
              </div> :
            null}
            <div className="row invite-inputs">
            {!this.state.friend1_email_address || this.allRowsOpen() ?
             null :
              <Button
                tabIndex="0"
                onClick={this.addAnotherInvitation.bind(this)}>
                <span>+ Add another invitation</span>
              </Button>}
            </div>
          </div>

          </form>
        </div>

          <form className="u-stack--md">
          {atLeastOneValidated ?
            <span>
              <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
              <input type="text" name="add_friends_message"
                 className="form-control"
                 onChange={this.cacheAddFriendsByEmailMessage.bind(this)}
                 placeholder="Please join me in preparing for the upcoming election."/>
            </span> :
              null }
              </form>

              <div className="u-gutter__top--small">
                <span style={floatRight}>
                  <Button
                    tabIndex="0"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                    bsStyle="primary"
                    disabled={!this.state.friend1_email_address || !this.AllEnteredEmailsVerified() }
                  >
                    { this.hasValidEmail() ?
                      <span>Send &gt;</span> :
                      <span>Next &gt;</span>
                    }
                  </Button>
                </span>
                <span>These friends will see what you support, oppose, and which opinions you listen to.
                   We will never sell your email.</span>
            </div>
        </div> :
        null }

      {this.state.on_collect_email_step ?
        <div>
          <form className="u-stack--md">
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
                  onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                  bsStyle="primary"
                  disabled={!this.state.sender_email_address || !this.senderEmailAddressVerified() } >
                  <span>Send</span>
                </Button>
              </span>
              <p>In order to send your message, you will need to verify your email address. We will never sell your email.</p>
          </div>
        </div> :
        null }
		</div>;
	}
}
