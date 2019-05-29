const assert = require('assert');
const { simpleClick, scrollThroughPage } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;

async function simpleCloseBootstrapModal () {
  const clickableSelector = 'button[class="close"]';
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

describe('Basic cross-platform We Vote test',  () => {
  it('can visit the different pages in the app', async () => {
    const isCordova = !!driver.getContexts;
    const desktopSize = !isCordova;

    // NOTE FROM Dale: This is commented out so we can test We Vote in a mobile browser
    //  I would be curious to see what is in driver.getContexts
    // if (isCordova) {
    //   // switch contexts and click through intro
    //   const contexts = await driver.getContexts();
    //   const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
    //   await driver.switchContext(context);
    //   const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
    //   await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //   await firstNextButton.click();
    //   const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
    //   await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //   await secondNextButton.click();
    //   const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
    //   await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //   await thirdNextButton.click();
    //   await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // } else {
    //   // navigate browser to WeVote QA site
    //   await browser.url('https://quality.wevote.us/ballot');
    // }

    await browser.url('https://quality.wevote.us/ballot');

    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('changeAddressHeaderBar'); // Open the "Change Address" modal
    // TODO: Choose 2018 General election
    await simpleCloseBootstrapModal(); // Close the "Change Address" modal
    // TODO Figure out how to close a Material UI Dialog
    // await simpleClick('signInHeaderBar'); // Open the "Sign In" modal
    // await simpleCloseModal(); // Close the "Sign In" modal

    // Build out path that goes through a ballot
    // await simpleClick('allItemsCompletionLevelTab'); // Go to the All Items tab
    // await simpleClick('Embed'); // Go to the embed tab

    await scrollThroughPage(); // Scroll to the bottom of the ballot page

    // Go to the Values tab
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('valuesTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('valuesTabFooterBar');
    }

    // Go to the My Friends tab
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('friendsTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('friendsTabFooterBar');
    }

    // Go to the Vote tab
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('voteTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('voteTabFooterBar');
    }

    // Go back to the Ballot tab
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('ballotTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('ballotTabFooterBar');
    }

    assert(true);
  });
});
