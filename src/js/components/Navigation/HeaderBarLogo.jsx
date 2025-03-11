import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderLogoImage from './HeaderLogoImage';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

const logoLight = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

const HeaderBarLogo = ({ chosenSiteLogoUrl, isBeta, light }) => (
  <HeaderBarLogoWrapper id="HeaderBarLogoWrapper">
    {chosenSiteLogoUrl ? (
      <Link to="/ready" id="logoHeaderBar">
        <HeaderLogoImage src={chosenSiteLogoUrl} />
      </Link>
    ) : (
      <WeVoteLogoWrapper>
        <Link to="/ready" id="logoHeaderBar">
          <HeaderLogoImage src={light ? normalizedImagePath(logoLight) : normalizedImagePath(logoDark)} />
          {(isBeta && !isCordova()) && (
            <BetaMarker>
              <Suspense fallback={<></>}>
                <DelayedLoad waitBeforeShow={200}>
                  <BetaMarkerInner light={light}>ballot</BetaMarkerInner>
                </DelayedLoad>
              </Suspense>
            </BetaMarker>
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

const BetaMarker = styled('span')`
  position:relative;
`;

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

const WeVoteLogoWrapper = styled('div')`
`;

export default HeaderBarLogo;
