import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendInvitationToggle from "../Friends/FriendInvitationToggle";
import ImageHandler from "../../components/ImageHandler";
import FriendActions from "../../actions/FriendActions";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class FriendInvitationDisplayForList extends Component {
  static propTypes = {
    key: PropTypes.string,
    children: PropTypes.array,  // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string
  };

  deleteInvitation (other_voter_we_vote_id) {
    FriendActions.deleteFriendInvite(other_voter_we_vote_id);
    // this.setState({
    //   friend_invitations_list: this.state.friend_invitations_list.filter( (friend) => {
    //     return friend.voter_we_vote_id !== voter_we_vote_id;
    //   })
    // });
  }

  handleIgnore (voter_we_vote_id) {
    FriendActions.ignoreFriendInvite(voter_we_vote_id);
    this.setState({
      friend_invitations_list: this.state.friend_invitations_list.filter( (friend) => {
        return friend.voter_we_vote_id !== voter_we_vote_id;
      })
    });
  }

  render () {
    const {
      voter_twitter_followers_count,
      voter_we_vote_id,
      voter_photo_url,
    } = this.props;

    let voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    let twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voter_display_name is in the voter_twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_display_name, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.voter_twitter_handle ? "/" + this.props.voter_twitter_handle : null;
    let voter_image = <ImageHandler sizeClassName="icon-lg " imageUrl={voter_photo_url} kind_of_ballot_item="CANDIDATE" />;
    let voter_display_name_formatted = <h4 className="card-child__display-name">{voter_display_name}</h4>;

    return <div className="position-item card-child card-child--not-followed">
      <div className="card-child__avatar">
        { voterGuideLink ?
          <Link to={voterGuideLink} className="no-underline">
            {voter_image}
          </Link> :
          <span>{voter_image}</span> }
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          { voterGuideLink ?
            <Link to={voterGuideLink} className="no-underline">
              {voter_display_name_formatted}
            </Link> :
            <span>{voter_display_name_formatted}</span> }
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
            null}
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            { this.props.invitationsSentByMe ?
              <span>
                <button className="btn btn-default btn-sm"
                  onClick={this.deleteInvitation.bind(this, voter_we_vote_id)}>
                  Delete Invitation
                </button>
              </span> :
              <span>
                <FriendInvitationToggle other_voter_we_vote_id={voter_we_vote_id}/>
                < button className="btn btn-default btn-sm"
                  onClick={this.handleIgnore.bind(this, voter_we_vote_id)}>
                  Ignore
                </button>
              </span>
            }
          </div>
          {voter_twitter_followers_count ?
            <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
              {numberWithCommas(voter_twitter_followers_count)}
            </span> :
            null}
        </div>
      </div>
    </div>;
  }
}
