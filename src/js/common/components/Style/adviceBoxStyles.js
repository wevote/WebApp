import styled from 'styled-components';

const AdviceBox = styled.div`
  margin: 25px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 20px;
  }
`;

const AdviceBoxText = styled.div`
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const AdviceBoxTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const AdviceBoxWrapper = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
`;

export {
  AdviceBox,
  AdviceBoxText,
  AdviceBoxTitle,
  AdviceBoxWrapper,
};
