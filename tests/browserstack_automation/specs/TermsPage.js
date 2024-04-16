import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import PrivacyPage from '../page_objects/privacy.page';
import TermsPage from '../page_objects/terms.page';

const { describe, it } = require('mocha');

describe('TermsPage', () => {
  // Terms_001
  it.only('verifyGitHubLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.getTermsLinkElement.findAndClick();
    await TermsPage.getGitHubLink.click();
    driver.switchWindow('https://github.com/WeVote');
    await expect(driver).toHaveTitle('We Vote · GitHub');
  });

  // Terms_002
  it('verifyPrivacyPolicyLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.getTermsLinkElement.findAndClick();
    await TermsPage.getPrivacyLinkElement.click();
    await expect(PrivacyPage.pageContentTitleText).toHaveText('WeVote.US Privacy Policy');
  });

  // Terms_003
  it('verifyEmailLink', async () => {
    await ReadyPage.load();
    await ReadyPage.getTermsLinkElement.findAndClick();
    await expect(TermsPage.emailLink).toHaveText('info@WeVote.US');
  });
});
