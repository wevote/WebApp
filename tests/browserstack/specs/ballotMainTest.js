const assert = require('assert');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;

async function simpleClick (elementIdName) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    const isCordova = !!driver.getContexts;
    const desktopSize = !isCordova;
    if (isCordova) {
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
    await simpleClick('changeAddressHeaderBar'); // Go to the Address section
    const closeChangeAddressButtonSelector = (isCordova) ? 'span=' : '.close';
    const closeChangeAddressButton = await $(closeChangeAddressButtonSelector);
    await closeChangeAddressButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('signInHeaderBar'); // Go to the Sign In section
    await simpleClick('logoHeaderBar'); // Go to the logo tab
    await simpleClick('allItemsCompletionLevelTab'); // Go to the All Items tab
    await simpleClick('Embed'); // Go to the embed tab

  // Go to values section
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('valuesTabHeaderBar'); // Go to the Values tab
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('valuesTabFooterBar'); // Go to the Values tab
    }
    // Go to friends section
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('friendsTabHeaderBar'); // Go to the My Friends tab
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('friendsTabFooterBar'); // Go to the My Friends tab
    }
    // Go to the Vote section
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('voteTabHeaderBar'); // Go to the Vote tab
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('voteTabFooterBar'); // Go to the Vote tab
    }
    // Go to the Ballot section
    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('ballotTabHeaderBar'); // Go to the Ballot tab
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('ballotTabFooterBar'); // Go to the Ballot tab
    }

    assert(true);
  });
});
