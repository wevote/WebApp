import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

const logoLight = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

const HeaderBarLogo = ({ chosenSiteLogoUrl, isBeta, light }) => (
  <HeaderBarLogoWrapper id="HeaderBarLogoWrapper">
    {chosenSiteLogoUrl ? (
      <img
        className="header-logo-img"
        alt="Logo"
        src={chosenSiteLogoUrl}
      />
    ) : (
      <WeVoteLogoWrapper>
        <Link to="/ready" className="page-logo page-logo-full-size" id="logoHeaderBar">
          <img
            className="header-logo-img"
            alt="We Vote logo"
            src={light ? normalizedImagePath(logoLight) : normalizedImagePath(logoDark)}
          />
          {(isBeta && !isCordova()) && (
            <span className="beta-marker">
              <Suspense fallback={<></>}>
                <DelayedLoad waitBeforeShow={200}>
                  <BetaMarkerInner light={light}>ballot</BetaMarkerInner>
                </DelayedLoad>
              </Suspense>
            </span>
          )}
        </Link>
      </WeVoteLogoWrapper>
    )}
  </HeaderBarLogoWrapper>
);

HeaderBarLogo.propTypes = {
  chosenSiteLogoUrl: PropTypes.string,
  isBeta: PropTypes.bool,
  light: PropTypes.bool,
};

const BetaMarkerInner = styled('span', {
  shouldForwardProp: (prop) => !['light'].includes(prop),
})(({ light }) => (`
  position: absolute;
  font-size: 10px;
  right: 0;
  top: 18px;
  color: ${light ? 'white' : '#2e3c5d'};
`));

const HeaderBarLogoWrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    padding-top: 5px;
  }

  @media print{
  }
`));

const WeVoteLogoWrapper = styled('div')(({ theme }) => (`
  // margin-left: -12px;
  // ${theme.breakpoints.down('sm')} {
  //   margin-left: 278px;
  // }
`));

export default HeaderBarLogo;
