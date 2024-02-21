import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { isLargerThanTablet, isTablet } from '../../common/utils/isMobileScreenSize';

const HeaderLogoImage = ({ src }) => (
  <LogoImg id="HeaderLogoImage" alt="WeVote Logo" src={src} />
);

HeaderLogoImage.propTypes = {
  src: PropTypes.string,
};

/* was the following css applied for an img
.header-logo-img {
  max-width: 132px;
  max-height: 42px;
}
*/
const LogoImg = styled('img')`
  ${isWebApp() ? 'min-width: 141px;' : ''}
  ${isTablet() ? 'padding: 4px;' : ''}
  ${isLargerThanTablet() ? 'padding: 2px;' : ''}
`;

export default HeaderLogoImage;
