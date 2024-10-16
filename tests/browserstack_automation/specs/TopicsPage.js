import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import TopicsPage from '../page_objects/topics.page';
import ProfilePage from '../page_objects/profile.page';

const waitTime = 5000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('TopicsPage', () => {
  // Ready_001

  
  it('verifyProChoiceTopicsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    //await driver.waitUntil(async () => (ReadyPage.electionCountDownTitle.isClickable()));
    await driver.waitUntil(async () => (ReadyPage.getProChoiceLinkElement.isClickable()));
    await ReadyPage.getProChoiceLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('pro-choice');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "pro-choice" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Pro-choice - WeVote');
    await driver.pause(waitTime);
    //await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
    //await expect(TopicsPage.getTopicTitleElement).toBeDisplayed();
    await expect(driver).toHaveTitle(expect.stringContaining('Pro-choice - WeVote'));
    // Checking Follow and Unfollow buttons
    await driver.waitUntil(async () => (TopicsPage.getProChoiceFollowElement.isClickable()));
    await TopicsPage.getProChoiceFollowElement.click();
    await driver.waitUntil(async () => (TopicsPage.getProChoiceDropdownButtonElement.isClickable()));
    await TopicsPage.getProChoiceDropdownButtonElement.click();
    //await expect(TopicsPage.getProChoiceUnfollowElement).toBeDisplayed();
    await driver.waitUntil(async () => (TopicsPage.getProChoiceUnfollowElement.isClickable()));
    await TopicsPage.getProChoiceUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getProChoiceFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  

  it('verifyDemocraticClubsTopicsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getDemocraticClubsLinkElement.isClickable()));
    await ReadyPage.getDemocraticClubsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('democratic_clubs');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "democratic_clubs" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Democratic Clubs - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Democratic Clubs - WeVote'));
    // Checking Follow and Unfollow buttons
    await driver.waitUntil(async () => (TopicsPage.getDemocraticClubsFollowElement.isClickable()));
    await TopicsPage.getDemocraticClubsFollowElement.click();
    await driver.waitUntil(async () => (TopicsPage.getDemocraticClubsDropdownButtonElement.isClickable()));
    await TopicsPage.getDemocraticClubsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getDemocraticClubsUnfollowElement.isClickable()));
    await TopicsPage.getDemocraticClubsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getDemocraticClubsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

});