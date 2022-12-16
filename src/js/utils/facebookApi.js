import { isWebApp } from '../common/utils/isCordovaOrWebApp';

export default function facebookApi () {
  return isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
}

