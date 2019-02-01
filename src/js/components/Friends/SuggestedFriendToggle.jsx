import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

export default class SuggestedFriendToggle extends Component {
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
    renderLog(__filename);
    if (!this.state) { return <div />; }
    const other_voter_we_vote_id = this.props.other_voter_we_vote_id;
    const { isFriend } = this.state;
    // console.log("SuggestedFriendToggle, other_voter_we_vote_id:", other_voter_we_vote_id, ", isFriend:", isFriend);
    const is_looking_at_self = this.state.voter.we_vote_id === other_voter_we_vote_id;
    // You should not be able to friend yourself
    if (is_looking_at_self) {
      // console.log("SuggestedFriendToggle, is_looking_at_self");
      return <div />;
    }

    const sendFriendInvite = FriendActions.friendInvitationByWeVoteIdSend.bind(this, other_voter_we_vote_id);
    const floatRight = { float: "right" };

    return (
      <span style={floatRight}>
        {isFriend ?
          <span>Already Friend!</span> :
          <Button variant="info" size="small" onClick={sendFriendInvite}><span>Add Friend</span></Button>
        }
      </span>
    );
  }
}
