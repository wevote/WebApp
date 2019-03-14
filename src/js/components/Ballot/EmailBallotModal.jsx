import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { deviceTypeString, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import LoadingWheel from '../LoadingWheel';
import validateEmail from '../../utils/email-functions';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';

export default class EmailBallotModal extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired, // Used by react-slick
    ballotEmailWasSent: PropTypes.func.isRequired, // Used to transition to EmailBallotToFriendsModal whan ballot was sent.
    ballot_link: PropTypes.string,
  };

  constructor (props) {
    super(props);
    let ballotLink = '';
    if (this.props.ballot_link) {
      ballotLink = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + this.props.ballot_link;
    } else {
      ballotLink = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/ballot`;
    }

    this.state = {
      emailBallotMessage: 'This is We Vote Ballot data for the upcoming election.',
      voter: VoterStore.getVoter(),
      loading: false,
      senderEmailAddress: VoterStore.getVoter().email,
      senderEmailAddressError: false,
      onEnterEmailAddressesStep: true,
      verificationEmailSent: false,
      ballot_link: ballotLink,
    };
    this.ballotEmailSend = this.ballotEmailSend.bind(this);
  }

  componentWillMount () {
    prepareForCordovaKeyboard(__filename);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
    restoreStylesAfterCordovaKeyboard(__filename);
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
    // console.log("EmailBallotModal, onFriendStoreChange, email_ballot_data_step:", email_ballot_data_step);
    if (emailBallotDataStep === 'on_collect_email_step') {
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

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.ballotEmailSendStepsManager().bind(scope);
    }
  }

  cacheSenderEmailAddress = (e) => {
    this.setState({
      senderEmailAddress: e.target.value,
    });
  }

  ballotEmailSendStepsManager = () => {
    // This function is called when the form is submitted
    console.log('ballotEmailSendStepsManager');
    let errorMessage = '';

    if (this.state.onEnterEmailAddressesStep) {
      // Validate friends' email addresses
      let senderEmailAddressError = false;
      if (!this.state.senderEmailAddress || !validateEmail(this.state.senderEmailAddress)) {
        senderEmailAddressError = true;
        errorMessage += 'Please enter a valid email address for yourself.';
      }

      if (senderEmailAddressError) {
        // console.log("ballotEmailSendStepsManager, senderEmailAddressError");
        this.setState({
          loading: false,
          senderEmailAddressError: true,
          errorMessage,
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
    let verificationEmailSent = false;
    let successMessage = (
      <span>
        Success! This ballot has been sent to the email address
        {this.state.senderEmailAddress}
        {' '}
      </span>
    );

    FriendActions.emailBallotData('', '', '', this.state.senderEmailAddress, this.state.emailBallotMessage,
      this.state.ballot_link, this.state.senderEmailAddress, this.state.verificationEmailSent, deviceTypeString());

    if (!this.hasValidEmail()) {
      verificationEmailSent = true;
      successMessage = (
        <span>
          Success! This ballot has been sent to the email address
          {' '}
          {this.state.senderEmailAddress}
          . Please check your email and verify your email address to send Ballot to your friends.
          {' '}
        </span>
      );
    }

    this.props.ballotEmailWasSent(successMessage, this.state.senderEmailAddress, this.state.verificationEmailSent);
    // After calling the API, reset the form
    this.setState({
      loading: true,
      senderEmailAddressError: false,
      onEnterEmailAddressesStep: true,
      showEmailToFriendsModal: false,
      verificationEmailSent,
    });
  }

  _openEmailToFriendsModal () {
    this.componentWillUnmount();
    const { showEmailToFriendsModal } = this.state;
    this.setState({ showEmailToFriendsModal: !showEmailToFriendsModal });
  }

  render () {
    renderLog(__filename);
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const floatRight = { float: 'right' };
    const textGray = { color: 'gray' };

    return (
      <div className="share-modal">
        <div className="intro-modal__h1">
        Send This Ballot to Yourself
        </div>

        <div>
          <div className="intro-modal-vertical-scroll card">
            <div className="share-modal__default-text">
              <div className="container-fluid u-inset--md text-left">
                {this.state.senderEmailAddressError ? (
                  <div className="alert alert-danger">
                    {this.state.errorMessage}
                  </div>
                ) :
                  null }
                {this.state.onEnterEmailAddressesStep ? (
                  <div className="row invite-inputs">
                    <span className="col-12 text-left">
                      Email a link to this ballot to yourself so you can print it, or come back to it later.&nbsp;
                      <br />
                      <br />
                    </span>
                    <div className="col-12 text-left">
                      { this.hasValidEmail() ? <span>Your Email Address</span> : <span>What is your email address?</span> }
                    </div>
                    <div className="form-group share-modal__container text-left">
                      <div className="share-modal__input">
                        <input
                          className="form-control"
                          name="self_email_address"
                          onChange={this.cacheSenderEmailAddress}
                          placeholder="For example: name@domain.com"
                          type="text"
                          value={this.state.senderEmailAddress || ''}
                        />
                      </div>
                      {/* <form onSubmit={this.ballotEmailSendStepsManager.bind(this)} className="u-stack--md"> */}
                      {/* <span> */}
                      {/* <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br /> */}
                      {/* <textarea className="form-control" name="emailBallotMessage" rows="5" */}
                      {/* onChange={this.cacheEmailMessage.bind(this)} */}
                      {/* placeholder="This is WeVote Ballot data for the upcoming election."/> */}
                      {/* </span> */}
                      {/* </form> */}
                      <div className="share-modal__button--send d-none d-sm-block">
                        <span style={floatRight}>
                          <Button
                            tabIndex="0"
                            onKeyDown={this.onKeyDown}
                            onClick={this.ballotEmailSendStepsManager}
                            variant="primary"
                          >
                            <span>Send This Ballot &gt;</span>
                          </Button>
                        </span>
                      </div>
                      <div className="share-modal__button--send d-block d-sm-none">
                        <span style={floatRight}>
                          <Button
                            tabIndex="0"
                            onKeyDown={this.onKeyDown}
                            onClick={this.ballotEmailSendStepsManager}
                            variant="primary"
                          >
                            <span>Send</span>
                          </Button>
                        </span>
                      </div>
                    </div>
                    <div className="col-12 u-inset--sm u-stack--lg" />
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
                ) : null
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
