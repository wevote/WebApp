import { Button } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import Avatar from '../Style/avatarStyles';
import { CancelButtonWrapper, FriendButtonsWrapper, FriendColumnWithoutButtons, FriendDisplayOuterWrapper } from '../Style/friendStyles';
import FriendDetails from './FriendDetails';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

class FriendInvitationEmailLinkDisplayForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cancelFriendInviteEmailSubmitted: false,
      voter: {},
    };
    this.cancelFriendInviteEmail = this.cancelFriendInviteEmail.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  cancelFriendInviteEmail (voterEmailAddress) {
    // console.log("cancelFriendInviteEmail");
    FriendActions.cancelFriendInviteEmail(voterEmailAddress);
    this.setState({
      cancelFriendInviteEmailSubmitted: true,
    });
  }

  render () {
    renderLog('FriendInvitationEmailLinkDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes,
      invitationState,
      linkedOrganizationWeVoteId,
      mutualFriends,
      positionsTaken,
      previewMode,
      voterDisplayName,
      voterTwitterHandle,
      voterEmailAddress,
      voterPhotoUrlLarge,
    } = this.props;

    const { cancelFriendInviteEmailSubmitted, voter } = this.state;
    let invitationStateText;
    if (invitationState === 'PENDING_EMAIL_VERIFICATION') {
      invitationStateText = 'Your invitation will be sent when you verify your email address.';
    } else if (invitationState === 'NO_RESPONSE') {
      invitationStateText = '';
    }

    // Link to their voter guide
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = linkedOrganizationWeVoteId ? `/voterguide/${linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const detailsHTML = (
      <FriendDetails
        invitationStateText={invitationStateText}
        mutualFriends={mutualFriends}
        positionsTaken={positionsTaken}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
      />
    );

    const friendInvitationHtml = (
      <FriendDisplayOuterWrapper/* previewMode={previewMode} */>
        <FriendColumnWithoutButtons>
          <Avatar>
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                <Suspense fallback={<></>}>
                  {voterImage}
                </Suspense>
              </Link>
            ) : (
              <>
                <Suspense fallback={<></>}>
                  {voterImage}
                </Suspense>
              </>
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
        <FriendButtonsWrapper>
          {invitationState === 'PENDING_EMAIL_VERIFICATION' && !voter.signed_in_with_email ? (
            <Link to="/settings/account">
              <ButtonContainer>
                <Button variant="outlined" color="primary">
                  Verify Your Email
                </Button>
              </ButtonContainer>
            </Link>
          ) : null}
          <CancelButtonWrapper>
            <Button
              classes={{ root: classes.ignoreButton }}
              color="primary"
              disabled={cancelFriendInviteEmailSubmitted}
              fullWidth
              onClick={() => this.cancelFriendInviteEmail(voterEmailAddress)}
              variant="outlined"
            >
              {cancelFriendInviteEmailSubmitted ? 'Canceling...' : 'Cancel Invite'}
            </Button>
          </CancelButtonWrapper>
        </FriendButtonsWrapper>
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
FriendInvitationEmailLinkDisplayForList.propTypes = {
  classes: PropTypes.object,
  invitationState: PropTypes.string, // Comes friend data object from API server
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  previewMode: PropTypes.bool,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
};

const styles = () => ({
  ignoreButton: {
    // fontSize: '12.5px',
  },
});

const ButtonContainer = styled('div')`
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

export default withStyles(styles)(FriendInvitationEmailLinkDisplayForList);
