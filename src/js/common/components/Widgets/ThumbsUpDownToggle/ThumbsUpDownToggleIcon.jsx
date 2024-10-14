import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThumbDownAltRounded, ThumbDownOffAltRounded } from '@mui/icons-material';
import DesignTokenColors from '../../Style/DesignTokenColors';

const ThumbsUpDownToggleIcon = ({ isFavorite, isDislike, supports, opposes }) => (
  <>
    {isFavorite && (
      <Icon>
        {supports ? <ThumbsUpPressedStyled /> : <ThumbsUpOutlineStyled />}
      </Icon>
    )}
    {isDislike && (
      <Icon>
        {opposes ? <ThumbsDownPressedStyled /> : <ThumbsDownOutlineStyled />}
      </Icon>
    )}
  </>
);

const Icon = styled('div')`
  flex: display;
  padding-left: 5px;

`;

const ThumbsUpOutlineStyled = styled(ThumbDownOffAltRounded)`
  color: ${DesignTokenColors.neutral400};
  cursor: pointer;
  transform: rotate(180deg);
  transition: path 0.3 ease;

  &:hover {
    color: ${DesignTokenColors.neutral600}
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

   &:hover {
    color: ${DesignTokenColors.neutral600}
  }
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
  opposes: PropTypes.bool,
};
