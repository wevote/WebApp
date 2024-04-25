import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import PrivacyPage from '../page_objects/privacy.page';
import DonatePage from '../page_objects/donate.page';
import TermsPage from '../page_objects/terms.page';

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('ReadyPage', () => {
  // Ready_001
  it('verifyElectionCountDownRedirect', async () => {
    await ReadyPage.load();
    await driver.pause(9000);
    await ReadyPage.electionCountDownTitle.findAndClick();
    await driver.pause(9000);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });

  // Ready_002
  // it('updateBallotAddress', async () => {
  //   await ReadyPage.load();
  //   await ReadyPage.updateBallotAddress('New York, NY, USA');
  //   await expect(ReadyPage.ballotForAddress).toHaveText('New York, NY, USA');
  // });

  // Ready_003
  it('verifyViewUpcomingBallotRedirect', async () => {
    await ReadyPage.load();
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });

  // Ready_004
  it('toggleIssueFollowing', async () => {
    await ReadyPage.load();
    await ReadyPage.followFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
    await ReadyPage.unfollowFirstIssue();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
  });

  // Ready_005
  it('unfurlIssues', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
    await ReadyPage.unfurlIssues();
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
  });

  // Ready_006
  it('toggleIntroduction', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.introductionStepText).not.toBeDisplayed();
    await driver.pause(9000);
    await ReadyPage.toggleIntroduction();
    await driver.pause(9000);
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
  });

  // Ready_007
  it('toggleFinePrint', async () => {
    await ReadyPage.load();
    await expect(ReadyPage.finePrintStepText).not.toBeDisplayed();
    await driver.pause(9000);

    await ReadyPage.toggleFinePrint();
    await driver.pause(9000);
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
  });

  // Ready_008
  // it('signIn', async () => {
  //   await ReadyPage.load();
  //   await expect(ReadyPage.avatar).not.toExist();
  //   await ReadyPage.signIn();
  //   await expect(ReadyPage.avatar).toBeDisplayed();
  // });

  // Ready_009
  it('verifyPrivacyLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.findPrivacyLink.click();
    await expect(driver).toHaveUrl(expect.stringContaining('privacy'));
    await expect(PrivacyPage.pageContentTitleText).toHaveText('WeVote.US Privacy Policy');
  });

  // Ready_010
  it('verifyHowItWorksModalWindowOpen', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await expect(ReadyPage.howItWorksTitle).toHaveText('1. Choose your interests');
  });

  // Ready_011
  it('verifyHowItWorksModalWindowClosed', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await ReadyPage.howItWorksTitle.isDisplayed();
    await ReadyPage.closeHowItWorksModalWindow();
    await expect(ReadyPage.elementHowItWorksWindow).not.toBeDisplayed();
  });

  // Ready_012
  it('verifyHowItWorksModalWindowNextButton', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();

    const expectedResult = await ReadyPage.checkTitleOfHowItWorksWindow();
    await expect(ReadyPage.howItWorksTitle).toHaveText(expectedResult);
  });

  // Ready_013
  it('verifyHowItWorksModalWindowNextGetStartedButton', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await ReadyPage.clickNextButtonFourTimes();
    await ReadyPage.clickGetStartedButton();
    await expect(ReadyPage.getTitleSignUpPopUp).toHaveText('Sign In or Join');
  });

  // Ready_014
  it('verifyHowItWorksModalWindowBackButton', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();

    const expectedResult = await ReadyPage.getTitleOfHowItWorksWindowAfterBackButton();
    await expect(ReadyPage.howItWorksTitle).toHaveText(expectedResult);
  });

  // Ready_015
  it('verifyHelpLink', async () => {
    await ReadyPage.load();
    await ReadyPage.getHelpLinkElement.click();
    await driver.switchWindow('https://help.wevote.us/hc/en-us');
    await expect(ReadyPage.getHelpPageTitleElement).toHaveText('Frequently Asked Questions');
  });

  // Ready_016
  it('verifyTermsLink', async () => {
    await ReadyPage.load();
    await ReadyPage.getTermsLinkElement.click();
    await expect(TermsPage.getTermsPageTitleElement).toHaveText('Terms of Service');
  });

  // Ready_017
  it('verifyTeamLink', async () => {
    await ReadyPage.load();
    await ReadyPage.getTeamLinkElement.click();
    await driver.switchWindow('https://wevote.us/more/about');
    await expect(ReadyPage.getTeamPageTitleElement).toHaveText('About WeVote');
  });

  // Ready_018
  it('verifyCreditsAndThanksLink', async () => {
    await ReadyPage.load();
    await ReadyPage.getCreditsAndThanksElement.click();
    await driver.switchWindow('https://wevote.us/more/credits');
    await expect(ReadyPage.getCreditsAndThanksPageTitleElement).toHaveText('Credits & Thanks');
  });

  // Ready_019
  it('verifyVolunteeringOpportunitiesLink', async () => {
    await ReadyPage.load();
    await ReadyPage.getVolunteeringOpportunitiesElement.click();
    await driver.switchWindow('https://wevote.applytojob.com/apply');
    await expect(ReadyPage.getVolunteeringOpportunitiesPageTitleElement).toHaveText('Current Openings');
  });

  // Ready_020
  it('verifyDonateLinkRedirected', async () => {
    await ReadyPage.load();
    await ReadyPage.getDonateLinkLocator.click();
    await expect(DonatePage.getDonatePageContentTitleElement).toHaveText('Want more Americans to vote?');
  });
});
