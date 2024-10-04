import { $, $$ } from '@wdio/globals';
import Page from './page';


class WRFOPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - WeVote';
  }
  
    
  async waitAboutLinkAndClick () {
    await this.getAboutLinkElement.waitForDisplayed({ timeout: 15000 });
    // await driver.pause(9000);
    await this.getAboutLinkElement.click();
  }

  async load () {
    await super.open('/ready');
  }

  async signIn () {
    await super.signIn();
  }

  
}

export default new WRFOPage();
