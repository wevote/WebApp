import React, { PropTypes } from "react";

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
    // The final shortening will be done in css, this is just so we can see the layout better until then
    let shortened = this.props.subtitle;
    if (shortened && shortened.length > 50) {
      shortened = shortened.substring(0, 49) + "...";
    }

    return <li className={"list-group-item" + (this.props.url === currentUrl ? " is-active" : "")}>
      <div>
        <a href={this.props.url}>
          <span className="header-menu-text-left">{this.props.label}</span>
        </a>
        <p className="text-left">{shortened}</p>
      </div>
    </li>;
  }
}
