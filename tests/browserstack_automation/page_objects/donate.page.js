import { $, $$ } from '@wdio/globals';
import Page from './page';

class DonatePage extends Page {
  constructor () {
    super().title = 'Donate - We Vote';
  }

  async load () {
    await super.open('/donate');
    await super.maximizeWindow();
    await super.rerender();
  }

  get getDonatePageContentTitleElement () {
    return $('.cZOxNT');
  }
}

export default new DonatePage();
