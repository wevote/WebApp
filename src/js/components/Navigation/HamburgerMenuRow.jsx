import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

export default class HamburgerMenuRow extends Component {
  static propTypes = {
    onClickAction: PropTypes.func,
    icon: PropTypes.string,
    iconStyle: PropTypes.object,
    fullIcon: PropTypes.object,
    linkText: PropTypes.string.required,
    to: PropTypes.string.required,
  };

  constructor (props) {
    super(props);
  }

  render () {
    let onClickAction = this.props.onClickAction ? this.props.onClickAction.bind(this) : null;
    return (
      <tr className={"hamburger-menu__tr"}>
        <td className={"hamburger-menu__td-left"}>
          <Link onClick={onClickAction} to={this.props.to}>
            {this.props.fullIcon ? this.props.fullIcon :
              <span className={this.props.icon} style={this.props.iconStyle}/>
            }
          </Link>
        </td>
        <td className={"hamburger-menu__td-mid"}>
          <Link onClick={onClickAction} to={this.props.to}>{this.props.linkText}</Link>
        </td>
      </tr>
    );
  }
}

