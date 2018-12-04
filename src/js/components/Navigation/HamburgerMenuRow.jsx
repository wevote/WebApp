import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";

export default class HamburgerMenuRow extends Component {
  static propTypes = {
    onClickAction: PropTypes.func,
    to: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconStyle: PropTypes.object,
    fullIcon: PropTypes.object,
    linkText: PropTypes.string.isRequired,
    indented: PropTypes.bool,
  };

  render () {
    renderLog(__filename);
    const onClickAction = this.props.onClickAction ? this.props.onClickAction.bind(this) : null;
    const indented = this.props.indented !== undefined;

    if (indented) {
      return (
        <tr className="hamburger-menu__tr">
          <td className="hamburger-menu__td-0" />
          <td className="hamburger-menu__td-1">
            <Link onClick={onClickAction} to={this.props.to}>
              {this.props.fullIcon ? this.props.fullIcon :
              <span className={this.props.icon} style={this.props.iconStyle} />
              }
            </Link>
          </td>
          <td className="hamburger-menu__td-2" colSpan={2}>
            <Link onClick={onClickAction} to={this.props.to}>{this.props.linkText}</Link>
          </td>
        </tr>
      );
    } else {
      return (
        <tr className="hamburger-menu__tr">
          <td className="hamburger-menu__td-0">
            <Link onClick={onClickAction} to={this.props.to}>
              {this.props.fullIcon ? this.props.fullIcon :
              <span className={this.props.icon} style={this.props.iconStyle} />
              }
            </Link>
          </td>
          <td className="hamburger-menu__td-1" colSpan={3}>
            <Link onClick={onClickAction} to={this.props.to}>{this.props.linkText}</Link>
          </td>
        </tr>
      );
    }
  }
}

