import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import Avatar from '../Style/avatarStyles';
import { FriendColumnWithoutButtons } from '../Style/friendStyles';
import FriendDetails from './FriendDetails';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

class FriendsShareListItem extends Component {
  render () {
    renderLog('FriendsShareListItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      linkedOrganizationWeVoteId,
      mutualFriendCount,
      mutualFriendPreviewList,
      positionsTaken,
      voterDisplayName,
      voterEmailAddress,
      voterPhotoUrlLarge,
      voterTwitterHandle,
    } = this.props;

    // Link to their voter guide
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = linkedOrganizationWeVoteId ? `/voterguide/${linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const detailsHTML = (
      <FriendDetails
        mutualFriendCount={mutualFriendCount}
        mutualFriendPreviewList={mutualFriendPreviewList}
        positionsTaken={positionsTaken}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
      />
    );

    const friendDisplayHtml = (
      <Wrapper>
        <FriendColumnWithoutButtons>
          <Avatar>
            { voterGuideLink ? (
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
      </Wrapper>
    );

    return (
      <>{friendDisplayHtml}</>
    );
  }
}
FriendsShareListItem.propTypes = {
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriendCount: PropTypes.number,
  mutualFriendPreviewList: PropTypes.array,
  positionsTaken: PropTypes.number,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
};

const Wrapper = styled('div')(({ theme }) => (`
  width: 100%;
  ${theme.breakpoints.up('sm')} {
    margin-left: 18px;
  }
  margin: 8px 0;
  display: flex;
`));

export default FriendsShareListItem;
