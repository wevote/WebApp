import withTheme from '@mui/styles/withTheme';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import Avatar from '../Style/avatarStyles';
import {
  FriendButtonsWrapper, FriendColumnWithoutButtons, FriendDisplayDesktopButtonsWrapper,
  FriendDisplayOuterWrapper, ToRightOfPhotoContentBlock, ToRightOfPhotoTopRow, ToRightOfPhotoWrapper,
} from '../Style/friendStyles';
import FriendDetails from './FriendDetails';
import FriendLocationDisplay from './FriendLocationDisplay';
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
      messageToFriendType,
      mutualFriendCount,
      mutualFriendPreviewList,
      positionsTaken,
      previewMode,
      stateCodeForDisplay,
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
    const detailsHTML = (
      <FriendDetails
        mutualFriendCount={mutualFriendCount}
        mutualFriendPreviewList={mutualFriendPreviewList}
        positionsTaken={positionsTaken}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
        voterWeVoteId={voterWeVoteId}
      />
    );
    const friendButtonsExist = !friendToggleOff || messageToFriendButtonOn;
    const friendButtonsWrapperHtml = (
      <FriendButtonsWrapper id="fbwhfdfl">
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
                messageToFriendType={messageToFriendType}
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
        <FriendColumnWithoutButtons id="fdfl-fdh">
          <Avatar>
            { (voterGuideLink && voterGuideLinkOn) ? (
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
          <ToRightOfPhotoWrapper>
            <ToRightOfPhotoTopRow id="fdfl">
              <ToRightOfPhotoContentBlock>
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
              </ToRightOfPhotoContentBlock>
              <FriendLocationDisplay stateCodeForDisplay={stateCodeForDisplay} />
            </ToRightOfPhotoTopRow>
            {friendButtonsExist && (
              <div className="u-show-mobile">
                {friendButtonsWrapperHtml}
              </div>
            )}
          </ToRightOfPhotoWrapper>
        </FriendColumnWithoutButtons>
        {friendButtonsExist && (
          <FriendDisplayDesktopButtonsWrapper id="fdfl-1" className="u-show-desktop-tablet">
            {friendButtonsWrapperHtml}
          </FriendDisplayDesktopButtonsWrapper>
        )}
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
  messageToFriendType: PropTypes.string,
  mutualFriendCount: PropTypes.number,
  mutualFriendPreviewList: PropTypes.array,
  positionsTaken: PropTypes.number,
  previewMode: PropTypes.bool,
  stateCodeForDisplay: PropTypes.string,
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

export default withTheme(withStyles(styles)(FriendDisplayForList));
