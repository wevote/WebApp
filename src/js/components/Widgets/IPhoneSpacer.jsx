import React from 'react';
import { hasIPhoneNotch, isIOS, isIOSAppOnMac } from '../../common/utils/cordovaUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { IOSDynamicIslandSpacer, IOSNotchedSpacer } from '../Style/pageLayoutStyles';


// A function component
export default function IPhoneSpacer () {
  renderLog('IPhoneSpacer');  // Set LOG_RENDER_EVENTS to log all renders

  if (isCordova() && isIOS() && hasIPhoneNotch()) {
    return <IOSNotchedSpacer />;
  } else if (isCordova() && isIOS() && !hasIPhoneNotch() && !isIOSAppOnMac()) {
    return <IOSDynamicIslandSpacer />;
  }
  return <></>;
}
