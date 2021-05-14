import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import SuggestedFriendDisplayForList from './SuggestedFriendDisplayForList';

export default class SuggestedFriendList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: this.props.friendList,
    };
  }

  componentDidMount () {
    this.setState({
      suggestedFriendList: this.props.friendList,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      suggestedFriendList: nextProps.friendList,
    });
  }

  render () {
    renderLog('SuggestedFriendList');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.suggestedFriendList === undefined) {
      return null;
    }
    const { inSideColumn, previewMode } = this.props;

    return (
      <div className={!previewMode ? 'card' : null}>
        <div className={!previewMode ? 'card-main' : null}>
          {this.state.suggestedFriendList.map((friend, index) => (
            <div key={friend.voter_we_vote_id}>
              <SuggestedFriendDisplayForList
                {...friend}
                inSideColumn={inSideColumn}
                previewMode={previewMode}
              />
              {index !== this.state.suggestedFriendList.length - 1 ? (
                <hr />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
SuggestedFriendList.propTypes = {
  friendList: PropTypes.array,
  inSideColumn: PropTypes.bool,
  previewMode: PropTypes.bool,
};
