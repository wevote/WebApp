import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Info } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

class WeVoteTooltip extends Component {
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
WeVoteTooltip.propTypes = {
  title: PropTypes.string,
};

const Icon = styled.span`
  position: relative;
  top: -2px;
  left: 4px;
  * {
    color: #999;
  }
`;

export default WeVoteTooltip;
