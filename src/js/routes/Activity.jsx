import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { renderLog } from '../utils/logging';

export default class Activity extends Component {
  static propTypes = {
  };

  static getProps () {
    return {};
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Activity Feed - We Vote" />
        <div className="container-fluid well u-stack--md u-inset--md">
          <h3 className="text-center">Activity Feed</h3>
          <h4 className="text-center">Coming Soon</h4>
          <p>See the latest endorsements and news.</p>
        </div>
      </div>
    );
  }
}
