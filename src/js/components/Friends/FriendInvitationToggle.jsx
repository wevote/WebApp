import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationToggle extends Component {
  static propTypes = {
    otherVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      acceptFriendInviteSent: false,
      voter: {
        we_vote_id: '',
      },
    };
    this.acceptFriendInvite = this.acceptFriendInvite.bind(this);
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
    const { otherVoterWeVoteId } = this.props;
    this.setState({
      isFriend: FriendStore.isFriend(otherVoterWeVoteId),
    });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  acceptFriendInvite () {
    console.log('acceptFriendInvite');
    const { otherVoterWeVoteId } = this.props;
    FriendActions.acceptFriendInvite(otherVoterWeVoteId);
    this.setState({
      acceptFriendInviteSent: true,
    });
  }

  render () {
    renderLog('FriendInvitationToggle');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { otherVoterWeVoteId } = this.props;
    const { acceptFriendInviteSent, isFriend } = this.state;
    // console.log("FriendInvitationToggle, my voter_we_vote_id:", this.state.voter.we_vote_id, ", otherVoterWeVoteId:", otherVoterWeVoteId, ", isFriend:", isFriend);
    const isLookingAtSelf = this.state.voter.we_vote_id === otherVoterWeVoteId;
    // You should not be able to friend yourself
    if (isLookingAtSelf) {
      // console.log("FriendInvitationToggle, isLookingAtSelf");
      return <div />;
    }

    return (
      <>
        {isFriend ? null : (
          <ButtonContainer>
            <Button
              color="primary"
              disabled={acceptFriendInviteSent}
              fullWidth
              onClick={this.acceptFriendInvite}
              variant="contained"
            >
              {acceptFriendInviteSent ? 'Confirming...' : 'Confirm'}
            </Button>
          </ButtonContainer>
        )}
      </>
    );
  }
}

const ButtonContainer = styled.div`
  width: 100%;
  margin-right: 12px;
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
    margin-bottom: 6px;
  }
  @media(min-width: 520px) {
    margin: 0;
    margin-left: 8px;
  }
`;
