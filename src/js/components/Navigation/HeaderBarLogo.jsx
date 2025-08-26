import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderLogoImage from './HeaderLogoImage';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../stores/VoterStore';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

const logoLight = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

const HeaderBarLogo = ({ chosenSiteLogoUrl, isBeta, light }) => {
  const homepagePath = '/ready';

  function handleClick () {
    const destinationPage = lookupPageNameAndPageTypeDict(homepagePath);
    const dataLayerObject = {
      actionDetails: {
        actionType: 'navigate',
        buttonId: 'logoHeaderBar',
      },
      event: 'action',
      pageDetails: getPageDetails(),
      destinationDetails: {
        destinationPageName: destinationPage.pageName,
        destinationPageType: destinationPage.pageType,
        destinationPathname: homepagePath,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  return (
    <HeaderBarLogoWrapper id="HeaderBarLogoWrapper">
      {chosenSiteLogoUrl ? (
        <Link to={homepagePath} id="logoHeaderBar" onClick={handleClick}>
          <HeaderLogoImage src={chosenSiteLogoUrl} />
        </Link>
      ) : (
        <WeVoteLogoWrapper>
          <Link to={homepagePath} id="logoHeaderBar" onClick={handleClick}>
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
};

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
