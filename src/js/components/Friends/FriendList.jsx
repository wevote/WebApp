import React, { Component, PropTypes } from "react";
import FriendDisplayForList from "./FriendDisplayForList";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import FriendToggle from "./FriendToggle";

export default class FriendList extends Component {

  static propTypes = {
    friendList: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    editMode: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      friend_list: this.props.friendList
    };
  }

  componentDidMount () {
    this.setState({
      friend_list: this.props.friendList
    });
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      friend_list: nextProps.friendList
    });
  }

  render () {
    if (this.state.friend_list === undefined) {
      return null;
    }

    const friend_list_for_display = this.state.friend_list.map( (friend) => {
      if (this.props.editMode) {
        return <FriendDisplayForList key={friend.voter_we_vote_id} {...friend} >
          <FriendToggle other_voter_we_vote_id={friend.voter_we_vote_id} />
        </FriendDisplayForList>;
      } else {
      return <FriendDisplayForList key={friend.voter_we_vote_id} {...friend} />;
      }
    });

    return <div className="guidelist card-child__list-group">
        <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={4000} transitionLeaveTimeout={2000}>
          {friend_list_for_display}
        </ReactCSSTransitionGroup>
      </div>;
  }

}
