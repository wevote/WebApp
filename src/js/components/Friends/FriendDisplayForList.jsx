import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Style/avatarStyles';
import { FriendButtonsWrapper, FriendColumnWithoutButtons, FriendDisplayOuterWrapper } from '../Style/friendStyles';
import { renderLog } from '../../common/utils/logging';
import FriendDetails from './FriendDetails';
import FriendToggle from './FriendToggle';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));


class FriendDisplayForList extends Component {
  render () {
    renderLog('FriendDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      mutualFriends,
      positionsTaken,
      previewMode,
      voterDisplayName,
      voterEmailAddress,
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

    const friendDisplayHtml = (
      <FriendDisplayOuterWrapper previewMode={this.props.previewMode}>
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
        {!previewMode && (
          <FriendButtonsWrapper>
            <FriendToggle otherVoterWeVoteId={voterWeVoteId} showFriendsText />
          </FriendButtonsWrapper>
        )}
      </FriendDisplayOuterWrapper>
    );

    if (this.props.previewMode) {
      return <span>{friendDisplayHtml}</span>;
    } else {
      return (
        <section className="card">
          <div className="card-main">
            {friendDisplayHtml}
          </div>
        </section>
      );
    }
  }
}
FriendDisplayForList.propTypes = {
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  previewMode: PropTypes.bool,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterWeVoteId: PropTypes.string,
};

export default FriendDisplayForList;
