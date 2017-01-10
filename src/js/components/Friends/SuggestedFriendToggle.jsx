import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";

export default class SuggestedFriendToggle extends Component {
  static propTypes = {
    other_voter_we_vote_id: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      other_voter_we_vote_id: "",
      voter: {
        we_vote_id: ""
      }
    };
  }

  componentDidMount (){
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onFriendStoreChange();
    this._onVoterStoreChange();
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onFriendStoreChange (){
    this.setState({
      is_friend: FriendStore.isFriend(this.props.other_voter_we_vote_id)
    });
  }

  _onVoterStoreChange (){
    this.setState({
      voter: VoterStore.getVoter()
    });
  }

  render () {
    if (!this.state) { return <div />; }
    let other_voter_we_vote_id = this.props.other_voter_we_vote_id;
    let is_friend = this.state.is_friend;
    // console.log("SuggestedFriendToggle, other_voter_we_vote_id:", other_voter_we_vote_id, ", is_friend:", is_friend);
    let is_looking_at_self = this.state.voter.we_vote_id === other_voter_we_vote_id;
    // You should not be able to friend yourself
    if (is_looking_at_self) {
      // console.log("SuggestedFriendToggle, is_looking_at_self");
      return <div />;
    }

    const sendFriendInvite = FriendActions.friendInvitationByWeVoteIdSend.bind(this, other_voter_we_vote_id);
    const floatRight = { float: "right"};

    return <span style={floatRight}>
      {is_friend ?
        <span>Already Friend!</span> :
        <Button bsStyle="info" bsSize="small" onClick={sendFriendInvite}><span>Add Friend</span></Button>
      }
      </span>;
  }
}
