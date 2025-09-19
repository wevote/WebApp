import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

export const ReadyCard = styled('div')`
  padding-bottom: 4px;
`;

export const ElectionCountdownInnerWrapper = styled('div')`
  ${isWebApp() ? 'margin-top: -37px' : ''}
`;

export const IntroAndFindTabletWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

export const IntroAndFindTabletSpacer = styled('div')`
  width: 20px;
`;

export const ReadyParagraph = styled('div')`
`;

export const PrepareForElectionOuterWrapper = styled('div')`
  min-height: 150px;
  margin-bottom: 48px;
`;

export const ReadyIntroductionMobileWrapper = styled('div')(({ theme }) => (`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 48px;
  margin-top: 31px;
  ${theme.breakpoints.up('sm')} {
    justify-content: center;
  }
`));

export const ElectionCountdownOuterWrapper = styled('div')`
  height: ${isWebApp() ? '250px' : '280px'};
  position: relative;
  z-index: 1;
`;

export const ReadyIntroductionDesktopWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 31px;
`;

export const ReadyPageContainer = styled('div')`
`;

export const ViewBallotButtonWrapper = styled('div')(({ theme }) => (`
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 32px;
  ${theme.breakpoints.down('sm')} {
    padding-top: 10px;
  }
`));

export const ReadyTitle = styled('h2')(({ theme }) => (`
  font-size: 26px;
  font-weight: 600;
  margin: 0 0 12px;
  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin: 0 0 4px;
  }
`));
