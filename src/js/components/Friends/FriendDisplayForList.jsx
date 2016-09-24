import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendToggle from "../Friends/FriendToggle";
import ImageHandler from "../../components/ImageHandler";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class FriendDisplayForList extends Component {
  static propTypes = {
    key: PropTypes.string,
    children: PropTypes.array,  // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    voter_we_vote_id: PropTypes.string,
    voter_photo_url: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number
  };

  render () {
    const {
      twitter_followers_count,
      voter_we_vote_id,
      voter_photo_url,
    } = this.props;

    let voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : "";
    let twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voter_display_name is in the voter_twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_display_name, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.voter_twitter_handle ? "/" + this.props.voter_twitter_handle : "/voterguide/" + voter_we_vote_id;

    return <div className="position-item card-child card-child--not-followed">
      <div className="card-child__avatar">
        <Link to={voterGuideLink}>
          <ImageHandler imageUrl={voter_photo_url} />
        </Link>
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <Link to={voterGuideLink}>
            <h4 className="card-child__display-name">{voter_display_name}</h4>
          </Link>
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
            null}
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            <FriendToggle other_voter_we_vote_id={voter_we_vote_id}/>
          </div>
          {twitter_followers_count ?
            <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
              {numberWithCommas(twitter_followers_count)}
            </span> :
            null}
        </div>
      </div>
    </div>;
  }
}
