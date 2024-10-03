import React from 'react';
import { styled } from '@mui/material';
import DesignTokenColors from '../../Style/DesignTokenColors';
import ThumbsUpDownToggleIcon from './ThumbsUpDownToggleIcon';
import numberWithCommas from '../../../utils/numberWithCommas';

function ThumbsUpDownToggle () {
  return (
    <ThumbsUpThumbsDownContainer>
      <ThumbsUpDownToggleIcon isFavorite />
      <Amount>{numberWithCommas(0)}</Amount>
      <ThumbsUpDownSeperator>&nbsp;</ThumbsUpDownSeperator>
      <ThumbsUpDownToggleIcon isDislike />
      <Amount>{numberWithCommas(0)}</Amount>
    </ThumbsUpThumbsDownContainer>
  );
}

const ThumbsUpThumbsDownContainer = styled('div')`
  display: flex;
`;

const Amount = styled('span')`
  margin-right: 10px;
`;

const ThumbsUpDownSeperator = styled('div')`
  max-width: 1px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};
`;

export default ThumbsUpDownToggle;
