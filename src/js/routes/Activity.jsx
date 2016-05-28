import React, { PropTypes, Component } from "react";

export default class Activity extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <div className="bs-container-fluid bs-well gutter-top--small fluff-full1">
        <h3 className="bs-text-center">Activity Feed</h3>
        <h4 className="bs-text-center">Coming Soon</h4>
        <p>See the latest endorsements and news.</p>
      </div>
    </div>;
  }
}
