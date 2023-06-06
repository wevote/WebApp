import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';

/* eslint-disable no-undef */
// This rule is disabled because describe() and it() are available at runtime.
// Refer to https://webdriver.io/docs/pageobjects for guidance.

describe('ReadyPage', () => {
  // Ready_001
  it('verifyElectionCountDownRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.electionCountDownTitle.click();
    await ReadyPage.rerender();
    await expect(driver).not.toHaveUrlContaining('ready');
  });
  // Ready_004
  it('updateBallotAddress', async () => {
    await ReadyPage.load();
    await ReadyPage.updateBallotAddress();
  });
  // Ready_005
  it('verifyViewUpcomingBallotRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.viewUpcomingBallotButton.click();
    await ReadyPage.rerender();
    await expect(driver).not.toHaveUrlContaining('ready');
  });
  // Ready_006
  it('unfurlIssues', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
    await ReadyPage.unfurlIssues();
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
  });
  // Ready_007
  it('toggleIntroduction', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(0);
    await ReadyPage.toggleIntroduction();
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
  });
  // Ready_008
  it('toggleFinePrint', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(0);
    await ReadyPage.toggleFinePrint();
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
  });
  // Ready_009
  it('toggleIssueFollowing', async () => {
    await ReadyPage.load();
    await ReadyPage.followFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
    await ReadyPage.unfollowFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
  });
  // Ready_011
  it('verifyFooter', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.footer).toBeDisplayed();
  });
});
