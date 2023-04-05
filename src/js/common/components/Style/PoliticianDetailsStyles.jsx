import styled, { css } from 'styled-components';

export const CandidateCampaignListDesktop = styled('div')`
  font-size: 18px;
  margin-bottom: 20x;
  min-height: 34px;
`;

export const CandidateCampaignListMobile = styled('div')`
  font-size: 16px;
  // margin-bottom: 20x;
  // min-height: 34px;
`;

export const CandidateCampaignWrapper = styled('div')`
  margin-bottom: 20px;
`;

export const OfficeHeldNameDesktop = styled('h2')(({ theme }) => (`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 22px;
  justify-content: center;
  text-align: center;
  margin-top: 10px;
  min-height: 34px;
  width: 100%;
  ${theme.breakpoints.down('md')} {
    font-size: 22px;
    min-height: 29px;
  }
`));

export const OfficeHeldNameMobile = styled('h2')`
  font-size: 18px;
  margin: 0;
  min-height: 34px;
  text-align: center;
`;

export const PoliticianImageMobile = styled('img')`
  max-height: 200px;
`;

export const PoliticianImageDesktop = styled('img')`
  border-radius: 5px;
  height: 100%;
`;

export const PoliticianImageSharedStyles = css`
  border-radius: 5px;
  margin: 0;
`;

export const PoliticianImageDesktopPlaceholder = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'height: 315px;' : 'height: 117px;'}
  align-items: center;
  background-color: #eee;
  display: flex;
  justify-content: center;
  ${limitCardWidth ? 'width: 561px;' : 'width: 224px;'}
  ${PoliticianImageSharedStyles}
`));

export const PoliticianImageMobilePlaceholder = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'height: 200px;' : 'height: 117px;'}
  align-items: center;
  background-color: #eee;
  display: flex;
  justify-content: center;
  // ${limitCardWidth ? 'width: 561px;' : 'width: 224px;'}
  width: 100%;
  ${PoliticianImageSharedStyles}
`));

export const PoliticianNameDesktop = styled('h1')(({ theme }) => (`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 0 20px;
  min-height: 34px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
    min-height: 29px;
  }
`));

export const PoliticianNameMobile = styled('h1')`
  font-size: 24px;
  margin: 0 0 10px 0;
  min-height: 27px;
  text-align: center;
`;

export const PoliticianNameOuterWrapperDesktop = styled('div')`
  margin-bottom: 30px
`;
