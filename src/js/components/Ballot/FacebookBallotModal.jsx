import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { deviceTypeString, isWebApp } from "../../utils/cordovaUtils";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import { oAuthLog } from "../../utils/logging";
import LoadingWheel from "../LoadingWheel";
import validateEmail from "../../utils/email-functions";
import VoterStore from "../../stores/VoterStore";
import webAppConfig from "../../config";

export default class FacebookBallotModal extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired, // Used by react-slick
    history: PropTypes.object,
    ballot_link: PropTypes.string,
    ballotFacebookEmailWasSent: PropTypes.func,
  };

  constructor (props) {
    super(props);
    let ballotLink = "";
    if (this.props.ballot_link) {
      ballotLink = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + this.props.ballot_link;
    } else {
      ballotLink = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/ballot`;
    }

    this.state = {
      email_ballot_message: "This is WeVote Ballot data for the upcoming election.",
      voter: VoterStore.getVoter(),
      loading: false,
      sender_email_address: VoterStore.getVoter().email,
      sender_email_address_error: false,
      on_enter_email_addresses_step: true,
      on_ballot_email_sent_step: false,
      on_facebook_login_step: false,
      facebook_login_started: false,
      verification_email_sent: false,
      on_mobile: false,
      ballot_link: ballotLink,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
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
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();
    const emailData = FacebookStore.getFacebookData();

    // console.log("_onFacebookStoreChange", facebookAuthResponse, emailData);
    if (facebookAuthResponse.facebookIsLoggedIn && emailData.userId && !this.state.facebook_login_started) {
      this.setState({
        facebook_login_started: true,
        on_facebook_login_step: true,
      });
      if (this.state.on_mobile) {
        this.shareOnFacebook();
      } else {
        this.sendDirectMessageToSelfFacebook();
      }
    }
  }

  _onFriendStoreChange () {
    const emailBallotDataStep = FriendStore.switchToEmailBallotDataStep();
    const errorMessageToShowVoter = FriendStore.getErrorMessageToShowVoter();

    // console.log("EmailBallotModal, _onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
    if (emailBallotDataStep === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        on_enter_email_addresses_step: false,
        on_ballot_email_sent_step: false,
        error_message_to_show_voter: errorMessageToShowVoter,
      });
    } else {
      this.setState({
        loading: false,
        error_message_to_show_voter: "",
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
      email_ballot_message: e.target.value,
    });
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return true;
  }

  ballotEmailSend () {
    let successMessage = "";
    let verificationEmailSent = false;
    if (this.state.on_facebook_login_step) {
      successMessage = (
        <span>
          Success! This ballot has been sent to Facebook and the email address
          {this.state.sender_email_address}
          {" "}

        </span>
      );
    } else {
      successMessage = (
        <span>
          Success! This ballot has been sent to the email address
          {this.state.sender_email_address}
          {" "}

        </span>
      );
    }

    FriendActions.emailBallotData("", "", "", this.state.sender_email_address, this.state.email_ballot_message,
      this.state.ballot_link, this.state.sender_email_address, this.state.verification_email_sent, deviceTypeString());

    if (!this.hasValidEmail()) {
      verificationEmailSent = true;
      successMessage = (
        <span>
          Success! This ballot has been sent to the email address
          {this.state.sender_email_address}
          . Please check your email and verify your email address to send Ballot to your friends.
          {" "}
        </span>
      );
    }

    this.props.ballotFacebookEmailWasSent(successMessage, this.state.sender_email_address, this.state.verification_email_sent);

    // After calling the API, reset the form
    this.setState({
      loading: true,
      sender_email_address_error: false,
      on_enter_email_addresses_step: true,
      on_ballot_email_sent_step: true,
      showFacebookToFriendsModal: false,
      verification_email_sent: verificationEmailSent,
      success_message: successMessage,
    });
  }

  _openFacebookToFriendsModal () {
    this.componentWillUnmount();
    this.setState({ showFacebookToFriendsModal: !this.state.showFacebookToFriendsModal });
  }

  ballotEmailSendStepsManager () {
    // This function is called when the form is submitted
    console.log("ballotEmailSendStepsManager");
    let errorMessage = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      let senderEmailAddressError = false;
      if (!this.state.sender_email_address || !validateEmail(this.state.sender_email_address)) {
        senderEmailAddressError = true;
        errorMessage += "Please enter a valid email address for yourself.";
      }

      if (senderEmailAddressError) {
        // console.log("ballotEmailSendStepsManager, sender_email_address_error");
        this.setState({
          loading: false,
          sender_email_address_error: true,
          error_message: errorMessage,
        });
      } else if (!this.hasValidEmail()) {
        // console.log("ballotEmailSendStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          on_enter_email_addresses_step: false,
        });
        this.ballotEmailSend();
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend();
      }
    }
  }

  sendDirectMessageToSelfFacebook () {
    const emailData = FacebookStore.getFacebookData();
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();

    oAuthLog("sendDirectMessageToSelfFacebook", emailData, facebookAuthResponse);
    if (facebookAuthResponse.facebookIsLoggedIn) {
      if (emailData.userId) {
        const api = isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
        api.ui({
          title: "We Vote USA",
          to: emailData.userId,
          method: "send",
          link: this.state.ballot_link,
          redirect_uri: `${webAppConfig.WE_VOTE_HOSTNAME}/ballot`,
        }, (response) => {
          if (response) {
            if (response.success) {
              oAuthLog("Successfully send", response);
              if (emailData.email) {
                if (emailData.email !== this.state.sender_email_address) {
                  this.setState({ sender_email_address: emailData.email });
                }

                this.ballotEmailSend();
              }
            }
          } else {
            oAuthLog("Failed to send", response);
          }

          this.setState({ on_facebook_login_step: false });
        });
      }
    } else {
      FacebookActions.login();
    }
  }

  shareOnFacebook () {
    const emailData = FacebookStore.getFacebookData();
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();

    oAuthLog("shareOnFacebook FacebookBallotModal", emailData, facebookAuthResponse);
    if (facebookAuthResponse.facebookIsLoggedIn) {
      if (emailData.userId) {
        const api = isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
        api.ui({
          title: "We Vote USA",
          method: "share",
          href: this.state.ballot_link,
          mobile_iframe: true,
          redirect_uri: `${webAppConfig.WE_VOTE_HOSTNAME}/ballot`,
        }, (response) => {
          if (response) {
            oAuthLog("Successfully send", response);
            if (emailData.email) {
              if (emailData.email !== this.state.sender_email_address) {
                this.setState({ sender_email_address: emailData.email });
              }

              this.ballotEmailSend();
            }
          } else {
            oAuthLog("Failed to send", response);
          }

          this.setState({ on_facebook_login_step: false });
        });
      }
    } else {
      FacebookActions.login();
      this.setState({ on_mobile: true });
    }
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.ballotEmailSendStepsManager().bind(this);
    }
  }

  render () {
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const textGray = { color: "gray" };

    return (
      <div className="share-modal">
        <div className="intro-modal__h1">
        Send This Ballot to Yourself
        </div>

        <div>
          {/* <div className="intro-modal-vertical-scroll-contain_without_slider"> */}
          <div className="intro-modal-vertical-scroll card">
            <div className="share-modal__default-text">
              <div className="container-fluid u-inset--md text-left">
                {this.state.sender_email_address_error ? (
                  <div className="alert alert-danger">
                    {this.state.error_message}
                  </div>
                ) :
                  null }
                {this.state.on_enter_email_addresses_step ? (
                  <div className="row invite-inputs">
                    <div className="text-center col-12">
                      <div className="d-none d-sm-block">
                        <span>Send a link to this ballot to the email address you use for Facebook.</span>
                        <div className="u-inset--xs" />
                        <Button
                          bsPrefix="btn btn-social btn-facebook u-push--sm"
                          variant="danger"
                          type="submit"
                          onClick={this.sendDirectMessageToSelfFacebook.bind(this)}
                        >
                          <span className="fa fa-facebook" />
                          Send to Your Facebook Email &gt;
                        </Button>
                      </div>
                      <div className="mobile-container">
                        <div>
                          <span>Send a link to this ballot to the email address you use for Facebook.</span>
                          <div className="u-inset--xs" />
                          <Button
                            bsPrefix="btn btn-social btn-facebook u-push--sm"
                            variant="danger"
                            type="submit"
                            onClick={this.shareOnFacebook.bind(this)}
                          >
                            <span className="fa fa-facebook" />
                            Send to Your Email &gt;
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 u-inset--md" />
                  </div>
                ) : null
                }
                <div className="text-center col-12 u-stack--md">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.props.next}
                  >
                    Want to send to friends?&nbsp;&nbsp;&gt;
                  </button>
                </div>
                <div className="text-center col-12 u-stack--sm">
                  <span className="u-no-break" style={textGray}>We will never sell your email.</span>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    );
  }
}
