import React, { Component, PropTypes } from "react";
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
        voter_email_address: "",
        voter_email_address_list: []
      };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterActions.retrieveEmailAddress();
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
      this.setState({
        voter_email_address_list: VoterStore.getEmailAddressList(),
        email_address_status: VoterStore.getEmailAddressStatus(),
        loading: false });
  }

  _ballotLoaded (){
    // browserHistory.push(this.props.saveUrl);
  }

  removeVoterEmailAddress (email_we_vote_id) {
    console.log("VoterEmailAddressEntry, removeVoterEmailAddress, email_we_vote_id:", email_we_vote_id);
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
    this.setState({loading: true});
  }

  sendVerificationEmail (email_we_vote_id) {
    VoterActions.sendVerificationEmail(email_we_vote_id);
    this.setState({loading: true});
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
      { this.state.email_address_status.email_address_already_owned_by_other_voter ?
        <Alert bsStyle="danger">
          That email is already being used by another account.
          To sign into that account, please click "Send Login Link in an Email".
        </Alert> :
        null }
      { this.state.email_address_status.email_address_created 
        || this.state.email_address_status.email_address_deleted 
        || this.state.email_address_status.email_ownership_is_verified 
        || this.state.email_address_status.verification_email_sent 
        || this.state.email_address_status.link_to_sign_in_email_sent ?
        <Alert bsStyle="success">
          { this.state.email_address_status.email_address_created ? <span>Your email address was saved. </span> : null }
          { this.state.email_address_status.email_address_deleted ? <span>Your email address was deleted. </span> : null }
          { this.state.email_address_status.email_ownership_is_verified ? <span>Your email address was verified. </span> : null }
          { this.state.email_address_status.verification_email_sent ? <span>Please check your email. A verification email was sent. </span> : null }
          { this.state.email_address_status.link_to_sign_in_email_sent ? <span>Please check your email. An email you can use to sign in was sent. </span> : null }
        </Alert> :
        null }
      </span>;

    const enter_email_html = <div>
      {email_address_status_html}
        <form onSubmit={this.voterEmailAddressSave.bind(this)}>
          <input
            type="text"
            onChange={this.updateVoterEmailAddress.bind(this)}
            name="address"
            value={voter_email_address}
            className="form-control text-center"
            placeholder="Sign in with email address"
          />
        </form>

        <div className="u-gutter__top--small">
          <Button onClick={this.voterEmailAddressSave.bind(this)}
                  bsStyle="primary">
            Send Verification Email</Button>
        </div>
      </div>;

    const send_link_to_login_html = <div>
      {email_address_status_html}
        <form onSubmit={this.voterEmailAddressSave.bind(this)}>
          <input
            type="text"
            onChange={this.updateVoterEmailAddress.bind(this)}
            name="address"
            value={voter_email_address}
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

    var email_status_description;
    const email_list_html = this.state.voter_email_address_list.map( (voter_email_address) => {
      email_status_description = voter_email_address.email_ownership_is_verified ? "Email Verified" : "Email Not Verified";
      console.log("VoterEmailAddressEntry, voter_email_address:", voter_email_address);
      return <div key={voter_email_address.email_we_vote_id}
                  className="position-item card-child card-child--not-followed">
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <h4 className="card-child__display-name">{voter_email_address.normalized_email_address}</h4>
            {email_status_description}
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              <Button onClick={this.removeVoterEmailAddress.bind(this, voter_email_address.email_we_vote_id)}
                      bsStyle="default"
                      bsSize="small">
                Remove Email
              </Button>
              {voter_email_address.email_ownership_is_verified ?
                null :
                <Button onClick={this.sendVerificationEmail.bind(this, voter_email_address.email_we_vote_id)}
                        bsStyle="warning">
                  Send Verification Email Again
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
