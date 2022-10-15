import styled from 'styled-components';

const AdviceBox = styled('div')`
  max-width: 300px;
  text-align: center;
`;

const AdviceBoxText = styled('div')`
  color: #999;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 4px;
`;

const AdviceBoxTitle = styled('div')`
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const AdviceBoxWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 36px;
`;

export {
  AdviceBox,
  AdviceBoxText,
  AdviceBoxTitle,
  AdviceBoxWrapper,
};
