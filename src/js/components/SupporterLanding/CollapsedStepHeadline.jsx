import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Mobile-only collapsed headline shown on later steps, standing in for the full welcome
// block. Tapping it steps back toward the top of the flow.
export default function CollapsedStepHeadline ({ headline, onClick }) {
  return (
    <Toggle type="button" className="u-show-mobile" onClick={onClick}>
      <ArrowDownIcon fontSize="small" />
      <Headline>{headline}</Headline>
    </Toggle>
  );
}
CollapsedStepHeadline.propTypes = {
  headline: PropTypes.string,
  onClick: PropTypes.func,
};

const Headline = styled.span`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
`;

const Toggle = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutral900};
  cursor: pointer;
  display: flex;
  gap: 6px;
  padding: 0;
  text-align: left;
`;
