import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export default function ActionPill ({ onClick, label, contentText = null }) {
  return (
    <ActionPillStyle type="button" onClick={onClick}>
      <PillLabel>{label}</PillLabel>
      {contentText && <PillContent>{contentText}</PillContent>}
    </ActionPillStyle>
  );
}
ActionPill.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.node,
  contentText: PropTypes.node,
};

const ActionPillStyle = styled.button`
  align-items: center;
  background: ${DesignTokenColors.whiteUI};
  border: 1.5px solid ${DesignTokenColors.primary700};
  border-radius: 9999px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 2px;
  justify-content: center;
  padding: 8px 16px;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background: ${DesignTokenColors.primary50};
  }

  @media (max-width: 575px) {
    flex: 1;
    width: 100%;
  }
`;

const PillContent = styled.span`
  color: ${DesignTokenColors.primary600};
  font-size: 12px;
`;

const PillLabel = styled.span`
  align-items: center;
  display: inline-flex;
  font-weight: 600;
  gap: 6px;
`;
