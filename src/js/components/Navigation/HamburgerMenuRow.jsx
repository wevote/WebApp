import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/esm/styles';
import { renderLog } from '../../utils/logging';

class HamburgerMenuRow extends Component {
  static propTypes = {
    onClickAction: PropTypes.func,
    to: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconStyle: PropTypes.object,
    fullIcon: PropTypes.object,
    linkText: PropTypes.string.isRequired,
    indented: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.onClickAction = this.props.onClickAction ? this.props.onClickAction.bind(this) : null;
  }

  render () {
    renderLog('HamburgerMenuRow');  // Set LOG_RENDER_EVENTS to log all renders
    const indented = this.props.indented !== undefined;

    if (indented) {
      // "indented" not currently used
      return (
        <tr className="hamburger-menu__tr">
          <td className="hamburger-menu__td-0">
            &nbsp;
          </td>
          <td className="hamburger-menu__td-1">
            <Link onClick={this.onClickAction} to={this.props.to}>
              {this.props.fullIcon ? this.props.fullIcon :
              <span className={this.props.icon} style={this.props.iconStyle} />
              }
            </Link>
          </td>
          <td className="hamburger-menu__td-2">
            <Link onClick={this.onClickAction} to={this.props.to}>
              <LinkTextWrapper>
                {this.props.linkText}
              </LinkTextWrapper>
            </Link>
          </td>
        </tr>
      );
    } else {
      return (
        <tr className="hamburger-menu__tr">
          <td className="hamburger-menu__td-0">
            <Link onClick={this.onClickAction} to={this.props.to}>
              {this.props.fullIcon ? this.props.fullIcon :
              <span className={this.props.icon} style={this.props.iconStyle} />
              }
            </Link>
          </td>
          <td className="hamburger-menu__td-1" colSpan={2}>
            <Link onClick={this.onClickAction} to={this.props.to}>
              <LinkTextWrapper>
                {this.props.linkText}
              </LinkTextWrapper>
            </Link>
          </td>
        </tr>
      );
    }
  }
}

const styles = () => ({
  indicator: {
    height: 4,
  },
});

const LinkTextWrapper = styled.div`
  width: 100%;
`;

export default withStyles(styles)(HamburgerMenuRow);
