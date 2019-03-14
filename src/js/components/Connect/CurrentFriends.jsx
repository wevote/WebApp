import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import CurrentFriendTinyDisplay from './CurrentFriendTinyDisplay';
import FriendDisplayForList from '../Friends/FriendDisplayForList';
import { renderLog } from '../../utils/logging';

export default class CurrentFriends extends Component {
  static propTypes = {
    currentFriendsList: PropTypes.array,
    maximumFriendDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      currentFriendsList: this.props.currentFriendsList,
      maximumFriendDisplay: this.props.maximumFriendDisplay,
    };
  }

  componentDidMount () {
    this.setState({
      currentFriendsList: this.props.currentFriendsList,
      maximumFriendDisplay: this.props.maximumFriendDisplay,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("CurrentFriends, componentWillReceiveProps, nextProps.currentFriendsList:", nextProps.currentFriendsList);
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      currentFriendsList: nextProps.currentFriendsList,
      maximumFriendDisplay: nextProps.maximumFriendDisplay,
    });
    // }
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
    if (this.state.currentFriendsList === undefined) {
      return null;
    }

    let localCounter = 0;
    let friendsNotShownCount = 0;
    if (this.state.currentFriendsList &&
      this.state.currentFriendsList.length > this.state.maximumFriendDisplay) {
      friendsNotShownCount = this.state.currentFriendsList.length - this.state.maximumFriendDisplay;
    }
    const friendsListToDisplay = this.state.currentFriendsList.map((oneFriend) => {
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
