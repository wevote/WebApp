const assert = require('assert');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';

describe('example test',  () => {
  it('can check capabilities in order to identify platform', async () => {
    const { isCordova, isMobile } = driver.config.capabilities;
    if (isCordova) {
      // switch contexts and click through intro
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
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
      await browser.url('https://quality.wevote.us/ballot');
    }
    const valuesButtonSelector = (isMobile) ? '#valuesTabFooterBar' : '#valuesTabHeaderBar';
    const valuesButton =
      await $(valuesButtonSelector);
    await valuesButton.click();
    await browser.pause(1000);
    assert(true);
  });
});
