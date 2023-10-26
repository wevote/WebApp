import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const SetUpSignInOptionsPanelWrapper = styled('div')(({ theme }) => (`
  margin-top: 32px;
  ${theme.breakpoints.up('sm')} {
    min-width: 500px;
  }
`));
