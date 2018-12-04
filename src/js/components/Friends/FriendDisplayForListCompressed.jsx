import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";

export default class FriendDisplayForListCompressed extends Component {
  static propTypes = {
    children: PropTypes.array, // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_email_address: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    linked_organization_we_vote_id: PropTypes.string,
    editMode: PropTypes.bool,
  };

  render () {
    renderLog(__filename);
    const {
      voter_photo_url_medium,
    } = this.props;

    const alternate_voter_display_name = this.props.voter_email_address ? this.props.voter_email_address : this.props.voter_twitter_handle;
    const voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : alternate_voter_display_name;

    // Link to their voter guide
    const twitter_voter_guide_link = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const we_vote_id_voter_guide_link = this.props.linked_organization_we_vote_id ? `/voterguide/${this.props.linked_organization_we_vote_id}` : null;
    const voterGuideLink = twitter_voter_guide_link || we_vote_id_voter_guide_link;
    const voter_image = <ImageHandler sizeClassName="icon-lg " imageUrl={voter_photo_url_medium} kind_of_ballot_item="CANDIDATE" />;
    const voter_display_name_formatted = <span className="card-child__display-name">{voter_display_name}</span>;

    return (
      <div className="position-item card-child card-child--not-followed">
        <div className="card-child__avatar">
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voter_image}
            </Link>
          ) :
            <span>{voter_image}</span> }
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voter_display_name_formatted}
              </Link>
            ) :
              <span>{voter_display_name_formatted}</span> }
            {" "}
            is your Friend
          </div>
        </div>
      </div>
    );
  }
}
