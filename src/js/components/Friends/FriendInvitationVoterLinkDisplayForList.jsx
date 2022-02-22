import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../common/utils/logging';
import Avatar from '../Style/avatarStyles';
import { CancelButtonWrapper, FriendButtonsWrapper, FriendColumnWithoutButtons, FriendDisplayOuterWrapper } from '../Style/friendStyles';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import FriendDetails from './FriendDetails';
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
    const detailsHTML = (
      <FriendDetails
        mutualFriends={mutualFriends}
        positionsTaken={positionsTaken}
        twitterDescriptionMinusName={twitterDescriptionMinusName}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
      />
    );

    const friendInvitationHtml = (
      <FriendDisplayOuterWrapper previewMode={previewMode}>
        <FriendColumnWithoutButtons>
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
          <div>
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {detailsHTML}
              </Link>
            ) : (
              <>
                {detailsHTML}
              </>
            )}
          </div>
        </FriendColumnWithoutButtons>
        { invitationsSentByMe ? (
          <FriendButtonsWrapper>
            <CancelButtonWrapper>
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
                    Cancel Invite
                  </>
                )}
              </Button>
            </CancelButtonWrapper>
          </FriendButtonsWrapper>
        ) : (
          <FriendButtonsWrapper>
            <FriendInvitationToggle otherVoterWeVoteId={otherVoterWeVoteId} />
            <IgnoreButtonWrapper>
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
            </IgnoreButtonWrapper>
          </FriendButtonsWrapper>
        )}
      </FriendDisplayOuterWrapper>
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
  voterEmailAddress: PropTypes.string,
  previewMode: PropTypes.bool,
};

const styles = () => ({
  ignoreButton: {
    // fontSize: '12.5px',
  },
});

const IgnoreButtonWrapperNotInColumn = `
/* TODO REMOVE
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
    margin-top: 6px;
  }
  @media(min-width: 520px) {
    margin: 0;
    margin-right: 8px;
  }
*/
`;

const IgnoreButtonWrapper = styled.div`
  margin-bottom: 0;
  margin-left: 8px;
  width: fit-content;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : IgnoreButtonWrapperNotInColumn)}
`;

export default withStyles(styles)(FriendInvitationVoterLinkDisplayForList);
