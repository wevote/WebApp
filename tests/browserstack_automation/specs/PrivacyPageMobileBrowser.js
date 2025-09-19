import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import PrivacyPage from '../page_objects/privacy.page';

const assert = require('assert');
const { describe, it } = require('mocha');

const waitTime = 10000;

describe('Privacy Page', () => {
  // Privacy_001
  it('verifyWeVoteUSLinkRedirect', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const weVoteUSLink = document.querySelector('#wevote');
      weVoteUSLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow('https://wevote.us/');
    await driver.pause(waitTime);
    await expect(driver).toHaveUrl('https://wevote.us/');
    await expect(driver).toHaveTitle('Ready to Vote? - WeVote');
  });

  // Privacy_002
  it('verifyCampaignsWeVoteUSLinkRedirect', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.findPrivacyLink.isClickable()));
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const weVoteCampaignsLink = document.querySelector('#weVoteCampaigns');
      weVoteCampaignsLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow('https://campaigns.wevote.us/');
    await driver.pause(waitTime);
    await expect(PrivacyPage.elementOfCampaignPage).toHaveText('Helping the best candidates win votes');
  });

  // Privacy_003
  it('verifyHelpCenterLinkRedirect', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const helpCenterLink = document.querySelector('#wevotePrivacy');
      helpCenterLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow('https://help.wevote.us/hc/en-us/sections/115000140987-Security-Technology');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('Security & Technology – We Vote');
  });

  // Privacy_005
  it('verifyDeleteYourAccountLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await PrivacyPage.deleteYourAccountLink.click();
    await driver.pause(waitTime);
    await PrivacyPage.deleteYourAccountButton.click();
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('Privacy Policy - WeVote');
  });

  // Privacy_005_2
  it('verifyCancelButtonOfDeleteYourAccountLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await PrivacyPage.deleteYourAccountLink.click();
    await driver.pause(waitTime);
    await expect(PrivacyPage.deleteYourAccountLink).not.toBeDisplayed();
    await driver.pause(waitTime);
    await PrivacyPage.cancelOfDeleteYourAccountButton.click();
    await driver.pause(waitTime);
    await expect(PrivacyPage.deleteYourAccountLink).toBeDisplayed();
  });

  // Privacy_006
  it('verifyGoogleApiUserDataPolicyLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const googleApiUserDataPolicyLink= document.querySelector('#googleLimitedUse');
      googleApiUserDataPolicyLink.click();
    });
    await driver.switchWindow('https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes');
    await expect(driver).toHaveTitle('Google API Services User Data Policy  |  Google for Developers');
  });

  // Privacy_007
  it('verifyGoogleAnalyticsLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const googleAnalyticsLink = document.querySelector('#googleAnalytics');
      googleAnalyticsLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow('https://policies.google.com/privacy');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('Privacy Policy – Privacy & Terms – Google');
  });

  // Privacy_008
  it('verifyOpenReplayPrivacyLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const openReplayPrivacyLink = document.querySelector('#openReplayPrivacy');
      openReplayPrivacyLink.click();
    });
    await driver.pause(waitTime);
    await driver.waitUntil(async () => {
      await driver.switchWindow('https://openreplay.com/legal/privacy.html');
      const currentUrl = await driver.getUrl();
      return currentUrl === 'https://openreplay.com/legal/privacy.html';
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL not found, timeout after 10000ms',
    });
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('Privacy | OpenReplay');
  });

  // Privacy 009
  it('verifyEmailLinks', async () => {
    await ReadyPage.load();
    await driver.pause(3000);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(3000);
    await expect(PrivacyPage.emailLink).toBeElementsArrayOfSize(2);
    await driver.pause(3000);
    const actualResultArray = await PrivacyPage.getTextFromEmailLinks();
    for (let i = 0; i < actualResultArray.length; i++) {
      const actualResult = actualResultArray[i];
      assert.equal(actualResult, 'info@WeVote.US');
    }
  });
});
