import { driver, expect } from '@wdio/globals';
import DiscussPage from '../page_objects/discuss.page';

const { describe, it } = require('mocha');

describe('Discuss Page', () => {
  // Discuss_001
  it('openDiscussPage', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(driver).toHaveUrl('https://quality.wevote.us/news');
    await expect(driver).toHaveTitle('Discuss - WeVote');
  });

  // // Clarify test case
  // // Discuss_002
  // // it('verifyDiscussPageSpelling', async () => {
  // //   await DiscussPage.load();
  // // });

  // // Clarify test case
  // // // Discuss_003
  // // it('verifyDiscussPageBlankSpace', async () => {
  // //   await DiscussPage.load();
  // // });

  // Discuss_004
  it('verifyInviteFriendsButton', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailSignInTextBox; // Locate the text box element using a selector
    element.setValue('wevote@gmail.com');
    await driver.waitUntil(async () => ((DiscussPage.toggleEmailVerificationButton)));
  });
});
