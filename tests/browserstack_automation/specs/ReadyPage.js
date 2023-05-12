import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';

/* eslint-disable no-undef */
// This rule is disabled because describe() and it() are available at runtime.
// Refer to https://webdriver.io/docs/pageobjects for guidance.

describe('ReadyPage', () => {
  // Ready_001
  it('verifyRedirect', async () => {
    await ReadyPage.open();
    await ReadyPage.viewUpcomingBallotButton.click();
    await expect(driver).not.toHaveUrlContaining('ready');
  });
  // Ready_014 - Ready_015
  it('verifyIssueFollowToggling', async () => {
    await ReadyPage.open();
    await ReadyPage.followFirstIssue();
    // await ReadyPage.unfollowFirstIssue();
  });
});
