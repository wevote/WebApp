import React, { Component, PropTypes } from "react";


export default class MenuLink extends React.Component {
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    subtitle: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="BallotItem__summary-item-container">
      <div>
        <a href={this.props.url}>
          <span className="BallotItem__summary-display-name">{this.props.label}</span>
        </a>
        <div className="BallotItem__summary-item">
          {this.props.subtitle}
        </div>
      </div>
    </div>;
  }
}
