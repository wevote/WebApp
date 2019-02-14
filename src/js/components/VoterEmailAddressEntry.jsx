import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { isWebApp } from '../utils/cordovaUtils';
import LoadingWheel from './LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterActions from '../actions/VoterActions';
import VoterStore from '../stores/VoterStore';

export default class VoterEmailAddressEntry extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      editEmailsToVerifyOn: false,
      editVerifiedEmailsOn: false,
      emailAddressStatus: {
        email_address_already_owned_by_other_voter: false,
        email_address_created: false,
        email_address_deleted: false,
        verification_email_sent: false,
        link_to_sign_in_email_sent: false,
      },
      voter: VoterStore.getVoter(),
      voterEmailAddress: '',
      voterEmailAddressList: [],
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      voterEmailAddressList: VoterStore.getEmailAddressList(),
      emailAddressStatus: VoterStore.getEmailAddressStatus(),
      loading: false,
    });
  }

  setEditVerifiedEmailsOn () {
    this.setState({ editVerifiedEmailsOn: true });
  }

  setEditVerifiedEmailsOff () {
    this.setState({ editVerifiedEmailsOn: false });
  }

  setEditEmailsToVerifyOn () {
    this.setState({ editEmailsToVerifyOn: true });
  }

  setEditEmailsToVerifyOff () {
    this.setState({ editEmailsToVerifyOn: false });
  }

  setAsPrimaryEmailAddress (emailWeVoteId) {
    VoterActions.setAsPrimaryEmailAddress(emailWeVoteId);
  }

  voterEmailAddressSave = (event) => {
    event.preventDefault();
    const sendLinkToSignIn = true;
    VoterActions.voterEmailAddressSave(this.state.voterEmailAddress, sendLinkToSignIn);
    this.setState({ loading: true });
  }

  removeVoterEmailAddress (emailWeVoteId) {
    VoterActions.removeVoterEmailAddress(emailWeVoteId);
  }

  resetEmailForm () {
    this.setState({
      emailAddressStatus: {
        email_address_already_owned_by_other_voter: false,
        email_address_created: false,
        email_address_deleted: false,
        verification_email_sent: false,
        link_to_sign_in_email_sent: false,
      },
      loading: false,
    });
  }

  sendSignInLinkEmail (event) {
    event.preventDefault();
    VoterActions.sendSignInLinkEmail(this.state.voterEmailAddress);
    this.setState({
      emailAddressStatus: {
        email_address_already_owned_by_other_voter: false,
      },
      loading: true,
    });
  }

  sendVerificationEmail (emailWeVoteId) {
    VoterActions.sendVerificationEmail(emailWeVoteId);
    this.setState({ loading: true });
  }

  updateVoterEmailAddress (e) {
    this.setState({
      voterEmailAddress: e.target.value,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      return LoadingWheel;
    }

    const emailAddressStatusHtml = (
      <span>
        { this.state.emailAddressStatus.email_address_already_owned_by_other_voter &&
          !this.state.emailAddressStatus.link_to_sign_in_email_sent ? (
            <Alert variant="warning">
            That email is already being used by another account.
              <br />
              <br />
            Please click &quot;Send Login Link in an Email&quot; below to sign into that account.
            </Alert>
          ) : null
        }
        { this.state.emailAddressStatus.email_address_created ||
        this.state.emailAddressStatus.email_address_deleted ||
        this.state.emailAddressStatus.email_ownership_is_verified ||
        this.state.emailAddressStatus.verification_email_sent ||
        this.state.emailAddressStatus.link_to_sign_in_email_sent ? (
          <Alert variant="success">
            { this.state.emailAddressStatus.email_address_created &&
            !this.state.emailAddressStatus.verification_email_sent ? <span>Your email address was saved. </span> : null }
            { this.state.emailAddressStatus.email_address_deleted ? <span>Your email address was deleted. </span> : null }
            { this.state.emailAddressStatus.email_ownership_is_verified ? <span>Your email address was verified. </span> : null }
            { this.state.emailAddressStatus.verification_email_sent ? <span>Please check your email. A verification email was sent. </span> : null }
            { this.state.emailAddressStatus.link_to_sign_in_email_sent ? <span>Please check your email. A sign in link was sent. </span> : null }
          </Alert>
          ) : null
        }
      </span>
    );

    let enterEmailTitle = 'Or, sign in with email';
    let enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to be signed into your We Vote account." :
      "You'll receive a magic link in the email on this phone. Click that link to be signed into your We Vote account.";
    if (this.state.voter && this.state.voter.is_signed_in) {
      enterEmailTitle = 'Add New Email';
      enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to verify this new email." :
        "You'll receive a magic link in the email on this phone. Click that link to verify this new email.";
    }

    const enterEmailHtml = (
      <div>
        <div className="u-stack--sm">
          <strong>
            {enterEmailTitle}
            .
          </strong>
          {' '}
          {enterEmailExplanation}
        </div>
        <form className="form-inline" onSubmit={this.voterEmailAddressSave.bind(this)}>
          <input
            className="form-control col-sm-8 mr-sm-3 u-stack--xs"
            type="email"
            name="voter_email_address"
            id=""
            value={this.state.voterEmailAddress}
            onChange={this.updateVoterEmailAddress.bind(this)}
            placeholder="Email Address"
          />
          <Button
            className="u-stack--xs"
            variant="success"
            type="submit"
            onClick={this.voterEmailAddressSave}
          >
            Send Magic Link
          </Button>
        </form>
      </div>
    );

    let allowRemoveEmail;
    let emailOwnershipIsVerified;
    let isPrimaryEmailAddress;

    // ///////////////////////////////////
    // LIST OF VERIFIED EMAILS
    let verifiedEmailsFound = false;
    let verifiedEmailExistsThatIsNotPrimary = false;
    const verifiedEmailListHtml = this.state.voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = !!voterEmailAddressFromList.email_ownership_is_verified;

      if (emailOwnershipIsVerified) {
        verifiedEmailsFound = true;
        allowRemoveEmail = voterEmailAddressFromList.primary_email_address !== true;
        isPrimaryEmailAddress = voterEmailAddressFromList.primary_email_address === true;
        if (!isPrimaryEmailAddress) {
          verifiedEmailExistsThatIsNotPrimary = true;
        }

        return (
          <div key={voterEmailAddressFromList.email_we_vote_id}>
            <div className="position-item card-child">
              <span><strong>{voterEmailAddressFromList.normalized_email_address}</strong></span>

              {isPrimaryEmailAddress ? (
                <span>
                  <span>&nbsp;&nbsp;&nbsp;</span>
                Primary email
                </span>
              ) : null
              }
            </div>
            {this.state.editVerifiedEmailsOn && !isPrimaryEmailAddress ? (
              <div className="position-item card-child">
                <span>&nbsp;&nbsp;&nbsp;</span>
                {isPrimaryEmailAddress ?
                  null : (
                    <span>
                      <a onClick={this.setAsPrimaryEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}>
                      Make Primary
                      </a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  )}
                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveEmail ? (
                  <a onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}>
                  Remove Email
                  </a>
                ) : null
                }
              </div>
            ) : null
            }
          </div>
        );
      } else {
        return null;
      }
    });

    // ////////////////////////////////////
    // LIST OF EMAILS TO VERIFY
    let unverifiedEmailsFound = false;
    const toVerifyEmailListHtml = this.state.voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = !!voterEmailAddressFromList.email_ownership_is_verified;
      if (!emailOwnershipIsVerified) {
        unverifiedEmailsFound = true;
        allowRemoveEmail = !voterEmailAddressFromList.primary_email_address;
        isPrimaryEmailAddress = !!voterEmailAddressFromList.primary_email_address;
        return (
          <div key={voterEmailAddressFromList.email_we_vote_id}>
            <div className="position-item card-child">
              <span><strong>{voterEmailAddressFromList.normalized_email_address}</strong></span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span>To Be Verified</span>
            </div>
            {this.state.editEmailsToVerifyOn ? (
              <div className="position-item card-child">
                <span>&nbsp;&nbsp;&nbsp;</span>
                {voterEmailAddressFromList.email_ownership_is_verified ?
                  null : (
                    <a onClick={this.sendVerificationEmail.bind(this, voterEmailAddressFromList.email_we_vote_id)}>
                      Send Verification Again
                    </a>
                  )}

                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveEmail ? (
                  <a onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}>
                    Remove Email
                  </a>
                ) : null
                }
              </div>
            ) : null
            }
          </div>
        );
      } else {
        return null;
      }
    });

    return (
      <div className="">
        {emailAddressStatusHtml}
        {verifiedEmailsFound ? (
          <div>
            <span className="h3">Your Emails</span>
            { this.state.editVerifiedEmailsOn ? (
              <span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="pull-right" onClick={this.setEditVerifiedEmailsOff.bind(this)}>
                stop editing
                </span>
              </span>
            ) : (
              <span>
                { verifiedEmailExistsThatIsNotPrimary ? (
                  <span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span className="pull-right" onClick={this.setEditVerifiedEmailsOn.bind(this)}>
                      edit
                    </span>
                  </span>
                ) :
                  null }
              </span>
            )}
            <br />
            {verifiedEmailListHtml}
          </div>
        ) :
          null }

        {unverifiedEmailsFound ? (
          <div>
            <span className="h3">Emails to Verify</span>
            { this.state.editEmailsToVerifyOn ? (
              <span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="pull-right" onClick={this.setEditEmailsToVerifyOff.bind(this)}>
                stop editing
                </span>
              </span>
            ) : (
              <span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="pull-right" onClick={this.setEditEmailsToVerifyOn.bind(this)}>
                edit
                </span>
              </span>
            )}
            <br />
            {toVerifyEmailListHtml}
          </div>
        ) :
          null }
        <div className="u-stack--sm">{ enterEmailHtml }</div>
      </div>
    );
  }
}
