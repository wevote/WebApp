import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import PrivacyPage from '../page_objects/privacy.page';
import TermsPage from '../page_objects/terms.page';

const { describe, it } = require('mocha');

describe('TermsPage', () => {
  // Terms_001
  it.only('verifyGitHubLinkRedirected', async () => {
    await ReadyPage.load();
    await driver.pause(5000);
    await ReadyPage.getTermsLinkElement.findAndClick();
    await driver.pause(5000);
    await TermsPage.getGitHubLink.click();
    await driver.pause(5000);
    driver.switchWindow('https://github.com/WeVote');
    await driver.pause(5000);
    await expect(driver).toHaveTitle('We Vote · GitHub');
  });

  // Terms_002
  it('verifyPrivacyPolicyLinkRedirected', async () => {
    await ReadyPage.load();
    await driver.pause(5000);
    await ReadyPage.getTermsLinkElement.findAndClick();
    await driver.pause(5000);
    await TermsPage.getPrivacyLinkElement.click();
    await driver.pause(5000);
    await expect(PrivacyPage.pageContentTitleText).toHaveText('WeVote.US Privacy Policy');
  });

  // Terms_003
  it('verifyEmailLink', async () => {
    await ReadyPage.load();
    await driver.pause(5000);
    await ReadyPage.getTermsLinkElement.findAndClick();
    await driver.pause(5000);
    await expect(TermsPage.emailLink).toHaveText('info@WeVote.US');
  });
});
