import styled from 'styled-components';

const InputFieldsWrapper = styled('div')`
  margin-top: 42px;
  max-width: 300px;
  width: 100%;
`;

const OneInputFieldWrapper = styled('div')`
  margin-bottom: 16px;
`;

const SetUpAccountContactsTextWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const SetUpAccountContactsText = styled('div')`
  color: #6c757d;
  font-size: 16px;
  padding: 0 20px;
  text-align: center;
  width: 360px;
`;

const SetUpAccountIntroText = styled('div')`
  color: #6c757d;
  font-size: 16px;
  padding: 0 20px;
  text-align: center;
  width: 235px;
`;

const SetUpAccountTitle = styled('div')`
  color: #2E3C5D;
  font-size: 28px;
  font-weight: 600;
  line-height: 100%;
  margin-bottom: 12px;
  padding: 0 36px;
  text-align: center;
  width: 100%;
`;

const SetUpAccountTop = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepCenteredWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const VoterNameWrapper = styled('div')`
  font-size: 20px;
  margin-top: 16px;
`;

export {
  InputFieldsWrapper,
  OneInputFieldWrapper,
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountIntroText,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
  VoterNameWrapper,
};
