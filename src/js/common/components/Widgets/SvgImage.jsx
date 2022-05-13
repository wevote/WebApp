import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVG } from 'react-svg';
import { isWebApp } from '../../utils/isCordovaOrWebApp';
import normalizedImagePath from '../../utils/normalizedImagePath';
import { renderLog } from '../../utils/logging';


// A function component to avoid CORS issues in Cordova for ReactSVG
export default function SvgImage (props) {
  const { imageName, width: localWidth, alt, stylesTextIncoming } = props;
  const passedAlt = (typeof alt === 'string') ? alt : '';
  let imageSrc;
  if (imageName.includes('/img/')) {
    imageSrc = normalizedImagePath(`${imageName}`);
  } else {
    imageSrc = normalizedImagePath(`../../img/global/svg-icons/issues/${imageName}.svg`);
  }
  let stylesText = `
    fill: #2e3c5d;
    padding: 1px 1px 1px 0px;
    ${localWidth ? `width: ${localWidth};` : ''};
  `;
  if (stylesTextIncoming) {
    stylesText = stylesTextIncoming;
  }
  renderLog(`ChipImage for ${imageSrc}`);
  if (!imageName) {
    return <span />;
  }
  if (isWebApp()) {
    return (
      <ReactSVG
        alt={passedAlt}
        src={imageSrc}
        beforeInjection={(svg) => svg.setAttribute('style', stylesText)}
      />
    );
  } else {
    return (
      <img
        alt={passedAlt}
        src={imageSrc}
        style={localWidth ? { width: `${localWidth}` } : { width: '20px' }}
      />
    );
  }
}
SvgImage.propTypes = {
  imageName: PropTypes.string,
  width: PropTypes.string,
  alt: PropTypes.string,
  stylesTextIncoming: PropTypes.string,
};
