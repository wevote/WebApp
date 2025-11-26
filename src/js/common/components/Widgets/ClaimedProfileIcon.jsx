import React, { useState, useEffect, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SvgImage from './SvgImage';
import normalizedImagePath from '../../utils/normalizedImagePath';
import claimedProfileIcon from '../../../../img/global/svg-icons/claimed-profile-icon.svg'; // Claimed profile SVG asset.
import DesignTokenColors from '../Style/DesignTokenColors';
import { useTheme } from '@mui/material/styles';
import  useMediaQuery from '@mui/material/useMediaQuery';

// Behavior: renders a claimed-profile icon that shows a tooltip reading
// "Profile claimed by politician." The tooltip appears below the politician image:
// - Desktop: shows on hover via OverlayTrigger (no navigation triggered).
// - Mobile: shows on tap and does not navigate; tapping again or elsewhere closes it.
function ClaimedProfileIcon() {
  // Pull theme breakpoints to detect desktop vs mobile layout.
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // using state to control the click behavior on mobile
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null); // Ref used to anchor tooltip and detect outside clicks.

  // Attach listeners for outside clicks and sibling tooltip events.
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.claimed-profile-icon')) {
        setShowTooltip(false);
      }
    }
    // Close this tooltip if another claimed profile tooltip was opened.
    function handleTooltipOpened(e) {
      if (iconRef.current && e.detail !== iconRef.current) {
        setShowTooltip(false);
      }
    }
    // Mobile only: register and clean up click listeners.
    if (!isDesktop) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('claimedProfileTooltipOpened', handleTooltipOpened);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('claimedProfileTooltipOpened', handleTooltipOpened);
      };
    }
  }, [isDesktop]);

  // Prebuilt tooltip element reused by the overlay trigger.
  const claimedProfileToolTip = (
    <Tooltip className="u-z-index-9020" id="claimedProfileTooltip">
      <div><span>Profile claimed by politician.</span></div>
    </Tooltip>
  );

  // Mobile toggle: open/close tooltip and broadcast opening to other instances.
  const handleClick = () => {
    if (!showTooltip) {
      window.dispatchEvent(new CustomEvent('claimedProfileTooltipOpened', { detail: iconRef.current }));
    }
    setShowTooltip(prev => !prev);
  };

  return (
    <>
      {/* Show tooltip below on hover/focus for desktop, controlled click for mobile. */}
      <OverlayTrigger overlay={claimedProfileToolTip} placement="bottom" {...(!isDesktop ? { show: showTooltip } : {})}>
        {/* Wrapper required by OverlayTrigger child expectations. */}
        <span ref={iconRef} className="claimed-profile-icon" onClick={!isDesktop ? handleClick : undefined}>
          <SvgImage
            color={DesignTokenColors.neutral500}
            imageName={normalizedImagePath(claimedProfileIcon)} // Provide normalized path to the SVG asset.
            opacity="1.0"
          />
        </span>
      </OverlayTrigger>
    </>
  );
}

export default ClaimedProfileIcon;
