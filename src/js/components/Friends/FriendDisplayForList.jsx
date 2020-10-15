import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import FriendToggle from './FriendToggle';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';

class FriendDisplayForList extends Component {
  render () {
    renderLog('FriendDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      mutual_friends: mutualFriends,
      positions_taken: positionsTaken,
      voter_we_vote_id: voterWeVoteId,
      voter_photo_url_large: voterPhotoUrlLarge,
    } = this.props;

    const alternateVoterDisplayName = this.props.voter_email_address ? this.props.voter_email_address : this.props.voter_twitter_handle;
    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : alternateVoterDisplayName;

    // Link to their voter guide
    const twitterVoterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const weVoteIdVoterGuideLink = this.props.linked_organization_we_vote_id ? `/voterguide/${this.props.linked_organization_we_vote_id}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
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
      </Details>
    );

    const friendDisplayHtml = (
      <Wrapper previewMode={this.props.previewMode}>
        <Flex>
          <Avatar>
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voterImage}
              </Link>
            ) :
              <span>{voterImage}</span> }
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
        <>
          <FriendToggle otherVoterWeVoteId={voterWeVoteId} showFriendsText />
        </>
      </Wrapper>
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
  voterWeVoteId: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
};

const Wrapper = styled.div`
  margin: 12px 0;
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
  }
  @media (min-width: 520px) {
    height: 68px;
    padding-left: 85px;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Avatar = styled.div`
  max-width: 68.8px;
  margin-right: 8px;
  @media (min-width: 400px) {
    height: 100% !important;
    max-width: 100%;
    min-height: 100% !important;
    max-height: 100% !important;
    position: absolute !important;
    left: 0;
    top: 0;
    margin: 0 auto;
    & img {
      border-radius: 6px;
      width: 68.8px;
      height: 68.8px;
    }
  }
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
  max-width: 25ch;
  width: 100%;
  @media(max-width: 321px) {
    max-width: 20ch;
  }
  @media (min-width: 322px) and (max-width: 370px) {
    max-width: 20ch;
  }
  @media (min-width: 371px) and (max-width: 399px) {
    max-width: 24ch;
  }
  @media (min-width: 400px) and (max-width: 479px) {
    max-width: 20ch;
  }
  @media (min-width: 480px) and (max-width: 599px) {
    max-width: 25ch;
  }
  @media (min-width: 600px) and (max-width: 991px) {
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

export default FriendDisplayForList;
