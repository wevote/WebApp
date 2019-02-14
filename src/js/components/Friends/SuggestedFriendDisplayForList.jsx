import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SuggestedFriendToggle from './SuggestedFriendToggle';
import ImageHandler from '../ImageHandler';
import FriendActions from '../../actions/FriendActions';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

export default class SuggestedFriendDisplayForList extends Component {
  static propTypes = {
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
  };

  deleteFriendInviteEmail (voterEmailAddress) {
    // TODO DALE We have a problem with how we are deleting friend invitations.
    // It has to do with retrieve_friend_invitations_sent_by_me on the API server
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voterEmailAddress);
  }

  deleteFriendInviteVoter (otherVoterWeVoteId) {
    // console.log("deleteFriendInviteVoter");
    FriendActions.deleteFriendInviteVoter(otherVoterWeVoteId);
  }

  ignoreSuggestedFriend (voterWeVoteId) {
    FriendActions.ignoreSuggestedFriend(voterWeVoteId);
  }

  render () {
    renderLog(__filename);
    const {
      voter_twitter_followers_count: voterTwitterFollowersCount,
      voter_we_vote_id: voterWeVoteId,
      voter_photo_url_medium: voterPhotoUrlMedium,
    } = this.props;

    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : '';
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
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
                {voterDisplayNameFormatted}
              </span>
            )}
            { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              <span>
              &nbsp;
                <SuggestedFriendToggle otherVoterWeVoteId={voterWeVoteId} />
              </span>
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
