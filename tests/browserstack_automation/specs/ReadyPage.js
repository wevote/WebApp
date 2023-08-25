import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';

/* eslint-disable no-undef */
// describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('ReadyPage', () => {
  it('updateBallotAddress', async () => {
    await ReadyPage.load();
    await ReadyPage.updateBallotAddress();
  });

  it('verifyViewUpcomingBallotRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await expect(driver).not.toHaveUrlContaining('ready');
  });

  it('toggleIssueFollowing', async () => {
    await ReadyPage.load();
    await ReadyPage.followFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
    await ReadyPage.unfollowFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
  });

  it('unfurlIssues', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
    await ReadyPage.unfurlIssues();
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
  });

  it('toggleIntroduction', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(0);
    await ReadyPage.toggleIntroduction();
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
  });

  it('toggleFinePrint', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(0);
    await ReadyPage.toggleFinePrint();
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
  });
});
