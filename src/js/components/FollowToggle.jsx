import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import GuideStore from "../stores/GuideStore";
import GuideActions from "../actions/GuideActions";

export default class FollowToggle extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
  };

  componentDidMount (){
    this.listener = GuideStore.addListener(this._onChange.bind(this));
    this._onChange();
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  _onChange (){
    this.setState({ is_following: GuideStore.isFollowing(this.props.we_vote_id)});
  }

  render () {
    if (!this.state) { return <div></div>; }
    let we_vote_id = this.props.we_vote_id;
    let is_following = this.state.is_following;

    const followFunc = GuideActions.follow.bind(this, we_vote_id);
    const stopFollowingFunc = GuideActions.stopFollowing.bind(this, we_vote_id);
    const floatRight = { float: "right"};

    const jsx = <span style={floatRight}>
      {is_following ?
        <Button bsStyle="info"
                bsSize="xsmall"
                className="btn-action utils-margin_bottom5"
                onClick={stopFollowingFunc}
                data-hover="Unfollow">
                <span>Following</span>
        </Button> :
        <Button bsStyle="info" bsSize="xsmall" onClick={followFunc}><span>Follow</span></Button>
      }
      </span>;
    return jsx;
  }
}
