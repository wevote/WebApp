import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/esm/Button';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class SuggestedFriendToggle extends Component {
  static propTypes = {
    displayFullWidth: PropTypes.bool,
    otherVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      addSuggestedFriendSent: false,
      voter: {
        we_vote_id: '',
      },
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFriendStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      isFriend: FriendStore.isFriend(this.props.otherVoterWeVoteId),
    });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  addSuggestedFriend = () => {
    // console.log('addSuggestedFriend');
    FriendActions.friendInvitationByWeVoteIdSend(this.props.otherVoterWeVoteId);
    this.setState({
      addSuggestedFriendSent: true,
    });
  }

  render () {
    renderLog('SuggestedFriendToggle');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { displayFullWidth, otherVoterWeVoteId } = this.props;
    const { addSuggestedFriendSent, isFriend } = this.state;
    // console.log('SuggestedFriendToggle, otherVoterWeVoteId:', otherVoterWeVoteId, ', isFriend:', isFriend);
    const isLookingAtSelf = this.state.voter.we_vote_id === otherVoterWeVoteId;
    if (isLookingAtSelf) {
      // You should not be able to friend yourself
      // console.log('SuggestedFriendToggle, isLookingAtSelf');
      return <div />;
    }

    return (
      <>
        {addSuggestedFriendSent || isFriend ? (
          <ButtonContainer>
            <Button
              variant="contained"
              color="primary"
              disabled
              fullWidth
            >
              {!!(addSuggestedFriendSent && !isFriend) && 'Invite Sent'}
              {isFriend && 'Already Friends'}
            </Button>
          </ButtonContainer>
        ) : (
          <ButtonContainer displayFullWidth={displayFullWidth}>
            <Button
              color="primary"
              fullWidth
              onClick={this.addSuggestedFriend}
              variant="contained"
            >
              Add Friend
            </Button>
          </ButtonContainer>
        )}
      </>
    );
  }
}

const ButtonContainer = styled.div`
  width: 100%;
  // margin-right: 12px;
  @media(min-width: 400px) {
    ${({ displayFullWidth }) => (displayFullWidth ? 'width: 100%;' : 'width: fit-content;')}
    margin: 0;
    margin-bottom: 6px;
  }
  @media(min-width: 520px) {
    margin: 0;
    // margin-left: 8px;
  }
`;
