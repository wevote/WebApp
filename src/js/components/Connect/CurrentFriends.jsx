import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { OverlayTrigger, Popover } from "react-bootstrap";
import CurrentFriendTinyDisplay from "../../components/Connect/CurrentFriendTinyDisplay";
import FriendDisplayForList from "../../components/Friends/FriendDisplayForList";

export default class CurrentFriends extends Component {

  static propTypes = {
    currentFriendsList: PropTypes.array,
    maximumFriendDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      current_friends_list: this.props.currentFriendsList,
      maximum_friend_display: this.props.maximumFriendDisplay,
    };
  }

  componentDidMount () {
    this.setState({
      current_friends_list: this.props.currentFriendsList,
      maximum_friend_display: this.props.maximumFriendDisplay,
    });
  }

  componentWillReceiveProps (nextProps){
    // console.log("CurrentFriends, componentWillReceiveProps, nextProps.currentFriendsList:", nextProps.currentFriendsList);
    //if (nextProps.instantRefreshOn ) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({
        current_friends_list: nextProps.currentFriendsList,
        maximum_friend_display: nextProps.maximumFriendDisplay,
      });
    //}
  }

  onTriggerEnter (friend_id) {
    this.refs[`overlay-${friend_id}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (friend_id) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover) {
        this.refs[`overlay-${friend_id}`].hide();
      }
    }, 100);
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

  render () {
    if (this.state.current_friends_list === undefined) {
      return null;
    }

    let local_counter = 0;
    let friends_not_shown_count = 0;
    if (this.state.current_friends_list &&
      this.state.current_friends_list.length > this.state.maximum_friend_display) {
      friends_not_shown_count = this.state.current_friends_list.length - this.state.maximum_friend_display;
    }
    const friend_list_to_display = this.state.current_friends_list.map( (one_friend) => {
      local_counter++;
      let friend_id = one_friend.voter_we_vote_id;
      if (local_counter > this.state.maximum_friend_display) {
        if (local_counter === this.state.maximum_friend_display + 1) {
          // If here we want to show how many organizations there are to follow
          return <span key={one_friend.voter_we_vote_id}>
            <Link to="/friends"> +{friends_not_shown_count}</Link>
          </span>;
        } else {
          return "";
        }
      } else {
        let friendPopover = <Popover
            id={`friend-popover-${friend_id}`}
            onMouseOver={() => this.onTriggerEnter(friend_id)}
            onMouseOut={() => this.onTriggerLeave(friend_id)}
            className="card-popover">
            <div className="card">
              <div className="card-main">
                <FriendDisplayForList
                                   {...one_friend} />
              </div>
            </div>
          </Popover>;

        let placement = "bottom";
        return <OverlayTrigger
            key={`trigger-${friend_id}`}
            ref={`overlay-${friend_id}`}
            onMouseOver={() => this.onTriggerEnter(friend_id)}
            onMouseOut={() => this.onTriggerLeave(friend_id)}
            rootClose
            placement={placement}
            overlay={friendPopover}>
          <span className="position-rating__source with-popover">
            <Link to="/friends">
              <CurrentFriendTinyDisplay {...one_friend}
                                      showPlaceholderImage />
            </Link>
          </span>
        </OverlayTrigger>;
      }
    });

    return <span className="guidelist card-child__list-group">
          {friend_list_to_display}
      </span>;
  }

}
