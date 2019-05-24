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

    if (desktopSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('valuesTabHeaderBar'); // Go to the Values tab
      await simpleClick('friendsTabHeaderBar'); // Go to the My Friends tab
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('valuesTabFooterBar'); // Go to the Values tab
      await simpleClick('friendsTabFooterBar'); // Go to the My Friends tab
    }

    // Go to the Vote tab
    const voteButtonSelector = (isCordova) ? 'span=Ballot' : '#voteTabHeaderBar';
    const voteButton = await $(voteButtonSelector);
    await voteButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the Ballot tab
    const ballotButtonSelector = (isCordova) ? 'span=Ballot' : '#ballotTabHeaderBar';
    const ballotButton = await $(ballotButtonSelector);
    await ballotButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the Change Address tab
    const changeAddressButtonSelector = (isCordova) ? 'span=' : '#changeAddressHeaderBar';
    const changeAddressButton = await $(changeAddressButtonSelector);
    await changeAddressButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Close the Change Address tab
    const closeChangeAddressButtonSelector = (isCordova) ? 'span=' : '.close';
    const closeChangeAddressButton = await $(closeChangeAddressButtonSelector);
    await closeChangeAddressButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the Sign In tab
    const signInButtonSelector = (isCordova) ? 'span=Sign' : '#signInHeaderBar';
    const signInButton = await $(signInButtonSelector);
    await signInButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the logo tab
    const logoButtonSelector = (isCordova) ? 'span=beta' : '#logoHeaderBar';
    const logoButton = await $(logoButtonSelector);
    await logoButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the All Items tab
    const allItemsButtonSelector = (isCordova) ? 'span=All Items' : '#allItemsCompletionLevelTab';
    const allItemsButton = await $(allItemsButtonSelector);
    await allItemsButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the embed tab
    const emButtonSelector = (isCordova) ? 'span=Help' : '#Embed';
    const emButton = await $(emButtonSelector);
    await emButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    assert(true);
  });
});
