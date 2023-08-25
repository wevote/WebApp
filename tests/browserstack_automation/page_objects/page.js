import { driver, $ } from '@wdio/globals';

export default class Page {
  constructor () {
    this.title = '';
  }

  get header () {
    return $('#header-container');
  }

  get footer () {
    return $('#footer');
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
