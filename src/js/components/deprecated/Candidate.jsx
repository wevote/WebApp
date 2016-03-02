import React, { Component, PropTypes } from "react";

import Star from "../StarAction";

export default class Candidate extends Component {
  static propTypes = {
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

  render () {
    var { key } = this.props;

    const candidate =
      <div className="candidate">
        <Star key={key} />
      </div>;

    return candidate;
  }
}
