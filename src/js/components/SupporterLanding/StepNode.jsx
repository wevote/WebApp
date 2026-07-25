import { Check as CheckIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// A single numbered step in the progress bar: the circle (numbered / active / complete)
// plus the label beneath it. A small green check badge appears when the step is complete.
export default function StepNode ({ stepNumber, label, active = false, complete = false }) {
  return (
    <NodeWrapper>
      <Circle $active={active} $complete={complete}>
        {stepNumber}
        {complete && (
          <CompleteBadge>
            <CheckIcon style={{ fontSize: 12 }} />
          </CompleteBadge>
        )}
      </Circle>
      <Label $active={active}>{label}</Label>
    </NodeWrapper>
  );
}
StepNode.propTypes = {
  stepNumber: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  complete: PropTypes.bool,
};

const Circle = styled.div`
  align-items: center;
  background: ${({ $active }) => ($active ? DesignTokenColors.secondary800 : DesignTokenColors.whiteUI)};
  border: 2px solid ${({ $active }) => ($active ? DesignTokenColors.secondary800 : DesignTokenColors.neutralUI300)};
  border-radius: 50%;
  color: ${({ $active }) => ($active ? DesignTokenColors.whiteUI : DesignTokenColors.neutral800)};
  display: flex;
  font-size: 18px;
  font-weight: 700;
  height: 36px;
  justify-content: center;
  position: relative;
  width: 36px;
`;

const CompleteBadge = styled.span`
  align-items: center;
  background: ${DesignTokenColors.confirmation600};
  border: 2px solid ${DesignTokenColors.whiteUI};
  border-radius: 50%;
  bottom: -5px;
  color: ${DesignTokenColors.whiteUI};
  display: flex;
  height: 18px;
  justify-content: center;
  position: absolute;
  right: -5px;
  width: 18px;
`;

const Label = styled.span`
  color: ${({ $active }) => ($active ? DesignTokenColors.secondary800 : DesignTokenColors.neutral700)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  left: 50%;
  position: absolute;
  text-align: center;
  top: calc(100% + 8px);
  transform: translateX(-50%);
  white-space: nowrap;

  @media (max-width: 575px) {
    display: none;
  }
`;

// The wrapper is exactly the circle's size so the connecting lines meet the circles
// edge-to-edge; the label is taken out of flow (absolutely positioned) so its width
// doesn't push the nodes apart.
const NodeWrapper = styled.div`
  flex: 0 0 auto;
  position: relative;
`;
