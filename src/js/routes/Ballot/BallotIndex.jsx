import React, { Component, PropTypes } from 'react';

export default class BallotIndex extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render () {
    return <div className="ballot device-ballot--large">
            { this.props.children }
          </div>;
  }
}
