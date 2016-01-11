import React, { Component, PropTypes } from 'react';

export default class Measure extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {

  }

  render() {
      return (
          <div>
          </div>
      );
  }
}
