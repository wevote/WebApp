import styled from 'styled-components';

export const NameAndTwitter = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  ${theme.breakpoints.down('md')} {
    flex-flow: column;
  }
`));

export const OrganizationDescriptionText = styled('div')`
  color: #808080;
`;

export const OrganizationDetailsWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
`;

export const OrganizationImage = styled('img')`
  border: 1px solid #ccc;
  border-radius: 48px;
  height: 48px;
  max-width: 48px;
  width: 48px;
`;

export const OrganizationFollowWrapper = styled('div')`
  margin-left: 8px;
  margin-right: 6px;
`;

export const OrganizationName = styled('h4')`
  font-size: 16px;
  margin-bottom: 2px;
`;

export const OrganizationLogoWrapper = styled('div')`
  margin-right: 8px;
`;

export const TwitterOuterWrapper = styled('div')(({ theme }) => (`
  margin-left: 8px;
  margin-top: -7px;
  ${theme.breakpoints.down('md')} {
    margin-left: 0;
  }
`));
