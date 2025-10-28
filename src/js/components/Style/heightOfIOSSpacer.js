/* global $ */

// eslint-disable-next-line import/prefer-default-export
import { isIOS } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { cordovaOffsetLog } from '../../common/utils/logging';

function heightOfIOSSpacer (includePx = false) {
  if (isIOS()) {
    const iOSNotchedSpacer = $('div[class*=\'IOSNotchedSpacer\']');
    const $IOSDynamicIslandSpacer = $('div[class*=\'IOSDynamicIslandSpacer\']');
    const height = iOSNotchedSpacer.length ? iOSNotchedSpacer.outerHeight() : $IOSDynamicIslandSpacer.outerHeight();
    // console.log('heightOfIOSSpacer: ', includePx, includePx ? `${height}px` : height);
    return includePx ? `${height}px` : height;
  }
  return '';
}

export function cordovaDualHeaderContainerTopOffset () {
  if (isWebApp()) return '';
  const heightIOSSpacer = heightOfIOSSpacer();
  cordovaOffsetLog(`cordovaDualHeaderContainerTopOffset heightIOSSpacer: ${heightIOSSpacer} returned ${heightIOSSpacer}px`);
  return  `${heightIOSSpacer}px`;
}

export default heightOfIOSSpacer;
