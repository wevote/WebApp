import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVG } from 'react-svg';
import { cordovaDot, isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


// A function component to avoid CORS issues in Cordova for ReactSVG
export default function SvgImage (props) {
  const { imageName, width: localWidth, alt, otherStyles } = props;
  const passedAlt = (typeof alt === 'string') ? alt : '';
  let imageSrc;
  if (imageName.includes('/img/')) {
    imageSrc = `${imageName}`;
  } else {
    imageSrc = cordovaDot(`../../img/global/svg-icons/issues/${imageName}.svg`);
  }
  let stylesList = {
    fill: '#2e3c5d',
    padding: '1px 1px 1px 0px',
    width: `${localWidth || ''}`,
  };
  if (otherStyles) {
    stylesList = otherStyles;
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
        beforeInjection={(svg) => svg.setAttribute('style', stylesList)}
      />
    );
  } else {
    return (
      <img
        alt={passedAlt}
        src={imageSrc}
        style={{ width: `${localWidth || '20px'}` }}
      />
    );
  }
}
SvgImage.propTypes = {
  imageName: PropTypes.string,
  width: PropTypes.string,
  alt: PropTypes.string,
  otherStyles: PropTypes.object,
};
