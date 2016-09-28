import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../components/LoadingWheel";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class VoterEmailAddressEntry extends Component {
  static propTypes = {
  };

  constructor (props) {
      super(props);
      this.state = {
        loading: false,
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
        loading: false });
  }

  _ballotLoaded (){
    // browserHistory.push(this.props.saveUrl);
  }

  updateVoterEmailAddress (e) {
    this.setState({
      voter_email_address: e.target.value
    });
  }

  saveVoterEmailAddress (event) {
    event.preventDefault();
    var { voter_email_address } = this.state;
    VoterActions.saveVoterEmailAddress(voter_email_address);
    this.setState({loading: true});
  }

  sendVerificationEmail (event, email_we_vote_id) {
    event.preventDefault();
    VoterActions.sendVerificationEmail(email_we_vote_id);
    this.setState({loading: true});
  }

  deleteInvitation (voter_email_address) {
    //FriendActions.deleteFriendInviteEmail(voter_email_address);
    // this.setState({
    //   friend_invitations_list: this.state.friend_invitations_list.filter( (friend) => {
    //     return friend.voter_we_vote_id !== voter_we_vote_id;
    //   })
    // });
  }

  render () {
    var { loading, voter_email_address } = this.state;
    if (loading){
      return LoadingWheel;
    }
    const enter_email_html = <div>
        <form onSubmit={this.saveVoterEmailAddress.bind(this)}>
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
          <Button onClick={this.saveVoterEmailAddress.bind(this)}
                  bsStyle="primary">
            Send Verification Email</Button>
        </div>
      </div>;

    var email_status_description;
    const email_list_html = this.state.voter_email_address_list.map( (voter_email_address) => {
      email_status_description = (voter_email_address.email_ownership_is_verified) ? "Email Verified" : "Email Not Verified";
      return <div key={voter_email_address.email_we_vote_id}
                  className="position-item card-child card-child--not-followed">
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <h4 className="card-child__display-name">{voter_email_address.normalized_email_address}</h4>
            {email_status_description}
          </div>
          {voter_email_address.email_ownership_is_verified ?
            null :
            <div className="card-child__additional">
              <div className="card-child__follow-buttons">
                <Button onClick={this.sendVerificationEmail.bind(this, voter_email_address.email_we_vote_id)}
                        bsStyle="warning">
                  Send Verification Email Again
                </Button>
              </div>
            </div>}
        </div>
      </div>;
    });


    return <div className="guidelist card-child__list-group">
      {this.state.voter_email_address_list.length ?
      email_list_html :
      enter_email_html }
    </div>;
  }
}
