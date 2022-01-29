import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';

class FriendInvitationToggle extends Component {
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
    const { classes, otherVoterWeVoteId } = this.props;
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
              classes={{ root: classes.ignoreButton }}
              color="primary"
              disabled={acceptFriendInviteSent}
              fullWidth
              onClick={this.acceptFriendInvite}
              variant="contained"
            >
              {acceptFriendInviteSent ? 'Accepting...' : 'Accept'}
            </Button>
          </ButtonContainer>
        )}
      </>
    );
  }
}
FriendInvitationToggle.propTypes = {
  classes: PropTypes.object,
  otherVoterWeVoteId: PropTypes.string.isRequired,
};

const styles = () => ({
  ignoreButton: {
    // fontSize: '12.5px',
  },
});

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

export default withStyles(styles)(FriendInvitationToggle);
