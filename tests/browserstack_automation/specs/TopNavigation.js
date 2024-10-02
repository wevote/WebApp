import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import TopNavigation from '../page_objects/topnavigation';

const { describe, it } = require('mocha');

const waitTime = 5000;

describe('TopNavigation', () => {
// TopNavigation_001
  it('openWeVoteHomeLogo', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await TopNavigation.getBallotLinkLocator.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('ballot');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "ballot" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Ballot - WeVote');
    await TopNavigation.toggleLogoBar();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('ready');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "ready" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Ready to Vote? - WeVote');
    await expect(driver).toHaveUrl(expect.stringContaining('ready'));
  });

  // TopNavigation_002
  it('openBallotTab', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await TopNavigation.getBallotLinkLocator.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('ballot');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "ballot" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Ballot - WeVote');
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });


  // TopNavigation_003
  // it('signIn', async () => {
  //   await ReadyPage.load();
  //   await expect(ReadyPage.avatar).not.toExist();
  //   await ReadyPage.signIn();
  //   await expect(ReadyPage.avatar).toBeDisplayed();
  // });

  //   Friends page accessible after sign in
  //   // TopNavigation_004
  //   it('openFriendsTab', async () => {
  //     await ReadyPage.load();
  //   });

  //   Discuss page tab not in header bar
  //   // TopNavigation_005
  //   it('openDiscussTab', async () => {
  //     await ReadyPage.load();
  //   });

  //   HowitWorks tab not in header bar
  //   // TopNavigation_006
  //   it('openHowItWorksTab', async () => {
  //     await ReadyPage.load();
  //   });

  // TopNavigation_007
  it('openDonateTab', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await TopNavigation.toggleDonateTab();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('donate');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "donate" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Donate - WeVote');
    await driver.pause(waitTime);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });

  //   Feature doesn't exist
  //   // TopNavigation_008
  //   it('BallotTab', async () => {
  //     await ReadyPage.load();
  //     await driver.pause(waitTime);
  //   });

  // TopNavigation_009
  it('openCandidatesTab', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await TopNavigation.toggleCandidatesTab();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('candidates');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "candidates" not found, timeout after 10000ms',
    });
    await driver.pause(waitTime);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });

  // TopNavigation_0010
  // Squads feature removed from webapp
  // it('openSquadsTab', async () => {
  //   await ReadyPage.load();
  //   await driver.pause(waitTime);
  //   await TopNavigation.toggleSquadsTab();
  //   await driver.waitUntil(async () => {
  //     // Add condition to check for the expected URL
  //     const currentUrl = await driver.getUrl();
  //     console.log(currentUrl);
  //     return currentUrl.includes('squads');
  //   }, {
  //     timeout: 10000,
  //     timeoutMsg: 'Expected URL to contain "squads" not found, timeout after 10000ms',
  //   });
  //   await driver.switchWindow('Democracy Squads - WeVote');
  //   await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  // });

  // TopNavigation_011
  it('openChallengesTab', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await TopNavigation.toggleChallengesTab();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('challenges');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "challenges" not found, timeout after 10000ms',
    });
    await driver.pause(waitTime);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });
});
