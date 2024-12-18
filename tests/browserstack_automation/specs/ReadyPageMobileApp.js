//import { driver, expect, browser } from '@wdio/globals';
import { driver, expect , browser} from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
// import DonatePage from '../page_objects/donate.page';
import webAppConfig from '../../../src/js/config';

const waitTime = 8000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('ReadyPage', () => {
  // Ready_001 and Ready_003
  it('verifyElectionCountDownRedirect and verifyViewYourBallotRedirect', async () => {
    console.log('Tcs : Ready_001 and Ready_003');
    await ReadyPage.load();
    await driver.pause(waitTime+5000);
    /* await driver.waitUntil(async () => (ReadyPage.electionCountDownTitle.isClickable()));
    await ReadyPage.electionCountDownTitle.click();
    await driver.pause(waitTime + 2000);
    await browser.pause(1000);
    const handles = await browser.getWindowHandles();
    if (handles.length > 1) {
      console.log(`Switching to the second tab with handle: ${handles[1]}`);
      await browser.switchToWindow(handles[1]);

      // Validate the title of the new tab
      await expect(browser).toHaveTitle('Ballot - WeVote');
    } else {
      throw new Error('Second tab is not available.');
    }
    const currentUrl = await driver.getUrl();
    console.log(currentUrl);
    await driver.switchWindow('Ballot - WeVote');
    await driver.pause(waitTime);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
    console.log('Verified verifyElectionCountDownRedirect');
    */
    //await ReadyPage.wevoteLogo.findAndClick();
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await driver.pause(waitTime);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });

  /*// Ready_002 : In progress - locater issues
  it('updateBallotAddress', async () => {
    console.log('Tcs : Ready_002');
    await ReadyPage.load();
    const baladd = await ReadyPage.ballotAddress.getText();
    console.log(`baladd:${baladd}`);
    await ReadyPage.updateBallotAddress('New York, NY, USA');
    await browser.pause(waitTime + 10000);
    const updatedBalAdd = await ReadyPage.ballotAddress.getText();
    console.log(`updated address:${updatedBalAdd}`);
    expect(updatedBalAdd).toContain('New York, NY, USA');
  });


  // Ready_003 - merged with ready_001


  // Ready_004
  it('toggleIssueFollowing - Follow/UnfollowPopular Topics', async () => {
    console.log('Tcs : Ready_004');
    await ReadyPage.load();
    await ReadyPage.followFirstIssue();
    await driver.pause(waitTime);
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
    await ReadyPage.unfollowFirstIssue();
    await driver.pause(waitTime);
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
  });

  // Ready_005
  it('unfurlIssues - PopularIssues/ShowMoreIssues', async () => {
    console.log('Tcs : Ready_005');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
    await ReadyPage.unfurlIssues();
    await driver.pause(waitTime);
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
  });

  // Ready_006
  it('toggleIntroduction - ShowMore-WeVoteHelpsYouList', async () => {
    console.log('Tcs : Ready_006');
    await ReadyPage.load();
    await driver.waitUntil(async () => (ReadyPage.toggleIntroductionButton.isClickable()));
    await ReadyPage.toggleIntroductionButton.click();
    await driver.pause(waitTime);
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
  });

  // Ready_007
  it('toggleFinePrint - ShowMore-TheFinePrintList', async () => {
    console.log('Tcs : Ready_007');
    await ReadyPage.load();
    await ReadyPage.toggleFinePrintButton.scrollIntoView();
    await driver.waitUntil(async () => (ReadyPage.toggleFinePrintButton.isClickable()));
    await ReadyPage.toggleFinePrintButton.click();
    await driver.pause(waitTime);
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
  });

  // Ready_008 - signin testcases - moved to signin module
  // Ready_009 to Ready_020 ->Moving these testcases to FooterLinks : */
});
