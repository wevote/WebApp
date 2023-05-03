import { driver } from '@wdio/globals';

export default class Page {
  constructor () {
    this.title = '';
  }

  get isCordova () {
    return driver.isMobile;
  }

  get isAndroid () {
    return driver.isAndroid;
  }

  get isIOS () {
    return driver.isIOS;
  }

  async open (path) {
    await driver.url(path);
  }
}
