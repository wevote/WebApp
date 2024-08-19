import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVG } from 'react-svg';
import { isWebApp } from '../../utils/isCordovaOrWebApp';
import normalizedImagePath from '../../utils/normalizedImagePath';
import { renderLog } from '../../utils/logging';


// A function component to avoid CORS issues in Cordova for ReactSVG
export default function SvgImage (props) {
  const {
    alt, applyFillColor, color, height,
    imageName, width: localWidth, marginBottom, opacity,
    stylesTextIncoming,
  } = props;
  const passedAlt = (typeof alt === 'string') ? alt : '';
  let imageSrc;
  if (imageName.includes('/img/')) {
    imageSrc = normalizedImagePath(`${imageName}`);
  } else {
    imageSrc = normalizedImagePath(`../../img/global/svg-icons/issues/${imageName}.svg`);
  }
  let stylesText = `
    fill: ${color || '#2e3c5d'};
    ${height ? `height: ${height};` : ''}
    ${localWidth ? `width: ${localWidth};` : ''}
    ${marginBottom ? `margin-bottom: ${marginBottom};` : ''}
    ${opacity ? `opacity: ${opacity};` : ''}
    padding: 1px 1px 1px 0px;
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
        beforeInjection={(svg) => {
          svg.setAttribute('style', stylesText);
          if (applyFillColor) {
            // Fill property applied to the path element, not SVG element. querySelector to grab the path element and set the attribute.
            svg.querySelectorAll('path').forEach((path) => {
              path.setAttribute('fill', color || '#2e3c5d');
            });
          }
        }}
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
  alt: PropTypes.string,
  applyFillColor: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.string,
  imageName: PropTypes.string,
  marginBottom: PropTypes.string,
  opacity: PropTypes.string,
  stylesTextIncoming: PropTypes.string,
  width: PropTypes.string,
};
