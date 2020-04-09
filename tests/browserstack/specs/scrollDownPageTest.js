const assert = require('assert');
const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, scrollThroughPage, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal, simpleTextInput, stopScript } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run various tests', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;
    const platformPrefixID = (isDesktopScreenSize) ? 'desktop' : 'mobile';
    const changeAddressHeaderBarID = (isDesktopScreenSize) ? 'changeAddressOrElectionHeaderBarElection' : 'changeAddressOnlyHeaderBar';
    const ballotBadgePlatformPrefixID = (isDesktopScreenSize) ? 'ballotBadgeDesktop' : 'ballotBadgeMobile';
    const isOnePlus = device.includes('OnePlus');
    const isSamsung = device.includes('Samsung');
    const measureToTestOnBallotID = 'wv02meas604';
    const organizationToFollowOnMeasureBallotID = 'wv01org14';
    const candidateToTestOnBallotID = 'wv02cand40208';
    const organizationToFollowOnCandidateBallotID = 'wv02org11971';

    if (isCordovaFromAppStore) {
      // ///////////////////////////////
      // For the apps downloadable from either the Apple App Store or Android Play Store,
      // click through the onboarding screens
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await firstNextButton.click();
      await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await secondNextButton.click();
      await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);
    } else {
      // ///////////////////////////////
      // For the website version, open our quality testing site
      await browser.url('https://quality.wevote.us/ballot');
    }

    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // ///////////////////////////////////
    // These are a variety of tests to try to figure out scrolling down to click an element off screen
    // 2020 President "Show More" (so we can try to click below the fold): officeItemCompressedShowMoreFooter-wv02off28320
    // Non-clickable element below the fold: ballotSummaryFooter-showMoreBallotItems
    // ID at top of Ballot: ballotRoute-topOfBallot

    // DALE 2020-04-05 All of these failed
    // await scrollDownPage();
    // JavascriptExecutor js = (JavascriptExecutor) driver;
    // js.executeScript("window.scrollBy(0,250)", "");
    // await driver.scroll(0, 100);
    // driver.touchScroll({
    //   el: browser,
    //   xOffset: 10,
    //   yOffset: 100
    // });
    // await driver.scroll(0, 250);
    // await browser.elementClick('officeItemCompressedShowMoreFooter-wv02off28320');
    // await scrollIntoViewSimple('officeItemCompressedShowMoreFooter-wv02off28320'); // Scroll to the "Show More Ballot Items" header at bottom of page
    // await simpleClick('officeItemCompressedShowMoreFooter-wv02off28320');
    // await simpleClick('ballotSummaryFooter-showMoreBallotItems');
    // const clickableItem = await $('#ballotSummaryFooter-showMoreBallotItems');
    // await clickableItem.scrollIntoView();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await scrollThroughPage();

    // // Stop/Exit the script here for now
    // assert(true);
    // await stopScript(driver); // Not working
    // await browser.pause(100000); // Pause for a long time in order to force timeout

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    assert(true);
  });
});
