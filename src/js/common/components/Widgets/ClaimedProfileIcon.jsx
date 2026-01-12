import React, { useRef } from 'react';
import SvgImage from './SvgImage';
import SmartTooltip from './SmartToolTip';
import normalizedImagePath from '../../utils/normalizedImagePath';
import claimedProfileIcon from '../../../../img/global/svg-icons/claimed-profile-icon.svg';
import DesignTokenColors from '../Style/DesignTokenColors';

// Behavior: renders a claimed-profile icon that shows a tooltip reading
// "Profile claimed by politician." The tooltip appears below the politician image:
// - Desktop: shows on hover via OverlayTrigger (no navigation triggered).
// - Mobile: shows on tap and does not navigate; tapping again or elsewhere closes it.
function ClaimedProfileIcon () {
  const iconRef = useRef(null);

  return (
    <SmartTooltip
      title={<div><span>Profile claimed by politician.</span></div>}
      placement="bottom"
      triggerType="both"
      tooltipId="claimedProfileTooltip"
    >
      <span ref={iconRef} className="claimed-profile-icon">
        <SvgImage
          applyFillColor
          color={DesignTokenColors.neutral500}
          imageName={normalizedImagePath(claimedProfileIcon)}
          opacity="1.0"
        />
      </span>
    </SmartTooltip>
  );
}

export default ClaimedProfileIcon;
