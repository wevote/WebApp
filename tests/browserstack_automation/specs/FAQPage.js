import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import FAQPage from '../page_objects/faq.page';

const assert = require('assert');
const { describe, it } = require('mocha');

describe('FAQPage', () => {
  // FAQ_001
  it('verifyAboutLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await expect(FAQPage.getFAQPageTitleElement).toHaveText('Frequently Asked Questions');
  });

  // FAQ_003
  it('verifyFacebookIconRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getFacebookIconElement.click();
    await driver.switchWindow('https://www.facebook.com/WeVoteUSA');
    await expect(driver).toHaveTitle('We Vote | Facebook');
  });

  // FAQ_005
  it('verifyEmailIconRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getEmailIconElement.click();
    await driver.pause(5000);
    await driver.switchWindow('https://wevote.us8.list-manage.com/subscribe?u=29bec99e46ac46abe32781925&id=5e052cb629');
    await expect(driver).toHaveTitle('We Vote');
  });

  // FAQ_006
  it('verifyGitHubIconAndLinksRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
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
    await FAQPage.getBlogIconElement.click();
    driver.switchWindow('https://blog.wevote.us/');
    await expect(driver).toHaveTitle('We Vote – View your ballot. Learn from friends. Share your Vision.');
  });

  // FAQ_009
  it('verifyEducationLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getWeVoteEducationWebsiteElement.click();
    await driver.switchWindow('https://www.wevoteeducation.org/');
    await expect(driver).toHaveTitle('We Vote Education Fund');
  });

  // FAQ_010
  it('verifyWeVoteUSALinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getWeVoteUSAWebsiteElement.click();
    driver.switchWindow('https://www.wevoteusa.org/');
    await expect(driver).toHaveTitle('We Vote USA');
  });

  // FAQ_011
  it('verifyVolunteerOpeningsLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
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
    await FAQPage.getAboutPageTitleElement.click();
    driver.switchWindow('https://wevote.us/more/about');
    await expect(driver).toHaveTitle('About WeVote');
  });

  // FAQ_013
  it('verifyContactUsRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getWeVoteContactUsFormElement.click();
    driver.switchWindow('https://help.wevote.us/hc/en-us/requests/new');
    await expect(driver).toHaveTitle('Submit a request – We Vote');
  });

  // FAQ_014
  it('verifyAppStoreRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getWeVoteIPhoneLinkElement.click();
    await driver.pause(5000);
    driver.switchWindow('https://apps.apple.com/us/app/we-vote-ballot-guide-wevote/id1347335726');
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote on the App Store');
  });

  // FAQ_015
  it('verifyGooglePlayRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getWeVoteAndroidLinkElement.findAndClick();
    await driver.pause(5000);
    await driver.switchWindow('https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US');
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote - Apps on Google Play');
  });

  // FAQ_016
  it('verifyDonateLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getPleaseDonateElement.click();
    await expect(driver).toHaveTitle('Donate - WeVote');
  });

  // FAQ_017
  it('verifyLetsGetStartedLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.waitAboutLinkAndClick();
    await FAQPage.getLetsGetStartedElement.click();
    await expect(driver).toHaveTitle('Ready to Vote? - WeVote');
    await expect(ReadyPage.getFollowPopularTopicsElement).toHaveText('Follow Popular Topics');
  });
});
