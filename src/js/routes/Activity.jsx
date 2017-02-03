import React, { PropTypes, Component } from "react";
import Helmet from "react-helmet";

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
      <Helmet title="Activity Feed - We Vote" />
      <div className="container-fluid well u-hang--md u-inset--md">
        <h3 className="text-center">Activity Feed</h3>
        <h4 className="text-center">Coming Soon</h4>
        <p>See the latest endorsements and news.</p>
      </div>
    </div>;
  }
}
