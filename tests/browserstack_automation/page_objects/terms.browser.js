import { $ } from '@wdio/globals';
import PageBrowser from './page.browser';

class TermsBrowser extends PageBrowser {
  constructor () {
    super().title = 'Terms of Service - We Vote';
  }

  async load () {
    await super.open('/more/terms');
    await super.maximizeWindow();
    await super.rerender();
  }

  get getGitHubLink () {
    return $('#wevoteGitHub');
  }

  get getPrivacyLinkElement () {
    return $('#privacyPolicy');
  }

  get emailLink () {
    return $('#infoWeVoteEmailLink');
  }
}

export default new TermsBrowser();
