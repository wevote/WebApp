import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import FacebookFriendTinyDisplay from './FacebookFriendTinyDisplay';
import FacebookFriendCard from './FacebookFriendCard';
import FacebookStore from '../../stores/FacebookStore';
import FacebookActions from '../../actions/FacebookActions';
import { renderLog } from '../../utils/logging';

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
      facebookInvitableFriendsList: FacebookStore.facebookInvitableFriends(),
      facebookInvitableFriendsImageWidth: this.props.facebookInvitableFriendsImageWidth,
      facebookInvitableFriendsImageHeight: this.props.facebookInvitableFriendsImageHeight,
      maximumFriendDisplay: this.props.maximumFriendDisplay,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    if (this.state.facebookInvitableFriendsList) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebookInvitableFriendsImageWidth,
        this.state.facebookInvitableFriendsImageHeight);
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      facebookInvitableFriendsList: nextProps.facebookInvitableFriendsList,
      maximumFriendDisplay: nextProps.maximumFriendDisplay,
    });
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
  }

  onFacebookStoreChange () {
    this.setState({
      facebookInvitableFriendsList: FacebookStore.facebookInvitableFriends(),
    });
  }

  onTriggerEnter (friendWeVoteId) {
    this.refs[`overlay-${friendWeVoteId}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (friendWeVoteId) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover) {
        this.refs[`overlay-${friendWeVoteId}`].hide();
      }
    }, 100);
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog(__filename);
    if (this.state.facebookInvitableFriendsList === undefined) {
      return null;
    }

    let localCounter = 0;
    let friendsNotShownCount = 0;
    if (this.state.facebookInvitableFriendsList &&
        this.state.facebookInvitableFriendsList.length > this.state.maximumFriendDisplay) {
      friendsNotShownCount = this.state.facebookInvitableFriendsList.length - this.state.maximumFriendDisplay;
    }
    const friendListToDisplay = this.state.facebookInvitableFriendsList.map((oneFriend) => {
      localCounter++;
      const friendId = oneFriend.id;
      if (localCounter > this.state.maximumFriendDisplay) {
        if (localCounter === this.state.maximumFriendDisplay + 1) {
          // If here we want to show how many friends there are to follow
          return (
            <span key={oneFriend.id}>
              <Link to="/facebook_invitable_friends">
                {' '}
                +
                {friendsNotShownCount}
              </Link>
            </span>
          );
        } else {
          return '';
        }
      } else {
        // Removed bsPrefix="card-popover"
        const friendPopover = (
          <Popover
            id={`friend-popover-${friendId}`}
            onMouseOver={() => this.onTriggerEnter(friendId)}
            onFocus={() => this.onTriggerEnter(friendId)}
            onMouseOut={() => this.onTriggerLeave(friendId)}
            onBlur={() => this.onTriggerLeave(friendId)}
          >
            <div className="card">
              <div className="card-main">
                <FacebookFriendCard {...oneFriend} />
              </div>
            </div>
          </Popover>
        );

        const placement = 'bottom';
        return (
          <OverlayTrigger
            key={`trigger-${friendId}`}
            ref={`overlay-${friendId}`}
            onMouseOver={() => this.onTriggerEnter(friendId)}
            onFocus={() => this.onTriggerEnter(friendId)}
            onMouseOut={() => this.onTriggerLeave(friendId)}
            onBlur={() => this.onTriggerLeave(friendId)}
            rootClose
            placement={placement}
            overlay={friendPopover}
          >
            <span className="position-rating__source with-popover">
              <Link to="/facebook_invitable_friends">
                <FacebookFriendTinyDisplay {...oneFriend} />
              </Link>
            </span>
          </OverlayTrigger>
        );
      }
    });

    return (
      <span className="guidelist card-child__list-group">
        {friendListToDisplay}
      </span>
    );
  }
}
