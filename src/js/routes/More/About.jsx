import React, { Component } from "react";
import Helmet from "react-helmet";

export default class About extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="About Us - We Vote" />
        <div className="container-fluid card">
          <h1 className="h1">About We Vote</h1>
          <p>
            We Vote USA is nonprofit and nonpartisan. For more information, please
            visit <a href="http://www.WeVoteUSA.org" target="_blank">www.WeVoteUSA.org</a>.
            This is a demonstration version and has not been launched to the general public yet.
          </p>

        </div>
      </div>;
  }
}
