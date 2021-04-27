import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';

class FriendsShareListItem extends Component {
  render () {
    renderLog('FriendsShareListItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      mutual_friends: mutualFriends,
      positions_taken: positionsTaken,
      // voter_we_vote_id: voterWeVoteId,
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
        {voterGuideLink ? (
          <Link to={voterGuideLink} className="u-no-underline">
            <Name>
              {voterDisplayNameFormatted}
            </Name>
          </Link>
        ) : (
          <Name>
            {voterDisplayNameFormatted}
          </Name>
        )}
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
      <Wrapper>
        <Flex>
          <Avatar>
            <span>{voterImage}</span>
          </Avatar>
          <span>{detailsHTML}</span>
        </Flex>
      </Wrapper>
    );

    return (
      <>{friendDisplayHtml}</>
    );
  }
}
FriendsShareListItem.propTypes = {
  linked_organization_we_vote_id: PropTypes.string,
  mutual_friends: PropTypes.number,
  positions_taken: PropTypes.number,
  // voter_we_vote_id: PropTypes.string,
  voter_photo_url_large: PropTypes.string,
  voter_email_address: PropTypes.string,
  voter_display_name: PropTypes.string,
  voter_twitter_handle: PropTypes.string,
  // voter_twitter_description: PropTypes.string,
  // voter_twitter_followers_count: PropTypes.number,
};

const Wrapper = styled.div`
  width: 100%;
  margin-left: 12px;
  @media (min-width: 520px) {
    margin-left: 18px;
  }
  margin: 8px 0;
  display: flex;

`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Avatar = styled.div`
  margin-right: 8px;
  width: 45px;
  height: 45px;
  @media (min-width: 520px) {
    width: 55px;
    height: 55px;
  }
  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Details = styled.div`
  margin: 0;
  width: fit-content;
`;

const Name = styled.h3`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  text-align: left;
  width: 100%;
  @media(min-width: 400px) {
    font-size: 20px;
    width: fit-content;
  }
`;

const Info = styled.div`
  font-size: 12px;
  @media(min-width: 400px) {
    font-size: 14px;
    width: fit-content;
  }
`;

export default FriendsShareListItem;
