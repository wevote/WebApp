import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import PrivacyPage from '../page_objects/privacy.browser';
import TermsPage from '../page_objects/terms.browser';

const waitTime = 10000;

describe('TermsPage', () => {
  // Terms_001
  it.only('verifyGitHubLinkRedirected', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await ReadyPage.getTermsLinkElement.click();
    await driver.pause(waitTime);
    await TermsPage.getGitHubLink.click();
    await driver.pause(waitTime);
    driver.switchWindow('https://github.com/WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('We Vote · GitHub');
  });

  // Terms_002
  it('verifyPrivacyPolicyLinkRedirected', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await ReadyPage.getTermsLinkElement.click();
    await driver.pause(waitTime);
    await TermsPage.getPrivacyLinkElement.click();
    await driver.pause(waitTime);
    await expect(PrivacyPage.pageContentTitleText).toHaveText('WeVote.US Privacy Policy');
  });

  // Terms_003
  it('verifyEmailLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await ReadyPage.getTermsLinkElement.findAndClick();
    await driver.pause(waitTime);
    await expect(TermsPage.emailLink).toHaveText('info@WeVote.US');
  });
});
