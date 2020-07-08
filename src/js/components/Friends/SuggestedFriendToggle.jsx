import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class SuggestedFriendToggle extends Component {
  static propTypes = {
    displayFullWidth: PropTypes.bool,
    lightModeOn: PropTypes.bool,
    otherVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      addSuggestedFriendSent: false,
      voter: {
        we_vote_id: '',
      },
      voterIsSignedIn: false,
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
    const voter = VoterStore.getVoter();
    this.setState({
      voterIsSignedIn: voter.is_signed_in,
      voter,
    });
  }

  addSuggestedFriend = () => {
    const { otherVoterWeVoteId } = this.props;
    const { voterIsSignedIn } = this.state;
    // console.log('addSuggestedFriend');
    if (voterIsSignedIn) {
      FriendActions.friendInvitationByWeVoteIdSend(otherVoterWeVoteId);
      this.setState({
        addSuggestedFriendSent: true,
      });
    } else {
      AppActions.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('SuggestedFriendToggle');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { displayFullWidth, lightModeOn, otherVoterWeVoteId } = this.props;
    const { addSuggestedFriendSent, isFriend, voter } = this.state;
    // console.log('SuggestedFriendToggle, otherVoterWeVoteId:', otherVoterWeVoteId, ', isFriend:', isFriend);
    const isLookingAtSelf = voter.we_vote_id === otherVoterWeVoteId;
    if (isLookingAtSelf) {
      // You should not be able to friend yourself
      // console.log('SuggestedFriendToggle, isLookingAtSelf');
      return <div />;
    }

    return (
      <ButtonContainer displayFullWidth={displayFullWidth}>
        <Button
          className={`issues-follow-btn issues-follow-btn__main issues-follow-btn__main--radius ${lightModeOn ? ' issues-follow-btn--white' : ' issues-follow-btn--blue'}`}
          color="primary"
          disabled={addSuggestedFriendSent || isFriend}
          fullWidth
          onClick={this.addSuggestedFriend}
          variant={`${lightModeOn ? 'outlined' : 'contained'}`}
        >
          {isFriend ? 'Already Friends' : (
            <>
              {addSuggestedFriendSent ? 'Invite Sent' : 'Add Friend'}
            </>
          )}
        </Button>
      </ButtonContainer>
    );
  }
}

const ButtonContainer = styled.div`
  white-space: nowrap;
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
