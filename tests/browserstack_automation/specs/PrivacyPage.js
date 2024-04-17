import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import PrivacyPage from '../page_objects/privacy.page';

const assert = require('assert');
const { describe, it } = require('mocha');

describe('Privacy Page', () => {
  // Privacy_001
  it('verifyWeVoteUSLinkRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.weVoteUSLink.click();
    await driver.switchWindow('https://wevote.us/');
    await expect(driver).toHaveUrl('https://wevote.us/');
    await expect(driver).toHaveTitle('Ready to Vote? - WeVote');
  });

  // Privacy_002
  it('verifyCampaignsWeVoteUSLinkRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.campaignsWeVoteUSLink.findAndClick();
    await driver.switchWindow('https://campaigns.wevote.us/');
    await expect(PrivacyPage.elementOfCampaignPage).toHaveText('Helping the best candidates win votes');
  });

  // Privacy_003
  it('verifyHelpCenterLinkRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.helpCenterLink.click();
    await driver.switchWindow('https://help.wevote.us/hc/en-us/sections/115000140987-Security-Technology');
    await expect(driver).toHaveTitle('Security & Technology – We Vote');
  });

  // Privacy_005
  it('verifyDeleteYourAccountLink', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.deleteYourAccountLink.click();
    await PrivacyPage.deleteYourAccountButton.click();
    await driver.pause(3000);
    await expect(driver).toHaveTitle('Privacy Policy - WeVote');
  });

  // Privacy_005_2
  it('verifyCancelButtonOfDeleteYourAccountLink', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.deleteYourAccountLink.click();
    await expect(PrivacyPage.deleteYourAccountLink).not.toBeDisplayed();
    await PrivacyPage.cancelOfDeleteYourAccountButton.click();
    await expect(PrivacyPage.deleteYourAccountLink).toBeDisplayed();
  });

  // Privacy_006
  it('verifyGoogleApiUserDataPolicyLink', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.googleApiUserDataPolicyLink.click();
    await driver.switchWindow('https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes');
    await expect(driver).toHaveTitle('Google API Services User Data Policy  |  Google for Developers');
  });

  // Privacy_007
  it('verifyGoogleAnalyticsLink', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await PrivacyPage.googleAnalyticsLink.click();
    await driver.switchWindow('https://policies.google.com/privacy');
    await expect(driver).toHaveTitle('Privacy Policy – Privacy & Terms – Google');
  });

  // Privacy_008
  it('verifyOpenReplayPrivacyLink', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await driver.pause(5000);
    await PrivacyPage.openReplayPrivacyLink.click();
    // await driver.pause(5000);
    await driver.switchWindow('https://openreplay.com/legal/privacy.html');
    await driver.pause(5000);
    // await expect(driver).toHaveUrl('https://openreplay.com/privacy.html');
    await expect(driver).toHaveTitle('Privacy | OpenReplay');
  });

  // Privacy 009
  it('verifyEmailLinks', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await driver.pause(3000);
    await expect(PrivacyPage.emailLink).toBeElementsArrayOfSize(2);
    const actualResultArray = await PrivacyPage.getTextFromEmailLinks();
    for (let i = 0; i < actualResultArray.length; i++) {
      const actualResult = actualResultArray[i];
      assert.equal(actualResult, 'info@WeVote.US');
    }
  });
});
