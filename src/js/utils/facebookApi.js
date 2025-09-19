import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import webAppConfig from '../config';

export default function facebookApi () {
  return isWebApp() || !webAppConfig.ENABLE_FACEBOOK ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
}

