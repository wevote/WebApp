import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import CurrentFriendTinyDisplay from './CurrentFriendTinyDisplay';
import FriendDisplayForList from '../Friends/FriendDisplayForList';
import { renderLog } from '../../utils/logging';

export default class CurrentFriends extends Component {
  static propTypes = {
    currentFriendList: PropTypes.array,
    maximumFriendDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      currentFriendList: this.props.currentFriendList,
      maximumFriendDisplay: this.props.maximumFriendDisplay,
    };
  }

  componentDidMount () {
    this.setState({
      currentFriendList: this.props.currentFriendList,
      maximumFriendDisplay: this.props.maximumFriendDisplay,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log("CurrentFriends, componentWillReceiveProps, nextProps.currentFriendList:", nextProps.currentFriendList);
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      currentFriendList: nextProps.currentFriendList,
      maximumFriendDisplay: nextProps.maximumFriendDisplay,
    });
    // }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onTriggerEnter (friendWeVoteId) {
    this.refs[`overlay-${friendWeVoteId}`].show(); // eslint-disable-line react/no-string-refs
    this.show_popover = true;
    clearTimeout(this.timer);
  }

  onTriggerLeave (friendWeVoteId) {
    this.show_popover = false;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.show_popover) {
        this.refs[`overlay-${friendWeVoteId}`].hide(); // eslint-disable-line react/no-string-refs
      }
    }, 100);
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog('CurrentFriends');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.currentFriendList === undefined) {
      return null;
    }

    let localCounter = 0;
    let friendsNotShownCount = 0;
    if (this.state.currentFriendList &&
      this.state.currentFriendList.length > this.state.maximumFriendDisplay) {
      friendsNotShownCount = this.state.currentFriendList.length - this.state.maximumFriendDisplay;
    }
    const friendsListToDisplay = this.state.currentFriendList.map((oneFriend) => {
      localCounter++;
      const friendWeVoteId = oneFriend.voter_we_vote_id;
      if (localCounter > this.state.maximumFriendDisplay) {
        if (localCounter === this.state.maximumFriendDisplay + 1) {
          // If here we want to show how many organizations there are to follow
          return (
            <span key={oneFriend.voter_we_vote_id}>
              <Link to="/friends">
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
            id={`friend-popover-${friendWeVoteId}`}
            onMouseOver={() => this.onTriggerEnter(friendWeVoteId)}
            onFocus={() => this.onTriggerEnter(friendWeVoteId)}
            onMouseOut={() => this.onTriggerLeave(friendWeVoteId)}
            onBlur={() => this.onTriggerLeave(friendWeVoteId)}
          >
            <div className="card">
              <div className="card-main">
                <FriendDisplayForList
                  {...oneFriend}
                />
              </div>
            </div>
          </Popover>
        );

        const placement = 'bottom';
        return (
          <OverlayTrigger
            key={`trigger-${friendWeVoteId}`}
            ref={`overlay-${friendWeVoteId}`}
            onMouseOver={() => this.onTriggerEnter(friendWeVoteId)}
            onFocus={() => this.onTriggerEnter(friendWeVoteId)}
            onMouseOut={() => this.onTriggerLeave(friendWeVoteId)}
            onBlur={() => this.onTriggerLeave(friendWeVoteId)}
            rootClose
            placement={placement}
            overlay={friendPopover}
          >
            <span className="position-rating__source with-popover">
              <Link to="/friends">
                <CurrentFriendTinyDisplay
                  {...oneFriend}
                  showPlaceholderImage
                />
              </Link>
            </span>
          </OverlayTrigger>
        );
      }
    });

    return (
      <span className="guidelist card-child__list-group">
        {friendsListToDisplay}
      </span>
    );
  }
}
