import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

class WeVoteTooltip extends Component {
  static propTypes = {
    title: PropTypes.string,
  };

  render () {
    return (
      <Icon>
        <Tooltip
          title={this.props.title}
        >
          <Info />
        </Tooltip>
      </Icon>
    );
  }
}

const Icon = styled.span`
  position: relative;
  top: -2px;
  left: 4px;
  * {
    color: #777;
  }
`;

export default WeVoteTooltip;
