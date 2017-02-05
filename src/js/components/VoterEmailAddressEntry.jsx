import React, {Component} from "react";
import {Alert, Button} from "react-bootstrap";
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
    var {voter_email_address} = this.state;
    VoterActions.sendSignInLinkEmail(voter_email_address);
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
    var { voter_email_address } = this.state;
    VoterActions.voterEmailAddressSave(voter_email_address);
    this.setState({loading: true});
  }

  render () {
    var { loading, voter_email_address } = this.state;
    if (loading){
      return LoadingWheel;
    }
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

    const enter_email_html = <div>
      {email_address_status_html}
          <form onSubmit={this.voterEmailAddressSave.bind(this)}>
            <div className="input-group">
              <input
              type="text"
              onChange={this.updateVoterEmailAddress.bind(this)}
              name="voter_email_address"
              value={voter_email_address}
              className="form-control"
              placeholder="Sign in with email address"
            />
            <span className="input-group-btn">
              <Button onClick={this.voterEmailAddressSave.bind(this)}
                      bsStyle="primary">
                Go</Button>
              </span>
            </div>
          </form>

      </div>;

    const send_link_to_login_html = <div>
      {email_address_status_html}
        <form onSubmit={this.sendSignInLinkEmail.bind(this)} className="u-stack--md">
          <input
            type="text"
            onChange={this.updateVoterEmailAddress.bind(this)}
            name="voter_email_address"
            value={voter_email_address}
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

    // ///////////////////////////////////
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
      {verified_emails_found ?
        <div>
          <span className="h3">Your Emails</span>
          { this.state.edit_verified_emails_on ?
            <span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="account-edit-action" tabIndex="0" onClick={this.editVerifiedEmailsOff.bind(this)} >
                stop editing
              </span>
            </span> :
            <span>
              { verified_email_exists_that_is_not_primary ? <span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span className="account-edit-action" tabIndex="0" onClick={this.editVerifiedEmailsOn.bind(this)} >
                    edit
                  </span>
                </span> :
                null }
            </span>
          }
          <br />
          {email_address_status_html}
          {verified_email_list_html}
        </div> :
        null }

      {unverified_emails_found ?
        <div>
          <span className="h3">Emails to Verify</span>
          { this.state.edit_emails_to_verify_on ?
            <span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="account-edit-action" tabIndex="0" onClick={this.editEmailsToVerifyOff.bind(this)} >
                stop editing
              </span>
            </span> :
            <span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="account-edit-action" tabIndex="0" onClick={this.editEmailsToVerifyOn.bind(this)} >
                edit
              </span>
            </span> }
          <br />
          {email_address_status_html}
          {to_verify_email_list_html}
        </div> :
        null }
      { this.state.email_address_status.email_address_already_owned_by_other_voter ?
        send_link_to_login_html :
        null }
      <span><br />{ enter_email_html }</span>
    </div>;
  }
}
