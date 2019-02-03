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
    ballotLink: PropTypes.string,
    ballotFacebookEmailWasSent: PropTypes.func,
  };

  constructor (props) {
    super(props);
    let ballotLink = "";
    if (this.props.ballotLink) {
      ballotLink = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + this.props.ballotLink;
    } else {
      ballotLink = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/ballot`;
    }

    this.state = {
      emailBallotMessage: "This is We Vote Ballot data for the upcoming election.",
      voter: VoterStore.getVoter(),
      loading: false,
      senderEmailAddress: VoterStore.getVoter().email,
      senderEmailAddressError: false,
      onEnterEmailAddressesStep: true,
      onFacebookLoginStep: false,
      facebookLoginStarted: false,
      verificationEmailSent: false,
      onMobile: false,
      ballotLink,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
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

  onFacebookStoreChange () {
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();
    const emailData = FacebookStore.getFacebookData();

    // console.log("onFacebookStoreChange", facebookAuthResponse, emailData);
    if (facebookAuthResponse.facebookIsLoggedIn && emailData.userId && !this.state.facebookLoginStarted) {
      this.setState({
        facebookLoginStarted: true,
        onFacebookLoginStep: true,
      });
      if (this.state.onMobile) {
        this.shareOnFacebook();
      } else {
        this.sendDirectMessageToSelfFacebook();
      }
    }
  }

  onFriendStoreChange () {
    const emailBallotDataStep = FriendStore.switchToEmailBallotDataStep();

    // console.log("EmailBallotModal, onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
    if (emailBallotDataStep === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        onEnterEmailAddressesStep: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.ballotEmailSendStepsManager().bind(this);
    }
  }

  shareOnFacebook = () => {
    const emailData = FacebookStore.getFacebookData();
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();

    oAuthLog("shareOnFacebook FacebookBallotModal", emailData, facebookAuthResponse);
    if (facebookAuthResponse.facebookIsLoggedIn) {
      if (emailData.userId) {
        const api = isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
        api.ui({
          title: "We Vote USA",
          method: "share",
          href: this.state.ballotLink,
          mobile_iframe: true,
          redirect_uri: `${webAppConfig.WE_VOTE_HOSTNAME}/ballot`,
        }, (response) => {
          if (response) {
            oAuthLog("Successfully send", response);
            if (emailData.email) {
              if (emailData.email !== this.state.senderEmailAddress) {
                this.setState({ senderEmailAddress: emailData.email });
              }

              this.ballotEmailSend();
            }
          } else {
            oAuthLog("Failed to send", response);
          }

          this.setState({ onFacebookLoginStep: false });
        });
      }
    } else {
      FacebookActions.login();
      this.setState({ onMobile: true });
    }
  }

  sendDirectMessageToSelfFacebook = () => {
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
          link: this.state.ballotLink,
          redirect_uri: `${webAppConfig.WE_VOTE_HOSTNAME}/ballot`,
        }, (response) => {
          if (response) {
            if (response.success) {
              oAuthLog("Successfully send", response);
              if (emailData.email) {
                if (emailData.email !== this.state.senderEmailAddress) {
                  this.setState({ senderEmailAddress: emailData.email });
                }

                this.ballotEmailSend();
              }
            }
          } else {
            oAuthLog("Failed to send", response);
          }

          this.setState({ onFacebookLoginStep: false });
        });
      }
    } else {
      FacebookActions.login();
    }
  }

  cacheSenderEmailAddress (e) {
    this.setState({
      senderEmailAddress: e.target.value,
    });
  }

  cacheEmailMessage (e) {
    this.setState({
      emailBallotMessage: e.target.value,
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
    if (this.state.onFacebookLoginStep) {
      successMessage = (
        <span>
          Success! This ballot has been sent to Facebook and the email address
          {" "}
          {this.state.senderEmailAddress}
          {" "}

        </span>
      );
    } else {
      successMessage = (
        <span>
          Success! This ballot has been sent to the email address
          {this.state.senderEmailAddress}
          {" "}

        </span>
      );
    }

    FriendActions.emailBallotData("", "", "", this.state.senderEmailAddress, this.state.emailBallotMessage,
      this.state.ballotLink, this.state.senderEmailAddress, this.state.verificationEmailSent, deviceTypeString());

    if (!this.hasValidEmail()) {
      verificationEmailSent = true;
      successMessage = (
        <span>
          Success! This ballot has been sent to the email address
          {" "}
          {this.state.senderEmailAddress}
          . Please check your email and verify your email address to send Ballot to your friends.
          {" "}
        </span>
      );
    }

    this.props.ballotFacebookEmailWasSent(successMessage, this.state.senderEmailAddress, this.state.verificationEmailSent);

    // After calling the API, reset the form
    this.setState({
      loading: true,
      senderEmailAddressError: false,
      onEnterEmailAddressesStep: true,
      showFacebookToFriendsModal: false,
      verificationEmailSent,
    });
  }

  _openFacebookToFriendsModal () {
    this.componentWillUnmount();
    const { showFacebookToFriendsModal } = this.state;
    this.setState({ showFacebookToFriendsModal: !showFacebookToFriendsModal });
  }

  ballotEmailSendStepsManager () {
    // This function is called when the form is submitted
    console.log("ballotEmailSendStepsManager");
    let errorMessage = "";

    if (this.state.onEnterEmailAddressesStep) {
      // Validate friends' email addresses
      let senderEmailAddressError = false;
      if (!this.state.senderEmailAddress || !validateEmail(this.state.senderEmailAddress)) {
        senderEmailAddressError = true;
        errorMessage += "Please enter a valid email address for yourself.";
      }

      if (senderEmailAddressError) {
        // console.log("ballotEmailSendStepsManager, senderEmailAddressError");
        this.setState({
          loading: false,
          senderEmailAddressError: true,
          error_message: errorMessage,
        });
      } else if (!this.hasValidEmail()) {
        // console.log("ballotEmailSendStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          onEnterEmailAddressesStep: false,
        });
        this.ballotEmailSend();
      } else {
        // console.log("ballotEmailSendStepsManager, calling emailBallotData");
        this.ballotEmailSend();
      }
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
                {this.state.senderEmailAddressError ? (
                  <div className="alert alert-danger">
                    {this.state.error_message}
                  </div>
                ) :
                  null }
                {this.state.onEnterEmailAddressesStep ? (
                  <div className="row invite-inputs">
                    <div className="text-center col-12">
                      <div className="d-none d-sm-block">
                        <span>Send a link to this ballot to the email address you use for Facebook.</span>
                        <div className="u-inset--xs" />
                        <Button
                          bsPrefix="btn btn-social btn-facebook u-push--sm"
                          variant="danger"
                          type="submit"
                          onClick={this.sendDirectMessageToSelfFacebook}
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
                            onClick={this.shareOnFacebook}
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
