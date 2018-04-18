import React, { Component } from "react";
import { Alert, Button, FormGroup } from "react-bootstrap";
import { isWebApp } from "../utils/cordovaUtils";
import LoadingWheel from "../components/LoadingWheel";
import { renderLog } from "../utils/logging";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class VoterEmailAddressEntry extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      email_address_status: {
        emailAddressAlreadyOwnedByOtherVoter: false,
        emailAddressCreated: false,
        emailAddressDeleted: false,
        verificationEmailSent: false,
        linkToSignInEmailSent: false,
      },
      editVerifiedEmailsOn: false,
      editEmailsToVerifyOn: false,
      voter: VoterStore.getVoter(),
      voterEmailAddress: "",
      voterEmailAddressList: [],
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      voterEmailAddressList: VoterStore.getEmailAddressList(),
      email_address_status: VoterStore.getEmailAddressStatus(),
      loading: false, });
  }

  // _ballotLoaded () {
  //   //historyPush(this.props.saveUrl);
  // }

  editVerifiedEmailsOn () {
    this.setState({ editVerifiedEmailsOn: true });
  }

  editVerifiedEmailsOff () {
    this.setState({ editVerifiedEmailsOn: false });
  }

  editEmailsToVerifyOn () {
    this.setState({ editEmailsToVerifyOn: true });
  }

  editEmailsToVerifyOff () {
    this.setState({ editEmailsToVerifyOn: false });
  }

  removeVoterEmailAddress (emailWeVoteId) {
    VoterActions.removeVoterEmailAddress(emailWeVoteId);
  }

  resetEmailForm () {
    this.setState({
      email_address_status: {
        emailAddressAlreadyOwnedByOtherVoter: false,
        emailAddressCreated: false,
        emailAddressDeleted: false,
        verificationEmailSent: false,
        linkToSignInEmailSent: false,
      },
      loading: false,
    });
  }

  sendSignInLinkEmail (event) {
    event.preventDefault();
    VoterActions.sendSignInLinkEmail(this.state.voterEmailAddress);
    this.setState({
      email_address_status: {
        emailAddressAlreadyOwnedByOtherVoter: false,
      },
      loading: true,
    });
  }

  sendVerificationEmail (emailWeVoteId) {
    VoterActions.sendVerificationEmail(emailWeVoteId);
    this.setState({ loading: true });
  }

  setAsPrimaryEmailAddress (emailWeVoteId) {
    VoterActions.setAsPrimaryEmailAddress(emailWeVoteId);
  }

  updateVoterEmailAddress (e) {
    this.setState({
      voterEmailAddress: e.target.value,
    });
  }

  voterEmailAddressSave (event) {
    event.preventDefault();
    let sendLinkToSignIn = true;
    VoterActions.voterEmailAddressSave(this.state.voterEmailAddress, sendLinkToSignIn);
    this.setState({ loading: true });
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      return LoadingWheel;
    }

    const emailAddressStatusHtml = <span>
      { this.state.email_address_status.email_address_already_owned_by_other_voter &&
        !this.state.email_address_status.link_to_sign_in_email_sent ?
        <Alert bsStyle="warning">
          That email is already being used by another account.<br />
          <br />
          Please click "Send Login Link in an Email" below to sign into that account.
        </Alert> :
        null }
      { this.state.email_address_status.email_address_created ||
        this.state.email_address_status.email_address_deleted ||
        this.state.email_address_status.email_ownership_is_verified ||
        this.state.email_address_status.verification_email_sent ||
        this.state.email_address_status.link_to_sign_in_email_sent ?
        <Alert bsStyle="success">
          { this.state.email_address_status.email_address_created &&
            !this.state.email_address_status.verification_email_sent ? <span>Your email address was saved. </span> : null }
          { this.state.email_address_status.email_address_deleted ? <span>Your email address was deleted. </span> : null }
          { this.state.email_address_status.email_ownership_is_verified ? <span>Your email address was verified. </span> : null }
          { this.state.email_address_status.verification_email_sent ? <span>Please check your email. A verification email was sent. </span> : null }
          { this.state.email_address_status.link_to_sign_in_email_sent ? <span>Please check your email. A sign in link was sent. </span> : null }
        </Alert> :
        null }
      </span>;

    let enterEmailTitle = "Or, sign in with email";
    let enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to be signed into your We Vote account." :
      "You'll receive a magic link in the email on this phone. Click that link to be signed into your We Vote account.";
    if (this.state.voter && this.state.voter.is_signed_in) {
      enterEmailTitle = "Add New Email";
      enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to verify this new email." :
        "You'll receive a magic link in the email on this phone. Click that link to verify this new email.";
    }

    const enterEmailHtml = <div>
      <div><strong>{enterEmailTitle}.</strong> {enterEmailExplanation}</div>
          <form className="form-inline" onSubmit={this.voterEmailAddressSave.bind(this)}>
            <FormGroup className="u-push--sm">
              <label className="sr-only" htmlFor="exampleEmail">Email</label>
              <input className="form-control"
                     type="email"
                     name="voter_email_address"
                     id=""
                     value={this.state.voter_email_address}
                     onChange={this.updateVoterEmailAddress.bind(this)}
                     placeholder="Email Address"/>
            </FormGroup>
            <Button bsStyle="success"
                    type="submit"
                    onClick={this.voterEmailAddressSave.bind(this)}
                    >Send Magic Link</Button>
          </form>

      </div>;

    let allowRemoveEmail;
    let emailOwnershipIsVerified;
    let isPrimaryEmailAddress;

    // ///////////////////////////////////
    // LIST OF VERIFIED EMAILS
    let verifiedEmailsFound = false;
    let verifiedEmailExistsThatIsNotPrimary = false;
    const verifiedEmailListHtml = this.state.voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = voterEmailAddressFromList.email_ownership_is_verified ? true : false;

      if (emailOwnershipIsVerified) {
        verifiedEmailsFound = true;
        allowRemoveEmail = voterEmailAddressFromList.primary_email_address !== true;
        isPrimaryEmailAddress = voterEmailAddressFromList.primary_email_address === true;
        if (!isPrimaryEmailAddress) {
          verifiedEmailExistsThatIsNotPrimary = true;
        }

        return <div key={voterEmailAddressFromList.email_we_vote_id}>
          <div className="position-item card-child" >
            <span><strong>{voterEmailAddressFromList.normalized_email_address}</strong></span>

            {isPrimaryEmailAddress ?
              <span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                Primary email
              </span> :
              null }
          </div>
          {this.state.edit_verified_emails_on && !isPrimaryEmailAddress ?
            <div className="position-item card-child" >
              <span>&nbsp;&nbsp;&nbsp;</span>
              {isPrimaryEmailAddress ?
                null :
                <span>
                  <a on_click={this.set_as_primary_email_address.bind(this, voterEmailAddressFromList.email_we_vote_id)}>
                      Make Primary</a>&nbsp;&nbsp;&nbsp;
                </span>
              }
              <span>&nbsp;&nbsp;&nbsp;</span>
              {allowRemoveEmail ?
                <a onClick={this.remove_voter_email_address.bind(this, voterEmailAddressFromList.email_we_vote_id)}>
                  Remove Email</a> :
                null }
            </div> :
            null }
        </div>;
      } else {
        return null;
      }
    });

    // ////////////////////////////////////
    // LIST OF EMAILS TO VERIFY
    let unverifiedEmailsFound = false;
    const toVerifyEmailListHtml = this.state.voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = voterEmailAddressFromList.email_ownership_is_verified ? true : false;
      if (!emailOwnershipIsVerified) {
        unverifiedEmailsFound = true;
        allowRemoveEmail = voterEmailAddressFromList.primary_email_address ? false : true;
        isPrimaryEmailAddress = voterEmailAddressFromList.primary_email_address ? true : false;
        return <div key={voterEmailAddressFromList.email_we_vote_id}>
          <div className="position-item card-child">
            <span><strong>{voterEmailAddressFromList.normalized_email_address}</strong></span>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <span>To Be Verified</span>
          </div>
          {this.state.edit_emails_to_verify_on ?
            <div className="position-item card-child">
              <span>&nbsp;&nbsp;&nbsp;</span>
              {voterEmailAddressFromList.email_ownership_is_verified ?
                null :
                <a onClick={this.sendVerificationEmail.bind(this, voterEmailAddressFromList.email_we_vote_id)} >
                  Send Verification Again
                </a>}

              <span>&nbsp;&nbsp;&nbsp;</span>
              {allowRemoveEmail ?
                <a onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)} >
                  Remove Email
                </a> :
                null }
            </div> :
            null }
          </div>;
      } else {
        return null;
      }
    });

    return <div className="">
      {emailAddressStatusHtml}
      {verifiedEmailsFound ?
        <div>
          <span className="h3">Your Emails</span>
          { this.state.edit_verified_emails_on ?
            <span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="pull-right" tabIndex="0" onClick={this.editVerifiedEmailsOff.bind(this)} >
                stop editing
              </span>
            </span> :
            <span>
              { verifiedEmailExistsThatIsNotPrimary ? <span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span className="pull-right" tabIndex="0" onClick={this.editVerifiedEmailsOn.bind(this)} >
                    edit
                  </span>
                </span> :
                null }
            </span>
          }
          <br />
          {verifiedEmailListHtml}
        </div> :
        null }

      {unverifiedEmailsFound ?
        <div>
          <span className="h3">Emails to Verify</span>
          { this.state.edit_emails_to_verify_on ?
            <span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="pull-right" tabIndex="0" onClick={this.editEmailsToVerifyOff.bind(this)} >
                stop editing
              </span>
            </span> :
            <span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="pull-right" tabIndex="0" onClick={this.editEmailsToVerifyOn.bind(this)} >
                edit
              </span>
            </span> }
          <br />
          {toVerifyEmailListHtml}
        </div> :
        null }
      <span>{ enterEmailHtml }</span>
    </div>;
  }
}
