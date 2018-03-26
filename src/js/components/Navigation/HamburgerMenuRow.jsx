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
  };

  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);
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

