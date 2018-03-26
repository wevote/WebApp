import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import FriendToggle from "../Friends/FriendToggle";
import ImageHandler from "../../components/ImageHandler";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class FriendDisplayForList extends Component {
  static propTypes = {
    children: PropTypes.array,  // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_email_address: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    linked_organization_we_vote_id: PropTypes.string,
    editMode: PropTypes.bool
  };

  render () {
    renderLog(__filename);
    const {
      voter_twitter_followers_count,
      voter_we_vote_id,
      voter_photo_url_medium,
    } = this.props;

    let alternate_voter_display_name = this.props.voter_email_address ? this.props.voter_email_address : this.props.voter_twitter_handle;
    let voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : alternate_voter_display_name;
    let twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voter_display_name is in the voter_twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_display_name, twitterDescription);

    // Link to their voter guide
    let twitter_voter_guide_link = this.props.voter_twitter_handle ? "/" + this.props.voter_twitter_handle : null;
    let we_vote_id_voter_guide_link = this.props.linked_organization_we_vote_id ? "/voterguide/" + this.props.linked_organization_we_vote_id : null;
    let voterGuideLink = twitter_voter_guide_link ? twitter_voter_guide_link : we_vote_id_voter_guide_link;
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
            <span>{voter_display_name_formatted}</span> } is your Friend
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
            null}
          { voterGuideLink ?
            <span><br /><Link to={voterGuideLink} className="u-no-underline">See your friend's voter guide.</Link></span> :
            null}
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            { this.props.editMode ? <FriendToggle other_voter_we_vote_id={voter_we_vote_id}/> : null }
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
