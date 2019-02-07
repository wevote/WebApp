import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

export default class SuggestedFriendToggle extends Component {
  static propTypes = {
    otherVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: "",
      },
    };
    this.sendFriendInvite = FriendActions.friendInvitationByWeVoteIdSend.bind(this, this.props.otherVoterWeVoteId);
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
    renderLog(__filename);
    if (!this.state) { return <div />; }
    const { otherVoterWeVoteId } = this.props;
    const { isFriend } = this.state;
    // console.log("SuggestedFriendToggle, otherVoterWeVoteId:", otherVoterWeVoteId, ", isFriend:", isFriend);
    const isLookingAtSelf = this.state.voter.we_vote_id === otherVoterWeVoteId;
    // You should not be able to friend yourself
    if (isLookingAtSelf) {
      // console.log("SuggestedFriendToggle, isLookingAtSelf");
      return <div />;
    }

    const floatRight = { float: "right" };

    return (
      <span style={floatRight}>
        {isFriend ?
          <span>Already Friend!</span> :
          <Button variant="info" size="small" onClick={this.sendFriendInvite}><span>Add Friend</span></Button>
        }
      </span>
    );
  }
}
