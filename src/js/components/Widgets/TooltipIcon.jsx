import { Info } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';


class TooltipIcon extends Component {
  render () {
    return (
      <Icon>
        {isMobileScreenSize() ? (<span />) : (
          <Tooltip
            title={this.props.title}
          >
            <Info />
          </Tooltip>
        )}
      </Icon>
    );
  }
}
TooltipIcon.propTypes = {
  title: PropTypes.string,
};

const Icon = styled('span')`
  position: relative;
  top: -2px;
  left: 4px;
  * {
    color: #999;
  }
`;

export default TooltipIcon;
