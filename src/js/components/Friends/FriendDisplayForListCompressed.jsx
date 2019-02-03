import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";

export default class FriendDisplayForListCompressed extends Component {
  static propTypes = {
    voter_photo_url_medium: PropTypes.string,
    voter_email_address: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    linked_organization_we_vote_id: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const {
      voter_photo_url_medium: voterPhotoUrlMedium,
    } = this.props;

    const alternateVoterDisplayName = this.props.voter_email_address ? this.props.voter_email_address : this.props.voter_twitter_handle;
    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : alternateVoterDisplayName;

    // Link to their voter guide
    const twitterVoterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const weVoteIdVoterGuideLink = this.props.linked_organization_we_vote_id ? `/voterguide/${this.props.linked_organization_we_vote_id}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlMedium} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;

    return (
      <div className="position-item card-child card-child--not-followed">
        <div className="card-child__avatar">
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voterImage}
            </Link>
          ) :
            <span>{voterImage}</span> }
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voterDisplayNameFormatted}
              </Link>
            ) :
              <span>{voterDisplayNameFormatted}</span> }
            {" "}
            is your Friend
          </div>
        </div>
      </div>
    );
  }
}
