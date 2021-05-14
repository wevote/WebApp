import { Tooltip } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';


class TooltipIcon extends Component {
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
TooltipIcon.propTypes = {
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

export default TooltipIcon;
