const assert = require('assert');
const { scrollThroughPage, clickTopLeftCornerOfElement, setNewAddress, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;

describe('Basic cross-platform We Vote test',  () => {
  it('can visit the different pages in the app', async () => {
    const { isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;

    if (isCordovaFromAppStore) {
      // switch contexts and click through intro
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await firstNextButton.click();
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await secondNextButton.click();
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      // navigate browser to WeVote QA site
      await browser.url('https://quality.wevote.us/ballot');
    }

    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
 
    await simpleClick('changeAddressHeaderBar'); // Open the "Change Address" modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('profileCloseSelectBallotModal');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    //await browser.closeWindow();
    //await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //await simpleClick('profileCloseSelectBallotModal');
    //await simpleCloseBootstrapModal(); // Close the "Change Address" modal

    // //////////////////////
    // We want to start by setting the location, which will automatically choose the next upcoming election for that address
    if (isCordovaFromAppStore) {
      await simpleClick('changeAddressHeaderBar'); // Open the "Change Address" modal
    } else {
      await simpleClick('changeAddressHeaderBar'); // Opens the "Enter Your Full Address" link
    }

    if (isIOS) {
      // await setNewAddressIOS('addressBoxText', 'Oakland, CA 94602'); // Sets the text for the address box and hits enter
      await setNewAddressIOS('addressBoxText', 'Redmond, WA 98052'); // Sets the text for the address box and hits enter
    } else {
      // await setNewAddress('addressBoxText', 'Oakland, CA 94602'); // Sets the text for the address box and hits enter
      await setNewAddressIOS('addressBoxText', 'Redmond, WA 98052'); // Sets the text for the address box and hits enter
    }
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // //////////////////////
    // Next we want to switch to a known election
    await simpleClick('changeAddressHeaderBar'); // Opens the Enter Your Full Address link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('ballotElectionListWithFiltersButton-6000'); // Clicks on US 2018 Midterm Election
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // await simpleClick('profileCloseSelectBallotModal');
    // await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    await simpleClick('ballotBadge-State');
    await simpleClick('ballotBadge-Measure');
    await simpleClick('ballotBadge-Local');
    await simpleClick('ballotBadge-Federal');

    // //////////////////////
    // Visit the candidate page
    await simpleClick('officeItemCompressedCandidateInfo-wv02cand53915'); // Clicks the candidate
    //await simpleClick('valueIconAndText-wv02issue25'); // Clicks on the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valueIconAndText-wv02issue25'); // Clicks on the issue icon
    await simpleClick('valueIconAndText-wv02issue65'); // Clicks on the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valueIconAndText-wv02issue65'); // Clicks on the issue icon
    await simpleClick('valueIconAndText-wv02issue4'); // Clicks on the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valueIconAndText-wv02issue4'); // Clicks on the issue icon
    await simpleClick('valueIconAndText-wv02issue2'); // Clicks on the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valueIconAndText-wv02issue2'); // Clicks on the issue icon
    await simpleClick('valueIconAndText-wv02issue84'); // Clicks on the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valueIconAndText-wv02issue84'); // Clicks on the issue icon
    await simpleClick('valueIconAndText-wv02issue66'); // Clicks on the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valueIconAndText-wv02issue66'); // Clicks on the issue icon
    await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

        // //////////////////////
    // Visit the candidate page
    await simpleClick('officeItemCompressedCandidateInfo-wv02cand53902'); // Clicks the candidate Maria Cantwell
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('//*[@id="itemActionBarSupportButton-desktopVersion-wv02cand53902"]'); // To choose the candidate Maria Cantwell
    // await simpleClick('itemActionBarSupportButton-desktopVersion-wv02cand53902'); // To choose the candidate Maria Cantwell
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // const valuesButton =   await $('signInHeaderBar'); // To choose the candidate Maria Cantwell
    // await valuesButton.click();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
 
    // //////////////////////
    // Visit the office page
    // await simpleClick('officeItemCompressedShowMoreFooter-wv02off19922'); // Clicks Show More link
    // await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button
    await simpleClick('officeItemCompressedTopNameLink-wv02off19866'); // Clicks Office Item link
    await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button

    // Build out path that goes through a ballot
    // await simpleClick('allItemsCompletionLevelTab'); // Go to the All Items tab
    // await simpleClick('Embed'); // Go to the embed tab

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Go to the Values tab
    if (isDesktopScreenSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('valuesTabHeaderBar');
      await simpleClick('valuesToFollowPreviewShowMoreId');// Clicks on the link to show more public figures/organizations
      await simpleClick('backToLinkTabHeader');
      await simpleClick('publicFiguresToFollowPreviewShowMoreId');
      await simpleClick('backToLinkTabHeader');
      await simpleClick('organizationsToFollowPreviewShowMoreId');
      await simpleClick('backToLinkTabHeader');

    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('valuesTabFooterBar');
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    //
    // Go to the My Friends tab // DALE: FRIENDS TEMPORARILY DISABLED
    // if (isDesktopScreenSize) {
    //   // Desktop screen size - HEADER TABS
    //   await simpleClick('friendsTabHeaderBar');
    // } else {
    //   // Mobile or tablet screen size - FOOTER ICONS
    //   await simpleClick('friendsTabFooterBar');
    // }
    // await simpleTextInput('friend1EmailAddress','filipfrancetic@gmail.com');
    // await simpleClick('friendsAddAnotherInvitation');
    // await simpleClick('friendsNextButton');
    //
    // await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Go to the Vote tab
    if (isDesktopScreenSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('voteTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('voteTabFooterBar');
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Go back to the Ballot tab
    if (isDesktopScreenSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('ballotTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('ballotTabFooterBar');
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // //////////////////////
    // Review the full length of the page
    // await scrollThroughPage(); // Scroll to the bottom of the ballot page
    // TODO: We will need a way to scroll back to the top of the page for the tab navigation to work in Desktop

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Open sign in modal, then close it by pressing button
    await simpleClick('signInHeaderBar');
    await simpleClick('profileCloseSignInModal');

    // Open sign in modal, then close it by clicking/tapping outside of modal
    // NOTE: having trouble doing this with W3C Web Driver protocol, so skip for now
    if (!browser.isW3C) {
      await simpleClick('signInHeaderBar');
      await clickTopLeftCornerOfElement('div[role="document"]');
    }
    // If keyboard is available, open sign in modal and close by hitting escape key
    if (!isAndroid && !isIOS) {
      await simpleClick('signInHeaderBar');
      browser.keys(['Escape']);
    }

    assert(true);
  });
});
