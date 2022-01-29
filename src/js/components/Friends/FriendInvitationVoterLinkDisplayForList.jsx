import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../common/utils/logging';
import { Avatar } from '../Style/avatarStyles';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import FriendInvitationToggle from './FriendInvitationToggle';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

class FriendInvitationVoterLinkDisplayForList extends Component {
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
    const { voterWeVoteId } = this.props;
    const isFriend = FriendStore.isFriend(voterWeVoteId);
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
      classes,
      invitationsSentByMe,
      linkedOrganizationWeVoteId,
      mutualFriends,
      positionsTaken,
      previewMode,
      voterDisplayName,
      voterEmailAddress,
      voterTwitterDescription,
      // voterTwitterFollowersCount,
      voterTwitterHandle,
      voterWeVoteId: otherVoterWeVoteId,
      voterPhotoUrlLarge,
    } = this.props;

    const voterDisplayNameFiltered = voterDisplayName || voterEmailAddress;
    const twitterDescription = voterTwitterDescription || '';
    // If the voterDisplayName is in the twitterDescription, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayNameFiltered, twitterDescription);

    // Link to their voter guide
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = linkedOrganizationWeVoteId ? `/voterguide/${linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayNameFiltered}</span>;
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
                <Suspense fallback={<></>}>
                  {voterImage}
                </Suspense>
              </Link>
            ) : (
              <span>
                <Suspense fallback={<></>}>
                  {voterImage}
                </Suspense>
              </span>
            )}
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
                classes={{ root: classes.ignoreButton }}
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
            <IgnoreButtonContainer>
              <Button
                classes={{ root: classes.ignoreButton }}
                color="primary"
                fullWidth
                onClick={() => this.ignoreFriendInvite(otherVoterWeVoteId)}
                type="button"
                variant="outlined"
              >
                Ignore
              </Button>
            </IgnoreButtonContainer>
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
FriendInvitationVoterLinkDisplayForList.propTypes = {
  classes: PropTypes.object,
  invitationsSentByMe: PropTypes.bool,
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  voterWeVoteId: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterTwitterDescription: PropTypes.string,
  // voterTwitterFollowersCount: PropTypes.number,
  voterEmailAddress: PropTypes.string,
  previewMode: PropTypes.bool,
};

const styles = () => ({
  ignoreButton: {
    // fontSize: '12.5px',
  },
});

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
    justify-content: space-between;
    padding-left: 85px;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
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
    // margin-left: auto;
    // width: fit-content;
    align-items: flex-end;
    // flex-direction: column;
    justify-content: flex-end;
  }
  @media (min-width: 520px) {
    align-items: center;
    // flex-direction: row-reverse;
    justify-content: flex-end;
    width: fit-content;
  }
`;

const IgnoreButtonContainer = styled.div`
  width: 100%;
  margin-left: 12px;
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
    margin-bottom: 6px;
    margin-left: 8px;
  }
  @media(min-width: 520px) {
    margin: 0;
    margin-left: 8px;
  }
`;

const CancelButtonContainer = styled.div`
  width: 100%;
  margin-left: 12px;
  @media(min-width: 400px) {
    margin-left: 8px;
  }
  @media(min-width: 520px) {
    margin: 0;
    margin-left: 8px;
  }
`;

export default withStyles(styles)(FriendInvitationVoterLinkDisplayForList);
