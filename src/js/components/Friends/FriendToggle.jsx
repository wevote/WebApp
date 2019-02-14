import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class FriendToggle extends Component {
  static propTypes = {
    otherVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: '',
      },
    };
    const { otherVoterWeVoteId } = this.props;
    this.acceptFriendInvite = FriendActions.acceptFriendInvite.bind(this, otherVoterWeVoteId);
    this.unFriend = FriendActions.unFriend.bind(this, otherVoterWeVoteId);
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

  render () {
    const { isFriend } = this.state;
    renderLog(__filename);
    if (!this.state) { return <div />; }
    const { otherVoterWeVoteId } = this.props;
    const isLookingAtSelf = this.state.voter.we_vote_id === otherVoterWeVoteId;
    // You should not be able to friend yourself
    if (isLookingAtSelf) { return <div />; }

    const floatRight = { float: 'right' };

    return (
      <span style={floatRight}>
        {isFriend ? (
          <Button
            variant="warning"
            size="small"
            onClick={this.unFriend}
          >
            <span>Remove Friend</span>
          </Button>
        ) :
          <Button variant="info" size="small" onClick={this.acceptFriendInvite}><span>Add Friend</span></Button>
        }
      </span>
    );
  }
}
