import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import ImageHandler from '../ImageHandler';
import FriendActions from '../../actions/FriendActions';
import FriendInvitationToggle from './FriendInvitationToggle';
import FriendStore from '../../stores/FriendStore';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class FriendInvitationDisplayForList extends Component {
  static propTypes = {
    invitationsSentByMe: PropTypes.bool,
    mutual_friends: PropTypes.number,
    positions_taken: PropTypes.number,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    // voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    previewMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      isFriend: false,
    };
    this.ignoreFriendInvite = this.ignoreFriendInvite.bind(this);
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

  ignoreFriendInvite (otherVoterWeVoteId) {
    FriendActions.ignoreFriendInvite(otherVoterWeVoteId);
  }

  render () {
    renderLog('FriendInvitationDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders

    // Do not render if already a friend
    const { isFriend } = this.state;
    if (isFriend) {
      return null;
    }

    const {
      invitationsSentByMe,
      mutual_friends: mutualFriends,
      positions_taken: positionsTaken,
      previewMode,
      // voter_twitter_followers_count: voterTwitterFollowersCount,
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

    const friendInvitationHtml = (
      <Wrapper previewMode={previewMode}>
        <Flex>
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
            {!!(positionsTaken) && (
              <Info>
                Positions:
                {' '}
                <strong>{positionsTaken}</strong>
              </Info>
            )}
            <Info>
              Mutual Friends:
              {' '}
              <strong>{mutualFriends || 0}</strong>
            </Info>
            {/* { invitationsSentByMe ?
              null :
              <span> invited you.</span>} */}
            { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
            {/* {voterTwitterFollowersCount ? (
              <span className="twitter-followers__badge">
                <span className="fab fa-twitter" />
                {numberWithCommas(voterTwitterFollowersCount)}
              </span>
            ) : null
              } */}
          </Details>
        </Flex>
        { invitationsSentByMe ? (
          <ButtonWrapper>
            <CancelButtonContainer>
              <Button
                color="primary"
                fullWidth
                onClick={() => this.deleteFriendInviteVoter(otherVoterWeVoteId)}
                variant="outlined"
              >
                Cancel Invite
              </Button>
            </CancelButtonContainer>
          </ButtonWrapper>
        ) : (
          <ButtonWrapper>
            <FriendInvitationToggle otherVoterWeVoteId={otherVoterWeVoteId} />
            <ButtonContainer>
              <Button
                color="primary"
                fullWidth
                onClick={() => this.ignoreFriendInvite(otherVoterWeVoteId)}
                type="button"
                variant="outlined"
              >
                {window.innerWidth > 620 ? 'Delete' : 'Delete'}
              </Button>
            </ButtonContainer>
          </ButtonWrapper>
        )}
      </Wrapper>
    );

    if (previewMode) {
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
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-wrap: wrap;
  @media(min-width: 400px) {
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    padding-left: 100px;
  }
  @media (min-width: 520px) {
    height: 68px;
    padding-left: 85px;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const Avatar = styled.div`
  width: 25%;
  max-width: 100px;
  margin-right: 8px;
  & img {
    width: 100%;
  }
  @media (min-width: 400px) {
    height: 100% !important;
    max-width: 100%;
    min-height: 100% !important;
    max-height: 100% !important;
    position: absolute !important;
    left: 0;
    top: 0;
    margin: 0 auto;
    & img {
      height: 100%;
      width: auto;
      border-radius: 6px;
      max-width: 68.8px;
      max-height: 68.8px;
    }
  }
`;

const Details = styled.div`
  width: 50%;
  margin: 0 auto;
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
  }
`;

const Name = styled.h3`
  font-weight: bold;
  color: black !important;
  font-size: 26px;
  margin-bottom: 4px;
  text-align: center;
  width: 100%;
  @media(min-width: 400px) {
    text-align: left;
    font-size: 22px;
    width: fit-content;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media (min-width: 400px){
    display: block;
    width: fit-content;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media(min-width: 400px) {
    margin: 0;
    margin-left: auto;
    width: fit-content;
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
  }
  @media (min-width: 520px) {
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-left: 12px;
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
    margin-top: 6px;
  }
  @media(min-width: 520px) {
    margin: 0;
    margin-right: 8px;
  }
`;

const CancelButtonContainer = styled.div`
  width: 100%;
  margin-right: 12px;
  @media(min-width: 520px) {
    margin: 0;
    margin-right: 8px;
  }
`;

export default FriendInvitationDisplayForList;
