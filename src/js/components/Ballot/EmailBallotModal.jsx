import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import EmailBallotToFriendsModal from "./EmailBallotToFriendsModal";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../LoadingWheel";
import VoterStore from "../../stores/VoterStore";

const NEXT_BUTTON_TEXT = "Next >";
const web_app_config = require("../../config");

export default class EmailBallotModal extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func,
    ballot_link: PropTypes.string,
  };

  constructor (props) {
    super(props);
    let ballotLink = "";
    if (this.props.ballot_link) {
      ballotLink = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + this.props.ballot_link;
    } else {
      ballotLink = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/ballot";
    }

    this.state = {
      email_ballot_message: "This is WeVote Ballot data for the upcoming election.",
      voter: VoterStore.getVoter(),
      loading: false,
      sender_email_address: VoterStore.getVoter().email,
      sender_email_address_error: false,
      next_button_text: NEXT_BUTTON_TEXT,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_ballot_email_sent_step: false,
      on_facebook_login_step: false,
      facebook_login_started: false,
      on_mobile: false,
      ballot_link: ballotLink,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.onNext = this.onNext.bind(this);
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
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

  _onFacebookStoreChange () {
    let facebookAuthResponse = FacebookStore.getFacebookAuthResponse();
    let emailData = FacebookStore.getFacebookData();
    // console.log("_onFacebookStoreChange", facebookAuthResponse, emailData);
    if ( facebookAuthResponse.facebookIsLoggedIn && emailData.userId && !this.state.facebook_login_started ) {
      this.setState({
        facebook_login_started: true,
        on_facebook_login_step: true,
      });
      if ( this.state.on_mobile ) {
        this.shareOnFacebook();
      } else {
        this.sendDirectMessageToSelfFacebook();
      }
    }
  }

  _onFriendStoreChange () {
    let email_ballot_data_step = FriendStore.switchToEmailBallotDataStep();
    let error_message_to_show_voter = FriendStore.getErrorMessageToShowVoter();
    // console.log("AddFriendsByEmail, _onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
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
      on_ballot_email_sent_step: false,
    });
  }

  cacheEmailMessage (e) {
    this.setState({
      email_ballot_message: e.target.value
    });
  }

  hasValidEmail () {
    let { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return true;
  }

  ballotEmailSend () {
    let success_message = "";
    if ( this.state.on_facebook_login_step ) {
      success_message = <span>Success! This ballot has been sent to Facebook and the email address {this.state.sender_email_address} </span>;
    } else {
      success_message = <span>Success! This ballot has been sent to the email address {this.state.sender_email_address} </span>;
    }

    FriendActions.emailBallotData("", "", "", this.state.sender_email_address, this.state.email_ballot_message,
      this.state.ballot_link, this.state.sender_email_address);
    console.log("ballotEmailSend: email_address: ", this.state.sender_email_address);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      sender_email_address_error: false,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_ballot_email_sent_step: true,
      showEmailToFriendsModal: false,
      success_message: success_message,
    });
  }

  _openEmailToFriendsModal () {
    this.componentWillUnmount();
    this.setState({ showEmailToFriendsModal: !this.state.showEmailToFriendsModal });
  }

  ballotEmailSendStepsManager () {
    // This function is called when the form is submitted
    console.log("ballotEmailSendStepsManager");
    let error_message = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      let sender_email_address_error = false;
      if (!this.state.sender_email_address) {
        sender_email_address_error = true;
        error_message += "Please enter a valid email address for yourself.";
      }

      if (sender_email_address_error) {
        console.log("ballotEmailSendStepsManager, sender_email_address_error");
        this.setState({
          loading: false,
          sender_email_address_error: true,
          error_message: error_message
        });
      } else if (!this.hasValidEmail()) {
        console.log("ballotEmailSendStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          on_enter_email_addresses_step: false,
          on_collect_email_step: false,
        });
        this.ballotEmailSend();
      } else {
        console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend();
      }
    } else if (this.state.on_collect_email_step) {
      // Validate sender's email addresses
      let sender_email_address_error = false;
      if (!this.state.sender_email_address) {
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
        console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend();
      }
    }
  }

  sendDirectMessageToSelfFacebook () {
    let emailData = FacebookStore.getFacebookData();
    let facebookAuthResponse = FacebookStore.getFacebookAuthResponse();
    // console.log("sendDirectMessageToSelfFacebook", emailData, facebookAuthResponse);
    if ( facebookAuthResponse.facebookIsLoggedIn ) {
      if ( emailData.userId ) {
        window.FB.ui({
          title: "We Vote USA",
          to: emailData.userId,
          method: "send",
          mobile_iframe: true,
          link: this.state.ballot_link,
          redirect_uri: web_app_config.WE_VOTE_HOSTNAME + "/ballot",
        }, function (response) {
          if (response) {
            if (response.success) {
              // console.log("Successfully send", response);
              if ( emailData.email ) {
                if (emailData.email !== this.state.sender_email_address) {
                  this.setState({sender_email_address: emailData.email});
                }
                this.ballotEmailSend();
              }
            }
          } else {
            console.log("Failed to send", response);
          }
          this.setState({ on_facebook_login_step: false });
        }.bind(this));
      }
    } else {
      FacebookActions.login();
    }
  }

  shareOnFacebook () {
    let emailData = FacebookStore.getFacebookData();
    let facebookAuthResponse = FacebookStore.getFacebookAuthResponse();
    // console.log("shareOnFacebook", emailData, facebookAuthResponse);
    if ( facebookAuthResponse.facebookIsLoggedIn ) {
      if ( emailData.userId ) {
        window.FB.ui({
          title: "We Vote USA",
          method: "share",
          href: this.state.ballot_link,
          redirect_uri: web_app_config.WE_VOTE_HOSTNAME + "/ballot",
        }, function (response) {
          if (response) {
            // console.log("Successfully send", response);
            if ( emailData.email ) {
              if (emailData.email !== this.state.sender_email_address) {
                this.setState({sender_email_address: emailData.email});
              }
              this.ballotEmailSend();
            }
          } else {
            console.log("Failed to send", response);
          }
          this.setState({ on_facebook_login_step: false });
        }.bind(this));
      }
    } else {
      FacebookActions.login();
      this.setState({on_mobile: true});
    }
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.ballotEmailSendStepsManager().bind(scope);
    }
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

    if ( this.state.on_facebook_login_step ){
      return LoadingWheel;
    }

    if (this.state.showEmailToFriendsModal) {
      this.componentWillUnmount();
      return <EmailBallotToFriendsModal ballot_link={this.state.ballot_link}/>;
    }

    if (this.state.on_ballot_email_sent_step) {
      this.componentWillUnmount();
      return <EmailBallotToFriendsModal ballot_link={this.state.ballot_link} success_message={this.state.success_message}/>;
    }

    return (
    <div className="intro-modal">
      <div className="intro-modal__h1">
        Send This Ballot to Yourself Through Email or Facebook
      </div>

      <div>
        <div className="intro-modal-vertical-scroll-contain">
          <div className="intro-modal-vertical-scroll card">
            <div className="row intro-modal__grid intro-modal__default-text">
              <div className="container-fluid u-inset--md">
                {this.state.sender_email_address_error ?
                  <div className="alert alert-danger">
                    {this.state.error_message}
                  </div> :
                  null }
                {this.state.on_enter_email_addresses_step ? <div className="row invite-inputs">
                    <span className="col-12 text-left">Email this ballot to yourself so you can print it, or come back to it later.&nbsp;<br />&nbsp;<br /></span>
                    <div className="form-group col-12 col-sm-12 col-md-12 text-left">
                      { this.hasValidEmail() ? <label>Your Email Address</label> : <label>What is your email address?</label> }
                      <div className="input-group">
                        <input type="text" name="self_email_address"
                               className="form-control"
                               value={this.state.sender_email_address || ""}
                               onChange={this.cacheSenderEmailAddress.bind(this)}
                               placeholder="For example: name@domain.com"/>
                      </div>

                      {/*<form onSubmit={this.ballotEmailSendStepsManager.bind(this)} className="u-stack--md">*/}
                        {/*<span>*/}
                          {/*<label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />*/}
                          {/*<textarea className="form-control" name="email_ballot_message" rows="5"*/}
                                    {/*onChange={this.cacheEmailMessage.bind(this)}*/}
                                    {/*placeholder="This is WeVote Ballot data for the upcoming election."/>*/}
                        {/*</span>*/}
                      {/*</form>*/}

                    </div>
                    <div className="col-12">
                      <span style={floatRight}>
                        <Button
                          tabIndex="0"
                          onKeyDown={this.onKeyDown.bind(this)}
                          onClick={this.ballotEmailSendStepsManager.bind(this)}
                          bsStyle="primary"
                        >
                          <span>Send This Ballot &gt;</span>
                        </Button>
                      </span>
                    </div>
                    <div className="col-12 u-inset--sm" />
                    <div className="col-12">
                      <span style={floatRight} onClick={this._openEmailToFriendsModal.bind(this)}>
                        Click here to send to friends &gt;
                      </span>
                    </div>
                    <div className="col-12 u-inset--md" />
                    <div className="text-center col-12">
                      <div className="hidden-xs">
                        <span >Send this ballot to yourself through Facebook and your Facebook Email.</span>
                        <div className="u-inset--xs"/>
                        <Button className="btn btn-social btn-facebook u-push--sm"
                                bsStyle="danger"
                                type="submit"
                                onClick={this.sendDirectMessageToSelfFacebook.bind(this)}>
                          <span className="fa fa-facebook" />Send Through Facebook
                        </Button>
                      </div>
                      <div className="mobile-container">
                        <div>
                          <span >Share this ballot to your Facebook Timeline and Facebook Email.</span>
                          <div className="u-inset--xs"/>
                          <Button className="btn btn-social btn-facebook u-push--sm"
                                  bsStyle="danger"
                                  type="submit"
                                  onClick={this.shareOnFacebook.bind(this)}>
                            <span className="fa fa-facebook" />Share on Facebook
                          </Button>
                        </div>
                      </div>
                    </div>
                  <div className="col-12 u-inset--md" />
                </div> : null
                }
                <span style={textGray}>We will never sell your email.</span>
              </div>
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
    );
  }
}
