import withTheme from '@mui/styles/withTheme';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../Style/avatarStyles';
import { FriendButtonsWrapper, FriendColumnWithoutButtons, FriendDisplayOuterWrapper } from '../Style/friendStyles';
import { renderLog } from '../../common/utils/logging';
import FriendDetails from './FriendDetails';
import FriendToggle from './FriendToggle';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const MessageToFriendButton = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendButton' */ './MessageToFriendButton'));


class FriendDisplayForList extends Component {
  render () {
    renderLog('FriendDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      electionDateInFutureFormatted,
      electionDateIsToday,
      friendToggleOff,
      messageToFriendButtonOn,
      messageToFriendDefault,
      mutualFriends,
      positionsTaken,
      previewMode,
      voterDisplayName,
      voterEmailAddress,
      voterGuideLinkOn,
      voterWeVoteId,
      voterPhotoUrlLarge,
      voterTwitterHandle,
    } = this.props;

    // Link to their voter guide
    const twitterVoterGuideLink = this.props.voterTwitterHandle ? `/${this.props.voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = this.props.linkedOrganizationWeVoteId ? `/voterguide/${this.props.linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const detailsHTML = (
      <FriendDetails
        mutualFriends={mutualFriends}
        positionsTaken={positionsTaken}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
      />
    );
    const friendButtonsWrapperHtml = (
      <FriendButtonsWrapper>
        {!friendToggleOff && (
          <FriendSettingsWrapper>
            <FriendToggle otherVoterWeVoteId={voterWeVoteId} showFriendsText />
          </FriendSettingsWrapper>
        )}
        {messageToFriendButtonOn && (
          <MessageToFriendWrapper>
            <Suspense fallback={<></>}>
              <MessageToFriendButton
                electionDateInFutureFormatted={electionDateInFutureFormatted}
                electionDateIsToday={electionDateIsToday}
                messageToFriendDefault={messageToFriendDefault}
                otherVoterWeVoteId={voterWeVoteId}
                voterEmailAddressMissing={!voterEmailAddress}
              />
            </Suspense>
          </MessageToFriendWrapper>
        )}
      </FriendButtonsWrapper>
    );

    const friendDisplayHtml = (
      <FriendDisplayOuterWrapper>
        <FriendColumnWithoutButtons>
          <Avatar>
            { (voterGuideLink && voterGuideLinkOn) ? (
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
          <ToRightOfPhoto>
            <div className="full-width">
              { (voterGuideLink && voterGuideLinkOn) ? (
                <Link to={voterGuideLink} className="u-no-underline">
                  {detailsHTML}
                </Link>
              ) : (
                <>
                  {detailsHTML}
                </>
              )}
            </div>
            {(!friendToggleOff || messageToFriendButtonOn) && (
              <div className="u-show-mobile">
                {friendButtonsWrapperHtml}
              </div>
            )}
          </ToRightOfPhoto>
        </FriendColumnWithoutButtons>
        <div className="u-show-desktop-tablet">
          {friendButtonsWrapperHtml}
        </div>
      </FriendDisplayOuterWrapper>
    );

    if (previewMode) {
      return <span>{friendDisplayHtml}</span>;
    } else {
      return (
        <FriendDisplayForListWrapper key={`friendDisplayForListWrapper-${voterWeVoteId}`}>
          {friendDisplayHtml}
        </FriendDisplayForListWrapper>
      );
    }
  }
}
FriendDisplayForList.propTypes = {
  electionDateInFutureFormatted: PropTypes.string,
  electionDateIsToday: PropTypes.bool,
  friendToggleOff: PropTypes.bool,
  linkedOrganizationWeVoteId: PropTypes.string,
  messageToFriendButtonOn: PropTypes.bool,
  messageToFriendDefault: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  previewMode: PropTypes.bool,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterGuideLinkOn: PropTypes.bool,
  voterPhotoUrlLarge: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterWeVoteId: PropTypes.string,
};

const styles = () => ({
});

const FriendDisplayForListWrapper = styled('div')`
`;

const FriendSettingsWrapper = styled('div')`
  width: fit-content;
`;

const MessageToFriendWrapper = styled('div')`
`;

const ToRightOfPhoto = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export default withTheme(withStyles(styles)(FriendDisplayForList));
