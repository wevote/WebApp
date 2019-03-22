import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ImageHandler from '../ImageHandler';
import FriendActions from '../../actions/FriendActions';
import FriendInvitationToggle from './FriendInvitationToggle';
import FriendStore from '../../stores/FriendStore';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationDisplayForList extends Component {
  static propTypes = {
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    previewMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.onFriendStoreChange();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      isFriend: FriendStore.isFriend(this.props.voter_we_vote_id),
    });
  }

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

  handleIgnore (otherVoterWeVoteId) {
    FriendActions.ignoreFriendInvite(otherVoterWeVoteId);
  }

  render () {
    renderLog(__filename);
    const {
      invitationsSentByMe,
      voter_twitter_followers_count: voterTwitterFollowersCount,
      voter_twitter_handle: voterTwitterHandle,
      voter_we_vote_id: otherVoterWeVoteId,
      voter_photo_url_medium: voterPhotoUrlMedium,
    } = this.props;

    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : '';
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const voterImage = <ImageHandler sizeClassName="image-lg " imageUrl={voterPhotoUrlMedium} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
    // console.log("FriendInvitationDisplayForList, otherVoterWeVoteId:", otherVoterWeVoteId);

    const deleteInvitationHtml = '';

    const friendInvitationHtml = (
      <div>
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
              { invitationsSentByMe ?
                <span> has an open invitation from you.</span> :
                <span> invited you.</span>}
              { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
            </div>
            <div className="card-child__additional">
              {this.state.isFriend ? <span>Is Friend</span> :
                (
                  <div className="card-child__follow-buttons">
                    { this.props.invitationsSentByMe ?
                      <span>{deleteInvitationHtml}</span> : (
                        <span>
                          <FriendInvitationToggle otherVoterWeVoteId={otherVoterWeVoteId} />
                          <button
                            className="btn btn-default btn-sm"
                            onClick={this.handleIgnore.bind(this, otherVoterWeVoteId)}
                            type="button"
                          >
                        Ignore
                          </button>
                        </span>
                      )}
                  </div>
                )
              }
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
      </div>
    );

    if (this.props.previewMode) {
      return <span>{friendInvitationHtml}</span>;
    } else {
      return (
        <section className="card">
          <div className="card-main">
            {friendInvitationHtml}
          </div>
        </section>
      );
    }
  }
}
