import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Collapsible "Visibility of opinion & choice for Jane Dough" row at the bottom of the
// Step 3 card. Expands to a short demo summary of who can see the voter's support.
export default function VisibilityCollapse ({ label }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Wrapper>
      <Toggle type="button" aria-expanded={expanded} onClick={() => setExpanded((prev) => !prev)}>
        <Arrow $expanded={expanded}>
          <ArrowDownIcon fontSize="small" />
        </Arrow>
        <Label>{label}</Label>
      </Toggle>
      {expanded && (
        <Detail>Your choice and opinion are currently visible to your WeVote Friends only.</Detail>
      )}
    </Wrapper>
  );
}
VisibilityCollapse.propTypes = {
  label: PropTypes.string,
};

const Arrow = styled.span`
  color: ${DesignTokenColors.neutral700};
  display: inline-flex;
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
  transition: transform 0.15s ease;
`;

const Detail = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 0 26px;
`;

const Label = styled.span`
  color: ${DesignTokenColors.neutral800};
  font-size: 15px;
  font-weight: 400;
`;

const Toggle = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  gap: 6px;
  padding: 0;
  text-align: left;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
