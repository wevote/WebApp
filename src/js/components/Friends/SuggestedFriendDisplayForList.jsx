import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import ImageHandler from '../ImageHandler';
import FriendActions from '../../actions/FriendActions';
import SuggestedFriendToggle from './SuggestedFriendToggle';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class SuggestedFriendDisplayForList extends Component {
  static propTypes = {
    inSideColumn: PropTypes.bool,
    linked_organization_we_vote_id: PropTypes.string,
    mutual_friends: PropTypes.number,
    positions_taken: PropTypes.number,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_large: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    // voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    previewMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      ignoreSuggestedFriendSent: false,
    };
  }

  ignoreSuggestedFriend (voterWeVoteId) {
    FriendActions.ignoreSuggestedFriend(voterWeVoteId);
    this.setState({
      ignoreSuggestedFriendSent: true,
    });
  }

  render () {
    renderLog('SuggestedFriendDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      inSideColumn,
      mutual_friends: mutualFriends,
      positions_taken: positionsTaken,
      previewMode,
      voter_we_vote_id: otherVoterWeVoteId,
      voter_photo_url_large: voterPhotoUrlLarge,
    } = this.props;
    const { ignoreSuggestedFriendSent } = this.state;

    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : '';
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const twitterVoterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const weVoteIdVoterGuideLink = this.props.linked_organization_we_vote_id ? `/voterguide/${this.props.linked_organization_we_vote_id}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
    const detailsHTML = (
      <Details inSideColumn={inSideColumn}>
        <Name inSideColumn={inSideColumn}>
          {voterDisplayNameFormatted}
        </Name>
        {!!(positionsTaken) && (
          <Info inSideColumn={inSideColumn}>
            Opinions:
            {' '}
            <strong>{positionsTaken}</strong>
          </Info>
        )}
        <Info inSideColumn={inSideColumn}>
          Mutual Friends:
          {' '}
          <strong>{mutualFriends || 0}</strong>
        </Info>
        { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
      </Details>
    );

    const suggestedFriendHtml = (
      <Wrapper inSideColumn={inSideColumn} previewMode={previewMode}>
        <Flex>
          <Avatar inSideColumn={inSideColumn}>
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
        <ButtonWrapper inSideColumn={inSideColumn}>
          <SuggestedFriendToggle otherVoterWeVoteId={otherVoterWeVoteId} />
          <ButtonContainer inSideColumn={inSideColumn}>
            <Button
              color="primary"
              disabled={ignoreSuggestedFriendSent}
              fullWidth
              onClick={() => this.ignoreSuggestedFriend(otherVoterWeVoteId)}
              type="button"
              variant="outlined"
            >
              {ignoreSuggestedFriendSent ? 'Removing...' : 'Remove'}
            </Button>
          </ButtonContainer>
        </ButtonWrapper>
      </Wrapper>
    );

    if (previewMode) {
      return <span>{suggestedFriendHtml}</span>;
    } else {
      return (
        <div>
          {suggestedFriendHtml}
        </div>
      );
    }
  }
}

const AvatarNotInColumn = `
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

const Avatar = styled.div`
  max-width: 68.8px;
  margin-right: 8px;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : AvatarNotInColumn)}
`;

const ButtonContainerNotInColumn = `
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

const ButtonContainer = styled.div`
  width: 100%;
  margin-right: 12px;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : ButtonContainerNotInColumn)}
`;

const ButtonWrapperNotInColumn = `
  @media(min-width: 400px) {
    margin: 0;
    margin-left: auto;
    width: fit-content;
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
  }
  @media (min-width: 520px) {
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin: 12px 0 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : ButtonWrapperNotInColumn)}
`;

const DetailsNotInColumn = `
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
    margin-bottom: 0;
  }
  @media (min-width: 380px) {
    margin-bottom: auto;
  }
  @media(min-width: 520px) {
    margin-bottom: 0;
  }
`;

const Details = styled.div`
  margin: 0 auto;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : DetailsNotInColumn)}
`;

const Flex = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const InfoNotInSideColumn = `
  @media (min-width: 400px){
    display: block;
    width: fit-content;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : InfoNotInSideColumn)}
`;

const NameNotInSideColumn = `
  @media(max-width: 321px) {
    max-width: 20ch;
  }
  @media (min-width: 322px) and (max-width: 400px) {
    max-width: 25ch;
  }
  @media (min-width: 401px) and (max-width: 600px) {
    max-width: 12ch;
  }
  @media (min-width: 601px) and (max-width: 787px) {
    max-width: 18ch;
  }
  @media (min-width: 788px) and (max-width: 991px) {
    max-width: 30ch;
  }
  @media(min-width: 400px) {
    text-align: left;
    font-size: 22px;
    width: fit-content;
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
  max-width: 18ch;
  width: 100%;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : NameNotInSideColumn)}
`;

const WrapperNotInSideColumn = `
  @media(min-width: 400px) {
    align-items: center;
    flex-direction: row;
    flex-flow: row nowrap;
    justify-content: flex-start;
    padding-left: 100px;
  }
  @media (min-width: 520px) {
    height: 68px;
    padding-left: 85px;
  }
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 24px 0;
  position: relative;
  width: 100%;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : WrapperNotInSideColumn)}
`;

export default SuggestedFriendDisplayForList;
