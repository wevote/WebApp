import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThumbDownAltRounded, ThumbDownOffAltRounded } from '@mui/icons-material';
import DesignTokenColors from '../../Style/DesignTokenColors';

const ThumbsUpDownToggleIcon = ({ isFavorite, isDislike, supports, rejects }) => (
  <>
    {isFavorite && (
      <Icon>
        {supports ? <ThumbsUpPressedStyled /> : <ThumbsUpOutlineStyled />}
      </Icon>
    )}
    {isDislike && (
      <Icon>
        {rejects ? <ThumbsDownPressedStyled /> : <ThumbsDownOutlineStyled />}
      </Icon>
    )}
  </>
);

const Icon = styled('div')`
  flex: display;
  padding: 0 5px 0 5px;

`;

const ThumbsUpOutlineStyled = styled(ThumbDownOffAltRounded)`
  color: ${DesignTokenColors.neutral400};
  cursor: pointer;
  transform: rotate(180deg);
  transition: path 0.3 ease;

  &:hover {
    path {
      fill: ${DesignTokenColors.neutral400};
    }
  }
`;

const ThumbsUpPressedStyled = styled(ThumbDownAltRounded)`
  color: ${DesignTokenColors.neutral400};
  cursor: pointer;
  transform: rotate(180deg);
`;

const ThumbsDownOutlineStyled = styled(ThumbDownOffAltRounded)`
  color: ${DesignTokenColors.neutral400};
  cursor: pointer;
  transition: color 0.3 ease;
`;

const ThumbsDownPressedStyled = styled(ThumbDownAltRounded)`
  color: ${DesignTokenColors.neutral400};
  cursor: pointer;
`;

export default ThumbsUpDownToggleIcon;

ThumbsUpDownToggleIcon.propTypes = {
  isFavorite: PropTypes.bool,
  isDislike: PropTypes.bool,
  supports: PropTypes.bool,
  rejects: PropTypes.bool,
};
