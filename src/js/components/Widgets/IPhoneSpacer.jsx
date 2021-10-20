import React from 'react';
import { hasIPhoneNotch, isCordova, isIOS, isIOSAppOnMac } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { IOSNoNotchSpacer, IOSNotchedSpacer } from '../../utils/pageLayoutStyles';


// A function component
export default function IPhoneSpacer () {
  renderLog('IPhoneSpacer');  // Set LOG_RENDER_EVENTS to log all renders

  if (isCordova() && isIOS() && hasIPhoneNotch()) {
    return <IOSNotchedSpacer />;
  } else if (isCordova() && isIOS() && !hasIPhoneNotch() && !isIOSAppOnMac()) {
    return <IOSNoNotchSpacer />;
  }
  return <></>;
}
