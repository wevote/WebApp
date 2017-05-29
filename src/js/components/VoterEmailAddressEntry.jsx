import React, {Component} from "react";
import {Alert, Button, FormGroup} from "react-bootstrap";
import LoadingWheel from "../components/LoadingWheel";
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
          email_address_already_owned_by_other_voter: false,
          email_address_created: false,
          email_address_deleted: false,
          verification_email_sent: false,
          link_to_sign_in_email_sent: false
        },
        edit_verified_emails_on: false,
        edit_emails_to_verify_on: false,
        voter: VoterStore.getVoter(),
        voter_email_address: "",
        voter_email_address_list: []
      };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
      this.setState({
        voter: VoterStore.getVoter(),
        voter_email_address_list: VoterStore.getEmailAddressList(),
        email_address_status: VoterStore.getEmailAddressStatus(),
        loading: false });
  }

  _ballotLoaded (){
    // browserHistory.push(this.props.saveUrl);
  }

  editVerifiedEmailsOn () {
    this.setState({edit_verified_emails_on: true});
  }

  editVerifiedEmailsOff () {
    this.setState({edit_verified_emails_on: false});
  }

  editEmailsToVerifyOn () {
    this.setState({edit_emails_to_verify_on: true});
  }

  editEmailsToVerifyOff () {
    this.setState({edit_emails_to_verify_on: false});
  }

  removeVoterEmailAddress (email_we_vote_id) {
    VoterActions.removeVoterEmailAddress(email_we_vote_id);
  }

  resetEmailForm () {
    this.setState({
      email_address_status: {
        email_address_already_owned_by_other_voter: false,
        email_address_created: false,
        email_address_deleted: false,
        verification_email_sent: false,
        link_to_sign_in_email_sent: false
      },
      loading: false
    });
  }

  sendSignInLinkEmail (event) {
    event.preventDefault();
    VoterActions.sendSignInLinkEmail(this.state.voter_email_address);
    this.setState({
      email_address_status: {
        email_address_already_owned_by_other_voter: false,
      },
      loading: true
    });
  }

  sendVerificationEmail (email_we_vote_id) {
    VoterActions.sendVerificationEmail(email_we_vote_id);
    this.setState({loading: true});
  }

  setAsPrimaryEmailAddress (email_we_vote_id) {
    VoterActions.setAsPrimaryEmailAddress(email_we_vote_id);
  }

  updateVoterEmailAddress (e) {
    this.setState({
      voter_email_address: e.target.value
    });
  }

  voterEmailAddressSave (event) {
    event.preventDefault();
    let send_link_to_sign_in = true;
    VoterActions.voterEmailAddressSave(this.state.voter_email_address, send_link_to_sign_in);
    this.setState({loading: true});
  }

  render () {
    if (this.state.loading){
      return LoadingWheel;
    }
    //console.log("Entering VoterEmailAddressEntry.jsx");

    const email_address_status_html = <span>
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

    let enter_email_title = "Sign In With Email";
    let enter_email_explanation = "You will receive a magic link in your email inbox. Click that link to be signed into your We Vote account.";
    if (this.state.voter && this.state.voter.is_signed_in) {
      enter_email_title = "Add New Email";
      enter_email_explanation = "You will receive a magic link in your email inbox. Click that link to verify this new email.";
    }
    const enter_email_html = <div>
      <h3 className="h3">{enter_email_title}</h3>
      <div>{enter_email_explanation}</div>
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
            <Button bsStyle="primary"
                    type="submit"
                    onClick={this.voterEmailAddressSave.bind(this)}
                    >Send Verification Link</Button>
          </form>

      </div>;

    const send_link_to_login_html = <div>
        <form onSubmit={this.sendSignInLinkEmail.bind(this)} className="u-stack--md">
          <input
            type="text"
            onChange={this.updateVoterEmailAddress.bind(this)}
            name="voter_email_address"
            value={this.state.voter_email_address}
            className="form-control text-center"
            placeholder="Sign in with email address"
          />
        </form>

        <div className="u-stack--md">
          <Button onClick={this.resetEmailForm.bind(this)}
                  bsStyle="default"
                  bsSize="small">
            Cancel
          </Button>
          <Button onClick={this.sendSignInLinkEmail.bind(this)}
                  bsStyle="primary">
            Send Sign In Link in an Email</Button>
        </div>
      </div>;

    let allow_remove_email;
    let email_ownership_is_verified;
    let is_primary_email_address;

    // ///////////////////////////////////
    // LIST OF VERIFIED EMAILS
    let verified_emails_found = false;
    let verified_email_exists_that_is_not_primary = false;
    const verified_email_list_html = this.state.voter_email_address_list.map( (voter_email_address_from_list) => {
      email_ownership_is_verified = voter_email_address_from_list.email_ownership_is_verified ? true : false;

      if (email_ownership_is_verified) {
        verified_emails_found = true;
        allow_remove_email = voter_email_address_from_list.primary_email_address !== true;
        is_primary_email_address = voter_email_address_from_list.primary_email_address === true;
        if (!is_primary_email_address) {
          verified_email_exists_that_is_not_primary = true;
        }
        return <div key={voter_email_address_from_list.email_we_vote_id}>
          <div className="position-item card-child" >
            <span><strong>{voter_email_address_from_list.normalized_email_address}</strong></span>

            {is_primary_email_address ?
              <span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                Primary email
              </span> :
              null }
          </div>
          {this.state.edit_verified_emails_on && !is_primary_email_address ?
            <div className="position-item card-child" >
              <span>&nbsp;&nbsp;&nbsp;</span>
              {is_primary_email_address ?
                null :
                <span>
                  <a onClick={this.setAsPrimaryEmailAddress.bind(this, voter_email_address_from_list.email_we_vote_id)}>
                      Make Primary</a>&nbsp;&nbsp;&nbsp;
                </span>
              }
              <span>&nbsp;&nbsp;&nbsp;</span>
              {allow_remove_email ?
                <a onClick={this.removeVoterEmailAddress.bind(this, voter_email_address_from_list.email_we_vote_id)}>
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
    let unverified_emails_found = false;
    const to_verify_email_list_html = this.state.voter_email_address_list.map( (voter_email_address_from_list) => {
      email_ownership_is_verified = voter_email_address_from_list.email_ownership_is_verified ? true : false;
      if (!email_ownership_is_verified) {
        unverified_emails_found = true;
        allow_remove_email = voter_email_address_from_list.primary_email_address ? false : true;
        is_primary_email_address = voter_email_address_from_list.primary_email_address ? true : false;
        return <div key={voter_email_address_from_list.email_we_vote_id}>
          <div className="position-item card-child">
            <span><strong>{voter_email_address_from_list.normalized_email_address}</strong></span>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <span>To Be Verified</span>
          </div>
          {this.state.edit_emails_to_verify_on ?
            <div className="position-item card-child">
              <span>&nbsp;&nbsp;&nbsp;</span>
              {voter_email_address_from_list.email_ownership_is_verified ?
                null :
                <a onClick={this.sendVerificationEmail.bind(this, voter_email_address_from_list.email_we_vote_id)} >
                  Send Verification Again
                </a>}

              <span>&nbsp;&nbsp;&nbsp;</span>
              {allow_remove_email ?
                <a onClick={this.removeVoterEmailAddress.bind(this, voter_email_address_from_list.email_we_vote_id)} >
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

    return <div className="guidelist card-child__list-group">
      {email_address_status_html}
      {verified_emails_found ?
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
              { verified_email_exists_that_is_not_primary ? <span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span className="pull-right" tabIndex="0" onClick={this.editVerifiedEmailsOn.bind(this)} >
                    edit
                  </span>
                </span> :
                null }
            </span>
          }
          <br />
          {verified_email_list_html}
        </div> :
        null }

      {unverified_emails_found ?
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
          {to_verify_email_list_html}
        </div> :
        null }
      {/* this.state.email_address_status.email_address_already_owned_by_other_voter ?
        send_link_to_login_html :
        null */}
      <span>{ enter_email_html }</span>
    </div>;
  }
}
