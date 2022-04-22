import styled from 'styled-components';

const OuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 !important;
`;

const InnerWrapper = styled('div')`
`;

const IntroHeader = styled('div', {
  shouldForwardProp: (prop) => !['titleCentered', 'titleLarge'].includes(prop),
})(({ titleCentered, titleLarge, theme }) => (`
  color: #2e3c5d;
  padding-top: 0;
  padding-bottom: 0;
  ${titleLarge ? 'font-size: 26px;' : 'font-size: 18px;'}
  font-weight: 800;
  margin: 0 !important;
  ${titleCentered ? 'text-align: center;' : ''}
  ${theme.breakpoints.down('xs')} {
    font-size: 15px;
  }
`));

const ListWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const ListMaxWidth = styled('div')`
  max-width: 450px;
`;

const ListTitleRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 8px;
`;

const ListRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const Dot = styled('div')`
  padding-top: 2px;
  text-align: center;
  vertical-align: top;
`;

const StepNumber = styled('div')(({ theme }) => (`
  background: ${theme.colors.brandBlue};
  border-radius: 4px;
  color: white;
  font-size: 15px;
  width: 20px;
  height: 20px;
  padding-top: 1px;
`));

const StepTitle = styled('div')`
  font-size: 16px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
`;

const StepText = styled('div')`
  color: #555;
  font-size: 15px;
  font-weight: 200;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
`;

const StepNumberPlaceholder = styled('div')`
  width: 20px;
  height: 20px;
`;

export {
  Dot,
  InnerWrapper,
  IntroHeader,
  ListMaxWidth,
  ListRow,
  ListTitleRow,
  ListWrapper,
  OuterWrapper,
  StepNumber,
  StepNumberPlaceholder,
  StepText,
  StepTitle,
};
