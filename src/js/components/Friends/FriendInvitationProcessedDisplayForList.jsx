import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ImageHandler from '../ImageHandler';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationProcessedDisplayForList extends Component {
  static propTypes = {
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    invitation_sent_to: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const {
      voter_twitter_followers_count: voterTwitterFollowersCount,
      voter_photo_url_medium: voterPhotoUrlMedium,
    } = this.props;

    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const { invitation_sent_to: invitationSentTo } = this.props;
    let invitationSentToHtml;
    if (invitationSentTo) {
      invitationSentToHtml = (
        <span>
          Sent to:
          {invitationSentTo}
        </span>
      );
    }
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : '';
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlMedium} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <h4 className="card-child__display-name">{voterDisplayName}</h4>;

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
            {invitationSentToHtml ? (
              <span>
                <br />
                {invitationSentToHtml}
              </span>
            ) : null
            }
            { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons" />
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
