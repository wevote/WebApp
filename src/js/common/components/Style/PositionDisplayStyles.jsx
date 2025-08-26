import styled from 'styled-components';
import DesignTokenColors from './DesignTokenColors';

export const PositionText = styled('div')`
  align-items: center;
  color: ${DesignTokenColors.neutral700};
  display: flex;
  font-weight: 400;
  font-size: 14px;
  height: 100%;
  margin-left: 5px;
  white-space: nowrap;
`;

export const SpeakerInfoWrapper = styled('div')`
  display: flex;
  margin-bottom: 12px;
  margin-left: 15px;
  flex-direction: column;
  // width: 500px;
`;

export const SpeakerName = styled('h3')`
  color: ${DesignTokenColors.neutral900};
`;

export const SpeakerStatement = styled('div')`
  color: ${DesignTokenColors.neutral900};
  margin-bottom: 5px;
`;

export const SpeakerStatementWrapper = styled('div')`
  // max-width: 415px;
`;

export const VisibilityText = styled('div')`
  align-items: center;
  color: ${DesignTokenColors.neutral300};
  display: flex;
  font-weight: 250;
  font-size: 14px;
  height: 100%;
  margin-left: 5px;
`;
