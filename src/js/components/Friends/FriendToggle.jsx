import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

export default class FriendToggle extends Component {
  static propTypes = {
    other_voter_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      other_voter_we_vote_id: "",
      voter: {
        we_vote_id: "",
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
      isFriend: FriendStore.isFriend(this.props.other_voter_we_vote_id),
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
    const other_voter_we_vote_id = this.props.other_voter_we_vote_id;
    const is_looking_at_self = this.state.voter.we_vote_id === other_voter_we_vote_id;
    // You should not be able to friend yourself
    if (is_looking_at_self) { return <div />; }

    const acceptFriendInvite = FriendActions.acceptFriendInvite.bind(this, other_voter_we_vote_id);
    const unFriend = FriendActions.unFriend.bind(this, other_voter_we_vote_id);
    const floatRight = { float: "right" };

    return (
      <span style={floatRight}>
        {isFriend ? (
          <Button
            variant="warning"
            size="small"
            onClick={unFriend}
          >
            <span>Remove Friend</span>
          </Button>
        ) :
          <Button variant="info" size="small" onClick={acceptFriendInvite}><span>Add Friend</span></Button>
        }
      </span>
    );
  }
}
