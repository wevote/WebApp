import React, { Component, PropTypes } from "react";

export default class Measure extends Component {
  static propTypes = {
    key: PropTypes.string,
    displayName: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { };
  }

  componentDidMount () { }

  componentWillUnmount () { }

  _onChange () { }

  render () {
    return <div className="measure"></div>;
  }
}
