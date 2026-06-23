import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import PrivacyPage from '../page_objects/privacy.browser';
import assert from 'node:assert';

const waitTime = 10000;

describe('Privacy PageBrowser', () => {
  beforeEach(async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.waitForClickable({
      timeout: 10000,
    });
    await ReadyPage.findPrivacyLink.click();
  });

  afterEach(async () => {
    const handles = await driver.getWindowHandles();
    for (let i = handles.length - 1; i > 0; i--) {
      await driver.switchToWindow(handles[i]);
      await driver.closeWindow();
    }
    await driver.switchToWindow(handles[0]);
  });

  async function switchToNewWindow(urlFragment) {
    await driver.waitUntil(
      async () => {
        const handles = await driver.getWindowHandles();
        return handles.length > 1;
      },
      {
        timeout: 10000,
        timeoutMsg: 'New window was not opened',
      }
    );
    await driver.switchWindow(urlFragment);
  }
  // Privacy_001
  it('verifyWeVoteUSLinkRedirect', async () => {
    await PrivacyPage.weVoteUSLink.waitForClickable();
    await PrivacyPage.weVoteUSLink.click();
    await driver.switchWindow('wevote.us');
    await expect(driver).toHaveUrl(
      expect.stringContaining('wevote.us')
    );
  });

  // Privacy_002
  it('verifyCampaignsWeVoteUSLinkRedirect', async () => {
    await PrivacyPage.campaignsWeVoteUSLink.waitForClickable();
    await PrivacyPage.campaignsWeVoteUSLink.click();
    await switchToNewWindow('campaigns.wevote.us');
    await expect(
      PrivacyPage.elementOfCampaignPage
    ).toHaveText(
      'Helping the best candidates win votes'
    );
  });

  // Privacy_003
  it('verifyHelpCenterLinkRedirect', async () => {
    await PrivacyPage.helpCenterLink.waitForClickable();
    await PrivacyPage.helpCenterLink.click();
    await switchToNewWindow('help.wevote.us');
    await expect(driver).toHaveTitle(
      expect.stringContaining('Security')
    );
  });

  // Privacy_005
  it('verifyDeleteYourAccountLink', async () => {
    await PrivacyPage.deleteYourAccountLink.waitForClickable();
    await PrivacyPage.deleteYourAccountLink.click();
   await PrivacyPage.deleteYourAccountButton.waitForClickable();
    await PrivacyPage.deleteYourAccountButton.click();
    await expect(driver).toHaveTitle(
      expect.stringContaining('Privacy')
    );
  });

  // Privacy_005_2
  it('verifyCancelButtonOfDeleteYourAccountLink', async () => {
    await PrivacyPage.deleteYourAccountLink.waitForClickable();
    await PrivacyPage.deleteYourAccountLink.click();
    await expect(
      PrivacyPage.deleteYourAccountLink
    ).not.toBeDisplayed();
    await PrivacyPage.cancelOfDeleteYourAccountButton.waitForClickable();
    await PrivacyPage.cancelOfDeleteYourAccountButton.click();
    await expect(
      PrivacyPage.deleteYourAccountLink
    ).toBeDisplayed();
  });

  // Privacy_006
  it('verifyGoogleApiUserDataPolicyLink', async () => {
    await PrivacyPage.googleApiUserDataPolicyLink.waitForClickable();
    await PrivacyPage.googleApiUserDataPolicyLink.click();
    await switchToNewWindow('developers.google.com');
    await expect(driver).toHaveTitle(
      expect.stringContaining('Google API Services User Data Policy')
    );
  });

  // Privacy_007
  it('verifyGoogleAnalyticsLink', async () => {
    await PrivacyPage.googleAnalyticsLink.waitForClickable();
    await PrivacyPage.googleAnalyticsLink.click();
    await switchToNewWindow('policies.google.com');
    await expect(driver).toHaveTitle(
      expect.stringContaining('Privacy Policy')
    );
  });

  // Privacy_008
  it('verifyOpenReplayPrivacyLink', async () => {
    await PrivacyPage.openReplayPrivacyLink.waitForClickable();
    await PrivacyPage.openReplayPrivacyLink.click();
    await switchToNewWindow('openreplay.com');
    await driver.waitUntil(
      async () => {
        const currentUrl = await driver.getUrl();
        return currentUrl.includes('/legal/privacy/');
      },
      {
        timeout: 10000,
        timeoutMsg: 'Privacy page URL not found',
      }
    );
    await expect(driver).toHaveTitle(
      expect.stringContaining('Privacy')
    );
  });

  // Privacy 009
  it('verifyEmailLinks', async () => {
    await expect(
      PrivacyPage.emailLink
    ).toBeElementsArrayOfSize(2);
    const actualResultArray =
      await PrivacyPage.getTextFromEmailLinks();
    actualResultArray.forEach((email) => {
      assert.equal(email, 'info@WeVote.US');
    });
  });
});
