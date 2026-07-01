import { driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import FooterlinksPage from '../page_objects/footerlinks.browser';

const waitTime = 5000;

describe('Footer Links Navigation', () => {
  beforeEach(async () => {
    const handles = await browser.getWindowHandles();
    if (handles.length > 1) {
        const mainWindow = handles[0];
        for (let i = handles.length - 1; i > 0; i--) {
            await browser.switchToWindow(handles[i]);
            await browser.closeWindow();
        }
        await browser.switchToWindow(mainWindow);
    }
  });
  beforeEach(async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
  });
  // FooterLinks_001 & FooterLinks_002
  it('verifyPrivacyLinkRedirected & Terms link @BVT', async () => {
    console.log('Tcs : FooterLinks_001 && FooterLinks_002');
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
  it('verifyHowItWorksModalWindowOpen and verifyHowItWorksModalWindowClosed @BVT', async () => {
    console.log('Tcs : FooterLinks_003 and FooterLinks_004');
    await FooterlinksPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await expect(FooterlinksPage.howItWorksTitle).toHaveText('1. Choose your interests');
    await FooterlinksPage.closeHowItWorksModalWindow();
    await driver.pause(waitTime);
    await expect(FooterlinksPage.elementHowItWorksWindow).not.toBeDisplayed();
  });

    // FooterLinks_005
  it('verifyHelpLink @BVT', async () => {
     console.log('Tcs : FooterLinks_005');
     await FooterlinksPage.verifyExternalLink(
        FooterlinksPage.getHelpLinkElement,
        '/hc/en-us',
        FooterlinksPage.getHelpPageTitleElement,
        'Help Center'
    );
  });

  // FooterLinks_006
  it('verifyTeamLink @BVT', async () => {
    console.log('FooterLinks_006');
    await FooterlinksPage.verifyExternalLink(
      FooterlinksPage.getTeamLinkElement,
      '/more/about',
      FooterlinksPage.getTeamPageTitleElement,
      'About WeVote'
    );
  });

  // FooterLinks_007
  it('verifyCreditsAndThanksLink @BVT', async () => {
    console.log('Tcs : FooterLinks_007');
    await FooterlinksPage.verifyExternalLink(
      FooterlinksPage.getCreditsAndThanksElement,
      '/more/credits',
      FooterlinksPage.getCreditsAndThanksPageTitleElement,
      'Credits & Thanks'
    );
  });

  // FooterLinks_008
  it('verifyVolunteeringOpportunitiesLink @BVT', async () => {
    console.log('Tcs : FooterLinks_008');
    await FooterlinksPage.verifyExternalLink(
      FooterlinksPage.getVolunteeringOpportunitiesElement,
      '/apply',
      FooterlinksPage.getVolunteeringOpportunitiesPageTitleElement,
      'Current Openings'
    );
  });

  // FooterLinks_009
  it('verifyDonateLinkRedirected', async () => {
    console.log('Tcs : FooterLinks_009');
    await FooterlinksPage.getDonateLinkLocator.scrollIntoView();
    await FooterlinksPage.getDonateLinkLocator.click();
    await driver.pause(waitTime);
    await expect(driver).toHaveUrl(expect.stringContaining('donate'));
    await driver.pause(waitTime);
    await expect(browser).toHaveTitle('Donate - WeVote');
    console.log("Verified Donate link on the ready page")
  });
});
