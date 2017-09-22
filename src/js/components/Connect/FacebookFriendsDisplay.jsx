import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { OverlayTrigger, Popover } from "react-bootstrap";
import FacebookFriendTinyDisplay from "../../components/Connect/FacebookFriendTinyDisplay";
import FacebookFriendCard from "../../components/Connect/FacebookFriendCard";
import FacebookStore from "../../stores/FacebookStore";
import FacebookActions from "../../actions/FacebookActions";

export default class FacebookFriendsDisplay extends Component {

  static propTypes = {
    maximumFriendDisplay: PropTypes.number,
    facebookInvitableFriendsList: PropTypes.array,
    facebookInvitableFriendsImageWidth: PropTypes.number,
    facebookInvitableFriendsImageHeight: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriends(),
      facebook_invitable_friends_image_width: this.props.facebookInvitableFriendsImageWidth,
      facebook_invitable_friends_image_height: this.props.facebookInvitableFriendsImageHeight,
      maximum_friend_display: this.props.maximumFriendDisplay,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    if (this.state.facebook_invitable_friends_list) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
        this.state.facebook_invitable_friends_image_height);
    }
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      facebook_invitable_friends_list: nextProps.facebookInvitableFriendsList,
      maximum_friend_display: nextProps.maximumFriendDisplay,
    });
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriends(),
    });
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
      if (this.state.facebook_invitable_friends_list === undefined) {
        return null;
      }

      let local_counter = 0;
      let friends_not_shown_count = 0;
      if (this.state.facebook_invitable_friends_list &&
        this.state.facebook_invitable_friends_list.length > this.state.maximum_friend_display) {
        friends_not_shown_count = this.state.facebook_invitable_friends_list.length - this.state.maximum_friend_display;
      }
      const friend_list_to_display = this.state.facebook_invitable_friends_list.map( (one_friend) => {
        local_counter++;
        let friend_id = one_friend.id;
        if (local_counter > this.state.maximum_friend_display) {
          if (local_counter === this.state.maximum_friend_display + 1) {
            // If here we want to show how many friends there are to follow
            return <span key={one_friend.id}>
              <Link to="/facebook_invitable_friends"> +{friends_not_shown_count}</Link>
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
                  <FacebookFriendCard {...one_friend} />
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
              <Link to="/facebook_invitable_friends">
                <FacebookFriendTinyDisplay {...one_friend}
                                            />
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
