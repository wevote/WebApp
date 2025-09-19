import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import FAQPage from '../page_objects/faq.page';



const waitTime = 10000;

beforeEach(async () => {
  await ReadyPage.load();
  await driver.maximizeWindow();

  await driver.pause(waitTime);

  await ReadyPage.waitAboutLinkAndClick();

});


describe('FAQ Page', () => {
  // FAQ_001
  it('verifyAboutLinkRedirected @BVT', async () => {
    await expect(FAQPage.getFAQPageTitleElement).toHaveText('Frequently Asked Questions');
  });

  // FAQ_003
  it('verifyFacebookIconRedirected', async () => {
    await (await FAQPage.getFacebookIconElement).waitForClickable({ timeout: 15000 });
    await FAQPage.getFacebookIconElement.click();
    await FAQPage.waitForURL('https://www.facebook.com/WeVoteUSA');
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
    await FAQPage.getGitHubIconElement;
    await expect(await FAQPage.getGitHubIconElement).toBeElementsArrayOfSize(3);
    const actualResultArray = await FAQPage.clickGitHubIconAndLinks();
    for (let i = 0; i < actualResultArray.length; i++) {
      const actualResult = actualResultArray[i];
      await expect(actualResult).toHaveTitle('We Vote · GitHub');
    }
  });

  // FAQ_007
  it('verifyBlogIconRedirected', async () => {
    await (await FAQPage.getBlogIconElement).waitForClickable();
    await FAQPage.getBlogIconElement.click();
    await FAQPage.waitForURL('https://blog.wevote.us/');
    await expect(driver).toHaveTitle(expect.stringContaining('Share your Vision'));
  });

  // FAQ_009
  it('verifyEducationLinkRedirected', async () => {
    await (await FAQPage.getWeVoteEducationWebsiteElement).waitForClickable();
    await FAQPage.getWeVoteEducationWebsiteElement.click();
    await FAQPage.waitForURL('https://www.wevoteeducation.org/');
    await expect(driver).toHaveTitle('We Vote Education Fund');
  });

  // FAQ_010
  it('verifyWeVoteUSALinkRedirected', async () => {
    await (await FAQPage.getWeVoteUSAWebsiteElement).waitForClickable();
    await FAQPage.getWeVoteUSAWebsiteElement.click();
    await FAQPage.waitForURL('https://www.wevoteusa.org/');
    await expect(driver).toHaveTitle('We Vote USA');
  });

  // FAQ_011
  it('verifyVolunteerOpeningsLinkRedirected', async () => {
    const volunteerElements = await FAQPage.getWeVoteVolunteerElements;
    // await volunteerElements[0].waitForClickable();
    await expect(volunteerElements).toBeElementsArrayOfSize(2);
    const actualResultArray = await FAQPage.clickVolunteerOpeningsLinks();
    for (let i = 0; i < actualResultArray.length; i++) {
      const actualResult = actualResultArray[i];
      // assert.equal(actualResult, 'WeVote - Career Page');
      await expect(actualResult).toHaveTitle('WeVote - Career Page');
    }
  });
  // it('verifyTeamLinkRedirected', async () => {
  //   await ReadyPage.load();
  //   await ReadyPage.waitAboutLinkAndClick();
  //   await driver.pause(waitTime);
  //   await FAQPage.getAboutPageTitleElement.click();
  //   driver.switchWindow('https://quality.wevote.us/more/about');
  //   await driver.pause(waitTime);
  //   await expect(driver).toHaveTitle('About WeVote');
  // });
  //   // FAQ_012
  it('verifyTeamLinkRedirected', async () => {
    await (await FAQPage.getAboutPageTitleElement).waitForClickable();
    await FAQPage.getAboutPageTitleElement.click();
    await FAQPage.waitForURL('https://quality.wevote.us/more/about');
    await expect(driver).toHaveTitle('About WeVote');
  });

  // FAQ_013
  it('verifyContactUsRedirected', async () => {
    await (await FAQPage.getWeVoteContactUsFormElement).waitForClickable();
    await FAQPage.getWeVoteContactUsFormElement.click();
    await FAQPage.waitForURL('https://help.wevote.us/hc/en-us/requests/new');
    // await FAQPage.getWeVoteUSAWebsiteElement.click
    await expect(driver).toHaveTitle('Submit a request – We Vote');
  });

  // FAQ_014
  it('verifyAppStoreRedirected', async () => {
    await (await FAQPage.getWeVoteIPhoneLinkElement).waitForClickable();
    await FAQPage.getWeVoteIPhoneLinkElement.click();
    await FAQPage.waitForURL('https://apps.apple.com/us/app/we-vote-ballot-guide-wevote/id1347335726');
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote on the App Store');
  });

  // FAQ_015
  it('verifyGooglePlayRedirected', async () => {
    await (await FAQPage.getWeVoteAndroidLinkElement).waitForClickable();
    await FAQPage.getWeVoteAndroidLinkElement.click();
    await FAQPage.waitForURL('https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US');
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote - Apps on Google Play');
  });

  // FAQ_016
  it('verifyDonateLinkRedirected', async () => {
    await (await FAQPage.getPleaseDonateElement).waitForClickable();
    await FAQPage.getPleaseDonateElement.click();

    await expect(driver).toHaveTitle('Donate - WeVote');
  });

  /// FAQ_017
  it('verifyLetsGetStartedLinkRedirected', async () => {
    await (await FAQPage.getLetsGetStartedElement).waitForClickable();
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



