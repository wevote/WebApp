import React, { useState, useEffect, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SvgImage from './SvgImage';
import normalizedImagePath from '../../utils/normalizedImagePath';
import claimedProfileIcon from '../../../../img/global/svg-icons/claimed-profile-icon.svg';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import DesignTokenColors from '../Style/DesignTokenColors';

function ClaimedProfileIcon() {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);

  // Toggle tooltip on mobile while stopping bubbling so parent click handlers don't fire.
  const handleMobileClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (isMobileScreenSize()) setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    if (!showTooltip) return;

    // Close the mobile tooltip when tapping anywhere outside the icon container.
    function handleClickOutside(event) {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);

  const claimedProfileToolTip = isMobileScreenSize() ? null : (
    <Tooltip id="claimedProfileTooltip">
      <div><span>Profile claimed by politician.</span></div>
    </Tooltip>
  );

  return (
    <>
      {isMobileScreenSize() ? (
        <div ref={iconRef}>
          <span onClick={handleMobileClick}>
            <SvgImage
              color={DesignTokenColors.neutral500}
              imageName={normalizedImagePath(claimedProfileIcon)}
              opacity="1.0"
            />
          </span>
          {showTooltip && (
            <Tooltip id="claimedProfileTooltip" style={{ position: 'absolute', bottom: '-35px' }}>
              <div><span>Profile claimed by politician.</span></div>
            </Tooltip>
          )}
        </div>
      ) : (
        <OverlayTrigger overlay={claimedProfileToolTip} placement="bottom">
          <span>
            <SvgImage
              color={DesignTokenColors.neutral500}
              imageName={normalizedImagePath(claimedProfileIcon)}
              opacity="1.0"
            />
          </span>
        </OverlayTrigger>
      )}
    </>
  );
}

export default ClaimedProfileIcon;
