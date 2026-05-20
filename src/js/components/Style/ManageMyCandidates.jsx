import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: ${DesignTokenColors.neutralUI50};
  padding: 12px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);
`;

export const CardActionsAndOpinion = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 575px) {
    flex: 1;
    align-items: stretch;
  }
  padding-bottom: 10px;
`;

export const CardInfoTitle = styled.div`
  color: ${DesignTokenColors.neutralUI500};
  margin-top: auto;
`;

export const CardInfoValue = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-weight: strong;
  margin-top: auto;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 575px) {
    padding-bottom: 72px;
  }
  border-collapse: separate;
  border-spacing: 0 10px;
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const KebabBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

export const LeftTools = styled.div`
  display: flex;
  align-items: center;
`;

export const NameRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const NameText = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 15px;
  font-weight: 600;
`;

export const RightOptions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const ToolbarRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-left: 12px;
`;

export const VerticalBar = styled.div`
  width: 1px;
  height: 80%;
  background: #d1d5db;
  border-radius: 999px;
`;

export const VerticalBarWrapper = styled.div`
  align-self: stretch;
  display: flex;
  align-items: center;
  margin: ${(p) => (p.$tight ? '0 4px' : '0 12px')};
`;
