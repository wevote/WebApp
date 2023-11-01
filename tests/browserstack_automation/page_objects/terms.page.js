import { $, $$ } from '@wdio/globals';
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

  get getTermsPageTitleElement () {
    return $('.ContentTitle-sc-1h3qvzv-0.gyirbV');
  }

  get pageContentTitleText () {
    return $('.ContentTitle-sc-aac96k-0');
  }

  get emailLink () {
    return $$('//a[text() = "info@WeVote.US"]');
  }
}

export default new TermsPage();
