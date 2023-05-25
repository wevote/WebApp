import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';

/* eslint-disable no-undef */
// This rule is disabled because describe() and it() are available at runtime.
// Refer to https://webdriver.io/docs/pageobjects for guidance.

describe('ReadyPage', () => {
  // Ready_001
  it('verifyElectionCountDownRedirect', async () => {
    await ReadyPage.open();
    await ReadyPage.electionCountDown.click();
    await expect(driver).not.toHaveUrlContaining('ready');
  });
  // Ready_004
  it('changeBallotAddress', async () => {
    await ReadyPage.open();
    await ReadyPage.ballotAddress.click();
    await ReadyPage.ballotAddressInput.setValue('New York, NY, USA');
    await expect(ReadyPage.ballotAddressInput).toHaveValue('New York, NY, USA');
  });
  // Ready_005
  it('verifyViewUpcomingBallotRedirect', async () => {
    await ReadyPage.open();
    await ReadyPage.viewUpcomingBallotButton.click();
    await expect(driver).not.toHaveUrlContaining('ready');
  });
  // Ready_006
  it('toggleTextUnfurling', async () => {
    await ReadyPage.open();
    // toggleIntroduction
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(0);
    await ReadyPage.toggleIntroductionButton.click();
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
    // toggleFinePrint
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(0);
    await ReadyPage.toggleFinePrintButton.click();
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
  });
  // Ready_007
  it('toggleIssueFollowing', async () => {
    await ReadyPage.open();
    await ReadyPage.followFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
    await ReadyPage.unfollowFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
  });
  // Ready_009
  it('verifyFooter', async () => {
    await ReadyPage.open();
    await expect(ReadyPage.footer).toBeDisplayed();
  });
});
