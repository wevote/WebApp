import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import FAQPage from '../page_objects/faq.page';

const assert = require('assert');
const { describe, it } = require('mocha');

const waitTime = 5000;


describe('FAQPage', () => {
  // FAQ_001
  it('verifyAboutLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await expect(FAQPage.getFAQPageTitleElement).toHaveText('Frequently Asked Questions');
  });

  // FAQ_003
  it('verifyFacebookIconRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getFacebookIconElement.click();
    await driver.switchWindow('https://www.facebook.com/WeVoteUSA');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('We Vote | Facebook');
  });

  // FAQ_005
  // Email icon link is inactive
  // it('verifyEmailIconRedirected', async () => {
  //   await ReadyPage.load();
  //   await ReadyPage.waitAboutLinkAndClick();
  //   await FAQPage.getEmailIconElement.waitForDisplayed({ timeout: 1waitTime });
  //   await FAQPage.getEmailIconElement.click();
  //   await driver.switchWindow('https://wevote.us8.list-manage.com/subscribe?u=29bec99e46ac46abe32781925&id=5e052cb629');
  //   await expect(driver).toHaveTitle('We Vote');
  // });

  // FAQ_006
  it('verifyGitHubIconAndLinksRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await expect(FAQPage.getGitHubIconElement).toBeElementsArrayOfSize(3);
    const actualResultArray = await FAQPage.clickGitHubIconAndLinks();
    for (let i = 0; i < actualResultArray.length; i++) {
      const actualResult = actualResultArray[i];
      assert.equal(actualResult, 'We Vote · GitHub');
    }
  });

  // FAQ_007
  it('verifyBlogIconRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getBlogIconElement.click();
    driver.switchWindow('https://blog.wevote.us/');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('We Vote – View your ballot. Learn from friends. Share your Vision.');
  });

  // FAQ_009
  it('verifyEducationLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getWeVoteEducationWebsiteElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      await driver.switchWindow('https://www.wevoteeducation.org/');
      await driver.pause(waitTime);
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl === 'https://www.wevoteeducation.org/';
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL not found, timeout after 10000ms',
    });
    await expect(driver).toHaveTitle('We Vote Education Fund');
  });

  // FAQ_010
  it('verifyWeVoteUSALinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getWeVoteUSAWebsiteElement.click();
    driver.switchWindow('https://www.wevoteusa.org/');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('We Vote USA');
  });

  // FAQ_011
  it('verifyVolunteerOpeningsLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await expect(FAQPage.getWeVoteVolunteerElements).toBeElementsArrayOfSize(2);
    const actualResultArray = await FAQPage.clickVolunteerOpeningsLinks();
    for (let i = 0; i < actualResultArray.length; i++) {
      const actualResult = actualResultArray[i];
      assert.equal(actualResult, 'WeVote - Career Page');
    }
  });

  // FAQ_012
  it('verifyTeamLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getAboutPageTitleElement.click();
    driver.switchWindow('https://wevote.us/more/about');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('About WeVote');
  });

  // FAQ_013
  it('verifyContactUsRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getWeVoteContactUsFormElement.click();
    driver.switchWindow('https://help.wevote.us/hc/en-us/requests/new');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle('Submit a request – We Vote');
  });

  // FAQ_014
  it('verifyAppStoreRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getWeVoteIPhoneLinkElement.click();
    await driver.waitUntil(async () => {
      await driver.switchWindow('https://apps.apple.com/us/app/we-vote-ballot-guide-wevote/id1347335726');
      await driver.pause(waitTime);
      const currentUrl = await driver.getUrl();
      return currentUrl === 'https://apps.apple.com/us/app/we-vote-ballot-guide-wevote/id1347335726';
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL not found, timeout after 10000ms',
    });
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote on the App Store');
  });

  // FAQ_015
  it('verifyGooglePlayRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getWeVoteAndroidLinkElement.click();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => {
      await driver.switchWindow('https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US');
      await driver.pause(waitTime);
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl === 'https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US';
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL not found, timeout after 10000ms',
    });
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote - Apps on Google Play');
  });

  // FAQ_016
  it('verifyDonateLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getPleaseDonateElement.click();
    await expect(driver).toHaveTitle('Donate - WeVote');
  });

  // FAQ_017
  it('verifyLetsGetStartedLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await driver.pause(waitTime);
    await FAQPage.getLetsGetStartedElement.click();
    await driver.waitUntil(async () => {
      const currentTitle = await driver.getTitle();
      console.log(currentTitle);
      return currentTitle === 'Ready to Vote? - WeVote';
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected title not found, timeout after 10000ms',
    });
    await expect(ReadyPage.getFollowPopularTopicsElement).toHaveText('Follow Popular Topics');
  });
});
