import styled from 'styled-components';

export const ContinueButtonType1Wrapper = styled('div')`
  width: 100%;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ExplanationTextType1 = styled('div')`
  color: #2e3c5d;
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 18px 0;
  padding: 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

export const ExplanationTextLighterType1 = styled('div')`
  font-size: 14px;
  font-weight: 400;
  margin: 24px 0 0 0;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
`;

export const ModalContentHeaderType1 = styled('div')`
  color: #2e3c5d;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 18px 0;
  padding: 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

export const ModalTitleType1 = styled('h3')`
  font-size: 28px;
  color: black;
`;

export const ModalTitleAreaType1 = styled('div')`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 12px 0 24px;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: flex;
`;
