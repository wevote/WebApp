import { driver, expect } from '@wdio/globals';

import ReadyPage from '../page_objects/ready.page';

import webAppConfig from '../../../src/js/config';

const waitTime = 10000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('ReadyPage', () => {
  // Ready_001 and Ready_003
  it('verifyElectionCountDownRedirect and verifyViewUpcomingBallotRedirect', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const electionCountDownTitle = document.querySelector('#electionCountDownTitle');
      electionCountDownTitle.click();
    });
    await driver.pause(waitTime);
    await driver.waitUntil(async () => {
      const currentUrl = await driver.getUrl();
      return currentUrl.includes('ballot');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "ballot" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Ballot - WeVote');
    await driver.pause(waitTime);
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
    console.log('Verified verifyElectionCountDownRedirect');
    await ReadyPage.wevoteLogo.click();
    await ReadyPage.viewUpcomingBallotButton.click();
    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  });


  // // Ready_002
  // // it('updateBallotAddress', async () => {
  // //   await ReadyPage.load();
  // //   await ReadyPage.updateBallotAddress('New York, NY, USA');
  // //   await expect(ReadyPage.ballotForAddress).toHaveText('New York, NY, USA');
  // // });

  // // Ready_003 - merged with ready_001
  // //  it('verifyViewUpcomingBallotRedirect', async () => {
  // //    await ReadyPage.load();
  // //    await ReadyPage.viewUpcomingBallotButton.findAndClick();
  // //    await driver.pause(waitTime);
  // //    await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
  // //  });

  // Ready_004
  it('toggleIssueFollowing', async () => {
    await ReadyPage.load();
    await ReadyPage.followIssueButtons[0].click();
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
    await driver.pause(waitTime);
    await ReadyPage.toggleFollowMenuButtons[0].click();
    await ReadyPage.unfollowIssueButtons[0].click();
    await driver.pause(waitTime);
    await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
  });

  // Ready_005
  it('unfurlIssues', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
    await driver.execute(() => {
      const showMoreIssues = document.querySelector('[id*="showMoreReadyPageValuesList"]');
      showMoreIssues.click();
    });
    await driver.pause(waitTime);
    await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
  });

  // Ready_006
  it('toggleIntroduction', async () => {
    await ReadyPage.load();
    await driver.execute(() => {
      const showMore = document.querySelector('#toggleContentButton-showMoreReadyIntroductionCompressed');
      showMore.click();
    });
    await driver.pause(waitTime);
    await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
  });

  // Ready_007
  it('toggleFinePrint', async () => {
    await ReadyPage.load();
    await driver.execute(() => {
      const showMore = document.querySelector('#toggleContentButton-showMoreReadyFinePrintCompressed');
      showMore.click();
    });
    await driver.pause(waitTime);
    await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
  });

  // Ready_009 and Ready_016
  it('verifyPrivacyLinkRedirected', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const privacyLink = document.querySelector('#footerLinkPrivacy');
      privacyLink.click();
    });
    await driver.pause(waitTime);
    await expect(driver).toHaveUrl(expect.stringContaining('privacy'));
    console.log('Verified Privacy link on the ready page');
    await ReadyPage.wevoteLogoRedirectReadyPage.click();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const termsLink = document.querySelector('#footerLinkTermsOfUse');
      termsLink.click();
    });
    await driver.pause(waitTime);
    const url = await driver.getUrl();
    await expect(url).toContain('terms');
    console.log('Verified Terms link on the ready page');
  });

  // Ready_010 and Ready_011
  it('verifyHowItWorksModalWindowOpen and verifyHowItWorksModalWindowClosed', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const howItWorksLink = document.querySelector('#footerLinkHowItWorks');
      howItWorksLink.click();
    });
    await driver.pause(waitTime);
    await expect(ReadyPage.howItWorksTitle).toHaveText('1. Choose your interests');
    await ReadyPage.closeHowItWorksModalWindow();
    await driver.pause();
    await expect(ReadyPage.elementHowItWorksWindow).not.toBeDisplayed();
  });

  // // Ready_011 merged with Ready_010
  // //  it('verifyHowItWorksModalWindowClosed', async () => {
  // //    await ReadyPage.load();
  // //    await driver.pause(waitTime);
  // //    await ReadyPage.clickHowItWorksLink();
  // //    await driver.pause(waitTime);
  // //    await ReadyPage.howItWorksTitle.isDisplayed();
  // //    await ReadyPage.closeHowItWorksModalWindow();
  // //    await driver.pause();
  // //    await expect(ReadyPage.elementHowItWorksWindow).not.toBeDisplayed();
  // //  });

  // // Ready_012  this case can be deprecated as it is covered as part of Ready_013
  // //  it('verifyHowItWorksModalWindowNextButton', async () => {
  // //    await ReadyPage.load();
  // //    await driver.pause(5000);
  // //    await ReadyPage.clickHowItWorksLink();
  // //    await driver.pause(5000);
  // //    const expectedResult = await ReadyPage.checkTitleOfHowItWorksWindow();
  // //    await expect(ReadyPage.howItWorksTitle).toHaveText(expectedResult);
  // //  });

  // Ready_013
  it('verifyHowItWorksModalWindowNextGetStartedButton', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const howItWorksLink = document.querySelector('#footerLinkHowItWorks');
      howItWorksLink.click();
    });
    await driver.pause(waitTime);
    await driver.execute(() => {
      const nextButton = document.querySelector('[id*="annotatedSlideShowStep"]');
      nextButton.click();
      nextButton.click();
      nextButton.click();
      nextButton.click();
    });
    await driver.pause(waitTime);
    await ReadyPage.clickGetStartedButton();
    await driver.pause(waitTime);
    await expect(ReadyPage.getTitleSignUpPopUp).toHaveText('Sign In or Join');
  });

  // Ready_014
  it('verifyHowItWorksModalWindowBackButton', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const howItWorksLink = document.querySelector('#footerLinkHowItWorks');
      howItWorksLink.click();
    });
    await driver.pause(waitTime);
    const expectedResult = await ReadyPage.getTitleOfHowItWorksWindowAfterBackButton();
    await expect(ReadyPage.howItWorksTitle).toHaveText(expectedResult);
  });

  // Ready_015
  it('verifyHelpLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const helpLink = document.querySelector('#footerLinkWeVoteHelp');
      helpLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow('https://help.wevote.us/hc/en-us');
    await driver.pause(waitTime);
    const url = await driver.getUrl();
    await expect(url).toContain('help');
  });

  // // Ready_016 merged with Ready_009
  // it('verifyTermsLink', async () => {
  //   await ReadyPage.load();
  //   await driver.pause(waitTime);
  //   await driver.execute(() => {
  //     const helpLink = document.querySelector('#footerLinkTermsOfUse');
  //     helpLink.click();
  //   });
  //   await driver.pause(waitTime);
  //   await driver.switchWindow(`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/terms`);
  //   await driver.pause(waitTime);
  //   const url = await driver.getUrl();
  //   await expect(url).toContain('terms');
  // });

  // Ready_017
  it('verifyTeamLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const teamLink = document.querySelector('#footerLinkTeam');
      teamLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow(`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/about`);
    await driver.pause(waitTime);
    const url = await driver.getUrl();
    await expect(url).toContain('about');
  });

  // Ready_018
  it('verifyCreditsAndThanksLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const creditsLink = document.querySelector('#footerLinkCredits');
      creditsLink.click();
    });    await driver.pause(waitTime);
    await driver.switchWindow(`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/credits`);
    await driver.pause(waitTime);
    const url = await driver.getUrl();
    await expect(url).toContain('credits');
  });

  // Ready_019
  it('verifyVolunteeringOpportunitiesLink', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const volunteerLink = document.querySelector('#footerLinkVolunteer');
      volunteerLink.click();
    });
    await driver.pause(waitTime);
    await driver.switchWindow('https://wevote.applytojob.com/apply');
    await driver.pause(waitTime);
    const url = await driver.getUrl();
    await expect(url).toContain('apply');
  });

  // Ready_020
  it('verifyDonateLinkRedirected', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.execute(() => {
      const donateLink = document.querySelector('#footerMainLinkDonate');
      donateLink.click();
    });
    await driver.pause(waitTime);
    const url = await driver.getUrl();
    await expect(url).toContain('donate');
  });
});
