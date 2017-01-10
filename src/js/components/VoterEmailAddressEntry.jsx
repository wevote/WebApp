import React, { Component } from "react";
import { Alert, Button } from "react-bootstrap";
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
              defaultValue={voter_email_address}
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
        <form onSubmit={this.sendSignInLinkEmail.bind(this)}>
          <input
            type="text"
            onChange={this.updateVoterEmailAddress.bind(this)}
            name="voter_email_address"
            defaultValue={voter_email_address}
            className="form-control text-center"
            placeholder="Sign in with email address"
          />
        </form>

        <div className="u-gutter__top--small">
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
    let email_status_description;
    let is_primary_email_address;
    const email_list_html = this.state.voter_email_address_list.map( (voter_email_address_from_list) => {
      email_ownership_is_verified = voter_email_address_from_list.email_ownership_is_verified ? true : false;
      email_status_description = voter_email_address_from_list.email_ownership_is_verified ? "Email Verified" : "Email Not Verified";
      allow_remove_email = voter_email_address_from_list.primary_email_address ? false : true;
      is_primary_email_address = voter_email_address_from_list.primary_email_address ? true : false;
      return <div key={voter_email_address_from_list.email_we_vote_id}
                  className="position-item card-child card-child--not-followed">
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <h4 className="card-child__display-name">{voter_email_address_from_list.normalized_email_address}</h4>
              {email_status_description}
              {!is_primary_email_address && email_ownership_is_verified ?
                <span> &middot; <a onClick={this.setAsPrimaryEmailAddress.bind(this, voter_email_address_from_list.email_we_vote_id)}>set as primary</a></span> :
                null}
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {allow_remove_email ?
                <Button onClick={this.removeVoterEmailAddress.bind(this, voter_email_address_from_list.email_we_vote_id)}
                      bsStyle="default"
                      bsSize="small">
                Remove Email
              </Button> :
                null }
              {is_primary_email_address ?
              <span>Primary</span> :
              null}
              {voter_email_address_from_list.email_ownership_is_verified ?
                null :
                <Button onClick={this.sendVerificationEmail.bind(this, voter_email_address_from_list.email_we_vote_id)}
                        bsStyle="warning">
                  Send Verification Again
                </Button>}
            </div>
          </div>
        </div>
      </div>;
    });


    return <div className="guidelist card-child__list-group">
      {this.state.voter_email_address_list.length ?
        <span>
          {email_address_status_html}
          {email_list_html}
        </span> :
        <span>{ this.state.email_address_status.email_address_already_owned_by_other_voter ?
          send_link_to_login_html :
          enter_email_html }</span> }
    </div>;
  }
}
