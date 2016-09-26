import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import FriendActions from "../../actions/FriendActions";

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
    voter_email_address: PropTypes.string
  };

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
      voter_email_address,
    } = this.props;

    let voter_photo_url = "";

    return <div className="position-item card-child card-child--not-followed">
      <div className="card-child__avatar">
        <ImageHandler imageUrl={voter_photo_url} kind_of_ballot_item="CANDIDATE" />
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <h4 className="card-child__display-name">{voter_email_address}</h4>
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            <span>
              < button className="btn btn-default btn-sm"
                onClick={this.deleteInvitation.bind(this, voter_email_address)}>
                Delete Invitation
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>;
  }
}
