import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";

export default class FriendToggle extends Component {
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
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onVoterStoreChange();
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange (){
    this.setState({
      is_friend: VoterStore.isFriend(this.props.other_voter_we_vote_id),
      voter: VoterStore.getVoter()
    });
  }

  render () {
    if (!this.state) { return <div></div>; }
    let other_voter_we_vote_id = this.props.other_voter_we_vote_id;
    let is_friend = this.state.is_friend;
    let is_looking_at_self = this.state.voter.we_vote_id === other_voter_we_vote_id;
    // You should not be able to friend yourself
    if (is_looking_at_self) { return <div></div>; }

    const acceptFriendInvite = VoterActions.acceptFriendInvite.bind(this, other_voter_we_vote_id);
    const unFriend = VoterActions.unFriend.bind(this, other_voter_we_vote_id);
    const floatRight = { float: "right"};

    return <span style={floatRight}>
      {is_friend ?
        <Button bsStyle="info"
                bsSize="small"
                className="btn-action utils-margin_bottom5"
                onClick={unFriend}
                data-hover="Unfriend">
                <span>Remove Friend</span>
        </Button> :
        <Button bsStyle="info" bsSize="small" onClick={acceptFriendInvite}><span>Add Friend</span></Button>
      }
      </span>;
  }
}
