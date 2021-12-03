import React, { Component } from 'react';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const groupIcon = '../../../img/global/svg-icons/group-icon.svg';

export default class FriendsIcon extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <span>
        <img src={normalizedImagePath(groupIcon)} width="18" height="18" color="#999" alt="Friends" />
      </span>
    );
  }
}
