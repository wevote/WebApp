import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import ImageHandler from '../ImageHandler';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationEmailForList extends Component {
  static propTypes = {
    invitationsSentByMe: PropTypes.bool,
    invitation_status: PropTypes.string, // Comes friend data object from API server
    mutual_friends: PropTypes.number,
    positions_taken: PropTypes.number,
    // voter_display_name: PropTypes.string, // Comes friend data object from API server
    voter_email_address: PropTypes.string, // Comes friend data object from API server
    // voter_photo_url_medium: PropTypes.string, // Comes friend data object from API server
    // voter_twitter_description: PropTypes.string, // Comes friend data object from API server
    // voter_twitter_followers_count: PropTypes.number, // Comes friend data object from API server
    voter_twitter_handle: PropTypes.string, // Comes friend data object from API server
    // voter_we_vote_id: PropTypes.string, // Comes friend data object from API server
    previewMode: PropTypes.bool,
    voter_photo_url_medium: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {},
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  deleteFriendInviteEmail (voterEmailAddress) {
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voterEmailAddress);
  }

  render () {
    renderLog('FriendInvitationEmailForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      invitationsSentByMe,
      invitation_status: invitationState,
      mutual_friends: mutualFriends,
      positions_taken: positionsTaken,
      voter_email_address: voterEmailAddress,
      voter_photo_url_medium: voterPhotoUrlMedium,
    } = this.props;

    const { voter } = this.state;
    let invitationStateText;
    if (invitationState === 'PENDING_EMAIL_VERIFICATION') {
      invitationStateText = 'Your invitation will be sent when you verify your email address.';
    } else if (invitationState === 'NO_RESPONSE') {
      invitationStateText = '';
    }

    const voterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const voterImage = <ImageHandler sizeClassName="image-lg " imageUrl={voterPhotoUrlMedium || 'https://wevote-images.s3.amazonaws.com/wv02voter171306/twitter_profile_image-20190619_1_48x48.png'} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterEmailAddress}</span>;

    const friendInvitationHtml = (
      <Wrapper previewMode={this.props.previewMode}>
        <Flex>
          <Avatar>
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voterImage}
              </Link>
            ) :
              <>{voterImage}</> }
          </Avatar>
          <Details>
            { voterGuideLink ? (
              <Name>
                <Link to={voterGuideLink} className="u-no-underline">
                  {voterDisplayNameFormatted}
                </Link>
              </Name>
            ) : (
              <Name>{voterDisplayNameFormatted}</Name>
            )}
            {!!(positionsTaken) && (
              <Info>
                Positions:
                {' '}
                <strong>{positionsTaken}</strong>
              </Info>
            )}
            <Info>
              Mutual Friends:
              {' '}
              <strong>{mutualFriends || 0}</strong>
            </Info>
            { invitationsSentByMe ? null :
            <span> invited you.</span>}
            <h5>
              {invitationStateText}
            </h5>
          </Details>
        </Flex>
        <ButtonWrapper>
          {invitationState === 'PENDING_EMAIL_VERIFICATION' && !voter.signed_in_with_email ? (
            <Link to="/settings/account">
              <Button variant="outlined" color="primary">
                Verify Your Email
              </Button>
            </Link>
          ) : null
          }
          <CancelButtonContainer>
            <Button variant="outlined" color="primary" fullWidth>
              Cancel
            </Button>
          </CancelButtonContainer>
        </ButtonWrapper>
      </Wrapper>
    );

    if (this.props.previewMode) {
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

const Wrapper = styled.div`
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-wrap: wrap;
  @media(min-width: 360px) {
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
  justify-content: space-between;
`;

const Avatar = styled.div`
  width: 25%;
  max-width: 100px;
  margin-right: 8px;
  & img {
    width: 100%;
  }
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
      height: 100%;
      width: auto;
      border-radius: 6px;
      max-width: 68.8px;
      max-height: 68.8px;
    }
  }
`;

const Details = styled.div`
  width: 50%;
  margin: 0 auto;
  @media(min-width: 360px) {
    width: fit-content;
    margin: 0;
  }
`;

const Name = styled.h3`
  font-weight: bold;
  color: black !important;
  font-size: 26px;
  margin-bottom: 4px;
  text-align: center;
  width: 100%;
  @media(min-width: 360px) {
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
  @media (min-width: 360px){
    display: block;
    width: fit-content;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media(min-width: 360px) {
    margin: 0;
    margin-left: auto;
    width: fit-content;
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
  }
  @media (min-width: 520px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
`;

const CancelButtonContainer = styled.div`
  width: 100%;
  margin-right: 12px;
  @media(min-width: 520px) {
    margin: 0;
    margin-right: 8px;
  }
`;
