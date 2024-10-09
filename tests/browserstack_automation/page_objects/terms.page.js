import { $ } from '@wdio/globals';
import Page from './page';

class TermsPage extends Page {
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

export default new TermsPage();
