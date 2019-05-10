const assert = require('assert');
describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    const isCordova = !!driver.getContexts;
    if (isCordova) {
      // switch contexts and click through intro
      await driver.switchContext('WEBVIEW_org.wevote.cordova');
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await browser.pause(1000);
      await firstNextButton.click();
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await browser.pause(1000);
      await secondNextButton.click();
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await browser.pause(1000);
      await thirdNextButton.click();
      await browser.pause(1000);
    } else {
      // navigate browser to WeVote QA site
      await browser.url('https://quality.wevote.us/Ballot');
    }
	
//	Go to the Change Address tab
const changeAddressButtonSelector = (isCordova) ? 'span=' : 'button[id="changeAddressHeaderBar"]';
    const changeAddressButton =
      await $(changeAddressButtonSelector);
    await changeAddressButton.click();
    await browser.pause(1000);
	
// Go to the Values tab
const valuesButtonSelector = (isCordova) ? 'span=My Values' : 'button[id="valuesTabHeaderBar"]';
    const valuesButton =
      await $(valuesButtonSelector);
    await valuesButton.click();
    await browser.pause(1000);
	
// Go to the My Friends tab
const friendButtonSelector = (isCordova) ? 'span=My Friends' : 'button[id="friendsTabHeaderBar"]';
    const friendButton =
      await $(friendButtonSelector);
    await friendButton.click();
    await browser.pause(1000);
	
	// Go to the settings tab
const settingButtonSelector = (isCordova) ? 'span=' : 'button[title="Settings"]';
    const settingButton =
      await $(settingButtonSelector);
    await settingButton.click();
    await browser.pause(1000);
	
	// Go to the ballot tab
const ballotButtonSelector = (isCordova) ? 'span=Ballot' : 'button[id="ballotTabHeaderBar"]';
    const ballotButton =
      await $(ballotButtonSelector);
    await ballotButton.click();
    await browser.pause(1000);
	
// Go to the Sign In tab
const signInButtonSelector = (isCordova) ? 'span=Sign' : 'a[id="signInHeaderBar"]';
    const signInButton =
      await $(signInButtonSelector);
    await signInButton.click();
    await browser.pause(1000);
	
	// Go to the logo tab
const logoButtonSelector = (isCordova) ? 'span=beta' : 'a[id="logoHeaderBar"]';
    const logoButton =
      await $(logoButtonSelector);
    await logoButton.click();
    await browser.pause(1000);

	
// Go to the All Items tab
const allItemsButtonSelector = (isCordova) ? 'span=All Items' : 'button[id="allItemsCompletionLevelTab"]';
    const allItemsButton =
      await $(allItemsButtonSelector);
    await allItemsButton.click();
    await browser.pause(1000);


// Go to the embed tab
const emButtonSelector = (isCordova) ? 'span=Help' : 'div[id="Embed"]';
    const emButton =
      await $(emButtonSelector);
    await emButton.click();
    await browser.pause(1000);
	
	 assert(true);
	
  });
});