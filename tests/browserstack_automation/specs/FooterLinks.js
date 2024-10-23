import { driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import FooterlinksPage from '../page_objects/footerlinks.page';
import DonatePage from '../page_objects/donate.page';
import webAppConfig from '../../../src/js/config';

const waitTime = 8000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('Footer Links Navigation', () => {
 
  // FooterLinks_001 & FooterLinks_002
  it('verifyPrivacyLinkRedirected & Terms link', async () => {
    console.log('Tcs : FooterLinks_001 && FooterLinks_002');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await FooterlinksPage.findPrivacyLink.click();
    await driver.pause(waitTime);
    await expect(driver).toHaveUrl(expect.stringContaining('privacy'));
    await driver.pause(waitTime);
    await expect(browser).toHaveTitle('Privacy Policy - WeVote');
    console.log('Verified Privacy link on the ready page');
    await ReadyPage.wevoteLogo.findAndClick();
    await driver.pause(waitTime);
    await FooterlinksPage.getTermsLinkElement.click();
    await driver.pause(waitTime);
    await expect(browser).toHaveTitle('Terms of Service - WeVote');
  });

  // FooterLinks_003 and FooterLinks_004
  it('verifyHowItWorksModalWindowOpen and verifyHowItWorksModalWindowClosed', async () => {
    console.log('Tcs : FooterLinks_003 and FooterLinks_004');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await FooterlinksPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await expect(FooterlinksPage.howItWorksTitle).toHaveText('1. Choose your interests');
    await FooterlinksPage.closeHowItWorksModalWindow();
    await driver.pause();
    await expect(FooterlinksPage.elementHowItWorksWindow).not.toBeDisplayed();
  });

    // FooterLinks_005
  it('verifyHelpLink', async () => {
    console.log('Tcs : FooterLinks_005');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await FooterlinksPage.getHelpLinkElement.click();
    await driver.pause(waitTime);
    await driver.switchWindow('https://help.wevote.us/hc/en-us');
    await driver.pause(waitTime);
    await expect(FooterlinksPage.getHelpPageTitleElement).toHaveText('Frequently Asked Questions');
  });

  // FooterLinks_006
  it('verifyTeamLink', async () => {
    console.log('FooterLinks_006');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await FooterlinksPage.getTeamLinkElement.click();
    await driver.pause(waitTime);
    await driver.switchWindow(`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/about`);
    await driver.pause(waitTime);
    await expect(FooterlinksPage.getTeamPageTitleElement).toHaveText('About WeVote');
    await expect(browser).toHaveTitle('About WeVote');
  });

  // FooterLinks_007
  it('verifyCreditsAndThanksLink', async () => {
    console.log('Tcs : FooterLinks_007');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await FooterlinksPage.getCreditsAndThanksElement.click();
    await driver.pause(waitTime);
    await driver.switchWindow(`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/credits`);
    await driver.pause(waitTime);
    await expect(FooterlinksPage.getCreditsAndThanksPageTitleElement).toHaveText('Credits & Thanks');
    await expect(browser).toHaveTitle('Credits - WeVote');
  });

  // FooterLinks_008
  it('verifyVolunteeringOpportunitiesLink', async () => {
    console.log('Tcs : FooterLinks_008');
    await ReadyPage.load();
    await driver.pause(waitTime);
    await FooterlinksPage.getVolunteeringOpportunitiesElement.click();
    await driver.pause(waitTime);
    await driver.switchWindow('wevote.applytojob.com/apply');
    await driver.pause(waitTime);
    await expect(FooterlinksPage.getVolunteeringOpportunitiesPageTitleElement).toHaveText('Current Openings');
  });

  // FooterLinks_009
  it('verifyDonateLinkRedirected', async () => {
    console.log('Tcs : FooterLinks_009');
    await ReadyPage.load();
    await driver.pause(waitTime + 2000);
    await browser.scroll(0, 200);
    await driver.pause(waitTime);
    await FooterlinksPage.getDonateLinkLocator.click();
    await driver.pause(waitTime);
    await expect(driver).toHaveUrl(expect.stringContaining('donate'));
    await driver.pause(waitTime);
    await expect(FooterlinksPage.getDonatePageContentTitleElement).toHaveText('Want more Americans to vote?');
    await expect(browser).toHaveTitle('Donate - WeVote');
  });

 
});
