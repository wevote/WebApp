import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

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
    const search = window.location.search ? window.location.search : "";
    const currentUrl = window.location.pathname + search;

    return <li className={"list-group-item" + (this.props.url === currentUrl ? " is-active" : "")}>
      <div>
        <Link to={this.props.url}>
          <span className="header-menu-text-left">{this.props.label}</span>
        </Link>
        <p className="text-left">{this.props.subtitle}</p>
      </div>
    </li>;
  }
}
