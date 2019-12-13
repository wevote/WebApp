import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ImageHandler from '../ImageHandler';
import FriendActions from '../../actions/FriendActions';
import FriendInvitationToggle from './FriendInvitationToggle';
import FriendStore from '../../stores/FriendStore';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class FriendInvitationDisplayForList extends Component {
  static propTypes = {
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    previewMode: PropTypes.bool,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
    this.handleIgnore = this.handleIgnore.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.onFriendStoreChange();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      isFriend: FriendStore.isFriend(this.props.voter_we_vote_id),
    });
  }

  deleteFriendInviteEmail (voterEmailAddress) {
    // TODO DALE We have a problem with how we are deleting friend invitations.
    // It has to do with retrieve_friend_invitations_sent_by_me on the API server
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voterEmailAddress);
  }

  deleteFriendInviteVoter (otherVoterWeVoteId) {
    // console.log("deleteFriendInviteVoter");
    FriendActions.deleteFriendInviteVoter(otherVoterWeVoteId);
  }

  handleIgnore (otherVoterWeVoteId) {
    FriendActions.ignoreFriendInvite(otherVoterWeVoteId);
  }

  render () {
    renderLog('FriendInvitationDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      // invitationsSentByMe,
      // voter_twitter_followers_count: voterTwitterFollowersCount,
      voter_twitter_handle: voterTwitterHandle,
      voter_we_vote_id: otherVoterWeVoteId,
      voter_photo_url_medium: voterPhotoUrlMedium,
      classes,
    } = this.props;

    const voterDisplayName = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : '';
    // If the voterDisplayName is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const voterImage = <ImageHandler sizeClassName="image-lg " imageUrl={voterPhotoUrlMedium} kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
    // console.log("FriendInvitationDisplayForList, otherVoterWeVoteId:", otherVoterWeVoteId);

    const friendInvitationHtml = (
      <Wrapper>
        <Avatar>
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voterImage}
            </Link>
          ) :
            <span>{voterImage}</span> }
        </Avatar>
        <Details>
          {voterGuideLink ? (
            <Name>
              <Link to={voterGuideLink} className="u-no-underline">
                {voterDisplayNameFormatted}
              </Link>
            </Name>
          ) : (
            <Name>{voterDisplayNameFormatted}</Name>
          )}
          <Info>
            Positions:
            <strong>7</strong>
          </Info>
          <Info>
            Mutual Friends:
            <strong>23</strong>
          </Info>
          {/* { invitationsSentByMe ?
            null :
            <span> invited you.</span>} */}
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
          {/* {voterTwitterFollowersCount ? (
            <span className="twitter-followers__badge">
              <span className="fab fa-twitter" />
              {numberWithCommas(voterTwitterFollowersCount)}
            </span>
          ) : null
            } */}
        </Details>
        {this.state.isFriend ? null : (
          <>
            { this.props.invitationsSentByMe ? (
              <ButtonWrapper>
                <CancelButtonContainer>
                  <Button fullWidth variant="outlined" color="primary">
                    Cancel
                  </Button>
                </CancelButtonContainer>
              </ButtonWrapper>
            ) : (
              <ButtonWrapper>
                <ButtonContainer>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => this.handleIgnore(otherVoterWeVoteId)}
                    type="button"
                    className={classes.deleteButton}
                  >
                    {window.innerWidth > 620 ? 'Delete Request' : 'Delete'}
                  </Button>
                </ButtonContainer>
                <FriendInvitationToggle otherVoterWeVoteId={otherVoterWeVoteId} />
              </ButtonWrapper>
            )}
          </>
        )}
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

const styles = () => ({
  // buttonContainer: {
  //   ['@media(min-width: 569px)']: {
  //     height: '2px !important',
  //   },
  //   height: '40px !important',
  // },
});

const Wrapper = styled.div`
  margin: 24px 0 32px;
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

const Avatar = styled.div`
  width: 50%;
  margin: 0 auto;
  & img {
    width: 100%;
  }
  @media (min-width: 360px) {
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
    position: absolute !important;
    left: 0;
    top: 0;
    & img {
      height: 100%;
      width: auto;
      border-radius: 6px;
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

const ButtonContainer = styled.div`
  width: 100%;
  margin-right: 12px;
  @media(min-width: 360px) {
    width: fit-content;
    margin: 0;
    margin-bottom: 8px;
  }
  @media(min-width: 520px) {
    margin: 0;
    margin-right: 8px;
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

export default withStyles(styles)(FriendInvitationDisplayForList);
