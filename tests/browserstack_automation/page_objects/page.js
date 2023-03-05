import { driver, $ } from '@wdio/globals';

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
    if (this.isCordova) {
      // Navigate to the component associated with the path.
    } else {
      await driver.url(path);
    }
  }

  async saveScreenshot () {
    const date = new Date();
    const dateForDisplay = date.toDateString();
    await driver.saveScreenshot(`./tests/browserstack_automation/screenshots/${dateForDisplay}.png`);
  }

  async retrieveElementById (id) {
    let element = null;
    if (this.isCordova) {
      if (this.isAndroid) {
        element = await $(`android=new UiSelector().resourceId(${id})`);
        return element;
      }
      return element;
    }
    element = await $(`#${id}`);
    return element;
  }
}
