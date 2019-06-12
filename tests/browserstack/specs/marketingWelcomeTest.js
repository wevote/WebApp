const assert = require('assert');
const { clearTextInputValue, scrollThroughPage, simpleClick, simpleTextInput } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;


async function simpleCloseBootstrapModal () {
  const clickableSelector = 'button[class="intro-modal__close-anchor "]';
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    // const isCordova = !!driver.getContexts;
    const isCordova = true; // Set to True when testing APK or IPA files, and false when testing in mobile browser
    const isMobile = !!driver.getContexts;
    const isDesktop = !isMobile;

    // NOTE FROM Dale: This is commented out so we can test We Vote in a mobile browser
    // I would be curious to see what is in driver.getContexts
    // navigate browser to WeVote QA site
    await browser.url('https://quality.wevote.us/welcome');
     
    // How it Works
    await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    await simpleClick('footerLinkForVoters'); // Open For Voters Page
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForOrganizations'); // Open For Organizations Page
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForCampaigns'); // Open For Campaigns Page
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForPricing'); // Open Pricing Page
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Elections
    await simpleClick('footerLinkSupportedElections'); // Open Supported Elections Page
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkRegisterToVote'); // Open Register to Vote Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkGetYourAbsenteeBallot'); // Open Get Your Absentee Ballot Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkSeeYourBallot'); // Open See Your Ballot Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkPollingPlaceLocator'); // Open Polling Place Locator Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await simpleCloseBootstrapModal(); // Close Bootstrap Modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkFreeOnlineTools'); // Open Free Online Tools Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkPremiumOnlineTools'); // Open Premium Online Tools Page
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    assert(true);
  });
});
