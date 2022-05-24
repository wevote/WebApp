import styled from 'styled-components';

const InputFieldsWrapper = styled('div')`
  margin-top: 42px;
  width: 100%;
`;

const OneInputFieldWrapper = styled('div')`
  margin-bottom: 16px;
`;

const SetUpAccountIntroText = styled('div')`
  color: #999;
  font-size: 16px;
  padding: 0 20px;
  text-align: center;
  width: 235px;
`;

const SetUpAccountTitle = styled('div')`
  font-size: 24px;
  text-align: center;
  width: fit-content;
`;

const SetUpAccountTop = styled('div')`
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
  SetUpAccountIntroText,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
  VoterNameWrapper,
};
