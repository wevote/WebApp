import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import FriendToggle from "./FriendToggle";
import ImageHandler from "../ImageHandler";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class FriendDisplayForList extends Component {
  static propTypes = {
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
      voter_twitter_followers_count: voterTwitterFollowersCount,
      voter_we_vote_id: voterWeVoteId,
      voter_photo_url_medium: voterPhotoUrlMedium,
    } = this.props;

    const alternateVoterDisplayName = this.props.voter_email_address ? this.props.voter_email_address : this.props.voter_twitter_handle;
    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : alternateVoterDisplayName;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

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
            ) : (
              <span>
                &nbsp;
                {" "}
                {voterDisplayNameFormatted}
              </span>
            )}
            {" "}
            is your Friend
            { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
              null}
            { voterGuideLink ? (
              <span>
                <br />
                <Link to={voterGuideLink} className="u-no-underline">See your friend&apos;s voter guide.</Link>
              </span>
            ) : null
            }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              { this.props.editMode ? <FriendToggle otherVoterWeVoteId={voterWeVoteId} /> : null }
            </div>
            {voterTwitterFollowersCount ? (
              <span className="twitter-followers__badge">
                <span className="fa fa-twitter twitter-followers__icon" />
                {numberWithCommas(voterTwitterFollowersCount)}
              </span>
            ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
