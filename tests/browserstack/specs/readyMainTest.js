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
      await browser.url(`${WEB_APP_ROOT_URL}/ready`);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('signInHeaderBar'); // Click Sign In 
      await simpleTextInput('enterVoterEmailAddress', 'test@gmail.com'); // Enter test email in input box
      await simpleClick('voterEmailAddressEntrySendCode'); // Click on Send Code
      await simpleClick('digit1'); // Focus on first input box for verification code
      await simpleTextInput('digit1', '0'); // Set value to 0-9
      await simpleClick('digit2'); // Focus on second input box for verification code
      await simpleTextInput('digit2', '1'); // Set value to 0-9
      await simpleClick('digit3'); // Focus on third input box for verification code
      await simpleTextInput('digit3', '2'); // Set value to 0-9
      await simpleClick('digit4'); // Focus on fourth input box for verification code
      await simpleTextInput('digit4', '3'); // Set value to 0-9
      await simpleClick('digit5'); // Focus on fifth input box for verification code
      await simpleTextInput('digit5', '4'); // Set value to 0-9
      await simpleClick('digit6'); // Focus on sixth input box for verification code
      await simpleTextInput('digit6', '5'); // Set value to 0-9
//      const verifyButton = $('button.MuiButtonBase-root.MuiButton-root.jss415');
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await verifyButton.click(); // Click verify
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      const changeEmailAddress = $('button.MuiButtonBase-root.MuiButton-root.jss359.MuiButton-outlined.MuiButton-outlinedPrimary');
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await changeEmailAddress.click(); // Click Change Email Address
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await simpleClick('profileCloseSignInModal'); // Close Sign In Modal 
   }
  });
});
