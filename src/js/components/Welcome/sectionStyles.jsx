import styled from '@mui/material/styles/styled';

const Section = styled('div', {
  shouldForwardProp: (prop) => !['noTopMargin', 'noSideMargins', 'variant', 'rounded'].includes(prop),
})(({ noTopMargin, noSideMargins, variant, rounded, theme }) => (`
  display: flex;
  flex-flow: column;
  padding-top: ${noTopMargin ? '0' : '3em'};
  padding-right: ${noSideMargins ? '0' : '1em'};
  padding-bottom: ${noTopMargin ? '0' : '2em'};
  padding-left: ${noSideMargins ? '0' : '1em'};
  text-align: center;
  align-items: center;
  color: #333;
  width: 100%;
  background: ${variant === 'dark' ? 'rgb(235, 236, 240)' : 'white'};
  ${rounded ? // eslint-disable-next-line
      'border-radius: 50% 50%;\nwidth: 200%;\npadding: 3em 2em;' : ''};
  ${theme.breakpoints.down('md')} {
    padding-top: ${noTopMargin ? '0' : '2em'};
    padding-bottom: ${noTopMargin ? '0' : '1em'};
  }
`));

const SectionTitle = styled('h1')(({ theme }) => (`
  font-size: 36px;
  font-weight: 300;
  margin-bottom: 10px;
  ${theme.breakpoints.down('md')} {
    margin-bottom: 9px;
    font-size: 24px;
  }
`));

const SectionTitleBold = styled('span')`
  color: ${(props) => props.theme.colors.brandBlue};
  font-weight: bold;
`;

const Step = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18px;
  padding: 8px;
  background: rgb(243, 243, 247);
  width: 600px;
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  ${theme.breakpoints.down('md')} {
    width: 100%;
  }
`));

const StepNumber = styled('div')(({ theme }) => (`
  width: 24px;
  height: 24px;
  background: ${(props) => props.theme.colors.brandBlue};
  color: white;
  border-radius: 4px;
  ${theme.breakpoints.down('md')} {
    width: 35px;
    height: 35px;
    min-width: 35px;
    font-size: 24px;
  }
`));

const StepLabel = styled('p')(({ theme }) => (`
  font-weight: bold;
  color: #333;
  margin: 0 .7rem;
  text-align: left;
  ${theme.breakpoints.down('md')} {
    margin: auto .7rem;
    font-size: 16px;
  }
`));

const GetStarted2019 = styled('div')(({ theme }) => (`
  align-items: center;
  display: flex;
  flex-flow: column;
  text-align: center;
  margin: auto;
  margin-bottom: 50px;
  margin-top: 15px;
  width: 500px;
  ${theme.breakpoints.down('md')} {
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
  }
  ${theme.breakpoints.down('sm')} {
    padding-left: 0;
    padding-right: 0;
  }
`));

const ButtonContainer = styled('div')`
  margin-left: -132px;
`;

// ${theme.breakpoints.down('md')} {
//   flex-flow: column-reverse;
// }
const DescriptionContainer = styled('div')`
  display: flex;
  margin: 1em 3em;
  flex-flow: row wrap;
  width: 960px;
  max-width: 90vw;
  text-align: left;
`;

const MemberListContainer = styled('div')`
  margin: 0 auto;
  width: 960px;
  max-width: 90vw;
  text-align: center;
`;

const DescriptionLeftColumn = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: column;
  width: 70%;
  justify-content: center;
  text-align: left;
  ${theme.breakpoints.down('md')} {
    width: 100%;
  }
`));

const DescriptionImageColumn = styled('div')(({ theme }) => (`
  width: 30%;
  ${theme.breakpoints.down('md')} {
    width: 100%;
    text-align: center;
  }
`));

const Description = styled('span')`
  color: #333;
  font-size: 18px;
  padding-bottom: 16px;
`;

const Image = styled('img')`
  width: 100%;
  max-width: 60vw;
`;

const Bold = styled('span')`
  font-weight: bold;
`;

const NetworkContainer = styled('div')`
  width: 960px;
  max-width: 90vw;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  padding: 2em;
  padding-bottom: 3em;
`;

const NetworkImage = styled('img')(({ theme }) => (`
  filter: grayscale(100%);
  flex: 25%;
  max-width: 25%;
  padding: 0 2%;
  object-fit: scale-down;
  ${theme.breakpoints.down('md')} {
    flex: 50% !important;
    max-width: 50% !important;
  }
`));

const SignUpContainer = styled('div')`
  width: 350px;
  padding-bottom: 2em;
  max-width: 90vw;
`;

const SignUpMessage = styled('div')(({ theme }) => (`
  border-radius: 4px;
  color: ${theme.colors.brandBlue};
  padding: 8px 16px;
  font-size: 14px;
  margin-top: 2em;
  background: rgb(243,243,247);
  ${theme.breakpoints.down('md')} {
    font-size: 12px;
  }
`));

export {
  Bold,
  ButtonContainer,
  Description,
  DescriptionContainer,
  DescriptionImageColumn,
  DescriptionLeftColumn,
  GetStarted2019,
  Image,
  MemberListContainer,
  NetworkContainer,
  NetworkImage,
  Section,
  SectionTitle,
  SectionTitleBold,
  SignUpContainer,
  SignUpMessage,
  Step,
  StepLabel,
  StepNumber,
};

