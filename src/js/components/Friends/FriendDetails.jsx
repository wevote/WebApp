import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styled from 'styled-components';
import { FriendDetailsLine, FriendDetailsWrapper, FriendName } from '../Style/friendStyles';
import abbreviateNumber from '../../common/utils/abbreviateNumber';
import { renderLog } from '../../common/utils/logging';

const NUMBER_OF_MUTUAL_FRIEND_NAMES_TO_SHOW = 10; // Maximum available coming from API server is currently 5
const NUMBER_OF_MUTUAL_FRIEND_IMAGES_TO_SHOW = 3; // Maximum available coming from API server is currently 5

class FriendDetails extends Component {

  orderByPhotoExists = (firstMutualFriend, secondMutualFriend) => {
    const secondMutualFriendHasPhoto = secondMutualFriend && secondMutualFriend.friend_photo_url_medium && secondMutualFriend.friend_photo_url_medium.length ? 1 : 0;
    const firstMutualFriendHasPhoto = firstMutualFriend && firstMutualFriend.friend_photo_url_medium && firstMutualFriend.friend_photo_url_medium.length ? 1 : 0;
    return secondMutualFriendHasPhoto - firstMutualFriendHasPhoto;
  };

  render () {
    renderLog('FriendDetails');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      emailAddressForDisplay,
      indicateIfAlreadyOnWeVote,
      inSideColumn,
      invitationStateText,
      mutualFriendCount,
      mutualFriendPreviewList,
      positionsTaken,
      twitterDescriptionMinusName,
      voterEmailAddress,
      voterTwitterHandle,
      voterWeVoteId,
    } = this.props;

    const alternateVoterDisplayName = voterEmailAddress || voterTwitterHandle;
    const voterDisplayName = this.props.voterDisplayName || alternateVoterDisplayName;
    let isFirst;
    let mutualFriendImageCount = 0;
    let mutualFriendNameCount = 0;
    let mutualFriendsTooltip = <></>;
    let mutualFriendImageHtmlArray = <></>;
    if (mutualFriendPreviewList) {
      const mutualFriendPreviewListSorted = mutualFriendPreviewList.sort(this.orderByPhotoExists);
      mutualFriendsTooltip = (
        <Tooltip className="u-z-index-9020" id="mutualFriendsTooltip">
          <div>
            {mutualFriendPreviewListSorted.map((mutualFriend) => {
              // console.log('organization:', organization);
              if (mutualFriend.friend_display_name) {
                mutualFriendNameCount += 1;
                if (mutualFriendNameCount <= NUMBER_OF_MUTUAL_FRIEND_NAMES_TO_SHOW) {
                  return (
                    <OneFriendName key={`MutualFriendImage-${mutualFriend.voter_we_vote_id}-${mutualFriendNameCount}`}>
                      {mutualFriend.friend_display_name}
                      <br />
                    </OneFriendName>
                  );
                } else {
                  return null;
                }
              } else {
                return null;
              }
            })}
          </div>
        </Tooltip>
      );
      mutualFriendImageHtmlArray = mutualFriendPreviewList.map((mutualFriend) => {
        isFirst = mutualFriendImageCount === 0;
        // console.log('organization:', organization);
        if (mutualFriend.friend_photo_url_medium) {
          mutualFriendImageCount += 1;
          if (mutualFriendImageCount <= NUMBER_OF_MUTUAL_FRIEND_IMAGES_TO_SHOW) {
            return (
              <MutualFriendImage
                alt=""
                isFirst={isFirst}
                key={`MutualFriendImage-${voterWeVoteId}-${mutualFriendImageCount}`}
                mutualFriendImageCount={mutualFriendCount}
                src={mutualFriend.friend_photo_url_medium}
                title={mutualFriend.friend_display_name}
              />
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
    }

    // Link to their voter guide
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
    return (
      <FriendDetailsWrapper inSideColumn={inSideColumn}>
        <FriendName inSideColumn={inSideColumn}>
          {voterDisplayNameFormatted}
        </FriendName>
        {!!(emailAddressForDisplay) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            <EmailSmaller>
              {emailAddressForDisplay}
            </EmailSmaller>
          </FriendDetailsLine>
        )}
        {!!(indicateIfAlreadyOnWeVote && !voterWeVoteId) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            <span style={{ }}>Invite to We Vote</span>
          </FriendDetailsLine>
        )}
        {!!(positionsTaken) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            Opinions:
            {' '}
            <strong>{positionsTaken}</strong>
          </FriendDetailsLine>
        )}
        {!!(mutualFriendCount) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            <OverlayTrigger placement="top" overlay={mutualFriendsTooltip}>
              <MutualFriendsBlockWrapper>
                {mutualFriendPreviewList && (
                  <MutualFriendPreviewListImages>
                    {mutualFriendImageHtmlArray.map((mutualFriendImageHtml) => mutualFriendImageHtml)}
                  </MutualFriendPreviewListImages>
                )}
                <MutualFriendCountWrapper>
                  <span>
                    {abbreviateNumber(mutualFriendCount)}
                    {' '}
                  </span>
                  <span className="u-show-desktop-tablet">
                    {mutualFriendCount === 1 ? 'Mutual Friend' : 'Mutual Friends'}
                  </span>
                  <span className="u-show-mobile">
                    Mutual
                  </span>
                </MutualFriendCountWrapper>
              </MutualFriendsBlockWrapper>
            </OverlayTrigger>
          </FriendDetailsLine>
        )}
        { invitationStateText ? <p>{invitationStateText}</p> : null }
        { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
      </FriendDetailsWrapper>
    );
  }
}
FriendDetails.propTypes = {
  emailAddressForDisplay: PropTypes.string,
  indicateIfAlreadyOnWeVote: PropTypes.bool,
  inSideColumn: PropTypes.bool,
  invitationStateText: PropTypes.string,
  mutualFriendCount: PropTypes.number,
  mutualFriendPreviewList: PropTypes.array,
  positionsTaken: PropTypes.number,
  twitterDescriptionMinusName: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterWeVoteId: PropTypes.string,
};

const EmailSmaller = styled('div')`
  font-size: 16px;
  max-width: 21ch;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MutualFriendPreviewListImages = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-right: 2px;
`;

const MutualFriendsBlockWrapper = styled('div')`
  align-items: center;
  color: #999;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
  // overflow-x: hidden;
`;

const MutualFriendCountWrapper = styled('div')`
  margin-top: 4px;
  white-space: nowrap;
`;

const MutualFriendImage = styled('img', {
  shouldForwardProp: (prop) => !['isFirst', 'mutualFriendImageCount'].includes(prop),
})(({ isFirst, mutualFriendImageCount }) => (`
  border: 2px solid #fff;
  border-radius: 16px;
  height: 32px;
  margin-top: 3px;
  ${!isFirst ? 'margin-left: -8px;' : ''}
  width: 32px;
  z-index: ${200 - mutualFriendImageCount};
`));

const OneFriendName = styled('span')`
`;

export default FriendDetails;
