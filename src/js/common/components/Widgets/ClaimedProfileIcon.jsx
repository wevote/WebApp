import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SvgImage from './SvgImage';
import normalizedImagePath from '../../utils/normalizedImagePath';
import claimedProfileIcon from '../../../../img/global/svg-icons/claimed-profile-icon.svg'; // Claimed profile SVG asset.
import DesignTokenColors from '../Style/DesignTokenColors';

// Behavior: renders a claimed-profile icon that shows a tooltip reading
// "Profile claimed by politician." The tooltip appears below the politician image:
// - Desktop: shows on hover via OverlayTrigger (no navigation triggered).
// - Mobile: shows on tap and does not navigate; tapping elsewhere closes it.
function ClaimedProfileIcon() {
   // Prebuilt tooltip element reused by the overlay trigger.
  const claimedProfileToolTip = (
    <Tooltip className="u-z-index-9020" id="claimedProfileTooltip">
      <div><span>Profile claimed by politician.</span></div>
    </Tooltip>
  );

  return (
    <>
      {/* Show tooltip below on hover/focus. */}
      <OverlayTrigger overlay={claimedProfileToolTip} placement="bottom">
        {/* Wrapper required by OverlayTrigger child expectations. */}
        <span>
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
