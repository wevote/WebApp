import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { isTablet } from '../../common/utils/isMobileScreenSize';

const HeaderLogoImage = ({ src }) => (
  <LogoImg id="HeaderLogoImage" alt="We Vote Logo" src={src} />
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
  ${isTablet() ? 'margin-top: 4px;' : 'max-width: 132px; max-height: 42px;'}
`;

export default HeaderLogoImage;
