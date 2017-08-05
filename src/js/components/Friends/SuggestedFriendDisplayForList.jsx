import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import SuggestedFriendToggle from "../Friends/SuggestedFriendToggle";
import ImageHandler from "../../components/ImageHandler";
import FriendActions from "../../actions/FriendActions";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class SuggestedFriendDisplayForList extends Component {
  static propTypes = {
    children: PropTypes.array,  // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string
  };

  deleteFriendInviteEmail (voter_email_address) {
    // TODO DALE We have a problem with how we are deleting friend invitations.
    // It has to do with retrieve_friend_invitations_sent_by_me on the API server
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voter_email_address);
  }

  deleteFriendInviteVoter (other_voter_we_vote_id) {
    // console.log("deleteFriendInviteVoter");
    FriendActions.deleteFriendInviteVoter(other_voter_we_vote_id);
  }

  ignoreSuggestedFriend (voter_we_vote_id) {
    FriendActions.ignoreSuggestedFriend(voter_we_vote_id);
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
      voter_photo_url_medium,
    } = this.props;

    let voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    let twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voter_display_name is in the voter_twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_display_name, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.voter_twitter_handle ? "/" + this.props.voter_twitter_handle : null;
    let voter_image = <ImageHandler sizeClassName="icon-lg " imageUrl={voter_photo_url_medium} kind_of_ballot_item="CANDIDATE" />;
    let voter_display_name_formatted = <span className="card-child__display-name">{voter_display_name}</span>;

    return <div className="position-item card-child card-child--not-followed">
      <div className="card-child__avatar">
        { voterGuideLink ?
          <Link to={voterGuideLink} className="u-no-underline">
            {voter_image}
          </Link> :
          <span>{voter_image}</span> }
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          { voterGuideLink ?
            <Link to={voterGuideLink} className="u-no-underline">
              {voter_display_name_formatted}
            </Link> :
            <span>{voter_display_name_formatted}</span> }
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
            null}
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            <span>
              <SuggestedFriendToggle other_voter_we_vote_id={voter_we_vote_id}/>
              {/*
              <button className="btn btn-default btn-sm"
                onClick={this.ignoreSuggestedFriend.bind(this, voter_we_vote_id)}>
                Remove
              </button>
              */}
            </span>
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
