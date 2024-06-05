import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import TopNavigation from '../page_objects/topnavigation';

import HowItWorks from '../page_objects/howitworks';

const { describe, it } = require('mocha');


describe('HowItWorks', () => {
  // HowItWorks_001
  it('verifyHowItWorksModalWindowOpen', async () => {
    await ReadyPage.load();
    await driver.pause(5000);
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
    await HowItWorks.FirstModalbutton.click();
    await expect(HowItWorks.modalTitle).toBeDisplayed();
  });
  // it('verifyHowItWorksModalWindowClosed', async () => {
  //   await ReadyPage.load();
  //   await driver.pause(5000);
  //   await ReadyPage.clickHowItWorksLink();
  //   await driver.pause(5000);
  //   await ReadyPage.howItWorksTitle.isDisplayed();
  //   await ReadyPage.closeHowItWorksModalWindow();
  //   await driver.pause(5000);
  //   await expect(ReadyPage.elementHowItWorksWindow).not.toBeDisplayed();
  // });

  // // Ready_012
  // it('verifyHowItWorksModalWindowNextButton', async () => {
  //   await ReadyPage.load();
  //   await driver.pause(5000);
  //   await ReadyPage.clickHowItWorksLink();
  //   await driver.pause(5000);
  //   const expectedResult = await ReadyPage.checkTitleOfHowItWorksWindow();
  //   await expect(ReadyPage.howItWorksTitle).toHaveText(expectedResult);
  // });

  // // Ready_013
  // it('verifyHowItWorksModalWindowNextGetStartedButton', async () => {
  //   await ReadyPage.load();
  //   await ReadyPage.clickHowItWorksLink();
  //   await driver.pause(5000);
  //   await ReadyPage.clickNextButtonFourTimes();
  //   await driver.pause(5000);
  //   await ReadyPage.clickGetStartedButton();
  //   await driver.pause(5000);
  //   await expect(ReadyPage.getTitleSignUpPopUp).toHaveText('Sign In or Join');
  // });

  // // Ready_014
  // it('verifyHowItWorksModalWindowBackButton', async () => {
  //   await ReadyPage.load();
  //   await driver.pause(5000);
  //   await ReadyPage.clickHowItWorksLink();
  //   await driver.pause(5000);
  //   const expectedResult = await ReadyPage.getTitleOfHowItWorksWindowAfterBackButton();
  //   await expect(ReadyPage.howItWorksTitle).toHaveText(expectedResult);
  // });
});
