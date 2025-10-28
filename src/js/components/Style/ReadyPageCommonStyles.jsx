import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

/* global $ */

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

// "November 4, 2025 California Off-Year Election" takes three lines on mobile devices
// One line is 43px, two is 69, three is 95
function isLongElectionName () {
  if (window.$) {
    const $H1 = $('h1[class*=\'ElectionNameH1\']');
    return $H1.length && $H1.outerHeight() > 69;
  }
  return false;
}

export const ViewBallotButtonWrapper = styled('div')(({ theme }) => (`
  flex: 0 0 100%;
  max-width: 100%;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 32px;
  padding-top: 18px;
  ${theme.breakpoints.down('sm')} {
    padding: ${isLongElectionName() ? '25px 10px !important' : '10px'};
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
