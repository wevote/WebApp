import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import Avatar from '../Style/avatarStyles';
import {
  CancelButtonWrapper, FriendButtonsWrapper, FriendColumnWithoutButtons,
  FriendDisplayDesktopButtonsWrapper, FriendDisplayOuterWrapper, smallButtonIfNeeded, ToRightOfPhoto,
} from '../Style/friendStyles';
import FriendDetails from './FriendDetails';
import FriendInvitationToggle from './FriendInvitationToggle';
import FriendLocationDisplay from './FriendLocationDisplay';
import SuggestedFriendToggle from './SuggestedFriendToggle';

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

  friendInvitationByEmailSend (emailAddresses) {
    // console.log('FriendInvitationVoterLinkDisplayForList friendInvitationByEmailSend');
    const emailAddressArray = '';
    const firstNameArray = '';
    const lastNameArray = '';
    const invitationMessage = FriendStore.getMessageToFriendQueuedToSave();
    const senderEmailAddress = VoterStore.getVoterEmail();
    FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray, lastNameArray, emailAddresses, invitationMessage, senderEmailAddress);
    this.setState({
      friendInvitationByEmailSent: true,
    });
  }

  ignoreFriendInvite (otherVoterWeVoteId) {
    FriendActions.ignoreFriendInvite(otherVoterWeVoteId);
  }

  render () {
    renderLog('FriendInvitationVoterLinkDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders

    // Do not render if already a friend
    const { cancelFriendInviteVoterSubmitted, friendInvitationByEmailSent, isFriend } = this.state;
    if (isFriend) {
      // We still want to show the invite
    }

    const {
      cityForDisplay,
      classes,
      invitationsSentByMe,
      linkedOrganizationWeVoteId,
      mutualFriendCount,
      mutualFriendPreviewList,
      positionsTaken,
      previewMode,
      stateCodeForDisplay,
      voterDisplayName,
      voterEmailAddress,
      voterGuideLinkOn,
      voterTwitterDescription,
      voterTwitterHandle,
      voterWeVoteId: otherVoterWeVoteId,
      voterPhotoUrlLarge,
    } = this.props;
    // console.log('FriendInvitationVoterLinkDisplayForList, stateCodeForDisplay:', stateCodeForDisplay);

    const voterDisplayNameFiltered = voterDisplayName || voterEmailAddress;
    const twitterDescription = voterTwitterDescription || '';
    // If the voterDisplayName is in the twitterDescription, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayNameFiltered, twitterDescription);

    // Link to their voter guide
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = linkedOrganizationWeVoteId ? `/voterguide/${linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const detailsHTML = (
      <FriendDetails
        emailAddressForDisplay={voterEmailAddress}
        mutualFriendCount={mutualFriendCount}
        mutualFriendPreviewList={mutualFriendPreviewList}
        positionsTaken={positionsTaken}
        twitterDescriptionMinusName={twitterDescriptionMinusName}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
      />
    );
    const friendButtonsExist = true;
    const friendButtonsWrapperHtml = invitationsSentByMe ? (
      <FriendButtonsWrapper>
        <SentByMeResendButtonWrapper>
          {otherVoterWeVoteId ? (
            <SuggestedFriendToggle inviteAgain otherVoterWeVoteId={otherVoterWeVoteId} />
          ) : (
            <Button
              color="primary"
              disabled={friendInvitationByEmailSent}
              fullWidth
              onClick={() => this.friendInvitationByEmailSend(voterEmailAddress)}
              type="button"
              variant="contained"
            >
              <span className="u-no-break" style={smallButtonIfNeeded()}>
                {friendInvitationByEmailSent ? 'Invite sent' : 'Invite again'}
              </span>
            </Button>
          )}
        </SentByMeResendButtonWrapper>
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
              <span className="u-no-break" style={smallButtonIfNeeded()}>
                Cancel Invite
              </span>
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
    );

    const friendInvitationHtml = (
      <FriendDisplayOuterWrapper/* previewMode={previewMode} */>
        <FriendColumnWithoutButtons>
          <Avatar>
            {(voterGuideLinkOn && voterGuideLink) ? (
              <Link to={voterGuideLink} className="u-no-underline">
                <Suspense fallback={<></>}>
                  <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />
                </Suspense>
              </Link>
            ) : (
              <span>
                <Suspense fallback={<></>}>
                  <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />
                </Suspense>
              </span>
            )}
          </Avatar>
          <ToRightOfPhoto>
            <div className="full-width">
              {(voterGuideLinkOn && voterGuideLink) ? (
                <Link to={voterGuideLink} className="u-no-underline">
                  {detailsHTML}
                </Link>
              ) : (
                <>
                  {detailsHTML}
                </>
              )}
            </div>
            {friendButtonsExist && (
              <div className="u-show-mobile">
                {friendButtonsWrapperHtml}
              </div>
            )}
          </ToRightOfPhoto>
          <FriendLocationDisplay cityForDisplay={cityForDisplay} stateCodeForDisplay={stateCodeForDisplay} />
        </FriendColumnWithoutButtons>
        {friendButtonsExist && (
          <FriendDisplayDesktopButtonsWrapper className="u-show-desktop-tablet">
            {friendButtonsWrapperHtml}
          </FriendDisplayDesktopButtonsWrapper>
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
  cityForDisplay: PropTypes.string,
  classes: PropTypes.object,
  invitationsSentByMe: PropTypes.bool,
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriendCount: PropTypes.number,
  mutualFriendPreviewList: PropTypes.array,
  positionsTaken: PropTypes.number,
  stateCodeForDisplay: PropTypes.string,
  voterWeVoteId: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterGuideLinkOn: PropTypes.bool,
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

const IgnoreButtonWrapper = styled('div', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
  margin-bottom: 0;
  margin-left: 8px;
  width: fit-content;
  ${inSideColumn ? '' : IgnoreButtonWrapperNotInColumn}
`));

const SentByMeResendButtonWrapper = styled('div')`
  width: fit-content;
`;

export default withStyles(styles)(FriendInvitationVoterLinkDisplayForList);
