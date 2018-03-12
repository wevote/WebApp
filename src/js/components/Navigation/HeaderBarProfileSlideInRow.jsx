import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class HeaderBarProfileSlideInRow extends Component {
  static propTypes = {
    onClickAction: PropTypes.func.required,
    icon: PropTypes.string,
    iconStyle: PropTypes.array,
    fullIcon: PropTypes.object,
    linkText: PropTypes.string.required,
    to: PropTypes.string,
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <tr className={"slide-in-tr"}>
        <td className={"slide-in-td-left"}>
          <Link onClick={this.props.onClickAction} to={this.props.to}>
            {this.props.fullIcon ? this.props.fullIcon :
              <span className={this.props.icon} style={this.props.iconStyle}/>
            }
          </Link>
        </td>
        <td className={"slide-in-td-mid"}>
          <Link onClick={this.props.onClickAction} to={this.props.to}>{this.props.linkText}</Link>
        </td>
      </tr>
    );
  }
}

