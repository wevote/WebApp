import React from 'react';
import styled from 'styled-components';

export default function ActionPill({ onClick, label, contentText = null}) {
  return (
    <ActionPillStyle type="button" onClick={onClick}>
      <MediumBoldText>{label}</MediumBoldText>
      {contentText && <p>{contentText}</p>}
    </ActionPillStyle>
  );
}

const MediumBoldText = styled.span`
  font-weight: 500;
`;

const ActionPillStyle = styled.button`
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.98);
  }
  @media (max-width: 575px) {
    flex: 1;
  }
  @media (min-width: 576px) {
    min-width: 280px;
  }
`;
