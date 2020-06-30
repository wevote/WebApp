const { simpleClick, simpleTextInput, scrollIntoViewSimple } = require('../utils');
const PAUSE_DURATION_MICROSECONDS = 250;
const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run tests', async () => {
    const { isCordova, isMobile } = driver.config.capabilities;
    const WEB_APP_ROOT_URL = driver.config.webAppRootUrl;
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
      await browser.url(`${WEB_APP_ROOT_URL}/hc/en-us/requests/new`);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('request_anonymous_requester_email', 'test@gmail.com'); // Focus on 'Your email address' input box
      await simpleTextInput('request_subject', 'Error'); // Focus on Subject input box
      await simpleTextInput('request_description', 'There was an error.'); // Focus on Description input box
   }
  });
});
