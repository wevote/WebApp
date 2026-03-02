/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { driver, expect } from '@wdio/globals';
import axios from 'axios';
import ReadyPage from '../page_objects/ready.browser';
import FAQPage from '../page_objects/faq.browser';





describe('FAQ Page Scripts', () => {
  beforeEach(async () => {
    try {
      await ReadyPage.load();
      await driver.scroll(0, 600);
      // await driver.pause(10000); // Wait for the page to load completely

      await ReadyPage.waitAboutLinkAndClick();
      await driver.waitUntil(
        async () => (await driver.getUrl()).includes('/more/faq'),
        { timeout: 30000, timeoutMsg: 'URL did not change' },
      );
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });
  afterEach(async () => {
    try {
      let handles = await driver.getWindowHandles();
      if (handles.length > 1) {
        await driver.closeWindow();
        // RE-FETCH the handles to get the currently available ones
        handles = await driver.getWindowHandles();
        // Always switch back to a valid window after closing one
      }
      await driver.switchToWindow(handles[0]);
    } catch (error) {
      console.error('Teardown failed:', error);
    }
  });

  // FAQ_001
  it('verifyAboutLinkRedirected @BVT', async () => {
    await expect(FAQPage.getFAQPageTitleElement).toHaveText('Frequently Asked Questions');
  });

  // FAQ_003
  it('verifyFacebookIconRedirected', async () => {
    await FAQPage.getFacebookIconElement.waitForClickable({ timeout: 15000 });
    await FAQPage.getFacebookIconElement.click();
    await driver.pause(5000); // Wait for the new tab to open
    await FAQPage.waitForURL('https://www.facebook.com/WeVoteUSA');
    await expect(driver).toHaveTitle('We Vote | Facebook');
  });

  // FAQ_005
  // Email icon link is inactive
  // it('verifyEmailIconRedirected', async () => {
  //   await ReadyPage.load();
  //   await ReadyPage.waitAboutLinkAndClick();
  //   await FAQPage.getEmailIconElement.waitForDisplayed({ timeout: 1000 });
  //   await FAQPage.getEmailIconElement.click();
  //   await driver.switchWindow('https://wevote.us8.list-manage.com/subscribe?u=29bec99e46ac46abe32781925&id=5e052cb629');
  //   await expect(driver).toHaveTitle('We Vote');
  // });

  // FAQ_006
  it('verifyGitHubIconAndLinksRedirected', async () => {
    console.log('Github links test started');
    await expect(FAQPage.getGitHubIconElement).toBeElementsArrayOfSize(3);


    const actualResultArray = await FAQPage.clickGitHubIconAndLinks();

    for (let i = 0; i < actualResultArray.length; i++) {
      console.log(`this is  github links${actualResultArray[i]}`, actualResultArray[i].toString());
      const actualResult = actualResultArray[i];
      await expect(actualResult).toBe('We Vote · GitHub');
    } console.log('Github links test finished');
  });

  // FAQ_007
  it('verifyBlogIconRedirected', async () => {
    await FAQPage.getBlogIconElement.waitForClickable();
    await FAQPage.getBlogIconElement.click();
    await driver.pause(5000); // Wait for the new tab to open
    await FAQPage.waitForURL('https://blog.wevote.us/');
    await expect(driver).toHaveTitle(expect.stringContaining('Share your Vision'));
  });

  // FAQ_008
  it('verifyTiktokIconRedirected', async () => {
    await FAQPage.clickTitokIconElement.waitForClickable();
    await FAQPage.clickTitokIconElement.click();
    await FAQPage.waitForURL('https://www.tiktok.com/@wevoteus');
    await expect(driver).toHaveTitle(expect.stringContaining('TikTok'));
  });
  // FAQ_009
  // verifyTwitterIconRedirectedß
  it('verifyTwitterIconRedirected', async () => {
    await FAQPage.clickTwitterIconElement.waitForClickable();
    try {
      await FAQPage.clickTwitterIconElement.click();
      await FAQPage.waitForURL('https://x.com/WeVote');
      await expect(FAQPage.weVoteText).toBeDisplayed();
    } catch (error) {
      console.error('Error during Twitter icon test:', error);
      throw error; // Rethrow to ensure the test fails
    }
  });
  // FAQ_010   Instagram blocks automated traffic (ANTI-BOT) we are not able to verify the Instagram link redirection by clicking on the icon. As a workaround, we are verifying the Instagram link redirection by fetching the href attribute of the Instagram icon and making a HEAD request to check if the URL is valid and accessible.
  it('verifyInstagramIconRedirected', async () => {
    await FAQPage.getInstagramIconElement.waitForClickable();
    const href = await FAQPage.getInstagramIconElement.getAttribute('href');
    const response = await axios.head(href, { timeout: 5000 });
    await expect(response.status).toBeLessThan(400);
  });

  it('verifyEducationLinkRedirected', async () => {
    await FAQPage.getWeVoteEducationWebsiteElement.waitForClickable();
    await FAQPage.getWeVoteEducationWebsiteElement.click();

    await driver.pause(5000); // Wait for the new tab to open
    await FAQPage.waitForURL('https://www.wevoteeducation.org/');
    await expect(driver).toHaveTitle('We Vote Education Fund');
  });

  // FAQ_010
  it('verifyWeVoteUSALinkRedirected', async () => {
    await FAQPage.getWeVoteUSAWebsiteElement.waitForClickable();
    await FAQPage.getWeVoteUSAWebsiteElement.click();
    await driver.pause(5000); // Wait for the new tab to open
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
      // assert.equal(actualResult, 'WeVote - Career PageBrowser');
      await expect(actualResult).toContain('Career Page');
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
    await FAQPage.getAboutPageElement.waitForClickable();
    await FAQPage.getAboutPageElement.click();
    await driver.pause(5000); // Wait for the new tab to open
    await FAQPage.waitForURL('https://quality.wevote.us/more/about');
    await expect(driver).toHaveTitle('About WeVote');
  });

  // FAQ_013
  it('verifyContactUsRedirected', async () => {
    await FAQPage.getWeVoteContactUsFormElement.waitForClickable();
    await FAQPage.getWeVoteContactUsFormElement.click();
    await driver.pause(5000); // Wait for the new tab to open
    await FAQPage.waitForURL('https://help.wevote.us/hc/en-us/requests/new');
    // await FAQPage.getWeVoteUSAWebsiteElement.click
    await expect(driver).toHaveUrl(/help.wevote.us/);
  });

  // FAQ_014  //Appstore and Play store links are blocked by BrowserStack, we are not able to verify the app store and play store link redirection by clicking on the icons. As a workaround, we are verifying the app store and play store link redirection by fetching the href attribute of the icons and making a HEAD request to check if the URLs are valid and accessible.
  it('verifyAppStoreRedirected', async () => {
    await FAQPage.getWeVoteIPhoneLinkElement.waitForClickable();
    // await FAQPage.getWeVoteIPhoneLinkElement.click();
    const href = await FAQPage.getWeVoteIPhoneLinkElement.getAttribute('href');
    const response = await axios.head(href, { timeout: 5000 });
    expect(response.status).toBeLessThan(400);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  // FAQ_015
  it('verifyGooglePlayRedirected', async () => {
    await FAQPage.getWeVoteAndroidLinkElement.waitForClickable();
    await FAQPage.getWeVoteAndroidLinkElement.click();
    await FAQPage.waitForURL('https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US');
    await expect(driver).toHaveTitle('We Vote Ballot Guide, @WeVote - Apps on Google Play');
  });

  // FAQ_016
  it('verifyDonateLinkRedirected', async () => {
    await FAQPage.getPleaseDonateElement.waitForClickable();
    await FAQPage.getPleaseDonateElement.click();
    await driver.pause(5000); // Wait for the new tab to open
    await expect(driver).toHaveTitle('Donate - WeVote');
  });

  /// FAQ_017
  it('verifyLetsGetStartedLinkRedirected', async () => {
    await FAQPage.getLetsGetStartedElement.waitForClickable();
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

  // FAQ_18
  it('verifyPdfLinksRedirected', async () => {
    await driver.waitUntil(async () => {
      const links = await FAQPage.getAllPdfLinks;
      return links.length > 0;
    }, {
      timeout: 10000,
      timeoutMsg: 'No PDF links found on the page',
    });
    const pdfLinks = await FAQPage.getAllPdfLinks;
    console.log(`Checking PDF URL: ${pdfLinks.length} `);
    for (const link of pdfLinks) {
      try {
        const href = await link.getAttribute('href');
        console.log(href);

        const response = await axios.head(href, { timeout: 10000, validateStatus: () => true });
        await expect(response.status).toBe(200);
        await expect(response.headers['content-type']).toMatch(/application\/pdf/);
      } catch (error) {
        throw new Error(`PDF Link ${link} failed: ${error.message}`);
      }
    }
  });

  // FAQ_19
  it('verifyAllLinks', async () => {
    const links = await FAQPage.getAllFaqPageLinks();
    await driver.waitUntil(async () => links.length > 0, {
      timeout: 20000,
      timeoutMsg: 'No links found on the FAQ page',
    });
    // await driver.pause(50000);
    for (const link of links) {
      try {
        const response = await axios.head(link, { timeout: 10000, validateStatus: () => true });
        await expect(response.status).toBeLessThan(500);
        // console.log(`Checking URL: ${link} - Status: ${response.status}`);
      } catch (error) {
        // Fail the test explicitly if the network call fails
        throw new Error(`Link ${link} failed: ${error.message}`);
      }
    }
  });
});



