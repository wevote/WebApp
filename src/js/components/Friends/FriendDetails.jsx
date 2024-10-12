import { Launch } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styled from 'styled-components';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { FriendDetailsLine, FriendDetailsWrapper, FriendName, InviteToWeVoteLine } from '../Style/friendStyles';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import { renderLog } from '../../common/utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const NUMBER_OF_MUTUAL_FRIEND_NAMES_TO_SHOW = 10; // Maximum available coming from API server is currently 5
const NUMBER_OF_MUTUAL_FRIEND_IMAGES_TO_SHOW = 3; // Maximum available coming from API server is currently 5

class FriendDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  orderByPhotoExists = (firstMutualFriend, secondMutualFriend) => {
    const secondMutualFriendHasPhoto = secondMutualFriend && secondMutualFriend.friend_photo_url_medium && secondMutualFriend.friend_photo_url_medium.length ? 1 : 0;
    const firstMutualFriendHasPhoto = firstMutualFriend && firstMutualFriend.friend_photo_url_medium && firstMutualFriend.friend_photo_url_medium.length ? 1 : 0;
    return secondMutualFriendHasPhoto - firstMutualFriendHasPhoto;
  };

  generateSearchURL (item) {
    const temp = item.replace(/ /g, '+');
    return `https://www.google.com/search?q=${temp}&oq=${temp}`;
  }

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
      remindMode,
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
      mutualFriendsTooltip = isMobileScreenSize() ? (<span />) : (
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
                mutualFriendImageCount={mutualFriendImageCount}
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
        <FriendNameOuterWrapper>
          <FriendName inSideColumn={inSideColumn}>
            {voterDisplayNameFormatted}
          </FriendName>
          {(emailAddressForDisplay && !voterWeVoteId) && (
            <ExternalWebSiteWrapper>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="googleSearch"
                  url={this.generateSearchURL(`${voterDisplayName} ${emailAddressForDisplay}`)}
                  target="_blank"
                  className="u-gray-mid"
                  body={(
                    <div>
                      <Launch
                        style={{
                          height: 14,
                          marginLeft: 2,
                          marginTop: '-3px',
                          width: 14,
                        }}
                      />
                    </div>
                  )}
                />
              </Suspense>
            </ExternalWebSiteWrapper>
          )}
        </FriendNameOuterWrapper>
        {!!(emailAddressForDisplay) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            <EmailSmaller>
              {emailAddressForDisplay}
            </EmailSmaller>
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
            <OverlayTrigger overlay={mutualFriendsTooltip} placement="top">
              <MutualFriendsBlockWrapper className="u-cursor--pointer">
                {mutualFriendPreviewList && (
                  <MutualFriendPreviewListImages>
                    {mutualFriendImageHtmlArray.map((mutualFriendImageHtml) => mutualFriendImageHtml)}
                  </MutualFriendPreviewListImages>
                )}
                <MutualFriendCountWrapper>
                  <span>
                    {numberAbbreviate(mutualFriendCount)}
                    {' '}
                  </span>
                  <span className="u-show-desktop-tablet">
                    {mutualFriendCount === 1 ? 'mutual friend' : 'mutual friends'}
                  </span>
                  <span className="u-show-mobile">
                    mutual
                  </span>
                </MutualFriendCountWrapper>
              </MutualFriendsBlockWrapper>
            </OverlayTrigger>
          </FriendDetailsLine>
        )}
        { invitationStateText ? <p>{invitationStateText}</p> : null }
        { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
        {!!(indicateIfAlreadyOnWeVote && !voterWeVoteId && !remindMode) && (
          <InviteToWeVoteLine inSideColumn={inSideColumn}>
            <span style={{ }}>Invite to WeVote</span>
          </InviteToWeVoteLine>
        )}
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
  remindMode: PropTypes.bool,
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
  white-space: nowrap;
`;

const ExternalWebSiteWrapper = styled('div')`
  margin-left: 2px;
  white-space: nowrap;
`;

const FriendNameOuterWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: start;
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
  margin-top: -3px;
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
  z-index: ${5 - mutualFriendImageCount};
`));

const OneFriendName = styled('span')`
`;

export default FriendDetails;
