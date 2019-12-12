import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
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
    renderLog('FriendInvitationDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
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
      <Wrapper>
        <Avatar>
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voterImage}
            </Link>
          ) :
            <span>{voterImage}</span> }
        </Avatar>
        <Details>
          {voterGuideLink ? (
            <Name>
              <Link to={voterGuideLink} className="u-no-underline">
                {voterDisplayNameFormatted}
              </Link>
            </Name>
          ) : (
            <Name>{voterDisplayNameFormatted}</Name>
          )}
          <Info>
            Positions:
            <strong>7</strong>
          </Info>
          <Info>
            Mutual Friends:
            <strong>23</strong>
          </Info>
          { invitationsSentByMe ?
            null :
            <span> invited you.</span>}
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
          {/* {voterTwitterFollowersCount ? (
            <span className="twitter-followers__badge">
              <span className="fab fa-twitter" />
              {numberWithCommas(voterTwitterFollowersCount)}
            </span>
          ) : null
            } */}
        </Details>
        <ButtonWrapper>
          {this.state.isFriend ? <span>Is Friend</span> : (
            <>
              { this.props.invitationsSentByMe ? (
                <Button variant="outlined" color="primary">
                  Cancel
                </Button>
              ) : (
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
            </>
          )}
        </ButtonWrapper>
      </Wrapper>
    );

    if (this.props.previewMode) {
      return <span>{friendInvitationHtml}</span>;
    } else {
      return (
        <div>
          {friendInvitationHtml}
        </div>
      );
    }
  }
}

const Wrapper = styled.div`
  margin: 24px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding-left: 85px;
  height: 68px;
`;

const Avatar = styled.div`
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  position: absolute !important;
  left: 0;
  top: 0;
  & img {
    height: 100%;
    width: auto;
    border-radius: 6px;
  }
`;

const Details = styled.div`

`;

const Name = styled.h3`
  font-weight: bold;
  color: black !important;
  font-size: 22px;
  margin-bottom: 4px;
`;

const Info = styled.div`
  display: block;
`;

const ButtonWrapper = styled.div`
  margin-left: auto;
`;
