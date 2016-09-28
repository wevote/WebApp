import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import FriendActions from "../../actions/FriendActions";
import VoterStore from "../../stores/VoterStore";

export default class FriendInvitationEmailForList extends Component {
  static propTypes = {
    key: PropTypes.string,
    children: PropTypes.array,
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    invitation_status: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {}
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  deleteInvitation (voter_email_address) {
    FriendActions.deleteFriendInviteEmail(voter_email_address);
    // this.setState({
    //   friend_invitations_list: this.state.friend_invitations_list.filter( (friend) => {
    //     return friend.voter_we_vote_id !== voter_we_vote_id;
    //   })
    // });
  }

  render () {
    const {
      invitation_status, voter_email_address,
    } = this.props;

    var {voter} = this.state;

    return <div className="position-item card-child card-child--not-followed">
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <h5 className="card-child__display-name">{voter_email_address}</h5>
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            <button className="btn btn-default btn-sm"
              onClick={this.deleteInvitation.bind(this, voter_email_address)}>
              Delete Invitation
            </button>
            {invitation_status === "PENDING_EMAIL_VERIFICATION" && !voter.signed_in_with_email ?
              <Link to="/more/sign_in">
                <Button bsSize="small" bsStyle="warning">
                  Verify Your Email To Send
                </Button>
              </Link> :
              null }
          </div>
        </div>
      </div>
    </div>;
  }
}
