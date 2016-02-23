import React, { Component, PropTypes } from "react";

export default class Organization extends Component {
  static propTypes = {
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    displayName: PropTypes.string,
    followers: PropTypes.string,
  };

  constructor (props) {
    super(props);
  }

  render () {
    const org =
      <div className="organization"></div>;

    return org;
  }

}
