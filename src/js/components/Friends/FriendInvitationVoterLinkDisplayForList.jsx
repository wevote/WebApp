import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ImageHandler from '../ImageHandler';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import FriendActions from '../../actions/FriendActions';
import FriendInvitationToggle from './FriendInvitationToggle';
import FriendStore from '../../stores/FriendStore';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class FriendInvitationVoterLinkDisplayForList extends Component {
  static propTypes = {
    invitationsSentByMe: PropTypes.bool,
    linked_organization_we_vote_id: PropTypes.string,
    mutual_friends: PropTypes.number,
    positions_taken: PropTypes.number,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_large: PropTypes.string,
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
      cancelFriendInviteVoterSubmitted: false,
      isFriend: false,
    };
    this.cancelFriendInviteVoter = this.cancelFriendInviteVoter.bind(this);
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
    const isFriend = FriendStore.isFriend(this.props.voter_we_vote_id);
    this.setState({
      isFriend,
    });
  }

  cancelFriendInviteVoter (otherVoterWeVoteId) {
    // console.log("cancelFriendInviteVoter");
    FriendActions.cancelFriendInviteVoter(otherVoterWeVoteId);
    this.setState({
      cancelFriendInviteVoterSubmitted: true,
    });
  }

  ignoreFriendInvite (otherVoterWeVoteId) {
    FriendActions.ignoreFriendInvite(otherVoterWeVoteId);
  }

  render () {
    renderLog('FriendInvitationVoterLinkDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders

    // Do not render if already a friend
    const { cancelFriendInviteVoterSubmitted, isFriend } = this.state;
    if (isFriend) {
      // We still want to show the invite
    }

    const {
      invitationsSentByMe,
      mutual_friends: mutualFriends,
      positions_taken: positionsTaken,
      previewMode,
      // voter_twitter_followers_count: voterTwitterFollowersCount,
      voter_twitter_handle: voterTwitterHandle,
      voter_we_vote_id: otherVoterWeVoteId,
      voter_photo_url_large: voterPhotoUrlLarge,
    } = this.props;

    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : '';
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // Link to their voter guide
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = this.props.linked_organization_we_vote_id ? `/voterguide/${this.props.linked_organization_we_vote_id}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
    const detailsHTML = (
      <Details>
        <Name>
          {voterDisplayNameFormatted}
        </Name>
        {!!(positionsTaken) && (
          <Info>
            Opinions:
            {' '}
            <strong>{positionsTaken}</strong>
          </Info>
        )}
        {!!(mutualFriends) && (
          <Info>
            Mutual Friends:
            {' '}
            <strong>{mutualFriends || 0}</strong>
          </Info>
        )}
        { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
      </Details>
    );

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
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {detailsHTML}
            </Link>
          ) : (
            <>
              {detailsHTML}
            </>
          )}
        </Flex>
        { invitationsSentByMe ? (
          <ButtonWrapper>
            <CancelButtonContainer>
              <Button
                color="primary"
                disabled={cancelFriendInviteVoterSubmitted}
                fullWidth
                onClick={() => this.cancelFriendInviteVoter(otherVoterWeVoteId)}
                variant="outlined"
              >
                {cancelFriendInviteVoterSubmitted ? 'Canceling...' : (
                  <>
                    <span className="u-show-mobile">
                      Cancel
                    </span>
                    <span className="u-show-desktop-tablet">
                      Cancel Invite
                    </span>
                  </>
                )}
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
                {isMobileScreenSize() ? 'Delete' : 'Delete'}
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
  justify-content: flex-start;
  position: relative;
  flex-wrap: wrap;
  @media(min-width: 400px) {
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    padding-left: 100px;
    height: 68px;
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
  justify-content: flex-start;
`;

const Avatar = styled.div`
  max-width: 68.8px;
  margin-right: 8px;
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
      border-radius: 6px;
      width: 68.8px;
      height: 68.8px;
    }
  }
`;

const Details = styled.div`
  margin: 0 auto;
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
  }
`;

const Name = styled.h3`
  color: black !important;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 23ch;
  width: 100%;
  @media(max-width: 321px) {
    max-width: 20ch;
  }
  @media (min-width: 322px) and (max-width: 370px) {
    max-width: 20ch;
  }
  @media (min-width: 371px) and (max-width: 441px) {
    max-width: 20ch;
  }
  @media (min-width: 442px) and (max-width: 519px) {
    max-width: 12ch;
  }
  @media (min-width: 520px) and (max-width: 559px) {
    max-width: 15ch;
  }
  @media (min-width: 560px) and (max-width: 653px) {
    max-width: 20ch;
  }
  @media (min-width: 654px) and (max-width: 773px) {
    max-width: 25ch;
  }
  @media (min-width: 774px) and (max-width: 991px) {
    max-width: 34ch;
  }
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

export default FriendInvitationVoterLinkDisplayForList;
